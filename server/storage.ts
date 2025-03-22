import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  cartItems, type CartItem, type InsertCartItem,
  categories, type Category, type InsertCategory,
  testimonials, type Testimonial, type InsertTestimonial
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getBestSellerProducts(): Promise<Product[]>;
  getNewProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart operations
  getCartItems(userId: number): Promise<(CartItem & { product: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;

  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Testimonial operations
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonialById(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private categories: Map<number, Category>;
  private testimonials: Map<number, Testimonial>;
  private userIdCounter: number;
  private productIdCounter: number;
  private cartItemIdCounter: number;
  private categoryIdCounter: number;
  private testimonialIdCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.categories = new Map();
    this.testimonials = new Map();
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.categoryIdCounter = 1;
    this.testimonialIdCounter = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.featured
    );
  }

  async getBestSellerProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.bestSeller
    );
  }

  async getNewProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isNew
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Cart operations
  async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );

    return items.map(item => {
      const product = this.products.get(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      return { ...item, product };
    });
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if the item already exists in the cart
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => item.userId === insertCartItem.userId && item.productId === insertCartItem.productId
    );

    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += insertCartItem.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    } else {
      // Add new item if it doesn't exist
      const id = this.cartItemIdCounter++;
      const cartItem = { ...insertCartItem, id };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (cartItem) {
      cartItem.quantity = quantity;
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
    return undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const itemsToDelete = Array.from(this.cartItems.values())
      .filter(item => item.userId === userId)
      .map(item => item.id);
    
    itemsToDelete.forEach(id => this.cartItems.delete(id));
    return true;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Testimonial operations
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    const testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // Initialize with sample data
  private initializeSampleData() {
    // Sample categories
    this.createCategory({
      name: "Facial Cleansers",
      description: "Gentle, effective cleansers for all skin types",
      imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1287&auto=format&fit=crop"
    });

    this.createCategory({
      name: "Essential Oils",
      description: "Pure, therapeutic-grade essential oils",
      imageUrl: "https://images.unsplash.com/photo-1608571423539-e951b9b3871e?q=80&w=1287&auto=format&fit=crop"
    });

    this.createCategory({
      name: "Supplements",
      description: "Natural supplements for optimal health",
      imageUrl: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&w=1470&auto=format&fit=crop"
    });

    // Sample products
    this.createProduct({
      name: "Calm Essential Oil Blend",
      description: "Soothing blend for relaxation & sleep",
      price: "32.00",
      imageUrl: "https://images.unsplash.com/photo-1608571423539-e951b9b3871e?q=80&w=1287&auto=format&fit=crop",
      category: "Essential Oils",
      featured: true,
      bestSeller: true,
      isNew: false,
      rating: 5
    });

    this.createProduct({
      name: "Facial Cleansing Balm",
      description: "Gentle makeup removal & cleansing",
      price: "28.00",
      imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=1974&auto=format&fit=crop",
      category: "Facial Cleansers",
      featured: true,
      bestSeller: false,
      isNew: false,
      rating: 5
    });

    this.createProduct({
      name: "Vitamin C Serum",
      description: "Brightening & anti-aging formula",
      price: "45.00",
      imageUrl: "https://images.unsplash.com/photo-1582402828145-41201edc7f4e?q=80&w=1470&auto=format&fit=crop",
      category: "Facial Cleansers",
      featured: true,
      bestSeller: false,
      isNew: true,
      rating: 5
    });

    this.createProduct({
      name: "Wellness Supplement Bundle",
      description: "30-day immune support pack",
      price: "79.00",
      imageUrl: "https://images.unsplash.com/photo-1573575155376-b5010099301b?q=80&w=1287&auto=format&fit=crop",
      category: "Supplements",
      featured: true,
      bestSeller: false,
      isNew: false,
      rating: 5
    });

    this.createProduct({
      name: "Hydrating Face Mask",
      description: "Deep hydration for dry skin",
      price: "24.00",
      imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1335&auto=format&fit=crop",
      category: "Facial Cleansers",
      featured: false,
      bestSeller: true,
      isNew: false,
      rating: 4
    });

    this.createProduct({
      name: "Revitalize Essential Oil Blend",
      description: "Energizing blend for focus & clarity",
      price: "34.00",
      imageUrl: "https://images.unsplash.com/photo-1618239916271-7ad08f49e340?q=80&w=1470&auto=format&fit=crop",
      category: "Essential Oils",
      featured: false,
      bestSeller: true,
      isNew: false,
      rating: 5
    });

    // Sample testimonials
    this.createTestimonial({
      name: "Sarah J.",
      avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
      content: "These products have completely transformed my skin. The natural ingredients actually work better than the expensive chemical-filled products I was using before.",
      rating: 5
    });

    this.createTestimonial({
      name: "Mark T.",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "The essential oil blends are incredible. I use the Calm blend every night and it has significantly improved my sleep quality. Worth every penny!",
      rating: 5
    });

    this.createTestimonial({
      name: "Emma R.",
      avatarUrl: "https://randomuser.me/api/portraits/women/63.jpg",
      content: "I love that all the products are environmentally friendly and sustainable. The cleansing balm is now a staple in my skincare routine - gentle yet effective.",
      rating: 5
    });
  }
}

export const storage = new MemStorage();
