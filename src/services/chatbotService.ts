import { cars } from '../data/cars';
import { Car } from '../types/car';

export interface ChatbotResponse {
  message: string;
  cars?: typeof cars;
  suggestions?: string[];
}

export async function processMessage(message: string): Promise<ChatbotResponse> {
  const lowerMessage = message.toLowerCase();

  // Padrões para consulta de preço
  const pricePatterns = [
    /(?:carros|veículos|modelos) (?:até|abaixo de|menos de|com preço até|com valor até) (?:r\$|rs|r\s*\$)?\s*(\d+(?:\.\d{3})*(?:,\d{2})?)/i,
    /(?:quais|quais são|mostre|mostre-me|me mostre) (?:os|as) (?:carros|veículos|modelos) (?:até|abaixo de|menos de|com preço até|com valor até) (?:r\$|rs|r\s*\$)?\s*(\d+(?:\.\d{3})*(?:,\d{2})?)/i,
    /(?:carros|veículos|modelos) (?:com|de) (?:preço|valor) (?:até|máximo de|máximo) (?:r\$|rs|r\s*\$)?\s*(\d+(?:\.\d{3})*(?:,\d{2})?)/i,
    /(?:buscar|encontrar|procurar) (?:carros|veículos|modelos) (?:até|abaixo de|menos de|com preço até|com valor até) (?:r\$|rs|r\s*\$)?\s*(\d+(?:\.\d{3})*(?:,\d{2})?)/i
  ];

  // Padrões para consulta de localização
  const locationPatterns = [
    /(?:carros|veículos|modelos) (?:em|na|no) ([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)/i,
    /(?:quais|quais são|mostre|mostre-me|me mostre) (?:os|as) (?:carros|veículos|modelos) (?:em|na|no) ([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)/i,
    /(?:carros|veículos|modelos) (?:disponíveis|que tem|que existem) (?:em|na|no) ([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)/i,
    /(?:buscar|encontrar|procurar) (?:carros|veículos|modelos) (?:em|na|no) ([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)/i
  ];

  // Padrões para consulta de marca
  const brandPatterns = [
    /(?:carros|veículos|modelos) (?:da|de) ([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)/i,
    /(?:quais|quais são|mostre|mostre-me|me mostre) (?:os|as) (?:carros|veículos|modelos) (?:da|de) ([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)/i,
    /(?:carros|veículos|modelos) (?:da marca|da fabricante) ([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)/i
  ];

  // Padrões para carros mais baratos
  const cheapestPatterns = [
    /(?:carros|veículos|modelos) (?:mais baratos|com menor preço|com preço mais baixo)/i,
    /(?:quais|quais são|mostre|mostre-me|me mostre) (?:os|as) (?:carros|veículos|modelos) (?:mais baratos|com menor preço|com preço mais baixo)/i,
    /(?:buscar|encontrar|procurar) (?:carros|veículos|modelos) (?:mais baratos|com menor preço|com preço mais baixo)/i
  ];

  // Verificar padrões de preço
  for (const pattern of pricePatterns) {
    const match = message.match(pattern);
    if (match) {
      const priceStr = match[1].replace(/\./g, '').replace(',', '.');
      const maxPrice = parseFloat(priceStr);
      
      if (isNaN(maxPrice)) {
        return {
          message: "Desculpe, não consegui entender o valor informado. Por favor, tente novamente com um valor válido.",
          suggestions: ['Carros até R$ 50.000', 'Carros até R$ 100.000', 'Carros até R$ 150.000']
        };
      }

      const filteredCars = cars.filter(car => car.Price <= maxPrice);
      
      if (filteredCars.length === 0) {
        return {
          message: `Não encontrei carros com preço até R$ ${maxPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
          suggestions: ['Mostre os carros mais baratos', 'Carros até R$ 150.000', 'Carros até R$ 200.000']
        };
      }

      const cheapestCar = filteredCars.reduce((prev, current) => 
        prev.Price < current.Price ? prev : current
      );
      const mostExpensiveCar = filteredCars.reduce((prev, current) => 
        prev.Price > current.Price ? prev : current
      );

      const brands = Array.from(new Set(filteredCars.map(c => c.Name)));

      return {
        message: `Encontrei ${filteredCars.length} carros com preço até R$ ${maxPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}:\n\n` +
                `🚗 Mais barato: ${cheapestCar.Name} ${cheapestCar.Model} - R$ ${cheapestCar.Price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
                `💰 Mais caro: ${mostExpensiveCar.Name} ${mostExpensiveCar.Model} - R$ ${mostExpensiveCar.Price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n` +
                `Marcas disponíveis: ${brands.join(', ')}`,
        cars: filteredCars.slice(0, 5),
        suggestions: ['Mostre os carros mais baratos', 'Carros até R$ 150.000', 'Carros até R$ 200.000']
      };
    }
  }

  // Help command
  if (lowerMessage.includes('ajuda') || lowerMessage.includes('help')) {
    return {
      message: 'Posso ajudar você a encontrar carros! Você pode me perguntar sobre:\n' +
        '• Carros por marca\n' +
        '• Carros por preço\n' +
        '• Carros por localização\n' +
        '• Carros mais baratos\n' +
        '• Carros mais caros\n\n' +
        'Como posso ajudar?',
      suggestions: [
        'Mostre os carros mais baratos',
        'Quais carros tem em São Paulo?',
        'Carros da Toyota',
        'Carros até R$ 100.000'
      ]
    };
  }

  // Search by brand
  const brandMatch = lowerMessage.match(/(?:carros|veículos|modelos) (?:da|de) (?:marca )?([a-zA-Z]+)/i);
  if (brandMatch) {
    const brand = brandMatch[1];
    const filteredCars = cars.filter(car => 
      car.Name.toLowerCase().includes(brand.toLowerCase())
    );
    
    if (filteredCars.length > 0) {
      return {
        message: `Encontrei ${filteredCars.length} carro(s) da marca ${brand}:\n\n` +
                `O ${brand} ${filteredCars[0].Model} é o mais barato, custando R$ ${filteredCars[0].Price.toLocaleString()}.\n` +
                `O mais caro é o ${brand} ${filteredCars[filteredCars.length - 1].Model}, por R$ ${filteredCars[filteredCars.length - 1].Price.toLocaleString()}.`,
        cars: filteredCars,
        suggestions: [
          `Carros da ${brand} até R$ ${Math.min(...filteredCars.map(c => c.Price))}`,
          `Carros da ${brand} em ${filteredCars[0].Location}`,
          'Mostre os carros mais baratos',
          'Quais carros tem em São Paulo?'
        ]
      };
    }
    return {
      message: `Desculpe, não encontrei carros da marca ${brand}. Posso te ajudar a encontrar outras marcas disponíveis?`,
      suggestions: [
        'Mostre os carros mais baratos',
        'Quais carros tem em São Paulo?',
        'Carros da Toyota',
        'Carros até R$ 100.000'
      ]
    };
  }

  // Search by location - Improved pattern matching
  for (const pattern of locationPatterns) {
    const locationMatch = lowerMessage.match(pattern);
    if (locationMatch) {
      const location = locationMatch[1].trim();
      const filteredCars = cars.filter(car => 
        car.Location.toLowerCase().includes(location.toLowerCase())
      );
      
      if (filteredCars.length > 0) {
        const cheapestCar = filteredCars.reduce((a, b) => a.Price < b.Price ? a : b);
        const mostExpensiveCar = filteredCars.reduce((a, b) => a.Price > b.Price ? a : b);
        
        return {
          message: `Encontrei ${filteredCars.length} carro(s) em ${location}:\n\n` +
                  `O mais barato é o ${cheapestCar.Name} ${cheapestCar.Model} por R$ ${cheapestCar.Price.toLocaleString()}.\n` +
                  `O mais caro é o ${mostExpensiveCar.Name} ${mostExpensiveCar.Model} por R$ ${mostExpensiveCar.Price.toLocaleString()}.\n\n` +
                  `Marcas disponíveis: ${Array.from(new Set(filteredCars.map(c => c.Name))).join(', ')}.`,
          cars: filteredCars,
          suggestions: [
            `Carros da ${cheapestCar.Name}`,
            `Carros até R$ ${cheapestCar.Price}`,
            'Mostre os carros mais baratos',
            'Quais carros tem em São Paulo?'
          ]
        };
      }
      return {
        message: `Desculpe, não encontrei carros em ${location}. Temos carros disponíveis em: ${Array.from(new Set(cars.map(c => c.Location))).join(', ')}.`,
        suggestions: [
          'Quais carros tem em São Paulo?',
          'Mostre os carros mais baratos',
          'Carros da Toyota',
          'Carros até R$ 100.000'
        ]
      };
    }
  }

  // Cheapest cars
  if (lowerMessage.includes('mais barato') || lowerMessage.includes('mais econômico')) {
    const sortedCars = [...cars].sort((a, b) => a.Price - b.Price);
    const cheapestCars = sortedCars.slice(0, 3);
    
    return {
      message: 'Aqui estão os 3 carros mais baratos:\n\n' +
              `1. ${cheapestCars[0].Name} ${cheapestCars[0].Model} - R$ ${cheapestCars[0].Price.toLocaleString()}\n` +
              `2. ${cheapestCars[1].Name} ${cheapestCars[1].Model} - R$ ${cheapestCars[1].Price.toLocaleString()}\n` +
              `3. ${cheapestCars[2].Name} ${cheapestCars[2].Model} - R$ ${cheapestCars[2].Price.toLocaleString()}`,
      cars: cheapestCars,
      suggestions: [
        `Carros da ${cheapestCars[0].Name}`,
        `Carros em ${cheapestCars[0].Location}`,
        'Carros até R$ 100.000',
        'Quais carros tem em São Paulo?'
      ]
    };
  }

  // Most expensive cars
  if (lowerMessage.includes('mais caro') || lowerMessage.includes('mais luxuoso')) {
    const sortedCars = [...cars].sort((a, b) => b.Price - a.Price);
    const mostExpensiveCars = sortedCars.slice(0, 3);
    
    return {
      message: 'Aqui estão os 3 carros mais caros:\n\n' +
              `1. ${mostExpensiveCars[0].Name} ${mostExpensiveCars[0].Model} - R$ ${mostExpensiveCars[0].Price.toLocaleString()}\n` +
              `2. ${mostExpensiveCars[1].Name} ${mostExpensiveCars[1].Model} - R$ ${mostExpensiveCars[1].Price.toLocaleString()}\n` +
              `3. ${mostExpensiveCars[2].Name} ${mostExpensiveCars[2].Model} - R$ ${mostExpensiveCars[2].Price.toLocaleString()}`,
      cars: mostExpensiveCars,
      suggestions: [
        `Carros da ${mostExpensiveCars[0].Name}`,
        `Carros em ${mostExpensiveCars[0].Location}`,
        'Mostre os carros mais baratos',
        'Carros até R$ 100.000'
      ]
    };
  }

  // Default response
  return {
    message: 'Desculpe, não entendi sua pergunta. Você pode pedir ajuda digitando "ajuda" para ver as opções disponíveis.',
    suggestions: [
      'Mostre os carros mais baratos',
      'Quais carros tem em São Paulo?',
      'Carros da Toyota',
      'Carros até R$ 100.000'
    ]
  };
} 