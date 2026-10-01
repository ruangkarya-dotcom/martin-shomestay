import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatIDR, formatDateIndonesian } from '../utils/formatters';
import { PropertyType } from '../types';
import { Building2, PlusCircle, DollarSign, Calendar, Star, Users, Trash2, Edit, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';

export const HostDashboardPage: React.FC = () => {
  const { properties, bookings, addProperty, deleteProperty, navigate, addToast, currentPath } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'new_property' | 'bookings' | 'revenue'>(() => {
    if (currentPath.includes('new')) return 'new_property';
    if (currentPath.includes('properties')) return 'properties';
    if (currentPath.includes('bookings')) return 'bookings';
    if (currentPath.includes('revenue')) return 'revenue';
    return 'overview';
  });

  // New Property Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [type, setType] = useState<PropertyType>('Homestay');
  const [city, setCity] = useState('Yogyakarta');
  const [address, setAddress] = useState('');
  const [pricePerNight, setPricePerNight] = useState(500000);
  const [maxGuests, setMaxGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80');

  const totalRevenue = bookings.reduce((acc, b) => (b.status === 'paid' ? acc + b.totalPrice : acc), 0);

  const handleAddPropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !address || !description) {
      addToast('Data Inkomplit', 'Silakan isi nama, alamat, dan deskripsi properti.', 'error');
      return;
    }

    addProperty({
      name,
      tagline: tagline || 'Homestay Nyaman Bersih & Asri',
      type,
      city,
      location: `${city}, Indonesia`,
      address,
      mapCoordinates: { lat: -7.7956, lng: 110.3695 },
      pricePerNight: Number(pricePerNight),
      maxGuests: Number(maxGuests),
      bedrooms: Number(bedrooms),
      beds: Number(bedrooms) * 2,
      bathrooms: Number(bathrooms),
      images: [imageUrl],
      description,
      amenities: ['Wi-Fi Cepat', 'AC', 'Dapur', 'Water Heater', 'Parkir Garasi'],
      houseRules: ['Dilarang merokok di dalam kamar'],
      host: {
        id: 'host-me',
        name: 'Pemilik StayNest',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isVerified: true,
        joinedYear: 2026,
        responseTime: 'dalam 10 menit',
        phone: '+62 812-0000-1111',
        bio: 'Host berdedikasi menyambut Anda di penginapan bersih dan nyaman.'
      },
      rooms: []
    });

    // Reset Form & Redirect
    setName('');
    setAddress('');
    setDescription('');
    setActiveTab('properties');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Host Banner Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-bold">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">Dashboard Pemilik / Host</h1>
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-400" /> Host Terverifikasi
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Kelola properti, reservasi tamu, dan atur pendapatan homestay Anda</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('new_property')}
          className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Properti Baru</span>
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'overview' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Ringkasan Host</span>
          </button>

          <button
            onClick={() => setActiveTab('properties')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'properties' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Properti Saya ({properties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('new_property')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'new_property' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Properti</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'bookings' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Booking Masuk ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('revenue')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'revenue' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Pendapatan</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">PROPERTI AKTIF</span>
                  <div className="text-3xl font-black text-slate-900">{properties.length}</div>
                  <span className="text-[10px] text-teal-600 font-bold">Siap disewa</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">TOTAL RESERVASI</span>
                  <div className="text-3xl font-black text-slate-900">{bookings.length}</div>
                  <span className="text-[10px] text-slate-500 font-medium">Tamu menginap</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">PENDAPATAN LUNAS</span>
                  <div className="text-xl font-black text-teal-600">{formatIDR(totalRevenue)}</div>
                  <span className="text-[10px] text-emerald-600 font-bold">Terverifikasi</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">RATING RATA-RATA</span>
                  <div className="text-3xl font-black text-amber-500 flex items-center gap-1">
                    <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                    <span>4.9</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Dari ulasan tamu</span>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                    <span>Grafik Estimasi Pendapatan Bulan Ini</span>
                  </h3>
                  <span className="text-xs font-bold text-teal-600">Okt 2026</span>
                </div>

                <div className="h-44 bg-slate-50 rounded-2xl border border-slate-200/80 p-4 flex items-end justify-between gap-2">
                  {[40, 65, 80, 55, 90, 110, 130].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div
                        style={{ height: `${val}%` }}
                        className="w-full bg-teal-600 hover:bg-teal-700 rounded-t-lg transition-all"
                      />
                      <span className="text-[10px] text-slate-400 font-bold">Minggu {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROPERTIES LIST */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Daftar Properti Saya</h2>
                <button
                  onClick={() => setActiveTab('new_property')}
                  className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl"
                >
                  + Tambah Properti Baru
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {properties.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-40 object-cover rounded-xl"
                    />
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                          {p.type}
                        </span>
                        <span className="font-extrabold text-xs text-slate-900">{formatIDR(p.pricePerNight)} / malam</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mt-1 line-clamp-1">{p.name}</h3>
                      <p className="text-xs text-slate-500">{p.location}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/property/${p.id}`)}
                        className="text-xs font-bold text-teal-600 hover:underline"
                      >
                        Pratinjau Halaman
                      </button>

                      <button
                        onClick={() => deleteProperty(p.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Properti"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: NEW PROPERTY FORM */}
          {activeTab === 'new_property' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100">
                Formulir Pendaftaran Homestay Baru
              </h2>

              <form onSubmit={handleAddPropertySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nama Properti / Homestay *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Villa Rosewood Kaliurang"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Tagline Singkat</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Contoh: Villa Asri dengan View Gunung Merapi"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Tipe Properti</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as PropertyType)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Villa">Villa</option>
                      <option value="Homestay">Homestay</option>
                      <option value="Cottage">Cottage</option>
                      <option value="Ethnic">Ethnic / Joglo</option>
                      <option value="Apartment">Apartment</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Kota</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {['Yogyakarta', 'Bandung', 'Bali', 'Malang', 'Lombok', 'Jakarta', 'Semarang', 'Surabaya'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Harga Sewa / Malam (IDR) *</label>
                    <input
                      type="number"
                      required
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Jl. Kaliurang Km 18, Sleman, Yogyakarta"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Max Tamu</label>
                    <input
                      type="number"
                      value={maxGuests}
                      onChange={(e) => setMaxGuests(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Kamar Tidur</label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Kamar Mandi</label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">URL Foto Utama Properti</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi Lengkap *</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan keunikan homestay, udara lingkungan, akses destinasi..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-colors"
                >
                  Publikasikan Properti
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: BOOKINGS MASUK */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Daftar Reservasi Masuk dari Tamu</h2>
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-teal-600">{b.bookingCode}</span>
                        <span className="text-xs font-bold text-slate-900">{b.propertyName}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                        {b.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Pemesan: <strong>{b.customerName}</strong> ({b.customerPhone}) · {formatDateIndonesian(b.checkIn)} - {formatDateIndonesian(b.checkOut)} ({b.nights} Malam)
                    </p>

                    <p className="text-xs text-slate-500 font-semibold">
                      Total Pembayaran: <strong className="text-slate-900">{formatIDR(b.totalPrice)}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REVENUE */}
          {activeTab === 'revenue' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100">
                Rincian Pendapatan Host
              </h2>

              <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-2">
                <span className="text-xs text-slate-400 font-semibold uppercase">TOTAL PENDAPATAN TERVERIFIKASI</span>
                <strong className="text-3xl font-black text-teal-400 block">{formatIDR(totalRevenue)}</strong>
                <p className="text-xs text-slate-400">Pencairan otomatis ke rekening bank terdaftar setiap hari Senin.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
