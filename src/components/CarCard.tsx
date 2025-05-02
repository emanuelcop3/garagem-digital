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
          <div className="absolute inset-0 flex items-center justify-center">
            {imageError && (
              <Image
                src="/images/cars/placeholder-car.svg"
                alt="Car placeholder"
                fill
                className="object-contain p-8"
                priority={true}
              />
            )}
          </div>
          {!imageError && (
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[rgb(var(--accent))] text-gray-900 shadow-md">
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