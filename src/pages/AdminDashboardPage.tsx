import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatIDR, formatDateIndonesian } from '../utils/formatters';
import { Shield, Users, Building2, Calendar, DollarSign, CheckCircle2, Search } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { properties, bookings, deleteProperty } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'homestays' | 'bookings'>('homestays');
  const [searchQuery, setSearchQuery] = useState('');

  const totalUsers = 128;
  const totalHosts = 42;
  const totalVolume = bookings.reduce((acc, b) => acc + b.totalPrice, 0);

  const filteredProperties = properties.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center text-white">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black">Admin Management Panel</h1>
            <p className="text-xs text-slate-400 mt-1">Sistem kontrol dan pengawasan transaksi StayNest Indonesia</p>
          </div>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">TOTAL USER</span>
          <div className="text-2xl font-black text-slate-900">{totalUsers}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">TOTAL HOST</span>
          <div className="text-2xl font-black text-slate-900">{totalHosts}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">TOTAL HOMESTAY</span>
          <div className="text-2xl font-black text-slate-900">{properties.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">TOTAL BOOKING</span>
          <div className="text-2xl font-black text-slate-900">{bookings.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">VOLUME TRANSAKSI</span>
          <div className="text-base font-black text-teal-600">{formatIDR(totalVolume)}</div>
        </div>
      </div>

      {/* Main Admin Data Area */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        {/* Subtabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('homestays')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'homestays' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Kelola Homestay ({properties.length})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'bookings' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Transaksi Booking ({bookings.length})
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Homestays Table */}
        {activeTab === 'homestays' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="bg-slate-50 font-bold text-slate-600 uppercase border-b border-slate-200">
                  <th className="p-3">Nama Homestay</th>
                  <th className="p-3">Kota</th>
                  <th className="p-3">Harga / Malam</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Host</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">{p.name}</td>
                    <td className="p-3">{p.city}</td>
                    <td className="p-3 font-semibold">{formatIDR(p.pricePerNight)}</td>
                    <td className="p-3 font-bold text-amber-600">★ {p.rating}</td>
                    <td className="p-3">{p.host.name}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteProperty(p.id)}
                        className="text-rose-600 hover:text-rose-800 font-bold"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bookings Table */}
        {activeTab === 'bookings' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="bg-slate-50 font-bold text-slate-600 uppercase border-b border-slate-200">
                  <th className="p-3">Kode Booking</th>
                  <th className="p-3">Homestay</th>
                  <th className="p-3">Pemesan</th>
                  <th className="p-3">Tanggal Check-In</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-teal-600">{b.bookingCode}</td>
                    <td className="p-3 font-semibold">{b.propertyName}</td>
                    <td className="p-3">{b.customerName}</td>
                    <td className="p-3">{formatDateIndonesian(b.checkIn)}</td>
                    <td className="p-3 font-extrabold text-slate-900">{formatIDR(b.totalPrice)}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
