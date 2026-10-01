import React from 'react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { formatIDR } from '../utils/formatters';
import { Star, Heart, MapPin, Users, Bed, Bath, ShieldCheck } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { navigate, toggleWishlist, isInWishlist } = useApp();
  const isFav = isInWishlist(property.id);

  const effectivePrice = property.discountPricePerNight || property.pricePerNight;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={property.images[0]}
          alt={property.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(property.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-rose-500 hover:scale-110 shadow-md transition-all z-10"
          title={isFav ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
        >
          <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20">
          {property.type}
        </div>

        {/* Discount Badge if any */}
        {property.discountPricePerNight && (
          <div className="absolute bottom-3 left-3 bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow">
            Hemat {Math.round(((property.pricePerNight - property.discountPricePerNight) / property.pricePerNight) * 100)}%
          </div>
        )}

        {/* Host Verified Badge */}
        {property.host.isVerified && (
          <div className="absolute bottom-3 right-3 bg-teal-900/80 backdrop-blur-md text-teal-200 text-[10px] font-medium px-2 py-1 rounded-lg flex items-center gap-1 border border-teal-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Host Terverifikasi</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Unboxed Metadata Line: Location & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1 font-medium text-slate-600 truncate max-w-[180px]">
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              {property.location}
            </span>
            <div className="flex items-center gap-1 font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{property.rating}</span>
              <span className="text-slate-400 font-normal">({property.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => navigate(`/property/${property.id}`)}
            className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1 cursor-pointer"
          >
            {property.name}
          </h3>

          {/* Subtitle / Tagline */}
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {property.tagline}
          </p>

          {/* Quick Specs (Unboxed text with dots) */}
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {property.maxGuests} Tamu
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              {property.bedrooms} Kamar
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              {property.bathrooms} KM
            </span>
          </div>
        </div>

        {/* Pricing & Detail Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                {formatIDR(effectivePrice)}
              </span>
              <span className="text-xs text-slate-500 font-normal">/ malam</span>
            </div>
            {property.discountPricePerNight && (
              <span className="text-xs text-slate-400 line-through">
                {formatIDR(property.pricePerNight)}
              </span>
            )}
          </div>

          <button
            onClick={() => navigate(`/property/${property.id}`)}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-sm shadow-teal-600/20 active:scale-95"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
};
