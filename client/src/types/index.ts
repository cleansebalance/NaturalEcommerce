export interface Product {
  id: number;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  categoryId: number;
  isFeatured: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Review {
  id: number;
  productId: number;
  userName: string;
  userImageUrl: string;
  rating: number;
  comment: string;
  isVerified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  status: string;
  totalAmount: number;
  shippingAddress: string;
  createdAt: Date;
}

export interface Testimonial {
  id: number;
  userName: string;
  userImageUrl: string;
  rating: number;
  comment: string;
  isVerified: boolean;
}
