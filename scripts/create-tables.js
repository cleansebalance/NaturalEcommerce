// Simple script to create database tables

import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { serial, text, pgTable, timestamp, integer, boolean, doublePrecision, json } from 'drizzle-orm/pg-core';

const { Pool } = pg;

// Check for DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Define schema
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
});

const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  tagline: text('tagline').notNull(),
  price: doublePrecision('price').notNull(),
  originalPrice: doublePrecision('original_price'),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
  categoryId: integer('category_id').notNull(),
  rating: doublePrecision('rating').default(5.0),
  reviewCount: integer('review_count').default(0),
  featured: boolean('featured').default(false),
  inStock: boolean('in_stock').default(true),
});

const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull(),
  userName: text('user_name').notNull(),
  userImageUrl: text('user_image_url').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  isVerified: boolean('is_verified').notNull().default(true),
});

const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  userName: text('user_name').notNull(),
  userImage: text('user_image').notNull(),
  rating: integer('rating').notNull(),
  text: text('text').notNull(),
});

const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull().default(1),
  addedAt: timestamp('added_at').notNull().defaultNow(),
});

const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  items: json('items').notNull(),
  status: text('status').notNull(),
  totalAmount: doublePrecision('total_amount').notNull(),
  shippingAddress: text('shipping_address').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

const sessionTable = pgTable('sessions', {
  sid: text('sid').primaryKey(),
  sess: json('sess').notNull(),
  expire: timestamp('expire').notNull(),
});

async function createTables() {
  console.log('Creating database tables...');
  
  try {
    const db = drizzle(pool);
    
    // Create tables by executing raw SQL
    // This is faster than using migrations for a simple setup
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
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
        category_id INTEGER NOT NULL,
        rating DOUBLE PRECISION DEFAULT 5.0,
        review_count INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        in_stock BOOLEAN DEFAULT TRUE
      );
      
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        user_name TEXT NOT NULL,
        user_image_url TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        is_verified BOOLEAN NOT NULL DEFAULT TRUE
      );
      
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        user_name TEXT NOT NULL,
        user_image TEXT NOT NULL,
        rating INTEGER NOT NULL,
        text TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        added_at TIMESTAMP NOT NULL DEFAULT NOW()
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
      
      CREATE TABLE IF NOT EXISTS sessions (
        sid TEXT PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      );
    `);
    
    console.log('All tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  } finally {
    // Close connection pool
    await pool.end();
  }
}

// Execute function
createTables();