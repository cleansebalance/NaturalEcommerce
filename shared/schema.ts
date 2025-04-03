import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  price: doublePrecision("price").notNull(),
  originalPrice: doublePrecision("original_price"),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: doublePrecision("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  categoryId: integer("category_id").notNull(),
  isFeatured: boolean("is_featured").notNull().default(false),
  isBestSeller: boolean("is_best_seller").default(false),
  isNewArrival: boolean("is_new_arrival").default(false),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userName: text("user_name").notNull(),
  userImageUrl: text("user_image_url").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  isVerified: boolean("is_verified").notNull().default(true),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  userName: text("user_name").notNull(),
  userImageUrl: text("user_image_url").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  isVerified: boolean("is_verified").notNull().default(true),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  addedAt: timestamp("added_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  items: json("items").notNull(),
  status: text("status").notNull(),
  totalAmount: doublePrecision("total_amount").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCategorySchema = createInsertSchema(categories);
export const insertProductSchema = createInsertSchema(products);
export const insertReviewSchema = createInsertSchema(reviews);
export const insertTestimonialSchema = createInsertSchema(testimonials);
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, addedAt: true });
export const insertOrderSchema = createInsertSchema(orders);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;

// Custom type for cart items with product details
export type CartItemWithProduct = CartItem & {
  product: Product;
};
