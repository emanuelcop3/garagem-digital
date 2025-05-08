'use client';

import { Car } from '@/types/car';
import Image from 'next/image';
import { useState } from 'react';

interface CarDetailsProps {
  car: Car;
  onClose: () => void;
}

export default function CarDetails({ car, onClose }: CarDetailsProps) {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col relative animate-slideUp card-shadow">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-600 p-2 rounded-full hover:bg-white transition-colors z-20 shadow-lg hover:shadow-xl"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          {/* Image section with gradient overlay */}
          <div className="relative h-72 w-full bg-gradient-to-br from-gray-50 to-gray-100">
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <Image
                  src="/images/cars/placeholder-car.svg"
                  alt="Car placeholder"
                  fill
                  className="object-contain p-8"
                  priority={true}
                />
              </div>
            ) : (
              <>
                <Image
                  src={car.Image}
                  alt={`${car.Name} ${car.Model}`}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </>
            )}
            
            {/* Price tag */}
            <div className="absolute bottom-4 right-4 bg-gradient-custom text-white px-6 py-3 rounded-full text-xl font-bold shadow-lg">
              {formatPrice(car.Price)}
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-3xl font-bold text-gradient">
                  {car.Name} {car.Model}
                </h2>
                <div className="mt-2 flex items-center space-x-3">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-50 to-pink-50 text-indigo-600 shadow-sm">
                    {car.Location}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Descrição</h3>
                <p className="text-black leading-relaxed">
                  {car.Description || 'Descrição não disponível.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed contact button */}
        <div className="p-6 border-t border-gray-100">
          <button
            className="w-full bg-gradient-custom text-white py-4 px-6 rounded-xl hover-gradient transform hover:scale-[1.02] transition-all duration-200 font-medium text-lg shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2"
            onClick={() => window.open(`https://wa.me/?text=Olá, tenho interesse no ${car.Name} ${car.Model} por ${formatPrice(car.Price)}`, '_blank')}
          >
            Entrar em Contato
          </button>
        </div>
      </div>
    </div>
  );
} 