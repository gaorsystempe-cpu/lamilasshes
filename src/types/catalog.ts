export interface ProductVariantOption {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  category: string;
  tags: string[];
  price: number;
  compareAtPrice?: number;
  description: string;
  features: string[];
  images: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  variants?: ProductVariantOption[];
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  inStock: boolean;
  stockCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName?: string;
  productCount?: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  details: string;
  instructions: string;
  icon?: string;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoUrl?: string;
  whatsappNumber: string; // e.g. 51987654321
  whatsappCountryCode: string; // e.g. +51
  whatsappMessageTemplate: string;
  currencySymbol: string; // e.g. S/
  currencyCode: string; // e.g. PEN
  freeShippingThreshold: number;
  shippingFee: number;
  adminPin: string;
  paymentMethods: PaymentMethod[];
  topAnnouncementBar: {
    active: boolean;
    text: string;
    link?: string;
  };
  contactEmail?: string;
  address?: string;
  openingHours?: string;
}

export interface CartItem {
  id: string; // unique cart item id (product.id + variant selections)
  product: Product;
  selectedColor?: { name: string; hex: string };
  selectedSize?: string;
  customVariant?: string;
  quantity: number;
  customNotes?: string;
  unitPrice: number;
}

export interface Order {
  id: string; // e.g. ORD-2026-1042
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryCity: string;
  paymentMethod: string;
  items: {
    productId: string;
    title: string;
    quantity: number;
    color?: string;
    size?: string;
    notes?: string;
    price: number;
    total: number;
  }[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  status: 'pendiente' | 'confirmado' | 'enviado' | 'completado' | 'cancelado';
  notes?: string;
  whatsappSentAt?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 10 for 10% or 15 for S/15
  minPurchase?: number;
  active: boolean;
}
