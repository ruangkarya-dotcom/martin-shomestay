import React from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyType } from '../types';
import { formatIDR } from '../utils/formatters';
import { Filter, SlidersHorizontal, RotateCcw, Search, Star, MapPin } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const { filter, updateFilter, resetFilter, getFilteredProperties } = useApp();
  const filteredList = getFilteredProperties();

  const cities = ['Semua', 'Yogyakarta', 'Bandung', 'Bali', 'Malang', 'Lombok', 'Jakarta', 'Semarang', 'Surabaya'];
  const propertyTypesList: PropertyType[] = ['Villa', 'Homestay', 'Cottage', 'Ethnic', 'Apartment'];
  const amenitiesList = [
    'Kolam Renang',
    'Wi-Fi Cepat',
    'AC',
    'Dapur',
    'BBQ',
    'Water Heater',
    'Onsen',
    'Smart TV',
  ];

  const handlePropertyTypeToggle = (type: PropertyType) => {
    const current = filter.propertyTypes;
    if (current.includes(type)) {
      updateFilter({ propertyTypes: current.filter((t) => t !== type) });
    } else {
      updateFilter({ propertyTypes: [...current, type] });
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    const current = filter.amenities;
    if (current.includes(amenity)) {
      updateFilter({ amenities: current.filter((a) => a !== amenity) });
    } else {
      updateFilter({ amenities: [...current, amenity] });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Breadcrumb */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Eksplorasi Homestay & Villa
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Temukan penginapan terbaik sesuai budget, lokasi, dan fasilitas impianmu
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Filter Panel */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6 sticky top-20">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Filter className="w-4 h-4 text-teal-600" />
              <span>Filter Pencarian</span>
            </div>
            <button
              onClick={resetFilter}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Kota / Destinasi
            </label>
            <select
              value={filter.city || 'Semua'}
              onChange={(e) => updateFilter({ city: e.target.value === 'Semua' ? '' : e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === 'Semua' ? '📍 Semua Kota' : `📍 ${c}`}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Maksimal Harga
              </label>
              <span className="text-xs font-extrabold text-teal-600">
                {formatIDR(filter.priceRange[1])}
              </span>
            </div>
            <input
              type="range"
              min={300000}
              max={3000000}
              step={100000}
              value={filter.priceRange[1]}
              onChange={(e) => updateFilter({ priceRange: [filter.priceRange[0], Number(e.target.value)] })}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Rp300rb</span>
              <span>Rp3jt+ / malam</span>
            </div>
          </div>

          {/* Property Types */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Tipe Properti
            </label>
            <div className="space-y-1.5">
              {propertyTypesList.map((type) => (
                <label key={type} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={filter.propertyTypes.includes(type)}
                    onChange={() => handlePropertyTypeToggle(type)}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Rating Minimum
            </label>
            <div className="flex items-center gap-1">
              {[0, 4.0, 4.5, 4.8].map((rating) => (
                <button
                  key={rating}
                  onClick={() => updateFilter({ minRating: rating })}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    filter.minRating === rating
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {rating === 0 ? 'Semua' : `★ ${rating}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Fasilitas Utama
            </label>
            <div className="space-y-1.5">
              {amenitiesList.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={filter.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* Header Bar: Result Count & Sorting */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Menampilkan <span className="text-slate-900 font-extrabold">{filteredList.length}</span> homestay & villa pilihan
                {filter.city && <span> di <strong className="text-teal-600">{filter.city}</strong></span>}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Urutkan:</span>
              <select
                value={filter.sortBy}
                onChange={(e) => updateFilter({ sortBy: e.target.value as any })}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer w-full sm:w-auto"
              >
                <option value="recommendation">Rekomendasi StayNest</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="rating_desc">Rating Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Property Cards Grid or Empty State */}
          {filteredList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredList.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Homestay Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Maaf, tidak ada penginapan yang sesuai dengan kriteria filter Anda. Coba kurangi filter atau pilih destinasi lainnya.
              </p>
              <button
                onClick={resetFilter}
                className="px-5 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
