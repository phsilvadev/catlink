# Primeiro acesso

O HTML aprovado está preservado em `docs/referencias/onboarding-aprovado.html`.
A interface foi convertida em componentes React, com estilos limitados a
`.entry-flow`, sem executar os scripts/CDN do protótipo nem alterar o editor.

## Fluxo atual

Cadastro com e-mail/senha → link → tipo de perfil → até cinco plataformas
(opcional) → modelo → editor do rascunho. Login e cadastro compartilham a
ilustração interativa do HTML; cadastro mantém apenas seu formulário de conta.
A prévia permite experimentar blocos e temas e se expande na seleção de modelo.
Esses exemplos não acrescentam blocos ou autorizam modelos na página real.

Após 450 ms sem digitação, a API autenticada verifica o username no PostgreSQL.
O campo mostra spinner e “Verificando nome de usuário…” durante a consulta.
Check verde e confirmação dependem da disponibilidade real. Editar cancela a
consulta anterior e invalida o check; falha de rede permite tentar novamente.
Mantidas as regras de endereço do projeto: 3–40 letras minúsculas, números e
hífens, sem nomes reservados. A consulta não reserva o endereço.

Cada etapa salva ao continuar; recarregar retoma o progresso. Revisões e lock
por conta impedem sobrescrita entre abas. Na etapa 4, o cliente envia
`{templateKey, complete:true}`: o servidor valida etapas anteriores, endereço,
modelo, blocos e limite por plano, cria uma única página privada e conclui o
progresso numa transação. Repetir a conclusão retorna a mesma página.

O fluxo anterior de seis etapas continua aceito na API para compatibilidade.
Sessões antigas nas etapas 5/6 abrem a seleção de modelo; perfil, foto e links já
salvos são preservados ao concluir. Foto/bio e revisão não são telas obrigatórias
no novo onboarding de quatro etapas. Não há publicação automática.

## Catálogo

Modelos vêm de `GET /api/catalog`, com permissões resolvidas pelo servidor.
Básico continua gratuito. Rosa, Menta e PixelMaster são adicionados ao catálogo,
sem concessões automáticas; aparecem bloqueados até liberação a um plano.
O HTML é uma referência visual, não uma autorização para liberar todos os itens.
Itens bloqueados não podem ser escolhidos por teclado, clique ou requisição direta.

## Componentes

- `components/entry/EntryShowcase.tsx`: prévia compartilhada e suas interações.
- `components/entry/entry.css`: estilos convertidos do HTML e arquivos auxiliares.
- `components/onboarding/OnboardingWizard.tsx`: quatro etapas persistidas.
- `components/onboarding/UsernameField.tsx`: campo e indicador de disponibilidade.
- `components/auth/AuthForm.tsx`: formulários reais do Better Auth.

## Limites e compatibilidade

`/app` lista páginas e `/app/editor/:id` verifica propriedade e carrega a prévia
real. Os demais controles do editor continuam demonstrativos. Sem rota pública
/usuario, cobrança ou criação comercial de páginas adicionais nesta entrega.
Uploads S3 e APIs de perfil existentes permanecem disponíveis; e-mail segue adiado.

## Validação

`npm run check` verifica formatação, lint, tipos e build. `npm run test:e2e` usa
banco isolado `_test` e S3 local. Cobre cadastro/login/logout, quatro etapas no
celular, retomada, rascunho único, limite de plataformas, modelo bloqueado,
conclusão sem etapas prévias, conflito entre abas, prévia interativa, autocheck
com debounce e descarte de respostas antigas. APIs anteriores continuam testadas
para upload, autorização, URLs, planos e revogação de concessões.

## Branch

Trabalhar e enviar alterações somente em `development`. Ela contém o histórico
completo das branches anteriores, sem squash nem perda de commits. Não criar
branches por tarefa. Branches antigas são referências históricas, sem trabalho novo.
