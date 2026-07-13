# TODO - Favoritos no Firestore + Profile 100% funcional (PetHub)

- [x] 1) Favoritos persistentes por usuário no Firebase
  - [x] Criar serviço `src/services/favorites.ts` com subcoleção `users/{uid}/favorites`
  - [x] Implementar operações: listar, adicionar, remover, verificar favorito
  - [x] Integrar botão de coração nas telas de produto/listagem

- [x] 2) Página de Favoritos conectada ao Firestore
  - [x] Refatorar `src/pages/Favorites/Favorites.tsx` para ler favoritos do usuário logado
  - [x] Manter fallback para visitante (localStorage) sem quebrar UX
  - [x] Garantir ações: remover favorito, abrir detalhes, adicionar ao carrinho

- [x] 3) Profile com funcionalidades operacionais
  - [x] Meu Perfil: salvar dados reais no `users/{uid}`
  - [x] Favoritos: exibir resumo real + atalho funcional
  - [x] Endereços: listar de pedidos + permitir cadastro manual
  - [x] Pagamentos: exibir último método usado em pedidos
  - [x] Notificações: simulação baseada em status de pedidos
  - [x] Configurações: reset de senha real via Firebase Auth

- [ ] 4) Camada de dados e tipos
  - [ ] Ajustar tipos em `src/types/index.ts` se necessário
  - [ ] Garantir normalização de datas/status para telas de profile

- [ ] 5) Verificação técnica e documentação
  - [ ] Executar `npm run lint`
  - [ ] Executar `npm run build`
  - [ ] Atualizar relatórios técnicos e de testes com as novas entregas
