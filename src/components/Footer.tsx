import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ShieldCheck, HeartHandshake, CreditCard, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, updateFilter } = useApp();

  const handleCityClick = (city: string) => {
    updateFilter({ city });
    navigate('/explore');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-black tracking-tight text-white">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-900 font-bold">
                <Home className="w-5 h-5" />
              </div>
              <span>Stay<span className="text-teal-400">Nest</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Platform pemesanan homestay & villa unik terpercaya di Indonesia. Garansi harga jujur, fasilitas lengkap, dan pembayaran super aman.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Terverifikasi 100%</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <HeartHandshake className="w-4 h-4 text-teal-400" />
                <span>Layanan 24/7</span>
              </div>
            </div>
          </div>

          {/* Col 2: Kota Populer */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Destinasi Favorit</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {['Yogyakarta', 'Bandung', 'Bali', 'Malang', 'Lombok', 'Jakarta', 'Semarang', 'Surabaya'].map((city) => (
                <li key={city}>
                  <button
                    onClick={() => handleCityClick(city)}
                    className="hover:text-teal-400 transition-colors text-left"
                  >
                    Homestay di {city}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#/explore" onClick={(e) => { e.preventDefault(); navigate('/explore'); }} className="hover:text-teal-400 transition-colors">
                  Cari Homestay
                </a>
              </li>
              <li>
                <a href="#/host" onClick={(e) => { e.preventDefault(); navigate('/host'); }} className="hover:text-teal-400 transition-colors">
                  Daftarkan Properti Anda (Host)
                </a>
              </li>
              <li>
                <a href="#/dashboard/bookings" onClick={(e) => { e.preventDefault(); navigate('/dashboard/bookings'); }} className="hover:text-teal-400 transition-colors">
                  Cek Booking Saya
                </a>
              </li>
              <li>
                <a href="#/dashboard/wishlist" onClick={(e) => { e.preventDefault(); navigate('/dashboard/wishlist'); }} className="hover:text-teal-400 transition-colors">
                  Wishlist Homestay
                </a>
              </li>
              <li>
                <a href="#/admin" onClick={(e) => { e.preventDefault(); navigate('/admin'); }} className="hover:text-teal-400 transition-colors">
                  Admin Panel
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak & Metode Pembayaran */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Hubungi Kami</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+62 800-1-STAYNEST</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>bantuan@staynest.id</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-1" />
                <span>Gedung StayNest Tower, Jakarta Selatan, Indonesia</span>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-300 mb-2">Metode Pembayaran:</p>
              <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-300">
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">BCA</span>
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">MANDIRI</span>
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">BRI</span>
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">QRIS</span>
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">GOPAY</span>
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">VISA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} StayNest Indonesia. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Pusat Bantuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
