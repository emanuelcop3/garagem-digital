'use client';

import { useState } from 'react';
import { Car, CarSearchParams } from '@/types/car';
import { searchCars, getSimilarCars } from '@/services/carService';
import CarCard from '@/components/CarCard';
import SearchForm from '@/components/SearchForm';
import cars from '@/data/cars.json';

export default function Home() {
  const [searchResults, setSearchResults] = useState<Car[]>([]);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<CarSearchParams>({});
  const [nameFilter, setNameFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');

  const handleSearch = async (params: CarSearchParams) => {
    setIsLoading(true);
    setSearchParams(params);
    
    try {
      const results = searchCars(params);
      setSearchResults(results);
      
      if (results.length === 0 && params.name) {
        // If no exact matches, show similar cars
        const similar = getSimilarCars({ Name: params.name } as Car);
        setSimilarCars(similar);
      } else {
        setSimilarCars([]);
      }
    } catch (error) {
      console.error('Error searching cars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCars = cars.filter((car: Car) => {
    const matchesName = car.Name.toLowerCase().includes(nameFilter.toLowerCase()) ||
                       car.Model.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesLocation = locationFilter === '' || car.Location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesPrice = maxPriceFilter === '' || car.Price <= parseInt(maxPriceFilter);
    return matchesName && matchesLocation && matchesPrice;
  });

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gradient">
          Encontre seu próximo carro
        </h1>
        <p className="text-lg text-[rgb(var(--text-secondary))] max-w-2xl mx-auto">
          Explore nossa seleção de carros premium e encontre o veículo perfeito para você
        </p>
      </div>

      {/* Search Form */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="bg-surface p-8 rounded-2xl card-shadow space-y-6 md:space-y-0 md:flex md:gap-8">
          <div className="flex-1">
            <label htmlFor="name" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Nome do Carro
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 rounded-xl border-2 border-surface-lighter focus:border-[rgb(var(--primary))] focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-opacity-20 transition-all bg-surface-light"
              placeholder="Ex: Corolla, Civic..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label htmlFor="location" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Localização
            </label>
            <input
              type="text"
              id="location"
              className="w-full px-4 py-3 rounded-xl border-2 border-surface-lighter focus:border-[rgb(var(--primary))] focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-opacity-20 transition-all bg-surface-light"
              placeholder="Ex: São Paulo, Rio..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label htmlFor="price" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Preço Máximo (R$)
            </label>
            <input
              type="number"
              id="price"
              className="w-full px-4 py-3 rounded-xl border-2 border-surface-lighter focus:border-[rgb(var(--primary))] focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-opacity-20 transition-all bg-surface-light"
              placeholder="Ex: 100000"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-xl font-semibold text-[rgb(var(--text-primary))]">
          {filteredCars.length} {filteredCars.length === 1 ? 'carro encontrado' : 'carros encontrados'}
        </h2>
      </div>

      {/* Cars grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car: Car) => (
            <CarCard key={`${car.Name}-${car.Model}`} car={car} />
          ))}
        </div>
      </div>
    </main>
  );
} 