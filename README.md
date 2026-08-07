# 🐾 PetHub - Pet Shop Ecommerce

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-FFCA28?logo=firebase)](https://firebase.google.com/)

> Uma plataforma moderna e intuitiva de e-commerce especializada em Pet Shops. Sistema completo de vendas online com carrinho de compras, autenticação de usuários e vitrine de produtos. ✨

---

## 📋 Visão Geral

**PetHub** é um sistema de comércio eletrônico desenvolvido com as melhores práticas modernas, oferecendo uma experiência completa para lojistas de Pet Shops venderem seus produtos online. O projeto fornece:

- 🛍️ **Carrinho de Compras** - Gerenciamento completo de itens
- 👤 **Sistema de Credenciais** - Autenticação e perfil de usuários
- 📦 **Vitrine de Produtos** - Catálogo organizado e responsivo
- 💳 **Interface Moderna** - Design limpo e profissional
- ⚡ **Desempenho** - Aplicação rápida e otimizada
- 🔒 **Segurança** - Integração segura com Firebase

> **Nota:** Sistema de pagamento será implementado em futuras versões.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **[React 18+](https://react.dev/)** - Biblioteca de interface de usuário
- **[TypeScript 5.0+](https://www.typescriptlang.org/)** - Tipagem estática e segurança de tipos
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário para styling
- **[Vite](https://vitejs.dev/)** - Build tool moderno e rápido

### Backend & Banco de Dados
- **[Firebase Realtime Database](https://firebase.google.com/docs/database)** - Banco de dados em tempo real
- **[Firebase Authentication](https://firebase.google.com/docs/auth)** - Autenticação de usuários
- **[Firebase Hosting](https://firebase.google.com/docs/hosting)** - Deploy da aplicação (opcional)

---

## 🚀 Primeiros Passos

### Pré-requisitos

- **Node.js** (v18.0.0 ou superior)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Conta Firebase** com projeto configurado

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/ParreirasJuniorWeb/PetHub.git
   cd PetHub
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente:**
   
   Crie um arquivo `.env.local` na raiz do projeto:
   ```env
   VITE_FIREBASE_API_KEY=seu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
   VITE_FIREBASE_PROJECT_ID=seu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
   VITE_FIREBASE_APP_ID=seu_app_id
   VITE_FIREBASE_DATABASE_URL=seu_database_url
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse a aplicação:**
   ```
   http://localhost:5173
   ```

---

## 📁 Estrutura do Projeto

```
PetHub/
├── src/
│   ├── components/       # Componentes React reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   ├── styles/          # Estilos globais
│   ├── config/          # Configurações (Firebase, etc)
│   ├── hooks/           # Custom hooks
│   ├── types/           # Tipos TypeScript
│   ├── services/        # Serviços (API, Firebase)
│   └── App.tsx          # Componente raiz
├── public/              # Assets estáticos
├── .env.local           # Variáveis de ambiente (não versionado)
├── tailwind.config.js   # Configuração Tailwind CSS
├── tsconfig.json        # Configuração TypeScript
├── vite.config.ts       # Configuração Vite
└── package.json         # Dependências do projeto
```

---

## 💡 Funcionalidades Principais

### 🏪 Vitrine de Produtos
- Catálogo completo de produtos
- Filtros e busca avançada
- Detalhes produtos com imagens
- Avaliações e comentários (planejado)

### 🛒 Carrinho de Compras
- Adicionar/remover produtos
- Atualizar quantidades
- Cálculo automático de totais
- Persistência de dados

### 👥 Sistema de Usuários
- Registro e login com Firebase Auth
- Perfil do usuário
- Histórico de pedidos
- Endereços salvos

### 📱 Design Responsivo
- Interface adaptada para mobile, tablet e desktop
- Navegação intuitiva com Tailwind CSS
- Otimizado para performance

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build otimizado para produção
npm run preview      # Visualiza build local

# Linting
npm run lint         # Verifica erros de código (se configurado)

# Type Checking
npm run type-check   # Valida tipos TypeScript (se configurado)
```

---

## 📚 Guia de Desenvolvimento

### Padrões de Código

- **Componentes**: Use componentes funcionais com hooks
- **Tipagem**: Todo componente e função deve ter tipos TypeScript explícitos
- **Estilo**: Use classes Tailwind CSS para estilização
- **Nomeação**: Use camelCase para variáveis e funções, PascalCase para componentes
- **Pastas**: Mantenha componentes, páginas e serviços organizados em suas respectivas pastas

### Exemplo de Componente

```typescript
import React from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  onAddToCart: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  onAddToCart,
}) => {
  return (
    <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition">
      <img src={image} alt={name} className="w-full h-48 object-cover rounded" />
      <h3 className="mt-2 text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">R$ {price.toFixed(2)}</p>
      <button
        onClick={() => onAddToCart(id)}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
};
```

---

## 🔐 Segurança

- ✅ Variáveis sensíveis em `.env.local` (não versionadas)
- ✅ Regras de segurança Firebase configuradas no console
- ✅ Validação de tipos com TypeScript
- ✅ Autenticação segura via Firebase Auth
- ✅ Dados persistidos no Firebase Realtime Database
- 🔄 Criptografia de dados sensíveis (planejado)

---

## 🚧 Roadmap

- [x] Estrutura base com React + TypeScript
- [x] Integração Firebase
- [x] Autenticação de usuários
- [x] Carrinho de compras
- [x] Vitrine de produtos
- [x] Perfil do usuário
- [x] Sistema de pagamento (Stripe/PayPal)
- [ ] Avaliações e comentários
- [ ] Notificações por email
- [ ] Dashboard administrativo
- [ ] Relatórios de vendas
- [ ] App mobile (React Native)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. **Faça um fork** do repositório
2. **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

### Diretrizes
- Siga o padrão de código do projeto
- Mantenha a compatibilidade TypeScript
- Atualize a documentação conforme necessário
- Use componentes reutilizáveis

---

## 🤖 Desenvolvimento Assistido por IA

Durante o desenvolvimento deste projeto utilizei ferramentas de Inteligência Artificial como apoio em atividades específicas, tais como:

- brainstorming de soluções
- revisão de código
- geração de testes
- documentação
- sugestões de refatoração

Toda a arquitetura da aplicação, definição das regras de negócio, integração entre serviços, revisão do código e validação dos resultados foram realizadas por mim.

A IA foi utilizada como ferramenta de produtividade, e não como substituta das decisões de engenharia.

Fui responsável por:

✅ definição dos requisitos

✅ modelagem da aplicação

✅ organização da arquitetura

✅ integração entre Firebase e Stripe

✅ implementação dos fluxos

✅ validação das regras de negócio

✅ depuração dos erros

✅ revisão de todo o código antes do deploy

Acredito que IA é uma excelente ferramenta de produtividade, mas não substitui conhecimento técnico, senso crítico e responsabilidade na construção de software.

---

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## Filosofia de desenvolvimento

> Este projeto foi desenvolvido utilizando ferramentas modernas de engenharia de software, incluindo Inteligência Artificial como apoio para brainstorming, revisão de código, documentação e testes.

> Todas as decisões relacionadas à arquitetura, implementação, regras de negócio, integração entre serviços, validação e publicação da aplicação foram conduzidas por mim.

### filosofia pessoal

> Acredito que Inteligência Artificial é uma excelente ferramenta de produtividade para desenvolvimento de software, mas considero que compreender o problema, tomar decisões técnicas, validar regras de negócio e garantir a qualidade da solução continuam sendo responsabilidades do desenvolvedor.

---

## 📧 Contato & Suporte

- **Autor:** [ParreirasJuniorWeb](https://github.com/ParreirasJuniorWeb)
- **Issues:** [GitHub Issues](https://github.com/ParreirasJuniorWeb/PetHub/issues)
- **Repositório:** [github.com/ParreirasJuniorWeb/PetHub](https://github.com/ParreirasJuniorWeb/PetHub)

---

## 🙏 Agradecimentos

- [React](https://react.dev/) - Pela excelente biblioteca
- [Tailwind CSS](https://tailwindcss.com/) - Pelo framework CSS moderno
- [Firebase](https://firebase.google.com/) - Pela plataforma de backend completa
- [TypeScript](https://www.typescriptlang.org/) - Pela segurança de tipos
- [Vite](https://vitejs.dev/) - Pelo excelente build tool

---

<div align="center">

**Desenvolvido com ❤️ para a comunidade Pet Shop** 🐾

⭐ Se este projeto foi útil, considere dar uma estrela! ⭐

</div>
