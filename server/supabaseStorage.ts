import {
  categories, products, reviews, testimonials, orders,
  type Category, type Product, type Review, type Testimonial, type Order,
  type InsertCategory, type InsertProduct, type InsertReview, type InsertTestimonial, type InsertOrder
} from "@shared/schema";
import { IStorage } from "./storage";
import { supabase } from "./supabase";
import { log } from "./vite";

export class SupabaseStorage implements IStorage {
  // Initialize database if necessary
  async initialize() {
    log("Initializing Supabase storage", "supabase");
    await this.ensureTablesExist();
  }

  // Helper method to ensure tables exist
  private async ensureTablesExist() {
    // Check if categories table has data
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (categoriesError) {
      log(`Error checking categories table: ${categoriesError.message}`, "supabase");
    }

    // If no categories exist, initialize with sample data
    if (!categoriesData || categoriesData.length === 0) {
      log("No categories found, initializing with sample data", "supabase");
      await this.initializeSampleData();
    } else {
      log("Database tables already initialized", "supabase");
    }
  }

  // Initialize with sample data
  private async initializeSampleData() {
    try {
      // Add Categories
      const facialCare = await this.createCategory({
        name: "Facial Care",
        description: "Cleansers, serums, masks, and more",
        imageUrl: "https://images.unsplash.com/photo-1598454444604-73563a529875?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&h=800&q=80"
      });
      
      const bodyRituals = await this.createCategory({
        name: "Body Rituals",
        description: "Oils, scrubs, lotions, and more",
        imageUrl: "https://images.unsplash.com/photo-1596870230056-88eea6ef6d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&h=800&q=80"
      });
      
      const aromatherapy = await this.createCategory({
        name: "Aromatherapy",
        description: "Essential oils, diffusers, and blends",
        imageUrl: "https://images.unsplash.com/photo-1593150320617-fc076c75ff85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&h=800&q=80"
      });
      
      // Add Products
      await this.createProduct({
        name: "Harmony Facial Cleanser",
        tagline: "Purify & Balance",
        price: 34.00,
        description: "A gentle cleanser that removes impurities without stripping the skin's natural moisture. Formulated with natural ingredients to leave your skin feeling refreshed and balanced.",
        imageUrl: "https://images.unsplash.com/photo-1595876210541-bc5e4a35de24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=900&q=80",
        rating: 4.5,
        reviewCount: 128,
        categoryId: facialCare.id,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: false
      });
      
      await this.createProduct({
        name: "Tranquil Face Serum",
        tagline: "Hydrate & Soothe",
        price: 49.00,
        description: "This potent serum delivers deep hydration and soothes irritated skin. Packed with antioxidants to protect against environmental stressors.",
        imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=900&q=80",
        rating: 5.0,
        reviewCount: 76,
        categoryId: facialCare.id,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: false
      });
      
      await this.createProduct({
        name: "Renewal Body Scrub",
        tagline: "Exfoliate & Renew",
        price: 42.00,
        description: "Reveal smoother, more radiant skin with this natural exfoliating scrub. Removes dead skin cells and promotes circulation for renewed skin texture.",
        imageUrl: "https://images.unsplash.com/photo-1616769364512-4f5659d12046?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=900&q=80",
        rating: 4.7,
        reviewCount: 214,
        categoryId: bodyRituals.id,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false
      });
      
      await this.createProduct({
        name: "Serene Body Oil",
        tagline: "Nourish & Restore",
        price: 38.00,
        description: "A luxurious body oil that deeply nourishes and restores the skin. Absorbs quickly without leaving a greasy residue, leaving skin soft and supple.",
        imageUrl: "https://images.unsplash.com/photo-1655344085290-ba7e9e049934?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=900&q=80",
        rating: 4.0,
        reviewCount: 92,
        categoryId: bodyRituals.id,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: false
      });
      
      await this.createProduct({
        name: "Ultimate Harmony Kit",
        tagline: "Complete Wellness Set",
        price: 129.00,
        originalPrice: 149.00,
        description: "Our complete wellness solution combines facial cleanser, serum, body oil, and aromatherapy blend in one beautifully packaged set. Perfect for gifting or starting your natural wellness journey.",
        imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&h=1200&q=80",
        rating: 5.0,
        reviewCount: 48,
        categoryId: facialCare.id,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true
      });
      
      // Add Testimonials
      await this.createTestimonial({
        userName: "Sarah J.",
        userImageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        comment: "I've been using the Tranquil Face Serum for three months now, and my skin has never looked better. The natural ingredients make a noticeable difference!",
        isVerified: true
      });
      
      await this.createTestimonial({
        userName: "Michael T.",
        userImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        comment: "The Ultimate Harmony Kit was the perfect gift for my mom. She loves the entire collection and the beautiful packaging made it extra special.",
        isVerified: true
      });
      
      await this.createTestimonial({
        userName: "Emma R.",
        userImageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 4,
        comment: "The Renewal Body Scrub is amazing! It leaves my skin so soft and the scent is divine. I love that all ingredients are natural and sustainable.",
        isVerified: true
      });

      log("Sample data initialized successfully", "supabase");
    } catch (error) {
      log(`Error initializing sample data: ${error}`, "supabase");
      throw error;
    }
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) {
      log(`Error fetching categories: ${error.message}`, "supabase");
      throw error;
    }
    
    return data || [];
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      // If not found, return undefined rather than throwing
      if (error.code === 'PGRST116') {
        return undefined;
      }
      log(`Error fetching category by id: ${error.message}`, "supabase");
      throw error;
    }
    
    return data;
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) {
      log(`Error creating category: ${error.message}`, "supabase");
      throw error;
    }
    
    return data;
  }
  
  // Products
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      log(`Error fetching products: ${error.message}`, "supabase");
      throw error;
    }
    
    return data || [];
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      // If not found, return undefined rather than throwing
      if (error.code === 'PGRST116') {
        return undefined;
      }
      log(`Error fetching product by id: ${error.message}`, "supabase");
      throw error;
    }
    
    return data;
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId);
    
    if (error) {
      log(`Error fetching products by category: ${error.message}`, "supabase");
      throw error;
    }
    
    return data || [];
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true);
    
    if (error) {
      log(`Error fetching featured products: ${error.message}`, "supabase");
      throw error;
    }
    
    return data || [];
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) {
      log(`Error creating product: ${error.message}`, "supabase");
      throw error;
    }
    
    return data;
  }
  
  // Reviews
  async getReviewsByProductId(productId: number): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId);
    
    if (error) {
      log(`Error fetching reviews by product id: ${error.message}`, "supabase");
      throw error;
    }
    
    return data || [];
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();
    
    if (error) {
      log(`Error creating review: ${error.message}`, "supabase");
      throw error;
    }
    
    return data;
  }
  
  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*');
    
    if (error) {
      log(`Error fetching testimonials: ${error.message}`, "supabase");
      throw error;
    }
    
    return data || [];
  }
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonial)
      .select()
      .single();
    
    if (error) {
      log(`Error creating testimonial: ${error.message}`, "supabase");
      throw error;
    }
    
    return data;
  }
  
  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) {
      log(`Error creating order: ${error.message}`, "supabase");
      throw error;
    }
    
    return data;
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      // If not found, return undefined rather than throwing
      if (error.code === 'PGRST116') {
        return undefined;
      }
      log(`Error fetching order by id: ${error.message}`, "supabase");
      throw error;
    }
    
    return data;
  }
}

// Create and initialize the Supabase storage instance
export const supabaseStorage = new SupabaseStorage();