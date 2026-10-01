import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { formatIDR, formatDateIndonesian } from '../utils/formatters';
import { Booking } from '../types';
import { LayoutDashboard, Calendar, Heart, User as UserIcon, MapPin, CheckCircle2, Clock, XCircle, ArrowRight, ShieldCheck, Phone, Mail } from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const { currentPath, navigate, currentUser, bookings, wishlist, getPropertyById, addToast } = useApp();

  // Tab state based on sub-route or local state
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'wishlist' | 'profile'>(() => {
    if (currentPath.includes('wishlist')) return 'wishlist';
    if (currentPath.includes('bookings')) return 'bookings';
    if (currentPath.includes('profile')) return 'profile';
    return 'overview';
  });

  const [bookingFilter, setBookingFilter] = useState<'all' | 'paid' | 'pending' | 'completed' | 'cancelled'>('all');
  const [selectedBookingModal, setSelectedBookingModal] = useState<Booking | null>(null);

  // Profile Form state
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  const wishlistProperties = wishlist.map((id) => getPropertyById(id)).filter(Boolean);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Profil Diperbarui', 'Data akun Anda berhasil disimpan', 'success');
  };

  const getStatusBadge = (status: Booking['status']) => {
    if (status === 'paid') return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Tervalidasi</span>;
    if (status === 'pending') return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3 text-amber-600" /> Menunggu Pembayaran</span>;
    if (status === 'completed') return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Selesai Inap</span>;
    return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"><XCircle className="w-3 h-3 text-rose-600" /> Dibatalkan</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner User Info */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-teal-500/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{currentUser.name}</h1>
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-500/30">
                Tamu StayNest
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{currentUser.email} · {currentUser.phone}</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('profile')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
        >
          Edit Profil
        </button>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation Tabs */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'overview' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Ringkasan Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'bookings' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Booking Saya ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'wishlist' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist Homestay ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'profile' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profil & Pengaturan</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                  <span className="text-xs text-slate-500 font-semibold uppercase">BOOKING AKTIF</span>
                  <div className="text-3xl font-black text-slate-900">
                    {bookings.filter((b) => b.status === 'paid' || b.status === 'pending').length}
                  </div>
                  <span className="text-[10px] text-teal-600 font-bold block">Siap menginap</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                  <span className="text-xs text-slate-500 font-semibold uppercase">TOTAL PERJALANAN</span>
                  <div className="text-3xl font-black text-slate-900">{bookings.length}</div>
                  <span className="text-[10px] text-slate-400 font-medium block">Pemesanan tercatat</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                  <span className="text-xs text-slate-500 font-semibold uppercase">WISHLIST DISIMPAN</span>
                  <div className="text-3xl font-black text-slate-900">{wishlist.length}</div>
                  <span className="text-[10px] text-rose-500 font-bold block">Homestay impian</span>
                </div>
              </div>

              {/* Recent Active Booking Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">Reservasi Terbaru Anda</h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    <span>Lihat Semua</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {bookings.length > 0 ? (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={bookings[0].propertyImage}
                        alt={bookings[0].propertyName}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{bookings[0].propertyName}</h4>
                          {getStatusBadge(bookings[0].status)}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Kode: <span className="font-mono font-bold text-slate-800">{bookings[0].bookingCode}</span> · {formatDateIndonesian(bookings[0].checkIn)} - {formatDateIndonesian(bookings[0].checkOut)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedBookingModal(bookings[0])}
                      className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors shrink-0"
                    >
                      Detail Booking
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Belum ada reservasi aktif. Ayo cari homestay favoritmu!</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS LIST */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900">Riwayat Booking Saya</h2>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  {(['all', 'paid', 'pending', 'cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setBookingFilter(st)}
                      className={`px-3 py-1.5 rounded-lg transition-colors capitalize ${
                        bookingFilter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st === 'all' ? 'Semua' : st === 'paid' ? 'Lunas' : st === 'pending' ? 'Pending' : 'Batal'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={b.propertyImage}
                          alt={b.propertyName}
                          className="w-20 h-20 rounded-2xl object-cover shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm">{b.propertyName}</h3>
                            {getStatusBadge(b.status)}
                          </div>
                          <p className="text-xs text-slate-500">
                            Kode: <span className="font-mono font-bold text-slate-800">{b.bookingCode}</span> · {b.propertyCity}
                          </p>
                          <p className="text-xs text-slate-600">
                            {formatDateIndonesian(b.checkIn)} - {formatDateIndonesian(b.checkOut)} ({b.nights} Malam, {b.guests} Tamu)
                          </p>
                        </div>
                      </div>

                      <div className="text-right sm:shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        <span className="font-black text-base text-slate-900">{formatIDR(b.totalPrice)}</span>
                        <button
                          onClick={() => setSelectedBookingModal(b)}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
                        >
                          Rincian Booking
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                    <p className="text-xs text-slate-500">Tidak ada riwayat booking dengan status ini.</p>
                    <button
                      onClick={() => navigate('/explore')}
                      className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
                    >
                      Cari Homestay
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Wishlist Homestay Favorit Anda</h2>
              {wishlistProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProperties.map((prop) => (
                    <PropertyCard key={prop!.id} property={prop!} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                  <p className="text-xs text-slate-500">Belum ada homestay yang disimpan ke wishlist.</p>
                  <button
                    onClick={() => navigate('/explore')}
                    className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
                  >
                    Eksplorasi Sekarang
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100">
                Pengaturan Profil Akun
              </h2>

              <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nomor Handphone / WA</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Simpan Perubahan
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Booking Detail Modal */}
      {selectedBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Rincian Booking</h3>
              <button
                onClick={() => setSelectedBookingModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Nomor Booking:</span>
                <strong className="font-mono text-teal-600">{selectedBookingModal.bookingCode}</strong>
              </div>
              <div className="flex justify-between">
                <span>Homestay:</span>
                <strong>{selectedBookingModal.propertyName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Lokasi:</span>
                <span>{selectedBookingModal.propertyAddress}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-in / Check-out:</span>
                <span>{formatDateIndonesian(selectedBookingModal.checkIn)} - {formatDateIndonesian(selectedBookingModal.checkOut)}</span>
              </div>
              <div className="flex justify-between">
                <span>Host:</span>
                <span>{selectedBookingModal.hostName} ({selectedBookingModal.hostPhone})</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-extrabold text-slate-900">
                <span>Total Pembayaran:</span>
                <span className="text-teal-600">{formatIDR(selectedBookingModal.totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBookingModal(null)}
              className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
