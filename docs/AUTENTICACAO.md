# Login e cadastro

Implementação baseada em `login_usuario_078.html` e `cadastro_usuario_031.html`
do repositório phsilvadev/Projetos. Layout dividido, prévia ilustrativa no painel
escuro, marca Catlink e conteúdo em português. No celular, a apresentação lateral
é ocultada e o formulário ocupa a largura disponível.

## Rotas e comportamento

- `/` redireciona para `/login`.
- `/login`: e-mail e senha, mostrar/ocultar senha e lembrar sessão.
- `/cadastro`: e-mail e senha; nome inicial interno derivado do e-mail, até o usuário
  configurar seu perfil. Isso não reserva slug nem cria página pública.
- `/app`: editor existente, protegido no servidor por sessão válida.
- `/api/auth/[...all]`: Better Auth, limitado a cadastro, login, logout e sessão.

O Better Auth gera hash da senha, cria usuários/contas/sessões no PostgreSQL via
Prisma e gerencia o cookie de sessão. A sessão persistente dura até sete dias;
"Lembrar de mim" desmarcado usa cookie de sessão do navegador conforme a biblioteca.
Não há token salvo no localStorage.

Validação acessível no formulário, mensagens de erro, estado de envio e bloqueio
contra clique duplicado. A biblioteca revalida os dados no servidor. A origem das
requisições é verificada pelo Better Auth. Rate limit persistido no PostgreSQL:
10 logins e 5 cadastros por minuto por chave/IP; demais endpoints até 100/minuto.
Não definir cabeçalhos de proxy confiáveis arbitrariamente em produção; validar a
configuração real do Railway antes de disponibilizar acesso público.

## Configuração local

```sh
npm ci
docker compose up -d postgres
```

Copie `.env.example` para `.env.local`. Preencha `BETTER_AUTH_SECRET` com pelo menos
32 caracteres aleatórios (por exemplo, gere com
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
Confirme `DATABASE_URL`, `DIRECT_URL` e `BETTER_AUTH_URL` para seu ambiente.

```sh
npm run db:migrate
npm run dev
```

O banco do Compose usa credenciais locais de exemplo e porta apenas em loopback.
Não reutilizar essas credenciais em produção. No Railway, usar variáveis secretas
e a conexão privada do PostgreSQL, configurar URL HTTPS pública do auth, aplicar
migrações antes do deploy e validar limites/backups separadamente. Nenhum recurso
Railway foi criado por esta implementação.

## Migração e instalação

Schema de auth e rate limit em `prisma/schema.prisma`; migração inicial versionada
em `prisma/migrations`. `npm ci` gera o Prisma Client no postinstall. O arquivo
`prisma7.config.ts` carrega variáveis com o mecanismo do Next.js e usa DIRECT_URL
quando disponível para migrações, caindo para DATABASE_URL. Não executar migrações
no banco de outro ambiente. Não há modelos de páginas/blocos ainda (restante do 05).

## Verificação

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

Os testes exigem um banco dedicado com nome terminado em `_test`, indicado por DATABASE_URL e precisam das
migrações aplicadas. Não usar banco de produção. Playwright inicia o build de
produção com `npm start` ou reutiliza o servidor local fora da CI. Para Chromium
instalado no sistema, defina PLAYWRIGHT_CHROMIUM_EXECUTABLE.
CI inclui PostgreSQL descartável, migração, build e testes de autenticação.

## Limites desta etapa

Integração de e-mail adiada pelo dono do produto. Cadastro faz login imediatamente,
e `emailVerified` permanece falso. Verificação, recuperação de senha e login social
não são apresentados como disponíveis; endpoints de e-mail ficam fora do handler.
Não habilitar verificação obrigatória sem transporte real, nem apresentar conta
não verificada como verificada. Reavaliar o fluxo antes de lançamento público.

A prévia lateral é ilustrativa, sem métricas inventadas de clientes. Avatar está
local em `public/images`; ícones do auth são SVGs Lucide. A fonte Inter ainda é
externa. O editor mantém seus assets demonstrativos e a edição ainda é em memória.
Não há persistência de páginas, publicação, cobrança ou redefinição de senha nesta
entrega. Cadastro duplicado não sobrescreve uma conta existente.
