import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatIDR, formatDateIndonesian } from '../utils/formatters';
import { Clock, QrCode, Copy, Check, ShieldCheck, ArrowRight, Building2, CreditCard } from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const { getBookingByCode, updateBookingStatus, navigate, addToast } = useApp();

  // Get code from hash parameter e.g. #/payment?code=SN-78K2P91
  const hash = window.location.hash;
  const searchParams = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
  const code = searchParams.get('code') || 'SN-78K2P91';

  const booking = getBookingByCode(code);

  const [copiedCode, setCopiedCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(24 * 3600 - 15); // 23h 59m

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyVa = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedCode(true);
    addToast('Nomor Disalin', 'Nomor rekening/VA telah disalin', 'info');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleSimulatePaymentDone = () => {
    if (booking) {
      updateBookingStatus(booking.id, 'paid');
      addToast('Pembayaran Berhasil!', 'Sistem telah memverifikasi pembayaran Anda.', 'success');
      navigate(`/booking/success?code=${booking.bookingCode}`);
    } else {
      navigate('/booking/success?code=' + code);
    }
  };

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Data Pembayaran Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">Silakan lakukan pemesanan dari halaman detail homestay terlebih dahulu.</p>
        <button
          onClick={() => navigate('/explore')}
          className="px-5 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl"
        >
          Ke Halaman Eksplorasi
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Countdown Timer Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Selesaikan Pembayaran Dalam:</span>
        </div>
        <span className="font-mono font-black text-xl text-amber-700 bg-amber-100 px-3 py-1 rounded-xl">
          {formatCountdown(timeLeft)}
        </span>
      </div>

      {/* Main Payment Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1 pb-6 border-b border-slate-100">
          <span className="text-[10px] font-extrabold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full">
            REF BOOKING: {booking.bookingCode}
          </span>
          <h1 className="text-2xl font-black text-slate-900 pt-2">Instruksi Pembayaran</h1>
          <p className="text-xs text-slate-500">
            Pemesanan homestay untuk <strong>{booking.propertyName}</strong>
          </p>
        </div>

        {/* Total Price Callout */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">TOTAL PEMBAYARAN</span>
            <strong className="text-2xl font-black text-teal-400">{formatIDR(booking.totalPrice)}</strong>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 font-semibold">
            Status: Menunggu Pembayaran
          </span>
        </div>

        {/* Payment Method Details */}
        {booking.paymentMethod === 'qris' && (
          <div className="text-center space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">Pindai Kode QRIS Di Bawah</h3>
            <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-md border border-slate-200 mx-auto flex flex-col items-center justify-center space-y-2">
              {/* QRIS Placeholder SVG visual */}
              <div className="w-full h-full bg-slate-900 p-3 rounded-xl flex items-center justify-center text-white">
                <QrCode className="w-32 h-32 text-teal-400" />
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Buka aplikasi Gopay, ShopeePay, OVO, DANA, atau M-Banking favoritmu lalu pilih <strong>Pindai / QRIS</strong>.
            </p>
          </div>
        )}

        {(booking.paymentMethod === 'virtual_account' || booking.paymentMethod === 'bank_transfer') && (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Nomor Virtual Account / Rekening</h3>
            <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">BCA VIRTUAL ACCOUNT</span>
                <strong className="text-lg font-mono font-black text-slate-900 block">
                  8801 2345 8990 1200
                </strong>
                <span className="text-xs text-slate-500">a.n. PT StayNest Indonesia</span>
              </div>
              <button
                onClick={() => handleCopyVa('8801234589901200')}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors font-semibold text-xs flex items-center gap-1"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Tersalin' : 'Salin VA'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step-by-Step Guide */}
        <div className="space-y-2 text-xs text-slate-600 pt-2">
          <h4 className="font-bold text-slate-900">Cara Pembayaran:</h4>
          <ol className="list-decimal list-inside space-y-1 text-slate-500">
            <li>Buka aplikasi e-wallet atau m-banking sesuai metode yang dipilih</li>
            <li>Lakukan pembayaran sebesar nominal tepat <strong>{formatIDR(booking.totalPrice)}</strong></li>
            <li>Tunggu konfirmasi otomatis sistem dalam 1-2 menit</li>
          </ol>
        </div>

        {/* Simulated Demo Button */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <button
            onClick={handleSimulatePaymentDone}
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Simulasikan Pembayaran Selesai (Demo Test)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-center text-slate-400">
            Tombol simulasi ini digunakan untuk menguji flow pemesanan langsung tanpa payment gateway asli.
          </p>
        </div>
      </div>
    </div>
  );
};
