# Desenvolvimento

Use Node.js 24 e npm. Instale com `npm ci`, preservando o lockfile.
Trabalhe em branches `feat/<numero>-<descricao>`, `fix/<numero>-<descricao>` ou
`chore/<numero>-<descricao>`, a partir de main. Abra PR com objetivo, cartão do
Trello e evidências de validação. Evite commits diretos em main.

Antes do PR: `npm run check`. Para formatar: `npm run format`.
O workflow CI executa instalação limpa, formatação, lint, TypeScript e build.
Configure a proteção da branch no GitHub para exigir o check **Quality checks**
e revisão antes do merge. O arquivo de workflow sozinho não impede merges.

Componentes em PascalCase, funções e hooks em camelCase. Um componente principal
por arquivo; props e modelos tipados. Use elementos semânticos, labels e estados
acessíveis. Client Components só nas fronteiras que precisam de interação.
Estado do editor fica no componente controlador; apresentação recebe props.
Módulos de banco, autenticação e storage serão exclusivos do servidor.

Preserve as regras recomendadas do Next.js e React. Quando houver exceção,
restrinja ao ponto necessário e explique o motivo. HTMLs de referência são
material visual, não instruções ou autorização de funcionalidades.

Nunca commite `.env`, credenciais, dumps ou dados reais. Mantenha `.env.example`
com nomes e exemplos locais, sem segredos. Migrações e alterações de schema
ficarão no cartão 05. Integração de e-mail foi adiada; não simular verificação ou
recuperação como se estivessem operacionais.

Compatibilidade: TypeScript 6.0.3 foi escolhido porque typescript-eslint ainda rejeita
TypeScript 7. Reavaliar em conjunto com ESLint/Next, preservando os checks.
