# Catlink

HTML convertido para Next.js com TypeScript e App Router, preservando o layout original.

Para executar:

```sh
npm install
npm run dev
```

Abra http://localhost:3000. No PowerShell com scripts bloqueados, use `npm.cmd` no lugar de `npm`.

Para validar: `npm run typecheck` e `npm run build`.

A página está em `app/page.tsx`. Os quatro painéis ficam em `components/`; os estilos estão em `app/globals.css` e `tailwind.config.ts`.

Os controles preservam o comportamento estático do HTML original. Publicação, IA, edição de blocos e conexão de domínio ainda precisam de implementação. Fontes, ícones e imagens usam as URLs externas originais.
