# Catálogos e acesso por plano

Implementação inicial do cartão 05 e suporte ao cartão 07. Modelos e tipos de
bloco ficam no PostgreSQL; não há painel administrativo de edição nesta entrega.

## Dados e concessões

- `Plan`: nome, estado ativo e limite positivo de páginas. FREE tem exatamente uma.
- `Entitlement`: concessão de plano por conta. Sem concessão, usa FREE.
- `Template`: chave, metadados, miniatura opcional, versão e configuração JSON
  validada. A configuração usa apenas dados; não aceita código/HTML executável.
- `BlockDefinition`: definição de tipo e versão suportada, separada das instâncias
  de blocos de uma página.
- `PlanTemplateAccess` e `PlanBlockAccess`: permissões explícitas por plano/item.
- `Page`: propriedade, slug global único, revisão, rascunho e cópia da configuração
  do modelo aplicado. `PublishedVersion`: snapshots imutáveis separados do rascunho.

Perfil e blocos ordenados ficam no documento JSONB versionado da página, validado
por Zod como união discriminada. Nesta implementação inicial não existem tabelas
Profile/Block separadas; essa escolha mantém atualização do documento atômica.
A ordem é a ordem do array; IDs únicos permanecem estáveis.

## Inicializar e gerir

```sh
npm run db:migrate
npm run db:seed
```

O seed usa `prisma/catalog.json`, instala o plano FREE, modelo Básico e cinco tipos
conhecidos: texto, link, botão, imagem e redes sociais. Ainda não concede esses
itens a FREE: a seleção comercial está aguardando definição do dono do produto.
Os arrays `plans[].templates` e `plans[].blocks` são as chaves a liberar. Não existe
plano pago padrão com quantidade/preço inventados. Planos de teste só existem no
banco descartável usado pela suíte automatizada.

O seed é aditivo e idempotente: não troca configuração/versão de modelos existentes,
não apaga permissões e não altera concessões de usuários. Remover uma chave do
JSON não revoga acesso já concedido. Para revogar permissões, desativar itens,
versionar modelos ou alterar planos existentes, criar uma migração de dados
revisada e executá-la no ambiente correto. Antes de mudar limite, verificar páginas
existentes e definir o tratamento de downgrade. Não editar produção sem revisão.

Não há endpoint público/da conta para alterar plano ou catálogo. A aplicação usa
credencial de banco só no servidor. Gestão por migração/seed é temporária; um
painel administrativo é uma entrega separada.

## Interface e API

`/app/catalogo` exibe o catálogo real e os itens incluídos no plano da sessão.
A biblioteca demonstrativa do editor também bloqueia tipos não incluídos.
Itens inativos não aparecem no catálogo. Nenhum conteúdo/configuração de modelo
premium é enviado pelo endpoint de catálogo a uma conta sem acesso.

Todas as rotas abaixo exigem sessão; mutações também exigem Origin correspondente
à origem configurada em BETTER_AUTH_URL. Respostas não são cacheadas.

| Operação                      | Contrato                                                  |
| ----------------------------- | --------------------------------------------------------- |
| GET /api/catalog              | Metadados, plano/limite e permissões da conta             |
| GET /api/pages                | Somente páginas da conta                                  |
| POST /api/pages               | slug, name, templateKey; cria rascunho na revisão 1       |
| GET /api/pages/:id            | Rascunho e configuração aplicada, somente do proprietário |
| PUT /api/pages/:id            | expectedRevision, draft e templateKey opcional            |
| POST /api/pages/:id/publish   | expectedRevision; valida e publica snapshot salvo         |
| DELETE /api/pages/:id/publish | Despublica sem apagar rascunho/histórico                  |

Plano e ownerId não podem ser fornecidos no corpo. Estruturas desconhecidas são
rejeitadas. O esquema de rascunho está em `lib/schemas/page.ts` e é a fonte de
verdade para campos, versões, URLs e limites. Nome de página normalizado para
minúsculas, reservado para rotas internas e com unicidade global no banco.

Bloqueio de linha da conta serializa operações de escrita e contagem de páginas,
impedindo duas criações simultâneas de exceder o limite. Salvar usa revisão
esperada para evitar sobrescrita. Publicar revalida modelo e todos os blocos,
mesmo se o cliente manipulou o JSON ou a concessão mudou após salvar.
Conteúdo premium existente não é apagado após revogação; leitura pelo dono e
despublicação continuam possíveis. Salvar/publicar ficam bloqueados até resolver
a permissão. A política comercial definitiva de downgrade ainda será definida.

Atualizar um modelo do catálogo não muda configuração já aplicada às páginas.
Trocar de modelo explicitamente copia a versão/configuração atual autorizada.
Snapshots públicos contêm apenas perfil, blocos visíveis e configuração visual,
sem dados da conta. O banco restringe o ponteiro publicado à própria página.

## Limites e próximas entregas

A API salva e publica snapshots, mas ainda não existe rota pública /usuario nem
renderizador público conectado. O editor atual continua demonstrativo/em memória;
sua seleção não cria nem salva instâncias. O fluxo visual de onboarding ainda
precisa consumir estas operações. Upload de assets, temas adicionais, painel de
páginas, cobrança, métricas e operação no Railway não são implementados aqui.

Não substituir o catálogo por listas confiadas ao navegador ao construir as telas
seguintes. Validar disponibilidade no servidor em cada operação nova. Compatibilidade
de renderizadores com versões antigas deve ser mantida ao introduzir novos tipos.

## Validação

`npm run check` verifica formatação, lint, tipos e build. `npm run test:e2e` usa
PostgreSQL dedicado com nome terminado em `_test`, migrações e seed aplicados.
Testes de catálogo usam contas/concessões artificiais e removem suas fixtures.
A suíte cobre requisição direta a item bloqueado, fraude de plano, isolamento,
slug único/reservado, limite concorrente, revisão, URLs perigosas, revogação antes
de publicar, preservação do rascunho, acesso pago e atualização do catálogo.
