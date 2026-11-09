# Catlink

Editor de páginas de perfil e links, construído com Next.js App Router,
TypeScript, React e Tailwind. Uma página gratuita por conta; páginas adicionais
ficarão no plano pago.

## Executar localmente

Requisito: Node.js 24 (veja `.nvmrc`) e npm.

```sh
npm ci
npm run dev
```

Abra http://localhost:3000. No PowerShell com scripts bloqueados, use `npm.cmd`.
As telas de login e cadastro abrem sem banco, mas autenticar e acessar o editor
exige PostgreSQL e variáveis de ambiente. Para habilitar:

```sh
docker compose up -d postgres
```

Copie `.env.example` para `.env.local`, preencha `BETTER_AUTH_SECRET` com pelo menos
32 caracteres aleatórios e confirme as URLs. Depois execute `npm run db:migrate` e `npm run db:seed`.
Leia [configuração de autenticação](docs/AUTENTICACAO.md). Nunca envie segredos ao Git.

## Validação

```sh
npm run format
npm run check
```

`check` valida formatação, lint, tipos e build. O GitHub Actions executará o mesmo
fluxo em PRs e pushes para main quando o workflow for enviado ao GitHub.
Para produção: `npm run build` e `npm start`. Deploy ainda não configurado.

## Estado atual

- Biblioteca de blocos e painel direito com seleção, expansão e campos por tipo.
- Valores dos campos mantidos em memória durante a sessão.
- Prévia demonstrativa separada em componente, ainda sem refletir os campos.
- Cadastro, login, sessão e logout com Better Auth + PostgreSQL.
- Editor em `/app` protegido por sessão no servidor; entrada em `/login` e `/cadastro`.
- Migração inicial de autenticação e testes com PostgreSQL.
- API de páginas com rascunho persistido e snapshots de publicação; editor ainda em memória.
- Catálogo de modelos/blocos e validação de permissões por plano.
- Sem upload, página pública renderizada ou cobrança.
- Fontes, ícones e imagens demonstrativas dependem de serviços externos.

As telas de auth estão em `components/auth` e `app/(auth)`. O controlador fica em `components/BioLinkEditor.tsx`; biblioteca, inspector,
barra superior e prévia têm componentes separados. A entrada redireciona ao login; o editor autenticado fica em `/app`.

## Arquitetura e sequência

Next.js para frontend/backend, PostgreSQL + Prisma e Better Auth. Hospedagem da
aplicação, banco e imagens no Railway (bucket S3). Serviços ainda não provisionados.
Integração de e-mail, métricas e detalhamento de privacidade ficam para depois.

Leia [arquitetura](docs/ARQUITETURA.md) e [convenções](docs/CONTRIBUINDO.md).
Referências visuais: https://github.com/phsilvadev/Projetos (HTMLs das telas).
A autenticação dos cartões 05/06 foi iniciada para dar suporte às telas aprovadas.
Faltam modelos e operações das páginas, recuperação de senha (e-mail adiado) e
validação do deploy no Railway. `npm run test:e2e` verifica auth com banco de teste.

## Catálogo e permissões

Catálogos de modelos/blocos e concessões por plano agora ficam no PostgreSQL.
Consulte `/app/catalogo`. API de páginas com validação de plano, limite gratuito,
isolamento e snapshots está implementada; onboarding e editor persistente ainda
não estão conectados. Veja [gestão e contratos do catálogo](docs/CATALOGO.md).
A seleção de itens gratuitos aguarda definição; o seed não libera itens por conta própria.
