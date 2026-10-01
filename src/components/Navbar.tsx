import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, Heart, User as UserIcon, PlusCircle, Menu, X, Shield, Building2, UserCheck, Sparkles, Tag } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPath, navigate, wishlist, currentRole, switchRole, currentUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Demo Role Switcher Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span className="hidden sm:inline">Mode Demo AI Studio:</span>
            <span className="font-medium text-white">
              Peran Aktif: <span className="capitalize text-teal-300 font-semibold">{currentRole}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 hidden md:inline">Ganti Peran:</span>
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => switchRole('user')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentRole === 'user' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Tamu / User
              </button>
              <button
                onClick={() => switchRole('host')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentRole === 'host' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Pemilik / Host
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentRole === 'admin' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title */}
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900 group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:bg-teal-700 transition-colors">
            <Home className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-slate-900">
            Stay<span className="text-teal-600">Nest</span>
          </span>
        </a>

        {/* Zone 2: Navigation Links (4-6 links) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <a
            href="#/"
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            className={`transition-colors py-1 ${isActive('/') ? 'text-teal-600 font-bold border-b-2 border-teal-600' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Beranda
          </a>
          <a
            href="#/explore"
            onClick={(e) => { e.preventDefault(); navigate('/explore'); }}
            className={`transition-colors py-1 ${isActive('/explore') ? 'text-teal-600 font-bold border-b-2 border-teal-600' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Eksplorasi
          </a>
          <a
            href="#/promo"
            onClick={(e) => { e.preventDefault(); navigate('/explore'); }}
            className="text-slate-600 hover:text-slate-900 transition-colors py-1 flex items-center gap-1"
          >
            <Tag className="w-3.5 h-3.5 text-teal-600" />
            Promo
          </a>
          <a
            href="#/about"
            onClick={(e) => { e.preventDefault(); navigate('/#about'); }}
            className="text-slate-600 hover:text-slate-900 transition-colors py-1"
          >
            Tentang Kami
          </a>
        </nav>

        {/* Zone 3: Actions & User Avatar */}
        <div className="flex items-center gap-3">
          {/* Wishlist Button */}
          <button
            onClick={() => navigate('/dashboard/wishlist')}
            className="relative p-2 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Wishlist Saya"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Host Button / Action */}
          <button
            onClick={() => {
              if (currentRole !== 'host') switchRole('host');
              navigate('/host/properties/new');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-teal-600" />
            <span>Daftarkan Homestay</span>
          </button>

          {/* User Profile / Dashboard Link */}
          <div className="relative">
            <button
              onClick={() => {
                if (currentRole === 'host') navigate('/host');
                else if (currentRole === 'admin') navigate('/admin');
                else navigate('/dashboard');
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
              />
              <span className="hidden lg:inline text-xs font-semibold text-slate-800">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <a
            href="#/"
            onClick={(e) => { e.preventDefault(); navigate('/'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 py-2 text-sm font-medium text-slate-800 hover:text-teal-600"
          >
            <Home className="w-4 h-4 text-slate-500" /> Beranda
          </a>
          <a
            href="#/explore"
            onClick={(e) => { e.preventDefault(); navigate('/explore'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 py-2 text-sm font-medium text-slate-800 hover:text-teal-600"
          >
            <Compass className="w-4 h-4 text-slate-500" /> Eksplorasi Homestay
          </a>
          <a
            href="#/dashboard/wishlist"
            onClick={(e) => { e.preventDefault(); navigate('/dashboard/wishlist'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 py-2 text-sm font-medium text-slate-800 hover:text-teal-600"
          >
            <Heart className="w-4 h-4 text-slate-500" /> Wishlist ({wishlist.length})
          </a>
          <a
            href="#/dashboard"
            onClick={(e) => { e.preventDefault(); navigate('/dashboard'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 py-2 text-sm font-medium text-slate-800 hover:text-teal-600"
          >
            <UserIcon className="w-4 h-4 text-slate-500" /> Dashboard Saya
          </a>
          <a
            href="#/host"
            onClick={(e) => { e.preventDefault(); switchRole('host'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg px-3"
          >
            <Building2 className="w-4 h-4 text-teal-600" /> Host Dashboard
          </a>
          <a
            href="#/admin"
            onClick={(e) => { e.preventDefault(); switchRole('admin'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg px-3"
          >
            <Shield className="w-4 h-4 text-slate-600" /> Admin Dashboard
          </a>
        </div>
      )}
    </header>
  );
};
