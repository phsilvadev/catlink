# Referência completa da entrada

HTML enviado pelo usuário e seus seis arquivos CSS/JavaScript auxiliares.
São referência visual; a aplicação usa componentes React e CSS compilado,
sem executar os scripts de manipulação do DOM ou o Tailwind por CDN.

- `components/entry/EntryShowcase.tsx`: skeleton, temas, PixelMaster, blocos,
  digitação, reprodução automática e interrupção após interação manual.
- `components/entry/entry.css`: estilos do HTML e dos arquivos CSS importados,
  restritos às telas de entrada.
- `components/onboarding/OnboardingWizard.tsx`: formulários, transições nos dois
  sentidos e carrossel com três modelos por vez.
- `/api/onboarding`: validação e persistência reais, com controle de revisão,
  permissões, disponibilidade de endereço e conclusão idempotente.

Modelos demonstrativos não liberam permissões no plano. A criação aplica a
aparência autorizada ao snapshot do rascunho e abre o editor; não publica a página.
