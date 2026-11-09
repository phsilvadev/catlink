# Primeiro acesso e primeira página

O fluxo está em `/app/primeiro-acesso`, baseado nos HTMLs registrados no cartão 07.
Após cadastrar/entrar, `/app` direciona contas sem páginas para esse fluxo. Contas
com páginas veem o painel. Todas as rotas exigem sessão no servidor.

## Etapas

1. Nome/endereço: valida formato, nomes reservados e disponibilidade no banco.
2. Tipo de perfil: criador, negócio, marca pessoal, influenciador, artista ou outro.
3. Até cinco plataformas; etapa opcional.
4. Modelo: catálogo real do banco, com itens fora do plano bloqueados.
5. Foto opcional, nome, bio e links opcionais das plataformas escolhidas.
6. Revisão: cria uma página como rascunho privado; não publica automaticamente.

Cada clique em "Salvar e continuar" persiste a etapa no PostgreSQL. Campos ainda
não confirmados no formulário não são salvos automaticamente. Ao recarregar ou
entrar novamente, o fluxo retoma a próxima etapa salva. O usuário pode voltar e
alterar etapas anteriores. Endereço é verificado inicialmente, mas só é reservado
na conclusão, quando há nova validação pela restrição única do banco.

Estado em Onboarding: userId, revision, state JSONB validado, completedPageId e
updatedAt. Não se aceita userId/plano/página concluída do navegador. Escritas são
serializadas na conta; revisões evitam sobrescrita entre abas. Conclusão é atômica
e idempotente: repetição retorna a mesma página, sem criar uma segunda.

Modelos e blocos são revalidados no servidor na seleção e na conclusão. O limite
de páginas é verificado na mesma transação de criação. Links tornam-se um bloco
SOCIAL com URLs http/https validadas. A página aponta para o snapshot da versão do
modelo aplicado. A bio aceita até 500 caracteres; nome até 80.

## Plano gratuito aprovado

Modelo Básico e blocos texto, link, botão, imagem e redes sociais. Uma página por
conta. O seed e a migração `20261109150000_onboarding` criam as concessões aprovadas;
versões/configurações existentes não são sobrescritas. Outros modelos/tipos exigem
concessões explícitas. Não existe limite/preço pago padrão inventado.

## Foto e armazenamento

Upload autenticado em POST `/api/assets/avatar`, com corpo binário, Origin válida,
limite de 5 MB, decodificação real por Sharp e formatos JPEG/PNG/WebP. Imagem é
orientada, redimensionada para até 512 × 512 e reencodada em WebP, sem metadados
originais. SVG/GIF e arquivos inválidos não são aceitos.

Arquivos ficam no bucket compatível com S3; o banco guarda Asset com ownerId,
chave, tipo e tamanho. Configure no ambiente de execução:

- S3_ENDPOINT, S3_REGION, S3_BUCKET;
- S3_ACCESS_KEY_ID e S3_SECRET_ACCESS_KEY (somente servidor).

Sem essas variáveis, envio retorna mensagem de indisponibilidade e o usuário pode
continuar sem foto. Nenhum bucket Railway foi provisionado por esta entrega.
GET `/api/assets/:id` entrega a imagem somente ao dono autenticado, com no-store.
Uma conta não consegue associar ao seu perfil uma foto pertencente a outra.

Remover/trocar foto no formulário remove a associação, sem apagar objeto que
possa estar referenciado. Limpeza de arquivos sem uso e quotas totais de storage
ficam para uma entrega posterior. Antes de abrir uploads em produção, configurar
limites operacionais, monitoramento e política de limpeza. Nos testes usamos um
servidor S3 de teste local, sem enviar dados a bucket real.

## Painel e editor

`/app` lista páginas da conta e status Rascunho/Publicada. Conta gratuita com uma
página recebe a informação do limite. Criação comercial de páginas adicionais
segue pendente com os planos pagos.

`/app/editor/:id` verifica propriedade e carrega a prévia real do rascunho salvo,
incluindo nome, bio, foto e links. Página de outra conta resulta em 404. O renderer
`components/page/PageContent.tsx` é compartilhado com a prévia do onboarding.
Os demais controles do editor continuam demonstrativos; a edição de blocos e
salvamento interativo no editor completo são entregas seguintes. Não há rota
pública /usuario ainda. A API de snapshots existente não substitui essa rota.

## Testes

Rodar migrações/seed e `npm run check`. `npm run test:e2e` usa banco `_test` e build
de produção. A suíte inclui cadastro→primeiro acesso→rascunho→editor→painel,
retomada após reload, celular, upload real ao S3 de teste, proteção de fotos entre
contas, salto de etapas, revisão conflitante, bloqueio de modelo e revogação antes
de concluir. O Playwright injeta credenciais/endpoint S3 fictícios somente no
servidor de teste; não usar essas configurações em produção.
