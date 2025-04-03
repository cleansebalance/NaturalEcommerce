import {
  categories, products, reviews, testimonials, orders, users, cartItems,
  type Category, type Product, type Review, type Testimonial, type Order, type User, type CartItem, type CartItemWithProduct,
  type InsertCategory, type InsertProduct, type InsertReview, type InsertTestimonial, type InsertOrder, type InsertUser, type InsertCartItem
} from "@shared/schema";
import { IStorage } from "./storage";
import { supabase } from "./supabase";
import { log } from "./vite";
import { pool } from './db'; // Import PostgreSQL client

export class SupabaseStorage implements IStorage {
  // Initialize database if necessary
  async initialize() {
    log("Initializing Supabase storage", "supabase");
    await this.ensureTablesExist();
  }

  // Helper method to ensure tables exist
  private async ensureTablesExist() {
    try {
      // First, let's verify that the tables are accessible through Supabase API
      let tablesExist = true;
      
      // Try to access each critical table through Supabase
      const tables = ['categories', 'products', 'testimonials'];
      for (const table of tables) {
        const { error } = await supabase.from(table).select('id').limit(1);
        
        if (error) {
          log(`Supabase table verification failed for ${table}: ${error.message}`, "supabase");
          tablesExist = false;
          break;
        }
      }
      
      // If tables don't exist or aren't accessible through Supabase API
      if (!tablesExist) {
        log("Tables not accessible through Supabase, attempting to migrate...", "supabase");
        // Import here to avoid circular dependency
        const { migrateToSupabase } = await import('./setupSupabase');
        const migrationSuccess = await migrateToSupabase();
        
        if (!migrationSuccess) {
          throw new Error("Migration failed");
        }
      }
      
      // Now check if we have data using direct PostgreSQL to avoid Supabase API issues
      const client = await pool.connect();
      try {
        // Check if any categories exist
        const result = await client.query('SELECT id FROM categories LIMIT 1');
        
        // If no categories exist, initialize with sample data
        if (result.rowCount === 0) {
          log("No categories found, initializing with sample data", "supabase");
          await this.initializeSampleData();
        } else {
          log("Database tables already initialized with data", "supabase");
        }
      } catch (error) {
        // Table might exist but be empty
        log(`Database check error: ${error}`, "supabase");
        log("Attempting to initialize sample data", "supabase");
        await this.initializeSampleData();
      } finally {
        client.release();
      }
      
      // Final verification that tables are accessible through Supabase
      for (const table of tables) {
        const { error } = await supabase.from(table).select('id').limit(1);
        
        if (error) {
          log(`Final Supabase verification still failed for ${table}: ${error.message}`, "supabase");
          log("Using direct PostgreSQL fallback for all operations", "supabase");
        }
      }
    } catch (error) {
      log(`Database initialization error: ${error}`, "supabase");
      throw error;
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
    try {
      // First try using Supabase
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) {
        log(`Error fetching categories via Supabase: ${error.message}`, "supabase");
        // Fall back to direct PostgreSQL
        const client = await pool.connect();
        try {
          const query = `
            SELECT 
              id, name, description, image_url as "imageUrl"
            FROM categories
          `;
          
          const result = await client.query(query);
          return result.rows;
        } finally {
          client.release();
        }
      }
      
      return data || [];
    } catch (error) {
      log(`Error fetching categories: ${error}`, "supabase");
      throw error;
    }
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
    try {
      const client = await pool.connect();
      try {
        const query = `
          INSERT INTO categories (name, description, image_url)
          VALUES ($1, $2, $3)
          RETURNING id, name, description, image_url as "imageUrl"
        `;
        
        const result = await client.query(query, [
          category.name,
          category.description,
          category.imageUrl
        ]);
        
        if (result.rows.length > 0) {
          return result.rows[0];
        }
        
        throw new Error('Failed to create category');
      } finally {
        client.release();
      }
    } catch (error) {
      log(`Error creating category: ${error}`, "supabase");
      throw error;
    }
  }
  
