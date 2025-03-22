
import { supabase } from './supabase';
import { log } from './vite';
import { memStorage } from './storage';

export async function migrateToSupabase() {
  log('Starting Supabase database setup...', 'supabase-migration');

  try {
    try {
      // Check if tables exist by attempting to query categories
      const { error: checkError } = await supabase
        .from('categories')
        .select('count')
        .single();

      // If tables don't exist, create them using raw SQL
      if (checkError?.message?.includes('does not exist')) {
        const { data: tables, error: sqlError } = await supabase
          .from('categories')
          .insert([
            {
              name: 'Facial Care',
              description: 'Cleansers, serums, masks, and more',
              image_url: 'https://images.unsplash.com/photo-1598454444604-73563a529875'
            }
          ])
          .select();

        if (sqlError) {
          // Tables need to be created first
          await supabase.schema.createTable('categories', {
            id: 'serial primary key',
            name: 'text not null',
            description: 'text not null',
            image_url: 'text not null'
          });

          await supabase.schema.createTable('products', {
            id: 'serial primary key',
            name: 'text not null',
            tagline: 'text not null',
            price: 'double precision not null',
            original_price: 'double precision',
            description: 'text not null',
            image_url: 'text not null',
            rating: 'double precision not null',
            review_count: 'integer not null',
            category_id: 'integer not null',
            is_featured: 'boolean not null default false',
            is_best_seller: 'boolean default false',
            is_new_arrival: 'boolean default false'
          });

          await supabase.schema.createTable('reviews', {
            id: 'serial primary key',
            product_id: 'integer not null',
            user_name: 'text not null',
            user_image_url: 'text not null',
            rating: 'integer not null',
            comment: 'text not null',
            is_verified: 'boolean not null default true'
          });

          await supabase.schema.createTable('testimonials', {
            id: 'serial primary key',
            user_name: 'text not null',
            user_image_url: 'text not null',
            rating: 'integer not null',
            comment: 'text not null',
            is_verified: 'boolean not null default true'
          });

          await supabase.schema.createTable('orders', {
            id: 'serial primary key',
            user_id: 'integer not null',
            items: 'jsonb not null',
            status: 'text not null',
            total_amount: 'double precision not null',
            shipping_address: 'text not null',
            created_at: 'timestamp not null default now()'
          });
        }
      }
    } catch (error) {
      log(`Error creating tables: ${error}`, 'supabase-migration');
      throw error;
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
  } catch (error: any) {
    const message = error?.message || String(error);
    log(`Supabase migration failed: ${message}`, 'supabase-migration');
    return false;
  }
}

export default migrateToSupabase;
