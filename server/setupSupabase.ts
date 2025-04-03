
import { supabase } from './supabase';
import { log } from './vite';
import { memStorage } from './storage';
import { pool } from './db'; // Using the pg pool directly

export async function migrateToSupabase() {
  log('Starting database setup...', 'migration');

  try {
    // Create tables using the pg client directly with DATABASE_URL
    log('Creating tables using pg client...', 'migration');
    const client = await pool.connect();

    try {
      // First, attempt to create tables using direct SQL queries
      const createCategoriesSQL = `
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL, 
          image_url TEXT NOT NULL
        );
      `;

      const createProductsSQL = `
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          tagline TEXT NOT NULL,
          price DOUBLE PRECISION NOT NULL,
          original_price DOUBLE PRECISION,
          description TEXT NOT NULL,
          image_url TEXT NOT NULL,
          rating DOUBLE PRECISION NOT NULL,
          review_count INTEGER NOT NULL,
          category_id INTEGER NOT NULL,
          is_featured BOOLEAN NOT NULL DEFAULT FALSE,
          is_best_seller BOOLEAN DEFAULT FALSE,
          is_new_arrival BOOLEAN DEFAULT FALSE
        );
      `;

      const createReviewsSQL = `
        CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          product_id INTEGER NOT NULL,
          user_name TEXT NOT NULL,
          user_image_url TEXT NOT NULL,
          rating INTEGER NOT NULL,
          comment TEXT NOT NULL,
          is_verified BOOLEAN NOT NULL DEFAULT TRUE
        );
      `;

      const createTestimonialsSQL = `
        CREATE TABLE IF NOT EXISTS testimonials (
          id SERIAL PRIMARY KEY,
          user_name TEXT NOT NULL,
          user_image_url TEXT NOT NULL,
          rating INTEGER NOT NULL,
          comment TEXT NOT NULL,
          is_verified BOOLEAN NOT NULL DEFAULT TRUE
        );
      `;

      const createOrdersSQL = `
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          items JSONB NOT NULL,
          status TEXT NOT NULL,
          total_amount DOUBLE PRECISION NOT NULL,
          shipping_address TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;

      const createUsersSQL = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'user',
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;

      const createCartItemsSQL = `
        CREATE TABLE IF NOT EXISTS cart_items (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          added_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;

      // Execute all SQL statements to create tables
      await client.query(createCategoriesSQL);
      await client.query(createProductsSQL);
      await client.query(createReviewsSQL);
      await client.query(createTestimonialsSQL);
      await client.query(createOrdersSQL);
      await client.query(createUsersSQL);
      await client.query(createCartItemsSQL);
      
      log('Tables created successfully', 'migration');
      
      // Now migrate data directly using pg client
      log('Migrating data from MemStorage using direct SQL...', 'migration');

      // Migrate Categories
      const categories = await memStorage.getAllCategories();
      for (const category of categories) {
        try {
          await client.query(
            `INSERT INTO categories (id, name, description, image_url) 
             VALUES ($1, $2, $3, $4) 
             ON CONFLICT (id) DO UPDATE 
             SET name = $2, description = $3, image_url = $4`,
            [category.id, category.name, category.description, category.imageUrl]
          );
          log(`Category ${category.name} migrated successfully`, 'migration');
        } catch (error) {
          log(`Error inserting category ${category.name}: ${error}`, 'migration');
        }
      }

      // Migrate Products
      const products = await memStorage.getAllProducts();
      const categoryList = await memStorage.getAllCategories();
      
      // Create a map of category names to IDs
      const categoryMap = new Map<string, number>();
      for (const category of categoryList) {
        categoryMap.set(category.name.toLowerCase(), category.id);
      }
      
      // Function to determine category ID based on product name
      const getCategoryId = (productName: string): number => {
        if (productName.toLowerCase().includes('facial') || 
            productName.toLowerCase().includes('face') || 
            productName.toLowerCase().includes('cleanser') || 
            productName.toLowerCase().includes('serum')) {
          return categoryMap.get('facial care') || 1;
        } else if (productName.toLowerCase().includes('body') || 
                  productName.toLowerCase().includes('scrub') || 
                  productName.toLowerCase().includes('oil')) {
          return categoryMap.get('body rituals') || 2;
        } else if (productName.toLowerCase().includes('aromatherapy') || 
                  productName.toLowerCase().includes('essential')) {
          return categoryMap.get('aromatherapy') || 3;
        }
        
        // Default to the first category if no match
        return categoryList[0]?.id || 1;
      };
      
      for (const product of products) {
        try {
          // Ensure category_id is never null by using the mapping function
          const categoryId = product.categoryId || getCategoryId(product.name);
          
          await client.query(
            `INSERT INTO products (
              id, name, tagline, price, original_price, description, 
              image_url, rating, review_count, category_id, 
              is_featured, is_best_seller, is_new_arrival
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            ON CONFLICT (id) DO UPDATE 
            SET name = $2, tagline = $3, price = $4, original_price = $5, 
                description = $6, image_url = $7, rating = $8, review_count = $9, 
                category_id = $10, is_featured = $11, is_best_seller = $12, 
                is_new_arrival = $13`,
            [
              product.id, 
              product.name, 
              product.tagline, 
              product.price, 
              product.originalPrice || null, 
              product.description, 
              product.imageUrl, 
              product.rating, 
              product.reviewCount, 
              categoryId, // Use the determined category ID
              product.isFeatured, 
              product.isBestSeller || false, 
              product.isNewArrival || false
            ]
          );
          log(`Product ${product.name} migrated successfully`, 'migration');
        } catch (error) {
          log(`Error inserting product ${product.name}: ${error}`, 'migration');
        }
      }

      // Migrate Testimonials  
      const testimonials = await memStorage.getAllTestimonials();
      for (const testimonial of testimonials) {
        try {
          await client.query(
            `INSERT INTO testimonials (
              id, user_name, user_image_url, rating, comment, is_verified
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO UPDATE
            SET user_name = $2, user_image_url = $3, rating = $4, 
                comment = $5, is_verified = $6`,
            [
              testimonial.id,
              testimonial.userName,
              testimonial.userImageUrl,
              testimonial.rating,
              testimonial.comment,
              testimonial.isVerified
            ]
          );
          log(`Testimonial from ${testimonial.userName} migrated successfully`, 'migration');
        } catch (error) {
          log(`Error inserting testimonial from ${testimonial.userName}: ${error}`, 'migration');
        }
      }
      
    } catch (error) {
      log(`Error in database migration: ${error}`, 'migration');
      throw error;
    } finally {
      client.release();
    }

    log('Data migration completed', 'migration');
    log('Migration completed successfully', 'migration');
    return true;
  } catch (error: any) {
    const message = error?.message || String(error);
    log(`Migration failed: ${message}`, 'migration');
    return false;
  }
}

export default migrateToSupabase;