  // Products
  async getAllProducts(): Promise<Product[]> {
    try {
      // First try using Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        log(`Error fetching products via Supabase: ${error.message}`, "supabase");
        // Fall back to direct PostgreSQL
        const client = await pool.connect();
        try {
          const query = `
            SELECT 
              id, name, tagline, price, original_price as "originalPrice", 
              description, image_url as "imageUrl", rating, review_count as "reviewCount", 
              category_id as "categoryId", is_featured as "isFeatured", 
              is_best_seller as "isBestSeller", is_new_arrival as "isNewArrival"
            FROM products
          `;
          
          const result = await client.query(query);
          return result.rows;
        } finally {
          client.release();
        }
      }
      
      return data || [];
    } catch (error) {
      log(`Error fetching products: ${error}`, "supabase");
      throw error;
    }
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    try {
      // First try Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        // If not found, return undefined
        if (error.code === 'PGRST116') {
          return undefined;
        }
        
        // For other errors, try direct PostgreSQL as fallback
        log(`Error fetching product by id: ${error.message}`, "supabase");
        
        // Fallback to direct PostgreSQL
        const client = await pool.connect();
        try {
          const result = await client.query(`
            SELECT 
              id, name, tagline, price, original_price as "originalPrice", 
              description, image_url as "imageUrl", rating, review_count as "reviewCount", 
              category_id as "categoryId", is_featured as "isFeatured", 
              is_best_seller as "isBestSeller", is_new_arrival as "isNewArrival"
            FROM products
            WHERE id = $1
          `, [id]);
          
          if (result.rows.length === 0) {
            return undefined;
          }
          
          return result.rows[0] as Product;
        } finally {
          client.release();
        }
      }
      
