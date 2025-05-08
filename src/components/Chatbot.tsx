'use client';

import React, { useState, useRef, useEffect } from 'react';
import { processMessage } from '@/services/chatbotService';
import { Car } from '../data/cars';

const SUGGESTIONS = [
  'Mostre os carros mais baratos',
  'Quais carros tem em São Paulo?',
  'Carros da Toyota',
  'Carros até R$ 100.000'
];

const SYSTEM_PROMPT = 'Você é um assistente virtual especializado em busca e comparação de carros. Seja objetivo, amigável e ajude o usuário a encontrar o carro ideal.';

interface Message {
  text: string;
  isUser: boolean;
  cars?: Car[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Olá! Sou o assistente virtual da Garagem Digital. Como posso ajudar você hoje?",
      isUser: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>(SUGGESTIONS);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsTyping(true);

    try {
      const response = await processMessage(userMessage);
      setMessages(prev => [...prev, { text: response.message, isUser: false, cars: response.cars }]);
      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.", 
        isUser: false 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-gray-900 rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden border border-purple-800">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 p-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Assistente Virtual</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-purple-300 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900 to-gray-800">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.isUser
                      ? 'bg-gradient-to-r from-indigo-900 to-purple-900 text-white'
                      : 'bg-gray-800 text-gray-200 shadow-md border border-purple-800'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  
                  {message.cars && (
                    <div className="mt-3 space-y-2">
                      {message.cars.map((car, carIndex) => (
                        <div
                          key={carIndex}
                          className="bg-gray-900 text-gray-200 rounded p-2 shadow-sm border border-purple-800"
                        >
                          <p className="font-semibold">{car.Name} {car.Model}</p>
                          <p className="text-sm">Preço: R$ {car.Price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          <p className="text-sm">Localização: {car.Location}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-200 rounded-2xl p-3 shadow-md border border-purple-800">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div className="p-4 bg-gray-900 border-t border-purple-800">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-sm bg-gray-800 text-purple-300 px-3 py-1 rounded-full hover:bg-gray-700 transition-colors border border-purple-800"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-gray-900 border-t border-purple-800">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2 rounded-xl border-2 border-purple-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 transition-all bg-gray-800 text-white placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 