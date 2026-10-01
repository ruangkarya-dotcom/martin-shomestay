import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatIDR, calculateNights, formatDateIndonesian, getTodayString, getTomorrowString } from '../utils/formatters';
import {
  Star, Heart, MapPin, Users, Bed, Bath, ShieldCheck, Share2, Calendar,
  Check, Info, MessageSquare, Send, Sparkles, ArrowLeft
} from 'lucide-react';

interface PropertyDetailPageProps {
  propertyId: string;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ propertyId }) => {
  const { getPropertyById, navigate, toggleWishlist, isInWishlist, setPendingBookingData, addToast, reviews, addReview } = useApp();

  const property = getPropertyById(propertyId);

  const [checkIn, setCheckIn] = useState(getTodayString());
  const [checkOut, setCheckOut] = useState(getTomorrowString());
  const [guests, setGuests] = useState(2);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // New review form state
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Properti Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500">Homestay yang Anda cari tidak tersedia atau telah dihapus.</p>
        <button
          onClick={() => navigate('/explore')}
          className="px-5 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl"
        >
          Kembali ke Eksplorasi
        </button>
      </div>
    );
  }

  const isFav = isInWishlist(property.id);
  const nights = calculateNights(checkIn, checkOut);

  const selectedRoom = property.rooms.find((r) => r.id === selectedRoomId);
  const baseRate = selectedRoom ? selectedRoom.pricePerNight : (property.discountPricePerNight || property.pricePerNight);
  const subtotal = baseRate * nights;
  const serviceFee = 50000;
  const tax = Math.round(subtotal * 0.05);
  const totalPrice = subtotal + serviceFee + tax;

  const propertyReviews = reviews.filter((r) => r.propertyId === property.id);

  const handleProceedToBooking = () => {
    setPendingBookingData({
      propertyId: property.id,
      propertyName: property.name,
      propertyImage: property.images[0],
      propertyCity: property.city,
      propertyAddress: property.address,
      hostName: property.host.name,
      hostPhone: property.host.phone,
      selectedRoomName: selectedRoom?.name,
      checkIn,
      checkOut,
      nights,
      guests,
      basePrice: subtotal,
      serviceFee,
      tax,
      totalPrice,
    });
    navigate('/booking');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.name,
        text: `Cek homestay keren ini di StayNest: ${property.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Tautan Disalin', 'Tautan homestay telah disalin ke clipboard!', 'info');
    }
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    addReview({
      propertyId: property.id,
      userName: 'Tamu StayNest',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      rating: newReviewRating,
      comment: newReviewComment,
      cleanlinessRating: newReviewRating,
      accuracyRating: newReviewRating,
      communicationRating: newReviewRating,
      locationRating: newReviewRating,
    });

    setNewReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link & Header Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Hasil Pencarian</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>Bagikan</span>
          </button>
          <button
            onClick={() => toggleWishlist(property.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
            <span>{isFav ? 'Tersimpan' : 'Wishlist'}</span>
          </button>
        </div>
      </div>

      {/* Property Title & Location Bar */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-teal-100 text-teal-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md">
            {property.type}
          </span>
          <div className="flex items-center gap-1 font-bold text-slate-900 text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{property.rating}</span>
            <span className="text-slate-400 font-normal">({property.reviewCount} ulasan)</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {property.name}
        </h1>

        <p className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-1">
          <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{property.address}</span>
        </p>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
        <div className="md:col-span-2 aspect-[4/3] md:aspect-auto h-full relative cursor-pointer overflow-hidden">
          <img
            src={property.images[activeImageIndex] || property.images[0]}
            alt={property.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-3 p-1">
          {property.images.map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`aspect-[4/3] relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                activeImageIndex === idx ? 'border-teal-600 ring-2 ring-teal-600/30' : 'border-transparent opacity-80 hover:opacity-100'
              }`}
            >
              <img
                src={imgUrl}
                alt={`${property.name} ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Specs Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-around gap-4 text-xs sm:text-sm font-semibold text-slate-700">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-teal-600" />
          <span>Hingga {property.maxGuests} Tamu</span>
        </div>
        <div className="flex items-center gap-2">
          <Bed className="w-5 h-5 text-teal-600" />
          <span>{property.bedrooms} Kamar Tidur ({property.beds} Kasur)</span>
        </div>
        <div className="flex items-center gap-2">
          <Bath className="w-5 h-5 text-teal-600" />
          <span>{property.bathrooms} Kamar Mandi</span>
        </div>
      </div>

      {/* Main Grid: Details (Left) + Sticky Booking Widget (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Property Info */}
        <div className="lg:col-span-7 space-y-10">
          {/* Host Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={property.host.avatar}
                alt={property.host.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-teal-500/30"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 text-base">Di-host oleh {property.host.name}</h3>
                  {property.host.isVerified && (
                    <span title="Host Terverifikasi">
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bergabung sejak {property.host.joinedYear} · Waktu respon: {property.host.responseTime}
                </p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{property.host.bio}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Tentang Homestay Ini
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Rooms Options if Available */}
          {property.rooms.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                Pilihan Unit / Kamar
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {property.rooms.map((room) => {
                  const isSelected = selectedRoomId === room.id;
                  return (
                    <div
                      key={room.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row gap-4 items-center justify-between ${
                        isSelected ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full sm:w-28 h-24 rounded-xl object-cover"
                      />
                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <h4 className="font-bold text-slate-900 text-sm">{room.name}</h4>
                        <p className="text-xs text-slate-500">
                          {room.bedType} · {room.sizeSqm} m² · Kapasitas {room.capacity} orang
                        </p>
                        <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                          {room.amenities.map((a) => (
                            <span key={a} className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-extrabold text-slate-900 block">
                          {formatIDR(room.pricePerNight)}
                        </span>
                        <button
                          onClick={() => setSelectedRoomId(isSelected ? null : room.id)}
                          className={`mt-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? 'Kamar Dipilih' : 'Pilih Kamar Ini'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Amenities Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Fasilitas yang Disediakan
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200/60">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Peraturan Homestay
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {property.houseRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Simulated Interactive Map */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Lokasi Homestay
            </h3>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-200 flex items-center justify-center text-center p-6 shadow-inner">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="relative z-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl max-w-sm space-y-2 border border-slate-100">
                <MapPin className="w-8 h-8 text-teal-600 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-900 text-sm">{property.name}</h4>
                <p className="text-xs text-slate-500">{property.address}</p>
                <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-mono block">
                  Koordinat: {property.mapCoordinates.lat}, {property.mapCoordinates.lng}
                </span>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                <span>Ulasan Tamu ({propertyReviews.length})</span>
              </h3>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {propertyReviews.length > 0 ? (
                propertyReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{rev.userName}</h4>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-xs text-slate-900 bg-amber-100/80 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">Belum ada ulasan untuk homestay ini. Jadilah yang pertama memberikan ulasan!</p>
              )}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleAddReviewSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Berikan Ulasan Anda</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">Rating:</span>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewReviewRating(s)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${s <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="Bagikan pengalaman menginap Anda secara jujur di sini..."
                rows={3}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Ulasan</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 space-y-6">
            {/* Widget Price Header */}
            <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-2xl font-black text-slate-900">
                  {formatIDR(baseRate)}
                </span>
                <span className="text-xs text-slate-500 font-normal"> / malam</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-xs text-slate-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{property.rating}</span>
              </div>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
              <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  CHECK-IN
                </label>
                <input
                  type="date"
                  min={getTodayString()}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (e.target.value >= checkOut) {
                      const next = new Date(e.target.value);
                      next.setDate(next.getDate() + 1);
                      setCheckOut(next.toISOString().split('T')[0]);
                    }
                  }}
                  className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
                />
              </div>

              <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  CHECK-OUT
                </label>
                <input
                  type="date"
                  min={checkIn}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Guest Selector */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  JUMLAH TAMU
                </label>
                <span className="text-xs font-extrabold text-slate-800">{guests} Orang Tamu</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-800 shadow-2xs"
                >
                  -
                </button>
                <button
                  onClick={() => setGuests(Math.min(property.maxGuests, guests + 1))}
                  className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-800 shadow-2xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Breakdown Calculation */}
            <div className="space-y-2 pt-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{formatIDR(baseRate)} × {nights} malam</span>
                <span className="font-semibold text-slate-800">{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Layanan StayNest</span>
                <span className="font-semibold text-slate-800">{formatIDR(serviceFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pajak (5%)</span>
                <span className="font-semibold text-slate-800">{formatIDR(tax)}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                <span className="font-extrabold text-sm">Total Pembayaran</span>
                <span className="font-black text-xl text-teal-600">{formatIDR(totalPrice)}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleProceedToBooking}
              className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-2xl shadow-lg shadow-teal-600/30 transition-all text-sm active:scale-98"
            >
              Pesan Sekarang
            </button>

            <p className="text-[11px] text-center text-slate-400 font-medium">
              🔒 Pembayaran aman & garansi harga transparan StayNest
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
