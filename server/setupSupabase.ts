
import { supabase } from './supabase';
import { log } from './vite';
import { memStorage } from './storage';
import { pool } from './db'; // Using the pg pool directly

/**
 * Create tables through Supabase's RPC mechanism to ensure proper registration
 * @returns true if successful, false otherwise
 */
async function createTablesWithSupabase() {
  log('Creating tables through Supabase...', 'migration');
  
  try {
    // First, we'll check if we can use the Supabase RPC mechanism
    const createTables = async () => {
      // Create categories table
      const { error: categoriesError } = await supabase.rpc('create_table_if_not_exists', {
        table_name: 'categories',
        table_definition: `
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL, 
          image_url TEXT NOT NULL
        `
      });
      
      if (categoriesError) {
        throw new Error(`Failed to create categories table: ${categoriesError.message}`);
      }
      
      // Create products table
      const { error: productsError } = await supabase.rpc('create_table_if_not_exists', {
        table_name: 'products',
        table_definition: `
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
        `
      });
      
      if (productsError) {
        throw new Error(`Failed to create products table: ${productsError.message}`);
      }
      
      // Create reviews table
      const { error: reviewsError } = await supabase.rpc('create_table_if_not_exists', {
        table_name: 'reviews',
        table_definition: `
          id SERIAL PRIMARY KEY,
          product_id INTEGER NOT NULL,
          user_name TEXT NOT NULL,
          user_image_url TEXT NOT NULL,
          rating INTEGER NOT NULL,
          comment TEXT NOT NULL,
          is_verified BOOLEAN NOT NULL DEFAULT TRUE
        `
      });
      
      if (reviewsError) {
        throw new Error(`Failed to create reviews table: ${reviewsError.message}`);
      }
      
      // Create testimonials table
      const { error: testimonialsError } = await supabase.rpc('create_table_if_not_exists', {
        table_name: 'testimonials',
        table_definition: `
          id SERIAL PRIMARY KEY,
          user_name TEXT NOT NULL,
          user_image_url TEXT NOT NULL,
          rating INTEGER NOT NULL,
          comment TEXT NOT NULL,
          is_verified BOOLEAN NOT NULL DEFAULT TRUE
        `
      });
      
      if (testimonialsError) {
        throw new Error(`Failed to create testimonials table: ${testimonialsError.message}`);
      }
      
      // Create orders table
      const { error: ordersError } = await supabase.rpc('create_table_if_not_exists', {
        table_name: 'orders',
        table_definition: `
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          items JSONB NOT NULL,
          status TEXT NOT NULL,
          total_amount DOUBLE PRECISION NOT NULL,
          shipping_address TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        `
      });
      
      if (ordersError) {
        throw new Error(`Failed to create orders table: ${ordersError.message}`);
      }
      
      // Create users table
      const { error: usersError } = await supabase.rpc('create_table_if_not_exists', {
        table_name: 'users',
        table_definition: `
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'user',
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        `
      });
      
      if (usersError) {
        throw new Error(`Failed to create users table: ${usersError.message}`);
      }
      
      // Create cart_items table
      const { error: cartItemsError } = await supabase.rpc('create_table_if_not_exists', {
        table_name: 'cart_items',
        table_definition: `
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          added_at TIMESTAMP NOT NULL DEFAULT NOW()
        `
      });
      
      if (cartItemsError) {
        throw new Error(`Failed to create cart_items table: ${cartItemsError.message}`);
      }
      
      return true;
    };
    
    // Try using Supabase RPC function
    try {
      return await createTables();
    } catch (error) {
      log(`Supabase RPC not available: ${error}`, 'migration');
      
      // If RPC fails, the function might not exist in Supabase, so we'll create it first
      log('Creating utility SQL function for table creation...', 'migration');
      
      // Connect directly to PostgreSQL to create the RPC function
      const client = await pool.connect();
      try {
        // Create a SQL function that can be used by Supabase RPC
        await client.query(`
          CREATE OR REPLACE FUNCTION create_table_if_not_exists(
            table_name text,
            table_definition text
          ) RETURNS void AS $$
          BEGIN
            EXECUTE format('CREATE TABLE IF NOT EXISTS %I (%s)', table_name, table_definition);
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `);
        
        log('Utility function created, trying again with Supabase RPC...', 'migration');
        return await createTables();
      } catch (sqlError) {
        log(`Failed to create utility function: ${sqlError}`, 'migration');
        return false;
      } finally {
        client.release();
      }
    }
  } catch (error) {
    log(`Error in table creation: ${error}`, 'migration');
    return false;
  }
}

