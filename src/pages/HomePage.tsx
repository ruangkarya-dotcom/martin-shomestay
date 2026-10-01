import React from 'react';
import { useApp } from '../context/AppContext';
import { SearchBar } from '../components/SearchBar';
import { PropertyCard } from '../components/PropertyCard';
import { POPULAR_DESTINATIONS, PROMO_CARDS } from '../data/mockData';
import { ShieldCheck, HeartHandshake, Sparkles, MapPin, Award, CheckCircle2, ArrowRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const HomePage: React.FC = () => {
  const { properties, navigate, updateFilter, addToast } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const featuredProperties = properties.filter((p) => p.isFeatured).slice(0, 4);

  const handleCityClick = (city: string) => {
    updateFilter({ city });
    navigate('/explore');
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast('Kode Promo Disalin', `Kode ${code} berhasil disalin ke clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-32 overflow-hidden bg-gradient-to-b from-teal-50/60 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Trust Kicker Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 text-teal-800 text-xs font-semibold mb-6 border border-teal-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Platform Homestay & Villa Terpercaya di Indonesia</span>
          </div>

          {/* Big Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Temukan Homestay Nyaman untuk <span className="text-teal-600 underline decoration-teal-300 decoration-wavy decoration-2">Perjalananmu</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Pesan penginapan terbaik dengan mudah, aman, dan harga transparan di seluruh destinasi indah Indonesia.
          </p>

          {/* Big Interactive Search Box */}
          <div className="mt-8 lg:mt-12">
            <SearchBar />
          </div>

          {/* Quick Filter City Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-600">
            <span className="text-slate-400">Pencarian Populer:</span>
            {['Yogyakarta', 'Bandung', 'Bali', 'Malang', 'Lombok'].map((city) => (
              <button
                key={city}
                onClick={() => handleCityClick(city)}
                className="px-3 py-1 bg-white hover:bg-teal-50 hover:text-teal-700 border border-slate-200 rounded-full transition-all shadow-2xs flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-teal-600" />
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Destinasi Populer
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Jelajahi keindahan Indonesia dari berbagai pilihan kota favorit
            </p>
          </div>
          <button
            onClick={() => {
              updateFilter({ city: '' });
              navigate('/explore');
            }}
            className="text-teal-600 font-bold text-sm hover:text-teal-700 flex items-center gap-1 group"
          >
            <span>Lihat Semua Destinasi</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {POPULAR_DESTINATIONS.map((dest) => (
            <div
              key={dest.city}
              onClick={() => handleCityClick(dest.city)}
              className="group relative h-56 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={dest.image}
                alt={dest.city}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
                <h3 className="font-extrabold text-lg group-hover:text-teal-300 transition-colors">
                  {dest.city}
                </h3>
                <p className="text-[11px] text-slate-200 line-clamp-1">{dest.tagline}</p>
                <span className="text-[10px] font-medium text-teal-300 mt-1">{dest.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Choice / Featured Homestays */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Rekomendasi Pilihan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Homestay & Villa Favorit Tamu
            </h2>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="text-teal-600 font-bold text-sm hover:text-teal-700 flex items-center gap-1 group"
          >
            <span>Eksplorasi Selengkapnya</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* Promos Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/30">
                PROMO KHUSUS HARI INI
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Hemat Lebih Banyak untuk Liburan Impianmu
              </h2>
              <p className="text-slate-300 text-sm">
                Gunakan kode kupon eksklusif StayNest dan dapatkan diskon potongan harga langsung saat checkout.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PROMO_CARDS.map((promo) => (
                <div
                  key={promo.id}
                  className={`bg-gradient-to-br ${promo.bgColor} p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 shadow-lg`}
                >
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-200">
                      Voucher
                    </span>
                    <h3 className="text-lg font-black text-white mt-0.5">{promo.title}</h3>
                    <p className="text-xs text-slate-100/90 mt-1">{promo.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/20">
                    <div className="bg-black/30 px-3 py-1.5 rounded-lg border border-white/20 text-xs font-mono font-bold text-white tracking-wider">
                      {promo.code}
                    </div>
                    <button
                      onClick={() => copyPromoCode(promo.code)}
                      className="bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow"
                    >
                      {copiedCode === promo.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan StayNest */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Mengapa Memilih StayNest?
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Kami berkomitmen memberikan pengalaman menginap terbaik tanpa rasa khawatir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Garansi Harga Transparan</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tanpa biaya tersembunyi. Total biaya kamar, pajak, dan layanan ditampilkan dengan jelas sejak awal booking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Host & Properti Terverifikasi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Seluruh lokasi homestay dan kelengkapan fasilitas diperiksa secara langsung untuk memastikan kenyamanan Anda.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Dukungan Pelanggan 24/7</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tim support siap membantu Anda dari proses pencarian, check-in, hingga penyelesaian kendala selama masa inap.
            </p>
          </div>
        </div>
      </section>

      {/* Host CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-700 to-emerald-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 text-center lg:text-left max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-200">
              MITRA HOMESTAY STAYNEST
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Punya Rumah atau Villa Kosong? Daftarkan di StayNest
            </h2>
            <p className="text-teal-100 text-sm">
              Raih pendapatan tambahan jutaan rupiah setiap bulan. Kami bantu pemasaran, kelola reservasi, dan sistem pembayaran otomatis.
            </p>
          </div>

          <button
            onClick={() => navigate('/host/properties/new')}
            className="px-8 py-4 bg-white text-teal-900 font-extrabold rounded-2xl hover:bg-teal-50 transition-all shadow-lg text-sm shrink-0 active:scale-95"
          >
            Daftarkan Homestay Anda Sekarang
          </button>
        </div>
      </section>
    </div>
  );
};
