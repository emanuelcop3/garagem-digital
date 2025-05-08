'use client';

import React, { useState, useEffect } from 'react';
import { Car } from '@/types/car';

interface SearchFormProps {
  onSearch: (results: Car[]) => void;
  cars: Car[];
}

export default function SearchForm({ onSearch, cars }: SearchFormProps) {
  const [nameFilter, setNameFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // Get unique brands and locations
  const brands = Array.from(new Set(cars.map(car => car.Name))).sort();
  const locations = Array.from(new Set(cars.map(car => car.Location))).sort();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      filterCars();
    }, 300);

    return () => clearTimeout(timer);
  }, [nameFilter, locationFilter, maxPriceFilter, selectedBrands]);

  const filterCars = () => {
    setIsFiltering(true);
    
    const filtered = cars.filter((car: Car) => {
      // Name/Model search
      const nameMatch = nameFilter === '' || 
        car.Name.toLowerCase().includes(nameFilter.toLowerCase()) ||
        car.Model.toLowerCase().includes(nameFilter.toLowerCase());

      // Location filter
      const locationMatch = locationFilter === '' || 
        car.Location.toLowerCase().includes(locationFilter.toLowerCase());

      // Price filter
      const priceMatch = maxPriceFilter === '' || 
        car.Price <= parseInt(maxPriceFilter);

      // Brand filter
      const brandMatch = selectedBrands.length === 0 || 
        selectedBrands.includes(car.Name);

      return nameMatch && locationMatch && priceMatch && brandMatch;
    });

    // Add highlighted text to results
    const highlightedResults = filtered.map(car => ({
      ...car,
      highlightedName: highlightText(car.Name, nameFilter),
      highlightedModel: highlightText(car.Model, nameFilter),
      highlightedLocation: highlightText(car.Location, locationFilter)
    }));

    onSearch(highlightedResults);
    setIsFiltering(false);
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="font-bold text-purple-300">$1</span>');
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setNameFilter('');
    setLocationFilter('');
    setMaxPriceFilter('');
    setSelectedBrands([]);
  };

  return (
    <div className="max-w-5xl mx-auto mb-16">
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 p-1 rounded-2xl">
        <div className="bg-gray-900/95 backdrop-blur-sm p-8 rounded-xl space-y-6">
          {/* Main Search Bar */}
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-4 pl-12 rounded-xl border-2 border-purple-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 transition-all bg-gray-800/80 text-white placeholder-gray-400 shadow-sm text-lg"
              placeholder="Busque por marca, modelo ou características..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Localização
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 transition-all bg-gray-800/80 text-white shadow-sm"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">Todas as localizações</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preço Máximo
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400">
                  R$
                </span>
                <input
                  type="number"
                  className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-purple-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 transition-all bg-gray-800/80 text-white placeholder-gray-400 shadow-sm"
                  placeholder="Ex: 100000"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Marcas
              </label>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleBrandToggle(brand)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedBrands.includes(brand)
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                        : 'bg-gray-800 text-purple-300 hover:bg-gray-700 border border-purple-800'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={clearFilters}
              className="px-6 py-2 rounded-lg text-purple-300 hover:bg-gray-800 transition-all"
            >
              Limpar Filtros
            </button>
            {isFiltering && (
              <div className="flex items-center text-purple-400">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Buscando...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 