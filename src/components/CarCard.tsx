'use client';

import { useState } from 'react';
import { Car } from '@/types/car';
import Image from 'next/image';
import CarDetails from './CarDetails';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <>
      <div className="group bg-surface rounded-2xl card-shadow overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        
        {/* Image container */}
        <div className="relative h-56 w-full bg-surface-lighter overflow-hidden">
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-light to-surface-lighter">
              <svg
                className="w-16 h-16 text-gray-400 transform -rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                />
              </svg>
            </div>
          ) : (
            <Image
              src={car.Image}
              alt={`${car.Name} ${car.Model}`}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
              priority={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={75}
            />
          )}
          
          {/* Price tag */}
          <div className="absolute top-4 right-4 bg-gradient-custom text-white px-4 py-2 rounded-full font-bold shadow-lg z-20">
            {formatPrice(car.Price)}
          </div>
        </div>
        
        <div className="p-6 relative z-20">
          {/* Title and badges */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-[rgb(var(--text-primary))] group-hover:text-gradient transition-all duration-300">
              {car.Name} {car.Model}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-surface-lighter text-[rgb(var(--primary))]">
                {car.Location}
              </span>
            </div>
          </div>
          
          {/* Description */}
          <p className="mt-3 text-[rgb(var(--text-secondary))] text-sm line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {car.Description}
          </p>
          
          {/* Action buttons */}
          <div className="mt-6 flex space-x-3">
            <button 
              onClick={() => setShowDetails(true)}
              className="flex-1 bg-gradient-custom text-white py-3 px-4 rounded-xl hover-gradient transform hover:scale-[1.02] transition-all duration-200 font-medium shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>

      {showDetails && (
        <CarDetails car={car} onClose={() => setShowDetails(false)} />
      )}
    </>
  );
} 