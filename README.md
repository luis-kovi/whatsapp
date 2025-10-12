# 📱 WhatsApp Manager - Sistema de Gestão de Atendimentos

Sistema completo de gestão de atendimentos via WhatsApp com distribuição inteligente, filas, tags e relatórios.

## 🚀 Tecnologias

### Backend
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- Socket.io (Real-time)
- JWT Authentication
- Baileys (WhatsApp Integration)

### Frontend
- Next.js 14 + TypeScript
- TailwindCSS
- Zustand (State Management)
- Socket.io Client
- Lucide Icons

## 📋 Funcionalidades Implementadas

### ✅ Fase 1 - MVP
- [x] Sistema de autenticação (Login/Logout)
- [x] Gestão de usuários (CRUD completo)
- [x] Gestão de filas de atendimento
- [x] Listagem de tickets/conversas
- [x] Chat funcional (enviar/receber mensagens)
- [x] Aceitar e finalizar atendimentos
- [x] Dashboard com métricas em tempo real
- [x] Sistema de tags
- [x] Gestão de contatos
- [x] Respostas rápidas
- [x] Transferência de tickets
- [x] Notificações em tempo real (Socket.io)

### 🔄 Fase 2 - Em Desenvolvimento
- [x] Integração WhatsApp via Baileys (QR Code) ✅
- [ ] Chatbot com fluxos configuráveis
- [ ] Relatórios avançados
- [ ] Pesquisa de satisfação
- [ ] Automações
- [ ] Upload de mídias

## 🛠️ Instalação

### Pré-requisitos
- Node.js 20+
- Docker e Docker Compose
- Git

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd whatsapp
```

2. **Configure as variáveis de ambiente**

Backend:
```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário.

3. **Inicie os serviços com Docker**
```bash
docker-compose up -d
```

4. **Execute as migrations do banco**
```bash
cd backend
npm run prisma:migrate
npm run prisma:seed
```

5. **Acesse a aplicação**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Credenciais Padrão
- **Email:** admin@whatsapp.com
- **Senha:** admin123

## 📁 Estrutura do Projeto

```
whatsapp/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Schema do banco de dados
│   │   └── seed.ts            # Dados iniciais
│   ├── src/
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── routes/            # Rotas da API
│   │   ├── services/          # Serviços (Socket, WhatsApp)
│   │   ├── middlewares/       # Auth, Error handling
│   │   └── server.ts          # Servidor principal
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/               # Páginas Next.js
│   │   ├── components/        # Componentes React
│   │   ├── lib/               # Utilitários (API client)
│   │   └── store/             # Zustand stores
│   └── package.json
└── docker-compose.yml
```

## 🔐 Permissões de Usuário

### ADMIN
- Acesso total ao sistema
- Gerenciar usuários, filas, configurações
- Visualizar todos os atendimentos

### SUPERVISOR
- Visualizar todos os atendimentos
- Acessar relatórios
- Não pode editar configurações

### AGENT (Atendente)
- Acesso apenas aos seus atendimentos
- Aceitar, transferir e finalizar tickets
- Enviar mensagens

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Dados do usuário logado

### Usuários
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário (Admin)
- `PUT /api/users/:id` - Atualizar usuário (Admin)
- `DELETE /api/users/:id` - Desativar usuário (Admin)

### Tickets
- `GET /api/tickets` - Listar tickets
- `GET /api/tickets/:id` - Detalhes do ticket
- `PUT /api/tickets/:id/accept` - Aceitar ticket
- `PUT /api/tickets/:id/close` - Finalizar ticket
- `PUT /api/tickets/:id/transfer` - Transferir ticket

### Mensagens
- `POST /api/messages` - Enviar mensagem

### Filas
- `GET /api/queues` - Listar filas
- `POST /api/queues` - Criar fila (Admin)
- `PUT /api/queues/:id` - Atualizar fila (Admin)
- `DELETE /api/queues/:id` - Excluir fila (Admin)

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas gerais

## 🔄 Real-time Events (Socket.io)

### Eventos do Cliente
- `join-room` - Entrar em sala do usuário

### Eventos do Servidor
- `ticket:new` - Novo ticket criado
- `ticket:update` - Ticket atualizado
- `ticket:transfer` - Ticket transferido
- `message:new` - Nova mensagem

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📦 Build para Produção

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 🐳 Docker

### Desenvolvimento
```bash
docker-compose up
```

### Produção
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configurações Avançadas

### Variáveis de Ambiente

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/whatsapp
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=3001
NODE_ENV=production
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## 📝 Roadmap

### Próximas Funcionalidades
- [ ] Integração completa WhatsApp com QR Code
- [ ] Chatbot visual builder
- [ ] Campanhas de mensagens em massa
- [ ] Relatórios exportáveis (PDF/Excel)
- [ ] Multi-idioma (i18n)
- [ ] Modo escuro
- [ ] Notificações push
- [ ] Integração com CRM
- [ ] API pública com documentação Swagger
- [ ] Testes automatizados completos

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato.

---

**Desenvolvido com ❤️ para gestão eficiente de atendimentos WhatsApp**
