# 💬 Chat em Tempo Real — Desafio ENTERness

Aplicação de **chat em tempo real** desenvolvida como desafio técnico, utilizando **WebSockets (Socket.IO)** no backend e **React + Vite** no frontend.
O sistema permite que usuários entrem em salas, troquem mensagens, enviem imagens, utilizem emojis e acompanhem entradas e saídas em tempo real.

---

## ✨ Funcionalidades

### 🧑‍🤝‍🧑 Usuários & Salas
- Login simples com nome do usuário
- Entrada em salas personalizadas ou sala padrão `#geral`
- Listagem de salas ativas com contador de usuários
- Troca dinâmica de salas

### 💬 Chat
- Envio de mensagens em tempo real
- Indicadores de entrada e saída de usuários
- Histórico de mensagens por sala
- Rolagem automática para a última mensagem
- Mensagens do próprio usuário destacadas

### 🖼️ Upload de Imagens
- Envio de imagens diretamente no chat
- Preview da imagem antes do envio
- Exibição da imagem na conversa
- Clique na imagem para abrir em nova aba e baixar

### 😀 Emojis
- Seletor de emojis integrado ao campo de mensagem
- Emojis inseridos diretamente no texto

### 🎨 UI & UX
- Layout responsivo e intuitivo
- Animações sutis (entrada de mensagens, status, transições)
- Feedback visual de envio e conexão
- Componentes padronizados com shadcn/ui
- Estilização com Tailwind CSS

### 🧪 Testes
- Testes unitários simples com Jest e React Testing Library
- Testes para login, envio de mensagens e renderização

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Socket.IO Client
- Jest + React Testing Library

### Backend
- NestJS
- Socket.IO
- TypeScript

---

## ▶️ Como Rodar o Projeto

### Backend
```bash
cd backend
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Rodando os Testes
```bash
npm test
```

---

## 🚀 Possíveis Evoluções
- Persistência em banco de dados
- Autenticação (JWT)
- Upload de imagens para cloud
- Indicador de usuário digitando
- Testes E2E

---

## 👨‍💻 Autor
Desenvolvido por **Gustavo Lima**
Desafio técnico — ENTERness
