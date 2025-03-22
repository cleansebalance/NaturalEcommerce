import { type Product, type Category, type Testimonial } from "@shared/schema";

// Default user ID for the demo (normally this would come from authentication)
export const DEFAULT_USER_ID = 1;

// Navigation items
export const navItems = [
  { name: "Shop", path: "/products" },
  { name: "Collections", path: "/collections" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" }
];

// Features for the features banner
export const features = [
  {
    icon: "leaf",
    title: "Natural Ingredients",
    description: "All products are made with plant-based, ethically sourced ingredients."
  },
  {
    icon: "recycle",
    title: "Sustainable Packaging",
    description: "Eco-friendly packaging that minimizes environmental impact."
  },
  {
    icon: "heart",
    title: "Cruelty-Free",
    description: "Never tested on animals and certified cruelty-free by Leaping Bunny."
  }
];

// Bundle products for the promo section
export const bundleProducts = [
  "Facial Cleansing Balm",
  "Vitamin C Serum",
  "Hydrating Face Mask",
  "Calm Essential Oil Blend"
];

// Footer links
export const footerLinks = {
  shop: [
    { name: "All Products", path: "/products" },
    { name: "Best Sellers", path: "/products?filter=bestsellers" },
    { name: "New Arrivals", path: "/products?filter=new" },
    { name: "Bundles & Sets", path: "/products?filter=bundles" },
    { name: "Gift Cards", path: "/gift-cards" }
  ],
  information: [
    { name: "About Us", path: "/about" },
    { name: "Sustainability", path: "/sustainability" },
    { name: "Ingredients", path: "/ingredients" },
    { name: "Our Story", path: "/story" },
    { name: "Contact Us", path: "/contact" }
  ],
  customerService: [
    { name: "Shipping & Returns", path: "/shipping" },
    { name: "FAQs", path: "/faqs" },
    { name: "Track Your Order", path: "/track-order" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" }
  ]
};

// Fetch functions for API endpoints
export async function fetchProducts() {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json() as Promise<Product[]>;
}

export async function fetchProductById(id: number) {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json() as Promise<Product>;
}

export async function fetchProductsByCategory(category: string) {
  const response = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products by category');
  }
  return response.json() as Promise<Product[]>;
}

export async function fetchFeaturedProducts() {
  const response = await fetch('/api/products/featured');
  if (!response.ok) {
    throw new Error('Failed to fetch featured products');
  }
  return response.json() as Promise<Product[]>;
}

export async function fetchBestSellerProducts() {
  const response = await fetch('/api/products/bestsellers');
  if (!response.ok) {
    throw new Error('Failed to fetch best seller products');
  }
  return response.json() as Promise<Product[]>;
}

export async function fetchNewProducts() {
  const response = await fetch('/api/products/new');
  if (!response.ok) {
    throw new Error('Failed to fetch new products');
  }
  return response.json() as Promise<Product[]>;
}

export async function fetchCategories() {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json() as Promise<Category[]>;
}

export async function fetchTestimonials() {
  const response = await fetch('/api/testimonials');
  if (!response.ok) {
    throw new Error('Failed to fetch testimonials');
  }
  return response.json() as Promise<Testimonial[]>;
}

// Cart functions
export async function fetchCartItems(userId = DEFAULT_USER_ID) {
  const response = await fetch(`/api/cart?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch cart items');
  }
  return response.json();
}

export async function addToCart(productId: number, quantity = 1, userId = DEFAULT_USER_ID) {
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      productId,
      quantity,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add item to cart');
  }
  
  return response.json();
}

export async function updateCartItem(id: number, quantity: number) {
  const response = await fetch(`/api/cart/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update cart item');
  }
  
  return response.json();
}

export async function removeFromCart(id: number) {
  const response = await fetch(`/api/cart/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove item from cart');
  }
  
  return response.json();
}

export async function clearCart(userId = DEFAULT_USER_ID) {
  const response = await fetch(`/api/cart?userId=${userId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to clear cart');
  }
  
  return response.json();
}
