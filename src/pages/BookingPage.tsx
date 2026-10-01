import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatIDR, formatDateIndonesian, generateBookingCode } from '../utils/formatters';
import { PaymentMethodType, Booking } from '../types';
import { ShieldCheck, User, Mail, Phone, Calendar, MapPin, CreditCard, Building2, QrCode, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const { pendingBookingData, currentUser, addBooking, navigate, addToast } = useApp();

  // If no pending booking, redirect or fallback
  const bookingData = pendingBookingData || {
    propertyId: 'prop-1',
    propertyName: 'Omah Joglo Heritage & Private Pool',
    propertyImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    propertyCity: 'Yogyakarta',
    propertyAddress: 'Jl. Palagan Tentara Pelajar Km 9.5, Sleman, DIY',
    hostName: 'Bapak Sugeng Rahardjo',
    hostPhone: '+62 812-3456-7890',
    checkIn: '2026-10-15',
    checkOut: '2026-10-17',
    nights: 2,
    guests: 2,
    basePrice: 1700000,
    serviceFee: 50000,
    tax: 85000,
    totalPrice: 1835000,
  };

  const [customerName, setCustomerName] = useState(currentUser.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('qris');

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const paymentMethodsList = [
    {
      id: 'qris' as PaymentMethodType,
      title: 'QRIS (Gopay / ShopeePay / OVO / Dana / Mobile Banking)',
      desc: 'Pindai kode QR instan dari aplikasi e-wallet atau m-banking Anda',
      icon: QrCode,
    },
    {
      id: 'virtual_account' as PaymentMethodType,
      title: 'Virtual Account (BCA / Mandiri / BRI / BNI)',
      desc: 'Transfer mudah dengan nomor akun unik tanpa konfirmasi manual',
      icon: Building2,
    },
    {
      id: 'bank_transfer' as PaymentMethodType,
      title: 'Transfer Bank Manual',
      desc: 'Transfer ke rekening resmi StayNest',
      icon: CreditCard,
    },
    {
      id: 'credit_card' as PaymentMethodType,
      title: 'Kartu Kredit / Debit Visa & Mastercard',
      desc: 'Pembayaran instan diproses dengan enkripsi 256-bit',
      icon: CreditCard,
    },
  ];

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerEmail || !customerPhone) {
      addToast('Data Belum Lengkap', 'Silakan lengkapi nama, email, dan nomor HP pemesan.', 'error');
      return;
    }

    const bookingCode = generateBookingCode();
    const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const newBooking: Booking = {
      id: 'book-' + Date.now(),
      bookingCode,
      propertyId: bookingData.propertyId!,
      propertyName: bookingData.propertyName!,
      propertyImage: bookingData.propertyImage!,
      propertyCity: bookingData.propertyCity!,
      propertyAddress: bookingData.propertyAddress!,
      hostName: bookingData.hostName!,
      hostPhone: bookingData.hostPhone!,
      selectedRoomName: bookingData.selectedRoomName,
      checkIn: bookingData.checkIn!,
      checkOut: bookingData.checkOut!,
      nights: bookingData.nights || 1,
      guests: bookingData.guests || 1,
      basePrice: bookingData.basePrice || 0,
      serviceFee: bookingData.serviceFee || 50000,
      tax: bookingData.tax || 0,
      totalPrice: bookingData.totalPrice || 0,
      status: 'pending',
      customerName,
      customerEmail,
      customerPhone,
      specialRequests,
      paymentMethod,
      paymentMethodLabel: paymentMethodsList.find((p) => p.id === paymentMethod)?.title || 'Online Payment',
      paymentDeadline: deadline,
      createdAt: new Date().toISOString(),
    };

    addBooking(newBooking);
    navigate(`/payment?code=${bookingCode}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Steps Indicator */}
      <div className="space-y-4">
        <button
          onClick={() => navigate(`/property/${bookingData.propertyId}`)}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Homestay</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Pemesanan Homestay
        </h1>

        {/* Steps Bar */}
        <div className="grid grid-cols-3 gap-2 max-w-xl text-xs font-bold">
          <div
            onClick={() => setCurrentStep(1)}
            className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
              currentStep === 1 ? 'bg-teal-600 text-white border-teal-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[11px]">1</span>
            <span>Data Pemesan</span>
          </div>

          <div
            onClick={() => setCurrentStep(2)}
            className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
              currentStep === 2 ? 'bg-teal-600 text-white border-teal-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[11px]">2</span>
            <span>Detail Inap</span>
          </div>

          <div
            onClick={() => setCurrentStep(3)}
            className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
              currentStep === 3 ? 'bg-teal-600 text-white border-teal-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[11px]">3</span>
            <span>Pembayaran</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Steps Form Area */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleSubmitBooking} className="space-y-8">
            {/* STEP 1: Data Pemesan */}
            {currentStep === 1 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <User className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-900 text-base">STEP 1: Data Kontak Pemesan</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Nama Lengkap Pemesan *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Sesuai KTP / SIM"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Email Aktif *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="contoh@gmail.com"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Nomor HP / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+62 812-xxxx-xxxx"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Catatan / Permintaan Khusus ke Host (Opsional)
                    </label>
                    <textarea
                      rows={3}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Contoh: Estimasi jam sampai pukul 14:00 WIB, minta disiapkan sarapan tanpa cabai..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full py-3 bg-teal-600 text-white font-extrabold rounded-xl text-xs hover:bg-teal-700 transition-colors"
                >
                  Lanjut ke Detail Inap (Step 2) →
                </button>
              </div>
            )}

            {/* STEP 2: Ringkasan Inap */}
            {currentStep === 2 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-900 text-base">STEP 2: Konfirmasi Ringkasan Menginap</h3>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-start gap-4">
                    <img
                      src={bookingData.propertyImage}
                      alt={bookingData.propertyName}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm">{bookingData.propertyName}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        {bookingData.propertyAddress}
                      </p>
                      {bookingData.selectedRoomName && (
                        <span className="inline-block text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                          Unit: {bookingData.selectedRoomName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block font-semibold text-[10px]">CHECK-IN</span>
                      <strong className="text-slate-800">{formatDateIndonesian(bookingData.checkIn!)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[10px]">CHECK-OUT</span>
                      <strong className="text-slate-800">{formatDateIndonesian(bookingData.checkOut!)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[10px]">DURASI</span>
                      <strong className="text-slate-800">{bookingData.nights} Malam</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[10px]">JUMLAH TAMU</span>
                      <strong className="text-slate-800">{bookingData.guests} Orang Tamu</strong>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200"
                  >
                    ← Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 py-3 bg-teal-600 text-white font-extrabold rounded-xl text-xs hover:bg-teal-700"
                  >
                    Lanjut ke Pembayaran (Step 3) →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Metode Pembayaran */}
            {currentStep === 3 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <CreditCard className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-900 text-base">STEP 3: Pilih Metode Pembayaran</h3>
                </div>

                <div className="space-y-3">
                  {paymentMethodsList.map((pm) => {
                    const IconComp = pm.icon;
                    const isSelected = paymentMethod === pm.id;
                    return (
                      <div
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-600/30'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          checked={isSelected}
                          onChange={() => setPaymentMethod(pm.id)}
                          className="mt-1 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <IconComp className="w-4 h-4 text-teal-600" />
                            <h4 className="font-bold text-slate-900 text-xs">{pm.title}</h4>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{pm.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="py-3 px-5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200"
                  >
                    ← Kembali
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl text-sm shadow-lg shadow-teal-600/30 transition-all"
                  >
                    Konfirmasi & Bayar Sekarang
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary Right Column */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 space-y-5">
            <h3 className="font-black text-slate-900 text-base pb-3 border-b border-slate-100">
              Rincian Biaya Pemesanan
            </h3>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
              <img
                src={bookingData.propertyImage}
                alt={bookingData.propertyName}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{bookingData.propertyName}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{bookingData.propertyCity}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2">
              <div className="flex justify-between">
                <span>Sewa Homestay ({bookingData.nights} malam)</span>
                <span className="font-semibold text-slate-800">{formatIDR(bookingData.basePrice!)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Layanan StayNest</span>
                <span className="font-semibold text-slate-800">{formatIDR(bookingData.serviceFee!)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pajak & Retribusi</span>
                <span className="font-semibold text-slate-800">{formatIDR(bookingData.tax!)}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                <span className="font-extrabold text-sm">Total Tagihan</span>
                <span className="font-black text-xl text-teal-600">{formatIDR(bookingData.totalPrice!)}</span>
              </div>
            </div>

            <div className="p-3 bg-teal-50/80 rounded-2xl border border-teal-200/60 text-[11px] text-teal-800 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                Garansi Pembatalan Gratis hingga 48 jam sebelum check-in. Pembayaran Anda dilindungi enkripsi aman StayNest.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
