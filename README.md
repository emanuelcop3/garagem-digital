# Garagem Digital

Uma aplicação web moderna para busca e comparação de veículos, desenvolvida com Next.js 14, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router e Server Components
- **TypeScript** - Tipagem estática e melhor DX
- **Tailwind CSS** - Framework CSS utilitário
- **React** - Biblioteca UI
- **ESLint** - Linting e formatação de código
- **Prettier** - Formatador de código

## 🛠️ Arquitetura

```
src/
├── app/                 # App Router e páginas
├── components/          # Componentes React reutilizáveis
├── data/               # Dados estáticos e interfaces
├── services/           # Serviços e lógica de negócio
└── types/              # Definições de tipos TypeScript
```

## 🔍 Funcionalidades

### Busca Avançada
- Filtros por marca, modelo e características
- Busca por localização
- Filtro por faixa de preço
- Seleção múltipla de marcas
- Debounce de 300ms para otimização de performance

### Chatbot Inteligente
- Processamento de linguagem natural
- Reconhecimento de padrões para:
  - Consultas de preço
  - Busca por localização
  - Filtros por marca
  - Carros mais baratos/caros
- Sugestões contextuais
- Interface responsiva e moderna

### UI/UX
- Design system consistente
- Tema escuro moderno
- Gradientes e efeitos visuais
- Animações suaves
- Layout responsivo
- Feedback visual em tempo real

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/garagem-digital.git
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

4. Acesse `http://localhost:3000`

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter
- `npm run format` - Formata o código com Prettier

## 🧪 Padrões de Código

- ESLint para linting
- Prettier para formatação
- TypeScript para tipagem estática
- Componentes funcionais com hooks
- Props tipadas com interfaces
- Nomenclatura consistente

## 🔄 Fluxo de Dados

1. **Busca**
   - Input do usuário → Debounce → Filtragem → Renderização
   - Cache de resultados para otimização

2. **Chatbot**
   - Input do usuário → Processamento NLP → Resposta → UI
   - Sugestões contextuais baseadas no histórico

## 🎨 Design System

### Cores
- Gradientes: `from-indigo-900 via-purple-900 to-pink-900`
- Fundo: `bg-gray-900`
- Texto: `text-gray-200`
- Destaque: `text-purple-300`

### Componentes
- Cards com bordas e sombras
- Inputs com estados de foco
- Botões com gradientes
- Animações de transição

## 📱 Responsividade

- Mobile-first approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

## 🔒 Segurança

- Validação de inputs
- Sanitização de dados
- Proteção contra XSS
- Rate limiting

## 📈 Performance

- Lazy loading de componentes
- Otimização de imagens
- Debounce em buscas
- Cache de resultados
- Server-side rendering

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Seu Nome - [@seu-usuario](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- Next.js Team
- Tailwind CSS
- React Community
