import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Home, Mail, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { navigate, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    addToast('Instruksi Dikirim', `Link reset kata sandi dikirim ke ${email}`, 'success');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-teal-600/30">
          <Home className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Lupa Kata Sandi?</h1>
        <p className="text-xs text-slate-500">Masukkan email Anda untuk menerima instruksi pemulihan akun</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-5">
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Terdaftar</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
            >
              Kirim Link Reset
            </button>
          </form>
        ) : (
          <div className="text-center space-y-3 py-4">
            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Cek Email Anda</h3>
            <p className="text-xs text-slate-500">
              Instruksi pemulihan telah dikirim ke <strong>{email}</strong>. Silakan periksa folder masuk atau spam Anda.
            </p>
          </div>
        )}

        <button
          onClick={() => navigate('/login')}
          className="w-full text-center text-xs font-bold text-slate-600 hover:text-teal-600 flex items-center justify-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Masuk</span>
        </button>
      </div>
    </div>
  );
};
