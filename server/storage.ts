import {
  categories, products, reviews, testimonials, orders,
  type Category, type Product, type Review, type Testimonial, type Order,
  type InsertCategory, type InsertProduct, type InsertReview, type InsertTestimonial, type InsertOrder
} from "@shared/schema";
import { log } from "./vite";

export interface IStorage {
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Reviews
  getReviewsByProductId(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private reviews: Map<number, Review>;
  private testimonials: Map<number, Testimonial>;
  private orders: Map<number, Order>;
  
  private categoryId: number;
  private productId: number;
  private reviewId: number;
  private testimonialId: number;
  private orderId: number;
  
  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.reviews = new Map();
    this.testimonials = new Map();
    this.orders = new Map();
    
    this.categoryId = 1;
    this.productId = 1;
    this.reviewId = 1;
    this.testimonialId = 1;
    this.orderId = 1;
    
    this.initializeData();
  }
  
  // Initialize with some sample data
  private initializeData() {
    // Add Categories
    const facialCare = this.createCategory({
      name: "Facial Care",
      description: "Cleansers, serums, masks, and more",
      imageUrl: "https://images.unsplash.com/photo-1598454444604-73563a529875?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&h=800&q=80"
    });
    
    const bodyRituals = this.createCategory({
      name: "Body Rituals",
      description: "Oils, scrubs, lotions, and more",
      imageUrl: "https://images.unsplash.com/photo-1596870230056-88eea6ef6d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&h=800&q=80"
    });
    
    const aromatherapy = this.createCategory({
      name: "Aromatherapy",
      description: "Essential oils, diffusers, and blends",
      imageUrl: "https://images.unsplash.com/photo-1593150320617-fc076c75ff85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&h=800&q=80"
    });
    
    // Add Products
    this.createProduct({
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
    
    this.createProduct({
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
    
    this.createProduct({
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
    
    this.createProduct({
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
    
    this.createProduct({
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
    this.createTestimonial({
      userName: "Sarah J.",
      userImageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      comment: "I've been using the Tranquil Face Serum for three months now, and my skin has never looked better. The natural ingredients make a noticeable difference!",
      isVerified: true
    });
    
    this.createTestimonial({
      userName: "Michael T.",
      userImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      comment: "The Ultimate Harmony Kit was the perfect gift for my mom. She loves the entire collection and the beautiful packaging made it extra special.",
      isVerified: true
    });
    
    this.createTestimonial({
      userName: "Emma R.",
      userImageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 4,
      comment: "The Renewal Body Scrub is amazing! It leaves my skin so soft and the scent is divine. I love that all ingredients are natural and sustainable.",
      isVerified: true
    });
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // Products
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.categoryId === categoryId);
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.isFeatured);
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  // Reviews
  async getReviewsByProductId(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.productId === productId);
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const newReview = { ...review, id };
    this.reviews.set(id, newReview);
    return newReview;
  }
  
  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialId++;
    const newTestimonial = { ...testimonial, id };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }
  
  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const newOrder = { ...order, id };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
}

// Create instance of MemStorage as a fallback
export const memStorage = new MemStorage();

// For now, use MemStorage while we set up Supabase
let _currentStorage: IStorage = memStorage;

// Function to switch storage implementation
export function setStorage(storageImpl: IStorage): void {
  _currentStorage = storageImpl;
}

// Export a proxy that forwards calls to the current storage implementation
export const storage: IStorage = new Proxy({} as IStorage, {
  get: (target, prop) => {
    return _currentStorage[prop as keyof IStorage];
  }
});

// Import supabaseStorage for future use
import { supabaseStorage } from './supabaseStorage';
