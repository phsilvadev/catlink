# Bloco de texto e prévia

O painel de texto segue `referencias/bloco-texto.html`: conteúdo com contador,
negrito, itálico, sublinhado, alinhamento, fonte de 10 a 48 px, cor de texto,
fundo opcional e espaçamento de 0 a 96 px. A formatação é aplicada ao bloco todo,
sem inserir HTML no conteúdo. Textos novos têm limite de 500 caracteres; textos
legados maiores continuam editáveis sem truncamento automático.

As alterações ficam visíveis no celular e são persistidas por `PUT /api/pages/:id`
ao salvar. A exclusão também salva o rascunho. Revisão, propriedade, plano e validação
dos estilos são verificados no servidor. Uma falha de rede ou conflito mantém as
alterações na tela e exibe o erro; salvar nunca publica a página.

O `style` opcional dos blocos de texto é validado pelo Zod e salvo no JSON do
rascunho. Nenhuma migração de tabelas é necessária; textos antigos sem estilo
continuam válidos.

`PhoneFrame` e `PageContent` são compartilhados pelo editor e pelo onboarding.
Moldura, notch, barra de status, capa, avatar, links e PixelMaster seguem a mesma
estrutura. O onboarding aplica sua escala de apresentação; o editor trabalha
com o conteúdo real do rascunho, sem substituir nome, foto ou links pelos dados
demonstrativos. A barra do editor informa o tamanho base correto e o slug da página.

O teste `tests/text-editor.spec.ts` verifica edição ao vivo, estilo persistido,
reabertura, exclusão e rejeição de CSS inválido pela API.
