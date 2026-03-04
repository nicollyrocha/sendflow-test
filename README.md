# SendFlow Test - Sistema SAAS de Mensageria

Sistema para gerenciamento de conexões, contatos e envio de mensagens agendadas.

## 🚀 Tecnologias

- **Frontend:** React + TypeScript + Vite
- **UI:** Material-UI + Tailwind CSS
- **Backend:** Firebase (Auth + Firestore)
- **Paradigma:** Funcional (sem OOP)

## 📁 Estrutura do Projeto

```
sendflow-test/
├── functions/           # Serviços e lógica de negócio
│   ├── auth.service.ts
│   ├── connections.service.ts
│   ├── contacts.service.ts
│   └── messages.service.ts
├── web/                 # Aplicação React
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── config/
│   │   └── types/
│   └── package.json
├── firestore.rules      # Regras de segurança do Firestore
└── package.json         # Workspace raiz
```

## 🔥 Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative **Authentication** (Email/Password)
3. Ative **Firestore Database**
4. Copie as credenciais para `web/src/config/firebase.ts`
5. Deploy das regras de segurança:
   ```bash
   firebase deploy --only firestore:rules
   ```

## 🛠️ Instalação

```bash
# Instalar todas as dependências (root + workspaces)
yarn install

# Executar o projeto
cd web
yarn dev
```

## 📋 Funcionalidades

### ✅ Autenticação

- Login e cadastro com Firebase Auth
- Rotas protegidas
- Isolamento de dados por usuário

### ✅ Conexões

- CRUD completo
- Tipos: WhatsApp, Telegram, Email, SMS
- Ícones coloridos por tipo
- Não permite duplicar tipo de conexão
- Tempo real (Firestore onSnapshot)

### ✅ Contatos

- CRUD completo
- Campos: nome e telefone
- Tempo real (Firestore onSnapshot)

### ✅ Mensagens

- Envio para múltiplos contatos
- Agendamento de mensagens
- Mudança automática de status (scheduled → sent) -- está no front pois o Firebase só aceita cloud functions se colocar cartão de crédito
- Processamento a cada 60 segundos
- Filtros: Enviadas e Agendadas
- Validação de data/hora mínima (não permite agendar no passado)
- Tempo real (Firestore onSnapshot)

## 🔐 Segurança

- **SAAS:** Cada usuário acessa apenas seus dados
- **Firestore Rules:** Validação no banco de dados
- **Authentication:** Todas as rotas protegidas
- **Queries filtradas:** `where("userId", "==", request.auth.uid)`

## 🌟 Boas Práticas

- ✅ Código limpo e bem estruturado
- ✅ Paradigma funcional
- ✅ TypeScript com tipagem forte
- ✅ Componentes reutilizáveis
- ✅ Hooks customizados
- ✅ Separação de responsabilidades
- ✅ Tempo real em todas as features
- ✅ Sem subcoleções no Firestore

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev

# Build para produção
yarn build

# Preview do build
yarn preview

# Lint
yarn lint
```

## 🎨 Design Pattern

- **Serviços:** Lógica de acesso ao Firebase isolada em `functions/`
- **Hooks:** Gerenciamento de estado e side effects
- **Componentes:** UI reutilizáveis com props tipadas
- **Config:** Configurações centralizadas (Firebase, Theme, Connections)
