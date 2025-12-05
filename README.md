# Planning Poker Frontend

Frontend em React + Vite + TypeScript para o sistema de Planning Poker.

## 🚀 Funcionalidades

- ✅ Criar salas de Planning Poker
- ✅ Entrar em salas via link compartilhado
- ✅ Adicionar atividades para estimar
- ✅ Sistema de votação em tempo real com Socket.io
- ✅ Cartas Fibonacci (1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?)
- ✅ Revelação de resultados
- ✅ Interface moderna e responsiva

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend do Planning Poker rodando (veja `../planning-poker-backend`)

## 🛠️ Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente (opcional):
```bash
cp .env.example .env
```

Edite o arquivo `.env` se necessário:
```
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

## 🏃 Execução

### Modo Desenvolvimento
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### Build para Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ActivityList.tsx
│   ├── CreateActivityModal.tsx
│   ├── UserList.tsx
│   └── VotingArea.tsx
├── pages/              # Páginas principais
│   ├── Home.tsx
│   └── Room.tsx
├── services/           # Serviços de API e Socket
│   ├── api.ts
│   └── socket.ts
├── types/              # Definições TypeScript
│   └── index.ts
├── App.tsx            # Componente principal
└── main.tsx           # Entry point
```

## 🔌 Integração com Backend

O frontend se conecta ao backend através de:

1. **API REST** (`/api/rooms`):
   - Criar salas
   - Obter informações da sala

2. **Socket.io**:
   - Entrar em salas
   - Criar atividades
   - Iniciar votação
   - Votar
   - Revelar resultados
   - Sincronização em tempo real

## 🎨 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router** - Roteamento
- **Socket.io Client** - Comunicação em tempo real
- **Axios** - Cliente HTTP

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa o linter

## 🔗 Links Úteis

- [Documentação do Backend](../planning-poker-backend/README.md)
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Socket.io](https://socket.io)

