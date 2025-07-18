# VIVABEM-SAAS

> *Empowering Seamless Growth Through Innovation and Trust*

<div align="center">

![Last Commit](https://img.shields.io/github/last-commit/LucasaaOrse/VivaBem-Saas?style=flat&logo=git&logoColor=white&color=0080ff)
![Top Language](https://img.shields.io/github/languages/top/LucasaaOrse/VivaBem-Saas?style=flat&color=0080ff)
![Language Count](https://img.shields.io/github/languages/count/LucasaaOrse/VivaBem-Saas?style=flat&color=0080ff)

---

### ⚙️ Built with:

![JSON](https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white)
![Markdown](https://img.shields.io/badge/Markdown-000000.svg?style=flat&logo=Markdown&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000.svg?style=flat&logo=Resend&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-2D3748.svg?style=flat&logo=Prisma&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1.svg?style=flat&logo=Zod&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5.svg?style=flat&logo=Cloudinary&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF.svg?style=flat&logo=Stripe&logoColor=white)
![date-fns](https://img.shields.io/badge/date-fns-770C56.svg?style=flat&logo=date-fns&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990.svg?style=flat&logo=React-Hook-Form&logoColor=white)

</div>

---

## 📚 Tabela de Conteúdos

- [📌 Visão Geral](#visão-geral)
- [🚀 Começando](#começando)
  - [🔧 Pré-requisitos](#pré-requisitos)
  - [📦 Instalação](#instalação)
  - [🧪 Uso](#uso)
  - [🧪 Testes](#testes)

---

## 📌 Visão Geral

**VivaBem-Saas** é um um projeto de Sass de Clinicas e consultas.

### ✨ Funcionalidades principais:

- 🧩 **Componentes UI modulares:** Baseados em Radix UI, acessíveis e consistentes.
- 🔐 **Autenticação com NextAuth:** Suporte a múltiplos provedores com gerenciamento de sessões.
- 💳 **Stripe Billing:** Cobrança integrada e gerenciamento de assinaturas.
- 🗃️ **Banco com Prisma:** Interações eficientes com banco para usuários, serviços, notificações e agendamentos.
- 📊 **Exportação de relatórios:** Geração de relatórios em Excel e PDF.
- 📅 **Sistema de Agendamento:** Criação e gerenciamento de compromissos em tempo real.

---

## 🚀 Começando

### 🔧 Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/)
- Banco de dados PostgreSQL (ou compatível)

### 📦 Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/LucasaaOrse/VivaBem-Saas
cd VivaBem-Saas
npm install

```
Gere o Prisma Client:

```bash

npx prisma generate

````

Rode as migrations e atualize o banco de dados:
````bash
npx prisma migrate dev

````

▶️ Uso

````bash
npm run dev