      return data;
    } catch (error) {
      log(`Critical error in getProductById: ${error}`, "supabase");
      
      // Last resort: still try direct PostgreSQL
      try {
        const client = await pool.connect();
        try {
          const result = await client.query(`
            SELECT 
              id, name, tagline, price, original_price as "originalPrice", 
              description, image_url as "imageUrl", rating, review_count as "reviewCount", 
              category_id as "categoryId", is_featured as "isFeatured", 
              is_best_seller as "isBestSeller", is_new_arrival as "isNewArrival"
            FROM products
            WHERE id = $1
          `, [id]);
          
          if (result.rows.length === 0) {
            return undefined;
          }
          
          return result.rows[0] as Product;
        } finally {
          client.release();
        }
      } catch (pgError) {
        log(`Failed to fallback to PostgreSQL: ${pgError}`, "supabase");
        throw pgError;
      }
    }
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
    try {
      // First try using Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true);
      
      if (error) {
        log(`Error fetching featured products via Supabase: ${error.message}`, "supabase");
        // Fall back to direct PostgreSQL
        const client = await pool.connect();
        try {
          const query = `
            SELECT 
              id, name, tagline, price, original_price as "originalPrice", 
              description, image_url as "imageUrl", rating, review_count as "reviewCount", 
              category_id as "categoryId", is_featured as "isFeatured", 
              is_best_seller as "isBestSeller", is_new_arrival as "isNewArrival"
            FROM products
            WHERE is_featured = true
          `;
          
          const result = await client.query(query);
          return result.rows;
        } finally {
          client.release();
        }
      }
      
      return data || [];
    } catch (error) {
      log(`Error fetching featured products: ${error}`, "supabase");
      throw error;
    }
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    try {
      const client = await pool.connect();
      try {
        const query = `
          INSERT INTO products (
            name, tagline, price, original_price, description, 
            image_url, rating, review_count, category_id, 
            is_featured, is_best_seller, is_new_arrival
          ) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING 
            id, name, tagline, price, original_price as "originalPrice", 
            description, image_url as "imageUrl", rating, review_count as "reviewCount", 
            category_id as "categoryId", is_featured as "isFeatured", 
            is_best_seller as "isBestSeller", is_new_arrival as "isNewArrival"
        `;
        
        const result = await client.query(query, [
          product.name,
          product.tagline,
          product.price,
          product.originalPrice || null,
          product.description,
          product.imageUrl,
          product.rating,
          product.reviewCount,
          product.categoryId,
          product.isFeatured || false,
          product.isBestSeller || false,
          product.isNewArrival || false
        ]);
        
        if (result.rows.length > 0) {
          return result.rows[0];
        }
        
        throw new Error('Failed to create product');
      } finally {
        client.release();
      }
    } catch (error) {
      log(`Error creating product: ${error}`, "supabase");
      throw error;
    }
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
    try {
      // First try using Supabase
      const { data, error } = await supabase
        .from('testimonials')
        .select('*');
      
      if (error) {
        log(`Error fetching testimonials via Supabase: ${error.message}`, "supabase");
        // Fall back to direct PostgreSQL
        const client = await pool.connect();
        try {
          const query = `
            SELECT 
              id, user_name as "userName", user_image_url as "userImageUrl", 
              rating, comment, is_verified as "isVerified"
            FROM testimonials
          `;
          
          const result = await client.query(query);
          return result.rows;
        } finally {
          client.release();
        }
      }
      
      return data || [];
    } catch (error) {
      log(`Error fetching testimonials: ${error}`, "supabase");
      throw error;
    }
  }
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    try {
      const client = await pool.connect();
      try {
        const query = `
          INSERT INTO testimonials (
            user_name, user_image_url, rating, comment, is_verified
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING 
            id, user_name as "userName", user_image_url as "userImageUrl", 
            rating, comment, is_verified as "isVerified"
        `;
        
        const result = await client.query(query, [
          testimonial.userName,
          testimonial.userImageUrl,
          testimonial.rating,
          testimonial.comment,
          testimonial.isVerified || true
        ]);
        
        if (result.rows.length > 0) {
          return result.rows[0];
        }
        
        throw new Error('Failed to create testimonial');
      } finally {
        client.release();
      }
    } catch (error) {
      log(`Error creating testimonial: ${error}`, "supabase");
      throw error;
    }
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
  
  async getUserOrders(userId: number): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      log(`Error fetching user orders: ${error.message}`, "supabase");
      throw error;
    }
    
    return data || [];
  }
  
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      // If not found, return undefined rather than throwing
      if (error.code === 'PGRST116') {
        return undefined;
      }
      log(`Error fetching user by id: ${error.message}`, "supabase");
      throw error;
    }
    
    return data;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      // First attempt to use Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) {
        // If not found, return undefined
        if (error.code === 'PGRST116') {
          return undefined;
        }
        
        // For other errors, try direct PostgreSQL connection as fallback
        log(`Error fetching user by username via Supabase: ${error.message}`, "supabase");
        
        // Fallback to direct PostgreSQL
        const client = await pool.connect();
        try {
          const result = await client.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
          );
          
          if (result.rows.length === 0) {
            return undefined;
          }
          
          return result.rows[0] as User;
        } finally {
          client.release();
        }
      }
      
      return data;
    } catch (error) {
      log(`Critical error in getUserByUsername: ${error}`, "supabase");
      // For critical errors, still try direct PostgreSQL
      try {
        const client = await pool.connect();
        try {
          const result = await client.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
          );
          
          if (result.rows.length === 0) {
            return undefined;
          }
          
          return result.rows[0] as User;
        } finally {
          client.release();
        }
      } catch (pgError) {
        log(`Failed to fallback to PostgreSQL: ${pgError}`, "supabase");
        throw pgError;
      }
    }
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      // First attempt to use Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        // If not found, return undefined
        if (error.code === 'PGRST116') {
          return undefined;
        }
        
        // For other errors, try direct PostgreSQL connection as fallback
        log(`Error fetching user by email via Supabase: ${error.message}`, "supabase");
        
        // Fallback to direct PostgreSQL
        const client = await pool.connect();
        try {
          const result = await client.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
          );
          
          if (result.rows.length === 0) {
            return undefined;
          }
          
          return result.rows[0] as User;
        } finally {
          client.release();
        }
      }
      
      return data;
    } catch (error) {
      log(`Critical error in getUserByEmail: ${error}`, "supabase");
      // For critical errors, still try direct PostgreSQL
      try {
        const client = await pool.connect();
        try {
          const result = await client.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
          );
          
          if (result.rows.length === 0) {
            return undefined;
          }
          
          return result.rows[0] as User;
        } finally {
          client.release();
        }
      } catch (pgError) {
        log(`Failed to fallback to PostgreSQL: ${pgError}`, "supabase");
        throw pgError;
      }
    }
  }
  
  async createUser(user: InsertUser): Promise<User> {
    try {
      // First attempt to use Supabase
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single();
      
      if (error) {
        log(`Error creating user via Supabase: ${error.message}`, "supabase");
        
        // Fallback to direct PostgreSQL with explicit column mapping
        const client = await pool.connect();
        try {
          // Generate a new id
          const idResult = await client.query("SELECT COALESCE(MAX(id), 0) + 1 as new_id FROM users");
          const newId = idResult.rows[0].new_id;
          
          // Explicitly construct the query with named parameters
          // to avoid type inconsistency issues
          const query = `
            INSERT INTO users (
              id, 
              username, 
              email, 
              password, 
              name, 
              role, 
              created_at
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, NOW()
            )
            RETURNING *
          `;
          
          // Use explicit mapping of values to maintain type consistency
          const result = await client.query(query, [
            newId,
            user.username,
            user.email,
            user.password,
            user.name || '',
            user.role || 'user'
          ]);
          
          if (result.rows.length === 0) {
            throw new Error("Failed to create user with PostgreSQL");
          }
          
          return result.rows[0] as User;
        } finally {
          client.release();
        }
      }
      
      return data;
    } catch (error) {
      log(`Critical error in createUser: ${error}`, "supabase");
      
      // For catastrophic errors, make one more attempt with simplified query
      try {
        const client = await pool.connect();
        try {
          // Generate a new id
          const idResult = await client.query("SELECT COALESCE(MAX(id), 0) + 1 as new_id FROM users");
          const newId = idResult.rows[0].new_id;
          
          // Use a much simpler query with hard-coded parameter positions
          const query = `
            INSERT INTO users (id, username, email, password, name, role, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *
          `;
          
          const result = await client.query(query, [
            newId,
            user.username,
            user.email,
            user.password,
            user.name || '',
            user.role || 'user'
          ]);
          
          if (result.rows.length === 0) {
            throw new Error("Failed to create user with PostgreSQL in final attempt");
          }
          
          return result.rows[0] as User;
        } finally {
          client.release();
        }
      } catch (finalError) {
        log(`All attempts to create user failed: ${finalError}`, "supabase");
        throw finalError;
      }
    }
  }

  // Cart Items
  async getCartItems(userId: number): Promise<CartItemWithProduct[]> {
    try {
      // First try using Supabase
      try {
        // First get the cart items
        const { data: cartItems, error: cartError } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', userId);
        
        if (cartError) {
          throw cartError;
        }
        
        if (!cartItems || cartItems.length === 0) {
          return [];
        }
        
        // Then fetch the products and join them
        const result: CartItemWithProduct[] = [];
        
        for (const item of cartItems) {
          const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', item.productId)
            .single();
          
          if (productError) {
            log(`Error fetching product for cart item: ${productError.message}`, "supabase");
            continue; // Skip this item if product not found
          }
          
          result.push({
            ...item,
            product
          });
        }
        
        return result;
      } catch (supabaseError) {
        log(`Error fetching cart items via Supabase: ${supabaseError}`, "supabase");
        
        // Fall back to direct PostgreSQL
        const client = await pool.connect();
        try {
          // First get cart items
          const cartItemsQuery = `
            SELECT 
              id, user_id as "userId", product_id as "productId", 
              quantity, added_at as "addedAt"
            FROM cart_items
            WHERE user_id = $1
          `;
          
          const cartItemsResult = await client.query(cartItemsQuery, [userId]);
          const cartItems = cartItemsResult.rows;
          
          if (cartItems.length === 0) {
            return [];
          }
          
          // Then fetch the products and join them
          const result: CartItemWithProduct[] = [];
          
          for (const item of cartItems) {
            const productQuery = `
              SELECT 
                id, name, tagline, price, original_price as "originalPrice", 
                description, image_url as "imageUrl", rating, review_count as "reviewCount", 
                category_id as "categoryId", is_featured as "isFeatured", 
                is_best_seller as "isBestSeller", is_new_arrival as "isNewArrival"
              FROM products
              WHERE id = $1
            `;
            
            const productResult = await client.query(productQuery, [item.productId]);
            
            if (productResult.rows.length === 0) {
              continue; // Skip if product not found
            }
            
            result.push({
              ...item,
              product: productResult.rows[0]
            });
          }
          
          return result;
        } finally {
          client.release();
        }
      }
    } catch (error) {
      log(`Error fetching cart items: ${error}`, "supabase");
      throw error;
    }
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    try {
      // First try with Supabase
      try {
        // Check if item already exists in cart
        const { data: existingItems, error: findError } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', cartItem.userId)
          .eq('product_id', cartItem.productId);
        
        if (findError) {
          log(`Error checking existing cart item: ${findError.message}`, "supabase");
          throw findError;
        }
        
        // If item exists, update its quantity
        if (existingItems && existingItems.length > 0) {
          const existingItem = existingItems[0];
          return this.updateCartItem(existingItem.id, existingItem.quantity + cartItem.quantity);
        }
        
        // Otherwise, insert new cart item
        const { data, error } = await supabase
          .from('cart_items')
          .insert(cartItem)
          .select()
          .single();
        
        if (error) {
          log(`Error adding to cart via Supabase: ${error.message}`, "supabase");
          throw error;
        }
        
        return data;
      } catch (supabaseError) {
        // Fallback to direct PostgreSQL
        log(`Falling back to PostgreSQL for addToCart: ${supabaseError}`, "supabase");
        
        const client = await pool.connect();
        try {
          // First check if product exists
          const productCheck = await client.query(
            'SELECT id FROM products WHERE id = $1',
            [cartItem.productId]
          );
          
          if (productCheck.rows.length === 0) {
            throw new Error(`Product with id ${cartItem.productId} not found`);
          }
          
          // Check if item already exists in cart
          const existingCheck = await client.query(
            'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
            [cartItem.userId, cartItem.productId]
          );
          
          // If item exists, update its quantity
          if (existingCheck.rows.length > 0) {
            const existingItem = existingCheck.rows[0];
            const newQuantity = existingItem.quantity + cartItem.quantity;
            
            const updateResult = await client.query(
              `UPDATE cart_items 
               SET quantity = $1 
               WHERE id = $2 
               RETURNING id, user_id as "userId", product_id as "productId", quantity, added_at as "addedAt"`,
              [newQuantity, existingItem.id]
            );
            
            return updateResult.rows[0] as CartItem;
          }
          
          // Otherwise, insert new cart item
          const insertResult = await client.query(
            `INSERT INTO cart_items (user_id, product_id, quantity, added_at)
             VALUES ($1, $2, $3, NOW())
             RETURNING id, user_id as "userId", product_id as "productId", quantity, added_at as "addedAt"`,
            [cartItem.userId, cartItem.productId, cartItem.quantity]
          );
          
          if (insertResult.rows.length === 0) {
            throw new Error('Failed to add item to cart');
          }
          
          return insertResult.rows[0] as CartItem;
        } finally {
          client.release();
        }
      }
    } catch (error) {
      log(`Error adding to cart: ${error}`, "supabase");
      throw error;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    try {
      // First try with Supabase
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        log(`Error updating cart item via Supabase: ${error.message}`, "supabase");
        
        // Fallback to direct PostgreSQL
        const client = await pool.connect();
        try {
          const result = await client.query(
            `UPDATE cart_items 
             SET quantity = $1 
             WHERE id = $2 
             RETURNING id, user_id as "userId", product_id as "productId", quantity, added_at as "addedAt"`,
            [quantity, id]
          );
          
          if (result.rows.length === 0) {
            throw new Error(`Cart item with id ${id} not found`);
          }
          
          return result.rows[0] as CartItem;
        } finally {
          client.release();
        }
      }
      
      return data;
    } catch (error) {
      log(`Error updating cart item: ${error}`, "supabase");
      throw error;
    }
  }

  async removeCartItem(id: number): Promise<void> {
    try {
      // First try with Supabase
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);
      
      if (error) {
        log(`Error removing cart item via Supabase: ${error.message}`, "supabase");
        
        // Fallback to direct PostgreSQL
        const client = await pool.connect();
        try {
          await client.query('DELETE FROM cart_items WHERE id = $1', [id]);
        } finally {
          client.release();
        }
      }
    } catch (error) {
      log(`Error removing cart item: ${error}`, "supabase");
      
      // Last attempt with PostgreSQL
      try {
        const client = await pool.connect();
        try {
          await client.query('DELETE FROM cart_items WHERE id = $1', [id]);
        } finally {
          client.release();
        }
      } catch (finalError) {
        log(`Final attempt to remove cart item failed: ${finalError}`, "supabase");
        throw finalError;
      }
    }
  }

  async clearCart(userId: number): Promise<void> {
    try {
      // First try with Supabase
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        log(`Error clearing cart via Supabase: ${error.message}`, "supabase");
        
        // Fallback to direct PostgreSQL
        const client = await pool.connect();
        try {
          await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
        } finally {
          client.release();
        }
      }
    } catch (error) {
      log(`Error clearing cart: ${error}`, "supabase");
      
      // Last attempt with PostgreSQL
      try {
        const client = await pool.connect();
        try {
          await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
        } finally {
          client.release();
        }
      } catch (finalError) {
        log(`Final attempt to clear cart failed: ${finalError}`, "supabase");
        throw finalError;
      }
    }
  }
}

// Create and initialize the Supabase storage instance
export const supabaseStorage = new SupabaseStorage();