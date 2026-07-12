# Relatório Técnico — Correções de Bugs, Performance e Segurança (PetHub)

**Projeto:** PetHub  
**Data:** 2026-07-12  
**Escopo:** análise e correções em autenticação, rotas protegidas, serviço Firebase e robustez de dados.

---

## 1) Objetivo

Realizar uma varredura técnica no código-fonte para identificar e corrigir problemas que possam impactar:

- **Segurança** (acesso indevido, configuração sensível exposta),
- **Performance/estabilidade** (efeitos colaterais durante render),
- **Confiabilidade de dados** (inconsistências de coleção e tipos de data no Firestore).

---

## 2) Arquivos analisados

- `src/pages/Profile/Profile.tsx`
- `src/components/common/PrivateRoute.tsx`
- `src/routes/routes.tsx`
- `src/services/firebase.ts`
- `src/contexts/AuthContext.tsx`
- `src/contexts/AuthContextDefinition.ts`
- `src/contexts/useAuth.ts`
- `src/services/stripe.ts`
- `TODO.md`

---

## 3) Problemas encontrados e correções aplicadas

### 3.1 Import incorreto de hook de autenticação (bug funcional)

**Arquivo:** `src/pages/Profile/Profile.tsx`

**Problema:** uso de import incompatível para `useAuth` (default import de caminho inadequado), podendo causar erro em runtime/compilação dependendo da resolução dos módulos.

**Correção aplicada:**
- Ajustado para uso correto do hook exportado em `src/contexts/useAuth.ts`:
  - `import { useAuth } from '../../contexts/useAuth';`

**Impacto:** melhora a confiabilidade do fluxo de autenticação na página de perfil.

---

### 3.2 Rota `/profile` sem proteção (falha de segurança)

**Arquivo:** `src/routes/routes.tsx`

**Problema:** rota de perfil estava pública.

**Correção aplicada:**
- Envolvida com `PrivateRoute`:

```tsx
{
  path: "/profile",
  element: (
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  ),
}
```

**Impacto:** bloqueia acesso não autenticado a dados/sessão do usuário.

---

### 3.3 Efeito colateral no render de `PrivateRoute` (toast em render)

**Arquivo:** `src/components/common/PrivateRoute.tsx`

**Problema:** `toast.error(...)` era chamado dentro do fluxo de render quando usuário não autenticado.  
Isso pode gerar repetição de toasts e comportamento instável em re-renderizações.

**Correção aplicada:**
- Removido toast durante render.
- Mantido apenas redirecionamento com `Navigate`.
- Padronizado hook para `useAuth` de `../../contexts/useAuth`.

**Impacto:** melhora UX, previsibilidade de render e evita side-effects indevidos.

---

### 3.4 Configuração Firebase hardcoded no frontend (risco de segurança/configuração)

**Arquivo:** `src/services/firebase.ts`

**Problema:** configuração Firebase fixa no código-fonte.

**Correção aplicada:**
- Migração para variáveis de ambiente `VITE_FIREBASE_*`:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
- Adicionada validação explícita de campos ausentes com erro descritivo.

**Impacto:** melhora postura de segurança e governança de configuração por ambiente.

---

### 3.5 Inconsistência de coleção de produtos no Firestore

**Arquivo:** `src/services/firebase.ts`

**Problema:** `productsRef` apontava para `petHub-products`, enquanto `getProductById` buscava em `products`.

**Correção aplicada:**
- Unificação para `petHub-products` em `getProductById`.

**Impacto:** evita retornos nulos indevidos e inconsistência de leitura.

---

### 3.6 Robustez de datas Firestore (`Timestamp` vs `Date`)

**Arquivo:** `src/services/firebase.ts`

**Problema:** `createdAt/updatedAt` podem vir como `Timestamp`, podendo causar inconsistência de tipo em consumo downstream.

**Correção aplicada:**
- Adicionado helper `toDate` para normalização.
- Em `getOrdersByUser`, campos de data passam por parsing com fallback seguro.

**Impacto:** reduz risco de erro de tipo/runtime e melhora consistência dos dados.

---

## 4) Evidências de validação executadas

### 4.1 Testes automatizados — frontend
- Suite: `src/hooks/__tests__/useStripe.test.ts`
- Resultado: **3/3 testes passando**

### 4.2 Testes automatizados — backend/functions
- Suite: `functions/src/__tests__/index.test.ts`
- Resultado: **3/3 testes passando**

### 4.3 Build/Lint global do projeto (estado atual)
- `npm run lint`:
  - **2 erros** (preexistentes em contexts):
    - `src/contexts/CartContext.tsx` — `react-refresh/only-export-components`
    - `src/contexts/CheckoutContext.tsx` — `react-refresh/only-export-components`
- `npm run build`:
  - **16 erros TypeScript** em áreas fora do escopo principal desta rodada (ex.: `Header.tsx`, `Checkout.tsx`, `useProduct.ts`, context hooks e tipagens).

---

## 5) Resumo de impacto

### Segurança
- ✅ Rota sensível (`/profile`) protegida.
- ✅ Configuração Firebase removida do hardcode e externalizada em env.
- ✅ Validação de env obrigatória no bootstrap do Firebase.

### Performance/estabilidade
- ✅ Remoção de side-effect no render de `PrivateRoute`.
- ✅ Fluxo de redirecionamento mais previsível e sem toast duplicado em render.

### Confiabilidade de dados
- ✅ Correção de coleção inconsistente de produtos.
- ✅ Normalização de datas de pedidos com suporte a `Timestamp`.

---

## 6) Pendências técnicas (fora do escopo direto das correções aplicadas)

Para deixar o projeto totalmente “green” em CI (lint + build), recomenda-se próxima rodada para:

1. Corrigir regra `react-refresh/only-export-components` em:
   - `src/contexts/CartContext.tsx`
   - `src/contexts/CheckoutContext.tsx`

2. Ajustar erros de tipagem e contratos de hooks/context:
   - `src/components/layout/Header.tsx`
   - `src/pages/Checkout/Checkout.tsx`
   - `src/hooks/useProduct.ts`
   - e demais pontos listados no output do `tsc`.

---

## 7) Arquivos efetivamente modificados nesta tarefa

- `src/pages/Profile/Profile.tsx`
- `src/routes/routes.tsx`
- `src/components/common/PrivateRoute.tsx`
- `src/services/firebase.ts`
- `TODO.md`

---

## 8) Conclusão

As correções implementadas atendem ao objetivo principal de mitigar problemas relevantes de **segurança, estabilidade e confiabilidade** nos pontos críticos identificados.  
O projeto evoluiu em robustez, porém ainda há débitos técnicos globais preexistentes (lint/build) que exigem uma etapa adicional de saneamento para conclusão total da qualidade técnica.
