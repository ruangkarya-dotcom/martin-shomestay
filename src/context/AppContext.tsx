import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, Review, User, Booking, FilterState, PropertyType } from '../types';
import { INITIAL_PROPERTIES, INITIAL_REVIEWS, INITIAL_USER, INITIAL_BOOKINGS } from '../data/mockData';
import { getTodayString, getTomorrowString } from '../utils/formatters';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation & Role
  currentRole: 'user' | 'host' | 'admin';
  switchRole: (role: 'user' | 'host' | 'admin') => void;
  currentUser: User;
  
  // Properties Data
  properties: Property[];
  getFilteredProperties: () => Property[];
  getPropertyById: (id: string) => Property | undefined;
  addProperty: (newProp: Omit<Property, 'id' | 'rating' | 'reviewCount'>) => void;
  updateProperty: (id: string, updated: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  
  // Filter State
  filter: FilterState;
  updateFilter: (partialFilter: Partial<FilterState>) => void;
  resetFilter: () => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (propertyId: string) => void;
  isInWishlist: (propertyId: string) => boolean;
  
  // Bookings
  bookings: Booking[];
  addBooking: (newBooking: Booking) => void;
  updateBookingStatus: (bookingId: string, status: 'pending' | 'paid' | 'completed' | 'cancelled') => void;
  getBookingByCode: (code: string) => Booking | undefined;
  
  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  
  // Pending Checkout State
  pendingBookingData: Partial<Booking> | null;
  setPendingBookingData: (data: Partial<Booking> | null) => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Active Route navigation helper
  currentPath: string;
  navigate: (path: string) => void;
}

const DEFAULT_FILTER: FilterState = {
  city: '',
  checkIn: getTodayString(),
  checkOut: getTomorrowString(),
  guests: 1,
  priceRange: [0, 3000000],
  propertyTypes: [],
  amenities: [],
  minRating: 0,
  sortBy: 'recommendation'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state or localStorage
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('staynest_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('staynest_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('staynest_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('staynest_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [currentRole, setCurrentRole] = useState<'user' | 'host' | 'admin'>('user');
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [wishlist, setWishlist] = useState<string[]>(currentUser.wishlist || []);
  const [pendingBookingData, setPendingBookingData] = useState<Partial<Booking> | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Simple router path state synced with hash
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/';
  });

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentPath(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('staynest_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('staynest_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('staynest_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    const updatedUser = { ...currentUser, wishlist, role: currentRole };
    localStorage.setItem('staynest_user', JSON.stringify(updatedUser));
  }, [wishlist, currentRole, currentUser]);

  const switchRole = (role: 'user' | 'host' | 'admin') => {
    setCurrentRole(role);
    addToast('Peran Diubah', `Mode aplikasi sekarang adalah ${role.toUpperCase()}`, 'info');
    if (role === 'host') navigate('/host');
    else if (role === 'admin') navigate('/admin');
    else navigate('/dashboard');
  };

  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleWishlist = (propertyId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(propertyId);
      if (exists) {
        addToast('Favorit Dihapus', 'Homestay telah dihapus dari wishlist', 'info');
        return prev.filter((id) => id !== propertyId);
      } else {
        addToast('Favorit Ditambahkan', 'Homestay telah disimpan ke wishlist Anda', 'success');
        return [...prev, propertyId];
      }
    });
  };

  const isInWishlist = (propertyId: string) => wishlist.includes(propertyId);

  const updateFilter = (partialFilter: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...partialFilter }));
  };

  const resetFilter = () => {
    setFilter(DEFAULT_FILTER);
  };

  const getFilteredProperties = (): Property[] => {
    return properties.filter((prop) => {
      // City filter
      if (filter.city && filter.city !== 'Semua') {
        const matchesCity = prop.city.toLowerCase().includes(filter.city.toLowerCase()) ||
          prop.location.toLowerCase().includes(filter.city.toLowerCase());
        if (!matchesCity) return false;
      }

      // Guest filter
      if (filter.guests > 1 && prop.maxGuests < filter.guests) {
        return false;
      }

      // Price filter
      const effectivePrice = prop.discountPricePerNight || prop.pricePerNight;
      if (effectivePrice < filter.priceRange[0] || effectivePrice > filter.priceRange[1]) {
        return false;
      }

      // Property type filter
      if (filter.propertyTypes.length > 0 && !filter.propertyTypes.includes(prop.type)) {
        return false;
      }

      // Rating filter
      if (filter.minRating > 0 && prop.rating < filter.minRating) {
        return false;
      }

      // Amenities filter
      if (filter.amenities.length > 0) {
        const hasAllAmenities = filter.amenities.every((amenity) =>
          prop.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.discountPricePerNight || a.pricePerNight;
      const priceB = b.discountPricePerNight || b.pricePerNight;
      if (filter.sortBy === 'price_asc') return priceA - priceB;
      if (filter.sortBy === 'price_desc') return priceB - priceA;
      if (filter.sortBy === 'rating_desc') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  };

  const getPropertyById = (id: string) => properties.find((p) => p.id === id);

  const addProperty = (newPropData: Omit<Property, 'id' | 'rating' | 'reviewCount'>) => {
    const id = 'prop-' + Date.now();
    const newProperty: Property = {
      ...newPropData,
      id,
      rating: 5.0,
      reviewCount: 0,
    };
    setProperties((prev) => [newProperty, ...prev]);
    addToast('Properti Berhasil Ditambahkan', `${newProperty.name} sekarang aktif di StayNest.`, 'success');
  };

  const updateProperty = (id: string, updated: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    addToast('Properti Diperbarui', 'Perubahan properti berhasil disimpan.', 'success');
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    addToast('Properti Dihapus', 'Properti telah dihapus dari sistem.', 'info');
  };

  const addBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    addToast('Booking Dibuat', `Nomor Booking: ${newBooking.bookingCode}`, 'success');
  };

  const updateBookingStatus = (bookingId: string, status: 'pending' | 'paid' | 'completed' | 'cancelled') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status, paidAt: status === 'paid' ? new Date().toISOString() : b.paidAt } : b))
    );
    addToast('Status Booking Diperbarui', `Status sekarang: ${status.toUpperCase()}`, 'success');
  };

  const getBookingByCode = (code: string) => bookings.find((b) => b.bookingCode === code || b.id === code);

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
    setReviews((prev) => [newRev, ...prev]);
    addToast('Ulasan Dikirim', 'Terima kasih atas ulasan Anda!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        switchRole,
        currentUser,
        properties,
        getFilteredProperties,
        getPropertyById,
        addProperty,
        updateProperty,
        deleteProperty,
        filter,
        updateFilter,
        resetFilter,
        wishlist,
        toggleWishlist,
        isInWishlist,
        bookings,
        addBooking,
        updateBookingStatus,
        getBookingByCode,
        reviews,
        addReview,
        pendingBookingData,
        setPendingBookingData,
        toasts,
        addToast,
        removeToast,
        currentPath,
        navigate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
