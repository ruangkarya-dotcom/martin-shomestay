import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatIDR, formatDateIndonesian } from '../utils/formatters';
import { CheckCircle2, Download, Home, Calendar, MapPin, User, FileText, Printer, ShieldCheck, X } from 'lucide-react';

export const BookingSuccessPage: React.FC = () => {
  const { getBookingByCode, navigate } = useApp();

  const hash = window.location.hash;
  const searchParams = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
  const code = searchParams.get('code') || 'SN-78K2P91';

  const booking = getBookingByCode(code);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Pemesanan Berhasil</h2>
        <p className="text-xs text-slate-500">Terima kasih! Pemesanan Anda telah kami catat.</p>
        <button
          onClick={() => navigate('/dashboard/bookings')}
          className="px-5 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl"
        >
          Lihat Riwayat Booking Saya
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Top Success Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-3xl text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Booking Berhasil!</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Pembayaran Anda telah diverifikasi. Bukti pemesanan & e-voucher telah dikirimkan ke <strong>{booking.customerEmail}</strong>.
        </p>
      </div>

      {/* Booking Summary Ticket Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Ticket Header */}
        <div className="bg-slate-900 text-white p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">KODE BOOKING</span>
            <strong className="text-xl font-mono font-black text-teal-400 block">{booking.bookingCode}</strong>
          </div>
          <div className="flex items-center gap-1.5 bg-teal-900/80 px-3 py-1.5 rounded-xl border border-teal-500/30 text-teal-200 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Status: LUNAS / VERIFIED</span>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Property Block */}
          <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
            <img
              src={booking.propertyImage}
              alt={booking.propertyName}
              className="w-24 h-24 rounded-2xl object-cover shrink-0"
            />
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">{booking.propertyName}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                {booking.propertyAddress}
              </p>
              <p className="text-xs text-slate-600">
                Host: <strong>{booking.hostName}</strong> ({booking.hostPhone})
              </p>
            </div>
          </div>

          {/* Key Stay Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase block">CHECK-IN</span>
              <strong className="text-slate-900">{formatDateIndonesian(booking.checkIn)}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase block">CHECK-OUT</span>
              <strong className="text-slate-900">{formatDateIndonesian(booking.checkOut)}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase block">DURASI</span>
              <strong className="text-slate-900">{booking.nights} Malam</strong>
            </div>
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase block">TAMU</span>
              <strong className="text-slate-900">{booking.guests} Orang</strong>
            </div>
          </div>

          {/* Customer & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold text-[10px] uppercase block">PEMESAN</span>
              <strong className="text-slate-900 block">{booking.customerName}</strong>
              <p className="text-slate-500">{booking.customerEmail}</p>
              <p className="text-slate-500">{booking.customerPhone}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold text-[10px] uppercase block">TOTAL PEMBAYARAN</span>
              <strong className="text-xl font-black text-teal-600 block">{formatIDR(booking.totalPrice)}</strong>
              <p className="text-slate-500">Metode: {booking.paymentMethodLabel}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/dashboard/bookings')}
            className="flex-1 min-w-[160px] py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all text-center shadow-sm"
          >
            Lihat Booking Saya
          </button>
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="flex-1 min-w-[160px] py-3 bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4 text-teal-600" />
            <span>Download Invoice</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="py-3 px-5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </button>
        </div>
      </div>

      {/* Invoice Modal Preview */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">INVOICE RESERVASI</h2>
                <p className="text-xs text-slate-500">StayNest Official E-Receipt</p>
              </div>
              <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-lg">
                {booking.bookingCode}
              </span>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Tanggal Invoice:</span>
                <strong className="text-slate-900">{new Date().toLocaleDateString('id-ID')}</strong>
              </div>
              <div className="flex justify-between">
                <span>Nama Pemesan:</span>
                <strong className="text-slate-900">{booking.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Homestay:</span>
                <strong className="text-slate-900">{booking.propertyName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Tanggal Inap:</span>
                <strong className="text-slate-900">{formatDateIndonesian(booking.checkIn)} - {formatDateIndonesian(booking.checkOut)} ({booking.nights} Malam)</strong>
              </div>

              <table className="w-full text-left border-collapse mt-4">
                <thead>
                  <tr className="bg-slate-100 text-[11px] font-bold text-slate-600">
                    <th className="p-2 rounded-l-lg">Deskripsi</th>
                    <th className="p-2 rounded-r-lg text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2">Sewa Kamar ({booking.nights} malam)</td>
                    <td className="p-2 text-right">{formatIDR(booking.basePrice)}</td>
                  </tr>
                  <tr>
                    <td className="p-2">Biaya Layanan StayNest</td>
                    <td className="p-2 text-right">{formatIDR(booking.serviceFee)}</td>
                  </tr>
                  <tr>
                    <td className="p-2">Pajak</td>
                    <td className="p-2 text-right">{formatIDR(booking.tax)}</td>
                  </tr>
                  <tr className="font-extrabold text-sm text-slate-900">
                    <td className="p-2 pt-3">TOTAL LUNAS</td>
                    <td className="p-2 pt-3 text-right text-teal-600">{formatIDR(booking.totalPrice)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="py-3 px-4 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
