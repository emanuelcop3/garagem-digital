import { Car, CarSearchParams } from '@/types/car';
import carData from '@/data/cars.json';

export const searchCars = (params: CarSearchParams): Car[] => {
  let results = carData;

  if (params.name) {
    const searchTerm = params.name.toLowerCase();
    results = results.filter(car => 
      car.Name.toLowerCase().includes(searchTerm) ||
      car.Model.toLowerCase().includes(searchTerm) ||
      car.Description.toLowerCase().includes(searchTerm)
    );
  }

  if (params.location) {
    const locationTerm = params.location.toLowerCase();
    results = results.filter(car => 
      car.Location.toLowerCase().includes(locationTerm)
    );
  }

  if (params.maxPrice) {
    results = results.filter(car => car.Price <= params.maxPrice!);
  }

  return results;
};

export const getSimilarCars = (car: Car, maxResults: number = 3): Car[] => {
  const similarCars = carData
    .filter(c => c.Name !== car.Name)
    .map(c => ({
      car: c,
      score: calculateSimilarityScore(c, car)
    }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.car)
    .slice(0, maxResults);

  return similarCars;
};

const calculateSimilarityScore = (car1: Car, car2: Car): number => {
  let score = 0;
  
  // Preço similar (dentro de 20%)
  const priceDiff = Math.abs(car1.Price - car2.Price);
  const maxPriceDiff = car2.Price * 0.2;
  if (priceDiff <= maxPriceDiff) {
    score += 3;
  }
  
  // Mesma localização
  if (car1.Location === car2.Location) {
    score += 2;
  }
  
  // Mesmo tipo de carro (baseado na descrição)
  const car1Type = getCarType(car1.Description);
  const car2Type = getCarType(car2.Description);
  if (car1Type === car2Type) {
    score += 1;
  }
  
  return score;
};

const getCarType = (description: string): string => {
  if (description.toLowerCase().includes('suv')) return 'suv';
  if (description.toLowerCase().includes('hatch')) return 'hatch';
  if (description.toLowerCase().includes('sedã')) return 'sedan';
  if (description.toLowerCase().includes('elétrico')) return 'electric';
  return 'other';
}; 