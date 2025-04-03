import { IStorage } from "./storage";
import { db } from "./db";
import { 
  users, categories, products, testimonials, reviews, cartItems, orders,
  type User, type Category, type Product, type Review, type Testimonial, type CartItem, type Order,
  type InsertUser, type InsertCategory, type InsertProduct, type InsertReview, 
  type InsertTestimonial, type InsertCartItem, type InsertOrder
} from "@shared/schema";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { log } from "./vite";

// Initialize PostgreSQL session store
const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any to avoid type conflicts

  constructor() {
    // Create the session store with our existing pool
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'sessions'
    });

    // Log initialization
    log("Database storage initialized", "database");
  }

  // Initialize database tables and seed with initial data if necessary
  async initialize(): Promise<void> {
    try {
      log("Initializing database tables...", "database");
      
      // Check if we have categories already, as a proxy for "is the database initialized"
      const existingCategories = await this.getAllCategories();
      
      if (existingCategories.length === 0) {
        log("Database appears empty, initializing with seed data...", "database");
        
        // Seed some initial data
        await this.seedInitialData();
        
        log("Database initialization complete", "database");
      } else {
        log("Database already contains data, skipping initialization", "database");
      }
    } catch (error) {
      log(`Database initialization error: ${error}`, "database");
      throw error;
    }
  }

  // Helper method to seed initial data
  private async seedInitialData(): Promise<void> {
    try {
      // Create categories
      const facialCare = await this.createCategory({
        name: "Facial Care",
        description: "Products for facial skincare routines",
        imageUrl: "/images/categories/facial-care.jpg"
      });
      
      const bodyRituals = await this.createCategory({
        name: "Body Rituals",
        description: "Luxurious body care products",
        imageUrl: "/images/categories/body-rituals.jpg"
      });
      
      const aromatherapy = await this.createCategory({
        name: "Aromatherapy",
        description: "Essential oils and diffusers",
        imageUrl: "/images/categories/aromatherapy.jpg"
      });

      // Create products
      await this.createProduct({
        name: "Harmony Facial Cleanser",
        tagline: "Gentle daily cleanser",
        description: "A gentle, pH-balanced cleanser that removes impurities without stripping the skin's natural moisture.",
        price: 28.00,
        imageUrl: "/images/products/facial-cleanser.jpg",
        categoryId: facialCare.id,
        featured: true,
        inStock: true
      });
      
      await this.createProduct({
        name: "Tranquil Face Serum",
        tagline: "Hydrating and calming",
        description: "Lightweight serum with hyaluronic acid and botanical extracts to hydrate and calm sensitive skin.",
        price: 42.00,
        imageUrl: "/images/products/face-serum.jpg",
        categoryId: facialCare.id,
        featured: true,
        inStock: true
      });
      
      await this.createProduct({
        name: "Renewal Body Scrub",
        tagline: "Exfoliating body treatment",
        description: "Natural exfoliating scrub that buffs away dull skin cells while nourishing with organic oils.",
        price: 36.00,
        imageUrl: "/images/products/body-scrub.jpg",
        categoryId: bodyRituals.id,
        featured: true,
        inStock: true
      });
      
      await this.createProduct({
        name: "Serene Body Oil",
        tagline: "Moisturizing body treatment",
        description: "Rich body oil that deeply moisturizes and leaves skin with a subtle, natural glow.",
        price: 38.00,
        imageUrl: "/images/products/body-oil.jpg",
        categoryId: bodyRituals.id,
        featured: true,
        inStock: true
      });
      
      await this.createProduct({
        name: "Ultimate Harmony Kit",
        tagline: "Complete skincare routine",
        description: "Our complete facial care ritual kit with cleanser, toner, serum, and moisturizer.",
        price: 120.00,
        imageUrl: "/images/products/skincare-kit.jpg",
        categoryId: facialCare.id,
        featured: true,
        inStock: true
      });

      // Create testimonials
      await this.createTestimonial({
        userName: "Sarah J.",
        userImage: "/images/testimonials/user1.jpg",
        rating: 5,
        text: "The Tranquil Face Serum transformed my skin. After just two weeks, my complexion is more even and hydrated than ever before."
      });
      
      await this.createTestimonial({
        userName: "Michael T.",
        userImage: "/images/testimonials/user2.jpg",
        rating: 5,
        text: "I was skeptical about natural skincare, but the Renewal Body Scrub has made me a believer. My skin feels amazing."
      });
      
      await this.createTestimonial({
        userName: "Emma R.",
        userImage: "/images/testimonials/user3.jpg",
        rating: 5,
        text: "The Ultimate Harmony Kit is worth every penny. It's simplified my routine and my skin has never looked better."
      });

      log("Initial seed data created successfully", "database");
    } catch (error) {
      log(`Error seeding initial data: ${error}`, "database");
      throw error;
    }
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    // Get data with raw SQL query to handle column name differences
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        tagline, 
        description, 
        price, 
        original_price as "originalPrice", 
        image_url as "imageUrl", 
        category_id as "categoryId",
        rating,
        review_count as "reviewCount",
        is_featured as "featured",
        COALESCE(in_stock, true) as "inStock"
      FROM products
    `);
    return result.rows as Product[];
  }

  async getProductById(id: number): Promise<Product | undefined> {
    // Get data with raw SQL query to handle column name differences
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        tagline, 
        description, 
        price, 
        original_price as "originalPrice", 
        image_url as "imageUrl", 
        category_id as "categoryId",
        rating,
        review_count as "reviewCount",
        is_featured as "featured",
        COALESCE(in_stock, true) as "inStock"
      FROM products
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return undefined;
    }
    
    return result.rows[0] as Product;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    // Get data with raw SQL query to handle column name differences
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        tagline, 
        description, 
        price, 
        original_price as "originalPrice", 
        image_url as "imageUrl", 
        category_id as "categoryId",
        rating,
        review_count as "reviewCount",
        is_featured as "featured",
        COALESCE(in_stock, true) as "inStock"
      FROM products
      WHERE category_id = $1
    `, [categoryId]);
    
    return result.rows as Product[];
  }

  async getFeaturedProducts(): Promise<Product[]> {
    // Get data with raw SQL query to handle column name differences
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        tagline, 
        description, 
        price, 
        original_price as "originalPrice", 
        image_url as "imageUrl", 
        category_id as "categoryId",
        rating,
        review_count as "reviewCount",
        is_featured as "featured",
        COALESCE(in_stock, true) as "inStock"
      FROM products
      WHERE is_featured = true
    `);
    
    return result.rows as Product[];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  // Reviews
  async getReviewsByProductId(productId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.productId, productId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return newTestimonial;
  }

  // Cart Items with Product information
  async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
    // First get cart items
    const items = await db.select().from(cartItems).where(eq(cartItems.userId, userId));
    
    // Now get products for those items
    const result = await Promise.all(items.map(async (item) => {
      const product = await this.getProductById(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found for cart item ${item.id}`);
      }
      return { ...item, product };
    }));
    
    return result;
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if this product is already in the cart
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, cartItem.userId),
          eq(cartItems.productId, cartItem.productId)
        )
      );
    
    if (existingItem) {
      // Update quantity instead of creating a new item
      // Make sure we have a quantity and default to 1 if not provided
      const quantityToAdd = cartItem.quantity || 1;
      return await this.updateCartItem(existingItem.id, existingItem.quantity + quantityToAdd);
    } else {
      // Create new cart item, ensuring quantity is set
      const [newCartItem] = await db.insert(cartItems).values({
        ...cartItem,
        quantity: cartItem.quantity || 1, // Default to 1 if not provided
        addedAt: new Date()
      }).returning();
      
      return newCartItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    if (quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }
    
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    
    if (!updatedItem) {
      throw new Error(`Cart item with id ${id} not found`);
    }
    
    return updatedItem;
  }

  async removeCartItem(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }
}

export const dbStorage = new DatabaseStorage();