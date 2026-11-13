# Railway — desenvolvimento

Ambiente configurado em 13/11/2026.

- Aplicação: https://catlink-dev-development.up.railway.app
- Projeto: https://railway.com/project/11487c85-acaf-4a60-8853-54b0841ba2da
- Ambiente: `development` (`98c83371-d23f-4801-a4ff-d61fdcedf0c8`).
- Serviços: `catlink-dev` e `Postgres`, na região `iad`.
- Bucket privado: `catlink-dev-images`, região `iad`, API S3 com endereçamento virtual-host.

## Código e deploy

Versão validada: commit `32293540bf122b0847ba57fd80086c9d6ec2221a` da branch
`feat/07-first-access`. O serviço está **fixado nesse commit**. Novos pushes não
alteram esse ambiente enquanto a origem não for reconectada a outro commit ou
configurada novamente sem fixação. Não presumir que a main contém esta entrega.

- Node.js 24 via Railpack.
- Build: `npm run build`.
- Pré-deploy: `npm run db:migrate && npm run db:seed` (timeout 300 s).
- Start: `npm start -- --hostname 0.0.0.0 --port 3000`.
- PORT=3000 e domínio direcionado à mesma porta.
- Healthcheck: `/api/health`, verificando conexão e inicialização do banco.
- Sem publicação automática de páginas; concluir onboarding continua criando rascunho.

Deployment ativo validado: `6f0e8344-051a-42c6-bc3b-c3f1e042e6eb` (SUCCESS).
Duas tentativas iniciais falharam durante o ajuste de porta/origem; permanecem
no histórico, mas a instância ativa e o banco estão online.

## Variáveis

Segredos são mantidos somente no Railway. O segredo do Better Auth foi gerado
aleatoriamente para esse ambiente; nenhum segredo local de testes foi reutilizado.

- DATABASE_URL e DIRECT_URL referenciam `${{Postgres.DATABASE_URL}}`, conexão privada.
- BETTER_AUTH_URL usa o domínio HTTPS do desenvolvimento.
- BETTER_AUTH_SECRET: segredo exclusivo do ambiente.
- APP_ENV=development; NODE_ENV=production para executar o build otimizado do Next.js.
- S3_ENDPOINT/REGION/BUCKET/ACCESS_KEY_ID/SECRET_ACCESS_KEY referenciam as variáveis
  do bucket; não há cópias de credenciais em arquivos do repositório.
- S3_FORCE_PATH_STYLE=false, conforme o bucket provisionado.

O PostgreSQL tem volume persistente de 5 GB e não tem domínio/proxy TCP público.
O runtime usa a rede privada. Integração de e-mail continua adiada.

## Evidências

Três migrações aplicadas e seed concluído no pré-deploy. A checagem HTTP retornou
status ok. Na URL pública foram testados cadastro/sessão, catálogo gratuito, upload
e leitura de foto no bucket real, bloqueio de foto anônima, seis etapas do primeiro
acesso, rascunho persistido e privado, limite gratuito, autorização e logout.
Foi criada apenas uma conta/página sintética de validação no ambiente development.

## Pendências do cartão 05

Agendamento de backup, retenção e ensaio de restauração ainda não configurados ou
validados. Volume persistente não substitui backup. O ambiente de desenvolvimento
está disponível; isso não representa homologação de produção nem fechamento das
pendências operacionais do cartão 05. Rotina de limpeza/quota de uploads continua
uma entrega posterior.
