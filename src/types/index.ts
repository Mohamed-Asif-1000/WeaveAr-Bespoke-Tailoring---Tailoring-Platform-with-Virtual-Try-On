export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export interface User {
  name: string;
  email: string;
  phone: string;
}

export interface Measurements {
  chest: string;
  shoulderWidth: string;
  sleeveLength: string;
  neck: string;
  waist: string;
  hip: string;
  shirtLength: string;
  armhole: string;
}

export interface FabricOption {
  name: string;
  weight: string;
  weave: string;
  origin: string;
  category: string;
  price: number;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  fabricName?: string;
  fabricPrice?: number;
  fit?: string;
  measurements?: Measurements;
  quantity: number;
}

export type OrderStatus =
  | "Ordered"
  | "In Tailoring"
  | "Shipped"
  | "Delivered";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  fabricName?: string;
  fit?: string;
}

export interface Order {
  id: string;
  placedAt: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  shippingAddress: Address;
  status: OrderStatus;
  timeline: { status: OrderStatus; at: string }[];
  userEmail: string;
}

export const ORDER_STATUSES: OrderStatus[] = [
  "Ordered",
  "In Tailoring",
  "Shipped",
  "Delivered",
];