export type PropertyType = 'Villa' | 'Homestay' | 'Cottage' | 'Ethnic' | 'Apartment';

export interface RoomOption {
  id: string;
  name: string;
  pricePerNight: number;
  capacity: number;
  bedType: string;
  sizeSqm: number;
  amenities: string[];
  image: string;
}

export interface HostInfo {
  id: string;
  name: string;
  avatar: string;
  isVerified: boolean;
  joinedYear: number;
  responseTime: string;
  phone: string;
  bio: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  cleanlinessRating: number;
  accuracyRating: number;
  communicationRating: number;
  locationRating: number;
}

export interface Property {
  id: string;
  name: string;
  tagline: string;
  type: PropertyType;
  city: string;
  location: string;
  address: string;
  mapCoordinates: { lat: number; lng: number };
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  discountPricePerNight?: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  images: string[];
  description: string;
  amenities: string[];
  houseRules: string[];
  host: HostInfo;
  rooms: RoomOption[];
  isFeatured?: boolean;
  isPopular?: boolean;
}

export interface FilterState {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  priceRange: [number, number];
  propertyTypes: PropertyType[];
  amenities: string[];
  minRating: number;
  sortBy: 'recommendation' | 'price_asc' | 'price_desc' | 'rating_desc';
}

export type PaymentMethodType = 'bank_transfer' | 'qris' | 'virtual_account' | 'ewallet' | 'credit_card';

export interface PaymentDetails {
  method: PaymentMethodType;
  providerName: string;
  accountNumber?: string;
  accountName?: string;
  qrCodeUrl?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  propertyCity: string;
  propertyAddress: string;
  hostName: string;
  hostPhone: string;
  selectedRoomName?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  basePrice: number;
  serviceFee: number;
  tax: number;
  totalPrice: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  paymentMethod: PaymentMethodType;
  paymentMethodLabel: string;
  paymentDeadline: string;
  paidAt?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'user' | 'host' | 'admin';
  wishlist: string[];
}
