# Executar esta cópia localmente

Esta integração foi configurada para não disputar as portas do outro projeto:

- Aplicação: http://localhost:3100
- Banco: PostgreSQL 16 em `127.0.0.1:5441`, container `catlink-local-postgres`.
- Dados do banco: `../.catlink-local-postgres/`, fora da árvore do projeto.
- Arquivos temporários: `.local/`, ignorado pelo Git e pelas verificações.
- Configuração e segredo de sessão: `.env.local`, não versionado.

```sh
npm ci
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev -- --hostname 0.0.0.0 --port 3100
```

Se a partição de temporários estiver cheia, defina `TMPDIR` para a pasta
`.local/tmp` antes de executar os comandos. As dependências e o build ficam
na partição do projeto.

Para reiniciar o banco existente: `docker start catlink-local-postgres`.
O container utiliza bind mount em `../.catlink-local-postgres/`; não apague essa pasta.

O fluxo é cadastro/login → link → perfil → plataformas → modelo → editor.
O progresso é salvo no PostgreSQL e o nome é validado por consulta autenticada.
As quatro etapas rodam na mesma página, sem recarregar o painel esquerdo.

Testes usam `catlink_test`, na mesma instância PostgreSQL, e aplicação na porta 3101. Eles não devem usar o banco de desenvolvimento. Configure `DATABASE_URL`,
`DIRECT_URL`, `BETTER_AUTH_URL` e, se necessário,
`PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome` ao executá-los.

O projeto recebido não contém `.git`; não foi possível fazer commit ou push
na branch `development`. Os arquivos foram alterados diretamente nesta cópia.