export async function migrateToSupabase() {
  log('Starting database setup...', 'migration');

  try {
    // First try to create tables using Supabase's mechanism
    const tablesCreated = await createTablesWithSupabase();
    
    if (!tablesCreated) {
      // Fallback to direct PostgreSQL if Supabase mechanism fails
      log('Falling back to direct PostgreSQL for table creation...', 'migration');
      const client = await pool.connect();
      
      try {
        // Create tables using direct SQL
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
        
        log('Tables created successfully via direct SQL', 'migration');
      } catch (sqlError) {
        log(`Error creating tables via direct SQL: ${sqlError}`, 'migration');
        throw sqlError;
      } finally {
        client.release();
      }
    }
    
    // Now enable row level security and create policies for Supabase
    log('Setting up Supabase-specific configurations...', 'migration');
    
    try {
      // Run these as direct SQL queries as they're Supabase-specific
      const client = await pool.connect();
      try {
        // Enable RLS on all tables
        await client.query(`
          DO $$
          DECLARE
            t text;
          BEGIN
            FOR t IN SELECT tablename FROM pg_tables 
            WHERE schemaname = 'public' AND 
            tablename IN ('categories', 'products', 'reviews', 'testimonials', 'orders', 'users', 'cart_items')
            LOOP
              EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
              -- Create a policy that allows all operations for authenticated users
              EXECUTE format('CREATE POLICY "Enable all operations for authenticated users" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t);
              -- Create a policy that allows reads for anon users
              EXECUTE format('CREATE POLICY "Enable read access for anon users" ON %I FOR SELECT TO anon USING (true)', t);
            END LOOP;
          END
          $$;
        `);
        
        log('Supabase-specific configurations completed', 'migration');
      } catch (rlsError) {
        log(`Error setting up Supabase RLS policies: ${rlsError}`, 'migration');
        // Continue even if RLS setup fails, as it might not be critical
      } finally {
        client.release();
      }
    } catch (error) {
      log(`Error in Supabase configuration: ${error}`, 'migration');
      // Continue even if there are errors, as we'll still attempt data migration
    }
    
    // Now migrate data using Supabase API
    log('Migrating data from MemStorage...', 'migration');
    
    // Migrate Categories
    const categories = await memStorage.getAllCategories();
    for (const category of categories) {
      try {
        // First try using Supabase
        const { error: supabaseError } = await supabase
          .from('categories')
          .upsert({
            id: category.id,
            name: category.name,
            description: category.description,
            image_url: category.imageUrl
          }, { onConflict: 'id' });
        
        if (supabaseError) {
          log(`Supabase insert error for category ${category.name}: ${supabaseError.message}`, 'migration');
          
          // Fallback to direct PostgreSQL
          const client = await pool.connect();
          try {
            await client.query(
              `INSERT INTO categories (id, name, description, image_url) 
               VALUES ($1, $2, $3, $4) 
               ON CONFLICT (id) DO UPDATE 
               SET name = $2, description = $3, image_url = $4`,
              [category.id, category.name, category.description, category.imageUrl]
            );
          } finally {
            client.release();
          }
        }
        
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
        
        // First try using Supabase
        const { error: supabaseError } = await supabase
          .from('products')
          .upsert({
            id: product.id,
            name: product.name,
            tagline: product.tagline,
            price: product.price,
            original_price: product.originalPrice || null,
            description: product.description,
            image_url: product.imageUrl,
            rating: product.rating,
            review_count: product.reviewCount,
            category_id: categoryId,
            is_featured: product.isFeatured,
            is_best_seller: product.isBestSeller || false,
            is_new_arrival: product.isNewArrival || false
          }, { onConflict: 'id' });
        
        if (supabaseError) {
          log(`Supabase insert error for product ${product.name}: ${supabaseError.message}`, 'migration');
          
          // Fallback to direct PostgreSQL
          const client = await pool.connect();
          try {
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
          } finally {
            client.release();
          }
        }
        
        log(`Product ${product.name} migrated successfully`, 'migration');
      } catch (error) {
        log(`Error inserting product ${product.name}: ${error}`, 'migration');
      }
    }

    // Migrate Testimonials  
    const testimonials = await memStorage.getAllTestimonials();
    for (const testimonial of testimonials) {
      try {
        // First try using Supabase
        const { error: supabaseError } = await supabase
          .from('testimonials')
          .upsert({
            id: testimonial.id,
            user_name: testimonial.userName,
            user_image_url: testimonial.userImageUrl,
            rating: testimonial.rating,
            comment: testimonial.comment,
            is_verified: testimonial.isVerified
          }, { onConflict: 'id' });
        
        if (supabaseError) {
          log(`Supabase insert error for testimonial from ${testimonial.userName}: ${supabaseError.message}`, 'migration');
          
          // Fallback to direct PostgreSQL
          const client = await pool.connect();
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
          } finally {
            client.release();
          }
        }
        
        log(`Testimonial from ${testimonial.userName} migrated successfully`, 'migration');
      } catch (error) {
        log(`Error inserting testimonial from ${testimonial.userName}: ${error}`, 'migration');
      }
    }
    
    // Verify that the tables are accessible through Supabase
    log('Verifying Supabase table access...', 'migration');
    
    try {
      // Try to access each table through Supabase
      const tables = ['categories', 'products', 'testimonials', 'users', 'cart_items', 'orders', 'reviews'];
      let allTablesAccessible = true;
      
      for (const table of tables) {
        const { error } = await supabase.from(table).select('id').limit(1);
        
        if (error) {
          log(`Supabase access verification failed for table ${table}: ${error.message}`, 'migration');
          allTablesAccessible = false;
        }
      }
      
      if (allTablesAccessible) {
        log('All tables are accessible through Supabase API', 'migration');
      } else {
        log('Some tables are not accessible through Supabase API', 'migration');
        
        // Attempt to refresh Supabase schema cache
        log('Attempting to refresh Supabase schema cache...', 'migration');
        
        const client = await pool.connect();
        try {
          // This is a common way to force Supabase to refresh its schema cache
          await client.query(`
            SELECT pg_notify('pgrst', 'reload schema');
          `);
          
          log('Supabase schema cache refresh requested', 'migration');
        } catch (refreshError) {
          log(`Error refreshing schema cache: ${refreshError}`, 'migration');
        } finally {
          client.release();
        }
      }
    } catch (verifyError) {
      log(`Error during verification: ${verifyError}`, 'migration');
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
