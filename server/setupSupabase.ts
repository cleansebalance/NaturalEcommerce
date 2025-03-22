import { supabase } from './supabase';
import { log } from './vite';
import { memStorage } from './storage';

export async function migrateToSupabase() {
  log('Starting Supabase database setup...', 'supabase-migration');

  try {
    // Create tables using direct SQL execution
    const { data, error: createError } = await supabase.sql`
          CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            image_url TEXT NOT NULL
          );

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
            is_featured BOOLEAN NOT NULL DEFAULT false,
            is_best_seller BOOLEAN DEFAULT false,
            is_new_arrival BOOLEAN DEFAULT false
          );

          CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            product_id INTEGER NOT NULL,
            user_name TEXT NOT NULL,
            user_image_url TEXT NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT NOT NULL,
            is_verified BOOLEAN NOT NULL DEFAULT true
          );

          CREATE TABLE IF NOT EXISTS testimonials (
            id SERIAL PRIMARY KEY,
            user_name TEXT NOT NULL,
            user_image_url TEXT NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT NOT NULL,
            is_verified BOOLEAN NOT NULL DEFAULT true
          );

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

    if (createError) {
      throw new Error(`Failed to create tables: ${createError.message}`);
    }

    // Migrate data from MemStorage
    log('Migrating data from MemStorage to Supabase...', 'supabase-migration');

    // Migrate Categories
    const categories = await memStorage.getAllCategories();
    for (const category of categories) {
      const { error } = await supabase
        .from('categories')
        .upsert({
          id: category.id,
          name: category.name,
          description: category.description,
          image_url: category.imageUrl
        });

      if (error) {
        log(`Error inserting category: ${error.message}`, 'supabase-migration');
      }
    }

    // Migrate Products
    const products = await memStorage.getAllProducts();
    for (const product of products) {
      const { error } = await supabase
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
          category_id: product.categoryId,
          is_featured: product.isFeatured,
          is_best_seller: product.isBestSeller || false,
          is_new_arrival: product.isNewArrival || false
        });

      if (error) {
        log(`Error inserting product: ${error.message}`, 'supabase-migration');
      }
    }

    // Migrate Testimonials
    const testimonials = await memStorage.getAllTestimonials();
    for (const testimonial of testimonials) {
      const { error } = await supabase
        .from('testimonials')
        .upsert({
          id: testimonial.id,
          user_name: testimonial.userName,
          user_image_url: testimonial.userImageUrl,
          rating: testimonial.rating,
          comment: testimonial.comment,
          is_verified: testimonial.isVerified
        });

      if (error) {
        log(`Error inserting testimonial: ${error.message}`, 'supabase-migration');
      }
    }

    log('Data migration completed', 'supabase-migration');
    log('Supabase migration completed successfully', 'supabase-migration');
    return true;
  } catch (error) {
    log(`Supabase migration failed: ${error}`, 'supabase-migration');
    return false;
  }
}

export default migrateToSupabase;