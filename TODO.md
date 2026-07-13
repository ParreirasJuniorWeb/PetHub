# TODO - Checkout Stripe completo (cartão/PIX/boleto) + correções gerais (PetHub)

- [x] 1) Corrigir autenticação e acesso protegido
  - [x] Ajustar import do `useAuth` em `src/pages/Profile/Profile.tsx`
  - [x] Proteger rota `/profile` com `PrivateRoute` em `src/routes/routes.tsx`
  - [x] Ajustar `PrivateRoute` para evitar efeito colateral (toast) durante render
  - [x] Corrigir import em `src/components/layout/Header.tsx` (`useAuth`/`useCart`)

- [x] 2) Corrigir consistência e robustez no Firebase service
  - [x] Unificar coleção de produtos em `src/services/firebase.ts` (`petHub-products` vs `products`)
  - [x] Tratar parsing de `createdAt/updatedAt` com compatibilidade para `Timestamp`/`Date`
  - [x] Ajustar fallback seguro para configuração Firebase em ambiente de desenvolvimento

- [ ] 3) Checkout Stripe no frontend
  - [ ] Atualizar `src/contexts/CheckoutContextDefinition.ts` para métodos: `card | pix | boleto`
  - [ ] Atualizar `src/contexts/CheckoutContext.tsx` com novos tipos de método de pagamento
  - [ ] Refatorar `src/pages/Checkout/Checkout.tsx` para usar `PaymentElement`
  - [ ] Integrar criação de PaymentIntent via Firebase Function (`createPaymentIntent`)
  - [ ] Confirmar pagamento com Stripe (`stripe.confirmPayment`) e tratar retorno por método
  - [ ] Manter identidade visual da loja e seleção explícita da forma de pagamento

- [ ] 4) Verificação técnica
  - [ ] Executar lint e corrigir erros impactados pelas mudanças
  - [ ] Executar build e validar compilação
  - [ ] Validar fluxo de checkout (cartão, PIX e boleto)

- [ ] 9) Correções finais de checkout + pedidos pagos + Home catálogo
  - [x] Corrigir erro Firestore de campo `paymentMethod` undefined
  - [x] Garantir gravação de pedidos conforme regra de pagamento (aprovado ou pendente para PIX/Boleto)
  - [ ] Criar página/rota de histórico de pedidos pagos
  - [ ] Criar página/rota de produtos favoritos
  - [x] Refatorar Home com ações de catálogo (ver produto, adicionar carrinho)
  - [x] Adicionar filtros na Home por categoria e faixa de preço

- [ ] 8) Correção de deploy Firebase Functions (produção)
  - [ ] Atualizar `functions/package.json` para `firebase-functions@latest`
  - [ ] Migrar `functions/src/index.ts` para API v2 com secrets por função
  - [ ] Rodar build/test local de `functions`
  - [ ] Fazer `firebase deploy --only functions`
  - [ ] Validar endpoints publicados (`createPaymentIntent`, `confirmPayment`, `stripeWebhook`)

- [x] 5) Login social Firebase (Google + GitHub)
  - [x] Atualizar contrato do AuthContext com métodos sociais
  - [x] Implementar login social no AuthProvider com persistência de perfil no Firestore
  - [x] Integrar botões sociais na tela de Login com tratamento de erros e loading
  - [x] Validar build após alterações

- [x] 6) Relatório técnico de arquitetura
  - [x] Criar `RELATORIO_ARQUITETURA_TECNICA.md`
  - [x] Documentar arquitetura em camadas (frontend, context/hooks, services, functions, integrações)
  - [x] Incluir diagramas Mermaid (contexto, autenticação social, checkout Stripe, webhook)
  - [x] Descrever padrões de projeto, clean code e padronizações de codificação
  - [x] Documentar fluxos de processamento e dados ponta a ponta
  - [x] Incluir recomendações de melhoria e roadmap técnico

- [x] 7) Login social na página de cadastro (Register)
  - [x] Integrar `signInWithGoogle` e `signInWithGitHub` em `src/pages/Register/Register.tsx`
  - [x] Adicionar loading por provedor e tratamento de erros sociais
  - [x] Ligar botões sociais com `onClick` e estados `disabled`
  - [ ] Validar build/lint após alteração
