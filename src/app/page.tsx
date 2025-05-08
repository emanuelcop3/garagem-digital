'use client';

import { useState } from 'react';
import { Car } from '@/types/car';
import CarCard from '@/components/CarCard';
import SearchForm from '@/components/SearchForm';
import cars from '@/data/cars.json';
import Chatbot from '../components/Chatbot';

export default function Home() {
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Logo no topo */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center">
          <span className="inline-block text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--secondary))] via-[rgb(var(--accent))] to-[rgb(var(--primary))] animate-gradient">
            Garagem Digital + Klubi Consórcio
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient">
            Encontre seu próximo carro
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Explore nossa seleção de carros premium e encontre o veículo perfeito para você
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Search Form */}
      <SearchForm onSearch={setFilteredCars} cars={cars} />

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

      {/* Chatbot */}
      <Chatbot />
    </main>
  );
} 