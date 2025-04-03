import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, setStorage } from "./storage";
import { supabaseStorage } from "./supabaseStorage";
import { insertProductSchema, insertOrderSchema, insertCartItemSchema } from "@shared/schema";
import { z } from "zod";
import { migrateToSupabase } from "./setupSupabase";
import { setupAuth } from "./auth";
import { createPaymentIntent, calculateOrderTotal } from "./stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // API Routes
  
  // Categories
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategoryById(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Products
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (_req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/products/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const products = await storage.getProductsByCategory(categoryId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const newProduct = await storage.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Reviews
  app.get("/api/products/:productId/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const reviews = await storage.getReviewsByProductId(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Testimonials
  app.get("/api/testimonials", async (_req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Cart
  app.get("/api/cart", async (req, res) => {
    try {
      // Get userId from query param or from authenticated user
      const userId = req.isAuthenticated() 
        ? req.user.id 
        : req.query.userId 
          ? parseInt(req.query.userId as string) 
          : 1; // Default user ID for demo
      
      // Fetch cart items with product details
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      // Get userId from authenticated user or query param
      const userId = req.isAuthenticated() ? req.user.id : req.body.userId;
      
      if (!userId || !req.body.productId || !req.body.quantity) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if product exists
      const product = await storage.getProductById(req.body.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Prepare cart item data
      const cartItemData = insertCartItemSchema.parse({
        userId,
        productId: req.body.productId,
        quantity: req.body.quantity
      });

      // Add to cart
      const cartItem = await storage.addToCart(cartItemData);
      res.status(201).json({
        success: true,
        data: cartItem,
        message: "Item added to cart"
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid cart data", 
          errors: error.errors 
        });
      }
      
      // Provide more detailed error messages for database errors
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      const statusCode = errorMessage.includes("not found") ? 404 : 500;
      
      res.status(statusCode).json({ 
        success: false,
        message: "Failed to add to cart",
        error: errorMessage
      });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid quantity" 
        });
      }

      // Update cart item
      const updatedItem = await storage.updateCartItem(id, quantity);
      res.json({
        success: true,
        data: updatedItem,
        message: "Cart item updated"
      });
    } catch (error) {
      console.error("Error updating cart item:", error);
      
      // Provide more detailed error messages for database errors
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      const statusCode = errorMessage.includes("not found") ? 404 : 500;
      
      res.status(statusCode).json({ 
        success: false,
        message: "Failed to update cart item",
        error: errorMessage
      });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeCartItem(id);
      res.json({ 
        success: true,
        message: "Item removed from cart"
      });
    } catch (error) {
      console.error("Error removing cart item:", error);
      
      // Provide more detailed error information
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      const statusCode = errorMessage.includes("not found") ? 404 : 500;
      
      res.status(statusCode).json({ 
        success: false,
        message: "Failed to remove cart item",
        error: errorMessage
      });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      // Get userId from authenticated user or query param
      const userId = req.isAuthenticated() 
        ? req.user.id 
        : req.query.userId 
          ? parseInt(req.query.userId as string) 
          : null;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false,
          message: "User ID is required" 
        });
      }
      
      await storage.clearCart(userId);
      res.json({ 
        success: true,
        message: "Cart cleared successfully" 
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      
      // Provide more detailed error information
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      res.status(500).json({ 
        success: false,
        message: "Failed to clear cart",
        error: errorMessage
      });
    }
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const newOrder = await storage.createOrder(orderData);
      res.status(201).json(newOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Supabase migration
  app.post("/api/supabase/migrate", async (_req, res) => {
    try {
      // Migrate data to Supabase
      await migrateToSupabase();
      
      // Change storage implementation to use Supabase
      await supabaseStorage.initialize();
      setStorage(supabaseStorage);
      
      res.status(200).json({ success: true, message: "Migration to Supabase completed successfully" });
    } catch (error) {
      console.error("Migration error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to migrate to Supabase", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Stripe Payment Routes
  
  // Create a payment intent
  app.post("/api/payment/create-intent", async (req, res) => {
    try {
      // Verify if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { cartItems } = req.body;
      
      if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ message: "Invalid cart items" });
      }
      
      // Calculate total amount from cart items
      const amount = calculateOrderTotal(cartItems);
      
      if (amount <= 0) {
        return res.status(400).json({ message: "Invalid order amount" });
      }
      
      // Create metadata with user information and cart summary
      const metadata: Record<string, string> = {
        userId: String(req.user.id),
        itemCount: String(cartItems.length),
      };
      
      // Create payment intent
      const paymentIntent = await createPaymentIntent(amount, 'usd', metadata);
      
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        amount: amount / 100, // Convert back to dollars for the frontend
      });
    } catch (error) {
      console.error("Payment intent error:", error);
      res.status(500).json({ 
        message: "Failed to create payment intent", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
