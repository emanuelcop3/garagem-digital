'use client';

import { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  'Quais carros estão disponíveis?',
  'Quero um carro até R$ 100.000',
  'Quais SUVs você recomenda?',
  'Tem carros em São Paulo?'
];

const SYSTEM_PROMPT = 'Você é um assistente virtual especializado em busca e comparação de carros. Seja objetivo, amigável e ajude o usuário a encontrar o carro ideal.';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: '🚗 Olá! Sou seu assistente de carros. O que você procura hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const resetChat = () => {
    setMessages([
      { from: 'bot', text: '🚗 Olá! Sou seu assistente de carros. O que você procura hoje?' }
    ]);
    setInput('');
  };

  const sendMessage = async (e?: React.FormEvent, suggestion?: string) => {
    if (e) e.preventDefault();
    const text = suggestion || input;
    if (!text.trim()) return;
    const userMessage = { from: 'user', text };
    setMessages([...messages, userMessage, { from: 'bot', text: 'Digitando...' }]);
    setInput('');
    setLoading(true);
    setTyping(true);
    try {
      // Limitar histórico a 10 trocas (20 mensagens)
      const history = messages.slice(-20);
      const deepseekMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map(m => m.from === 'user'
          ? { role: 'user', content: m.text }
          : { role: 'assistant', content: m.text }
        ),
        { role: 'user', content: text }
      ];
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-3c603754a4914c86bfcfd01f87f25506'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: deepseekMessages
        })
      });
      if (!response.ok) throw new Error('Erro na resposta da API');
      const data = await response.json();
      let botReply = data.choices?.[0]?.message?.content || 'Desculpe, não consegui responder agora.';
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs.slice(0, -1),
          { from: 'bot', text: botReply }
        ]);
        setTyping(false);
      }, 600 + Math.min(botReply.length * 15, 2000));
    } catch (err) {
      setMessages(msgs => [
        ...msgs.slice(0, -1),
        { from: 'bot', text: 'Ocorreu um erro ao conectar com a API. Tente novamente em instantes.' }
      ]);
      setTyping(false);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-[rgb(var(--secondary))] hover:bg-[rgb(var(--accent))] text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all duration-300 focus:outline-none"
        onClick={() => setOpen(o => !o)}
        aria-label="Abrir chatbot"
      >
        💬
      </button>

      {/* Janela do chatbot */}
      {open && (
        <div className="fixed bottom-28 right-6 z-50 w-80 max-w-[95vw] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp border border-gray-200">
          <div className="bg-gradient-custom p-4 text-white font-bold text-lg flex items-center justify-between">
            <span>Assistente Virtual</span>
            <div className="flex gap-2">
              <button onClick={resetChat} className="text-white text-base hover:opacity-70" title="Resetar conversa">⟳</button>
              <button onClick={() => setOpen(false)} className="text-white text-xl hover:opacity-70">×</button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto max-h-80 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-end gap-2">
                  {msg.from === 'bot' && (
                    <span className="w-7 h-7 rounded-full bg-[rgb(var(--secondary))] flex items-center justify-center text-white font-bold text-base">🤖</span>
                  )}
                  <div className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] ${msg.from === 'user' ? 'bg-[rgb(var(--secondary))] text-white' : 'bg-gray-200 text-gray-900'}`}>
                    {msg.text}
                  </div>
                  {msg.from === 'user' && (
                    <span className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-base">🧑</span>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="mb-2 flex justify-start">
                <div className="flex items-end gap-2">
                  <span className="w-7 h-7 rounded-full bg-[rgb(var(--secondary))] flex items-center justify-center text-white font-bold text-base">🤖</span>
                  <div className="px-4 py-2 rounded-2xl text-sm max-w-[80%] bg-gray-200 text-gray-900 animate-pulse">Digitando...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Sugestões rápidas */}
          {!loading && (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="bg-[rgb(var(--primary-light))] text-white text-xs px-3 py-1 rounded-full hover:bg-[rgb(var(--secondary))] transition-colors"
                  onClick={() => sendMessage(undefined, s)}
                  disabled={loading}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={sendMessage} className="flex border-t border-gray-200 bg-white">
            <input
              className="flex-1 p-3 text-sm outline-none bg-transparent"
              type="text"
              placeholder={loading ? 'Aguarde...' : 'Digite sua mensagem...'}
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
              disabled={loading}
            />
            <button
              type="submit"
              className={`px-4 font-bold transition-colors ${loading ? 'text-gray-400' : 'text-[rgb(var(--secondary))] hover:text-[rgb(var(--accent))]'}`}
              disabled={!input.trim() || loading}
            >
              {loading ? <span className="animate-spin inline-block">⏳</span> : '➤'}
            </button>
          </form>
        </div>
      )}
    </>
  );
} 