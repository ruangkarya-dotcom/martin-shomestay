import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { getTodayString, getTomorrowString } from '../utils/formatters';

interface SearchBarProps {
  compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ compact = false }) => {
  const { filter, updateFilter, navigate } = useApp();

  const [city, setCity] = useState(filter.city || '');
  const [checkIn, setCheckIn] = useState(filter.checkIn || getTodayString());
  const [checkOut, setCheckOut] = useState(filter.checkOut || getTomorrowString());
  const [guests, setGuests] = useState(filter.guests || 1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({
      city,
      checkIn,
      checkOut,
      guests,
    });
    navigate('/explore');
  };

  const cities = ['Semua Lokasi', 'Yogyakarta', 'Bandung', 'Bali', 'Malang', 'Lombok', 'Jakarta', 'Semarang', 'Surabaya'];

  return (
    <form
      onSubmit={handleSearch}
      className={`bg-white rounded-2xl md:rounded-full shadow-2xl border border-slate-200/90 p-2 sm:p-3 transition-all ${
        compact ? 'max-w-4xl' : 'max-w-5xl'
      } mx-auto`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 lg:gap-0 lg:divide-x lg:divide-slate-200/80 items-center">
        {/* Location Dropdown */}
        <div className="lg:col-span-4 px-3 py-2 text-left">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>Destinasi / Lokasi</span>
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value === 'Semua Lokasi' ? '' : e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer py-1"
          >
            {cities.map((c) => (
              <option key={c} value={c === 'Semua Lokasi' ? '' : c}>
                {c === '' ? '📍 Semua Lokasi di Indonesia' : `📍 ${c}`}
              </option>
            ))}
          </select>
        </div>

        {/* Check-In Date */}
        <div className="lg:col-span-3 px-3 py-2 text-left">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Check-in</span>
          </label>
          <input
            type="date"
            min={getTodayString()}
            value={checkIn}
            onChange={(e) => {
              setCheckIn(e.target.value);
              if (e.target.value >= checkOut) {
                // Adjust checkout to day after checkin
                const next = new Date(e.target.value);
                next.setDate(next.getDate() + 1);
                setCheckOut(next.toISOString().split('T')[0]);
              }
            }}
            className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer py-1"
          />
        </div>

        {/* Check-Out Date */}
        <div className="lg:col-span-3 px-3 py-2 text-left">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Check-out</span>
          </label>
          <input
            type="date"
            min={checkIn || getTodayString()}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer py-1"
          />
        </div>

        {/* Guests Count & Submit */}
        <div className="lg:col-span-2 px-2 py-1 flex items-center justify-between gap-2">
          <div className="flex-1 text-left px-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Users className="w-3.5 h-3.5 text-teal-600" />
              <span>Tamu</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700"
              >
                -
              </button>
              <span className="text-sm font-bold text-slate-800 w-4 text-center">{guests}</span>
              <button
                type="button"
                onClick={() => setGuests(Math.min(15, guests + 1))}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold p-3 sm:px-6 sm:py-3.5 rounded-xl md:rounded-full flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
            <span className="hidden sm:inline text-sm">Cari</span>
          </button>
        </div>
      </div>
    </form>
  );
};
