# Prototype Instructions

## Promoção aprovada e repositório — DEC-024

- Em 22/11/2026, o responsável aprovou promover `landing-fork-catalogo` ao Main e publicar o código em um repositório novo da Alba. A implementação já foi autorizada em conversa; as restrições iniciais de fase de planejamento não impedem esta promoção.
- Main agora tem 12 serviços e 15 opções, incluindo Figma. Itens expandidos usam ilustrações das categorias; marcas padronizadas ficam nos itens recolhidos. Recarregar o catálogo e ações genéricas iniciam em Todos; links explícitos de categoria preservam o destino.
- Em Apoie, remover o contorno somente do título que recebe foco programático. Preservar foco e indicadores dos controles.
- Publicar somente o conteúdo de `landing/`. Forks, backups, credenciais do workspace, `node_modules`, distribuição e configuração real da instância não vão ao Git. O exemplo de configuração começa desconectado; preservar a configuração real local do Main.
- Código original sob MIT; licenças de terceiros preservadas e identidade/ilustrações fora do escopo MIT. README acompanha a paleta editorial. Estado público atualizado em `docs/project_state.md`; registros abaixo são históricos quando superados por esta decisão.

## Pesquisa aprofundada e fork antes de promover — DEC-023

- Pedido de 22/11/2026: pesquisar e analisar cada assinatura antes de implementar, incluindo disponibilidade regional e restrições. Cruzar fontes comerciais, ajuda, renovação e relato verificável; registrar divergências, sem tratar formulário inacessível como indisponibilidade.
- Mudanças substanciais no catálogo, visual ou países passam primeiro por fork atual e isolado, com avaliação antes da promoção explícita. Para esta rodada, usar `../landing-fork-catalogo`; preservar o catálogo e o runtime do Main.
- Figma gratuito no Brasil tem evidência concreta do responsável (equipe com selo Edu e relato de ativação) e confirmação do acesso elegível via RNP/CAFe. A vigência diverge entre ajuda operacional e FAQ; não prometer dois anos universais, uso comercial ou IA ilimitada.

## Ampliação do catálogo e possível versão EUA — DEC-022

- O responsável autorizou novas assinaturas em 22/11/2026. Main ampliado com Adobe Creative Cloud Pro estudantil, YouTube Premium/Music Premium avulsos e JetBrains Student Pack: 11 serviços, 14 opções individuais. Preservar componentes, logos originais com máscara padronizada, favoritos e acesso sem login.
- Fontes novas conferidas em 22/11; ofertas anteriores preservam 20/11. `VERIFIED_AT` indica a revisão mais recente, sem substituir `offer.verifiedAt`. Adobe tem campanha até 27/11, contrato anual e renovação distinta; desativar resgate após o prazo. YouTube continua sem valor numérico inventado. Não publicar Figma/Obsidian como confirmados regionalmente nesta rodada.
- O responsável escolheu **planejar e validar primeiro** a versão americana. Plano em `../expansao-eua.md`; não ativar seletor de país, traduzir parcialmente o app, copiar ofertas brasileiras para os EUA nem criar infraestrutura/pagamentos por essa intenção.

## Tabelas de contas criadas — DEC-021

- Em 22/11/2026, o responsável autorizou criar as tabelas do Main. No projeto Alba-Hub, `public.profiles`, `public.user_preferences` e `public.user_favorites` estão vinculadas a `auth.users.id`, com RLS por dono, permissões mínimas e exclusão em cascata. Não duplicar e-mail ou senha nessas tabelas.
- Perfil e preferências iniciais são criados pelo trigger de Auth; nenhuma nova chamada do cliente é necessária no cadastro. Metadados de nome são apenas apresentação, nunca autorização.
- A criação das tabelas não ativa sincronização: favoritos, editorias e rotina ainda ficam no navegador. Não enviar essas escolhas ao banco automaticamente nem mudar textos para prometer sincronização sem implementar um fluxo explícito.
- SQL, registro remoto e testes com rollback em `supabase/README.md`. Não aplicar novamente o SQL inicial em um banco já migrado; mudanças seguintes devem ter migrações próprias e teste de isolamento. Não criar tabelas de pagamentos enquanto só houver intenção de receber um link do Stripe.

## Carregamento da página de apoio

- Ao abrir `apoie.html`, mostrar o mesmo sol com livro, fundo creme e animação do carregamento atual: mínimo de 1000 ms e saída de 240 ms. Respeitar movimento reduzido e repetir ao restaurar a página pelo histórico.
- Conteúdo sem interação durante a transição; ao terminar, devolver acesso e focar o título sem deslocar a página. Sem JavaScript, a página deve continuar acessível. Não aguardar o futuro link financeiro para liberar conteúdo.
- O responsável informou que criará o link do Stripe. Aguardar o endereço real para configurar `supportUrl`; não inventar destino nem criar conta/produto/pagamento nesta etapa.

## Perguntas frequentes em celular

- Perguntas curtas e orientadas às ações visíveis: explorar, buscar pelo serviço, filtrar e abrir o benefício. Não orientar o uso de Ctrl/⌘ K como caminho principal em celular.
- A navegação funciona sem atalho em qualquer tela. A dica de teclado fica como complemento da resposta, visível somente acima de 780 px com ponteiro preciso e hover, sem detecção de navegador ou troca de conteúdo por JavaScript.
- Preservar os botões acessíveis do acordeão, foco, regiões e IDs; chevron não encolhe e respostas usam a largura disponível em telas pequenas.

## Integração do apoio aprovada — DEC-020

- Em 22/11/2026, o responsável aprovou `landing-fork-apoio` e pediu migrá-lo ao Main. “Apoie” fica imediatamente à esquerda de “Entrar” na apresentação e no catálogo, inclusive em telas pequenas.
- A página usa “De estudantes para estudantes” e “Ajude-nos com um café”. Café significa contribuição simbólica no valor de um café; não repetir metáforas pelo restante da página. A Alba não tem fins lucrativos e o apoio serve somente como motivação, é voluntário e não libera vantagens.
- Arte aprovada em `public/assets/support-still-life-transparent.png`: copo existente e tecido modelado no Blender, sem piso captador de sombras. Todas as bordas têm alpha zero. Preservar a integração natural ao creme, sem elipse, retângulo cinza, vapor ou legendas decorativas.
- Preservar a configuração real do Main; o `app-config.json` desconectado do fork não integra esta promoção. Link financeiro continua pendente. Evidências em `qa/support-integration.json` e `qa/support-integration.md`.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Direção deste protótipo

- Nome oficial aprovado pelo responsável: **Alba** (DEC-015), substituindo “Revista de Campus” na interface e nos metadados. “Hub de Benefícios Estudantis” é a descrição. Preservar as chaves `revista-campus:prototype:*` e os fragmentos/classes antigos para manter dados e links compatíveis; forks e backups são históricos.
- Preservar a estética aprovada de `../Assets/Site.png`, usando os componentes fornecidos como referência. A nova estrutura de apresentação do produto, solicitada na segunda iteração, prevalece sobre a home de catálogo do mock. Ler `../Regras e Validação + Base/07 - Direcao de Arte.md`.
- Tokens definidos pelo responsável: papel `#F7F2E9`, tinta `#222621`, verde `#16483B`, ocre `#F2D38B`. Fraunces nos títulos e DM Sans na interface; arquivos locais em `public/assets/fonts/`.
- Escopo atual autorizado: landing de apresentação com botões e telas de cadastro/login, imagens por categoria e café 3D guiado pela rolagem. A interface de contas é uma prévia, sem autenticação real nem envio/armazenamento das credenciais. O responsável autorizou iniciar o catálogo real com GitHub, Google, Notion e Canva, conferidos em fontes oficiais.
- Os favoritos usam uma chave exclusiva do protótipo. A taxonomia editorial de demonstração não aprova o modelo definitivo do catálogo.
- Revisão visual automática ficou bloqueada nesta sessão: Computer Use não conseguiu identificar a URL ativa no Windows e encerrou a automação. Não registrar QA visual como aprovado sem uma nova captura válida.

## Segunda iteração aprovada em conversa

- A landing apresenta a Revista; o catálogo deve ser aberto por “Explorar benefícios”, “Explorar sem cadastro” ou por uma categoria. Preservar acesso livre ao catálogo.
- Corrigir o livro acima do papel: usar `sol-e-livro-cutout.png`, transparência real e camada de primeiro plano. Evitar `mix-blend-mode: multiply` nesse componente.
- Cada benefício/categoria usa sua própria imagem: campus/Estudo, ateliê/Criatividade, jardim/Bem-estar. Não repetir a paisagem em todos os destaques.
- Interpretar “walkable” como narrativa por rolagem nativa: café real de `hub-objetos/copo-cafe.glb`, renderização Three.js sob demanda e sem captura da rolagem. Usar pôster do próprio modelo para movimento reduzido e falhas de WebGL.
- Paleta, Fraunces e DM Sans permanecem definidos. A aparência anterior foi aprovada pelo responsável; mudanças de estrutura seguem o novo briefing.

## Imagem do Modo Foco

O responsável rejeitou a primeira imagem de Bem-estar por parecer artificial e destoar da direção artística. Usar `category-wellbeing-v2.png`: canto de leitura, formas planas e orgânicas, gouache/colagem com granulação sutil e profundidade contida. Evitar acessórios exagerados, móveis com aparência de escultura 3D e textura de papel excessivamente relevada. O campus original continua sendo a principal referência de acabamento.

## Integração do fork aprovada

- O responsável aprovou `landing-fork-interativo` e autorizou integrá-lo ao projeto principal, com refinamento pela skill `apple-design`. Esta versão em `landing/` é a principal; a restrição anterior de alterar apenas o fork foi superada pela autorização explícita em conversa.
- Preservar paleta, Fraunces/DM Sans, imagens aprovadas e café. Aplicar princípios HIG de hierarquia, legibilidade, alvos confortáveis, feedback e recuperação à web; não transformar a Revista em uma imitação de app nativo.
- Uma única navegação de capítulos, seletor de interesses, caminhos guardados e perguntas expansíveis. Temas guardados não ativam benefícios; catálogo e autenticação de demonstração mantêm seus limites.
- Favoritos existentes continuam em `revista-campus:prototype:favorites:v1`; caminhos do principal usam `revista-campus:prototype:paths:v1`. Não importar as chaves isoladas dos forks.
- Prévia principal na porta 4174. O fork interativo permanece separado na 4175; não alterar `landing-fork-antigravity` sem solicitação.
- Backup anterior à integração em `../backups/landing-before-integration-20261120-151609/`. Revisão HIG e limitações em `qa/apple-design-review.md` e `design-qa.md`.

## Catálogo e símbolo de sol com livro

- O catálogo não repete o banner “Boas descobertas”. O responsável esclareceu que o símbolo correto é **o sol com o livro**, não o sol isolado. Usar `public/assets/sol-e-livro-logo.png`, exportação proporcional da arte aprovada; a landing mantém seu hero.
- O mesmo conjunto de sol e livro identifica a aba via `favicon.ico`, PNGs em 16/32/48 px e ícone de toque de 180 px. Preservar transparência e proporções, sem redesenhar. O sol isolado anterior fica apenas como histórico não utilizado.
- O HTML aponta para `favicon-sol-e-livro.ico` e `favicon-sol-e-livro.png`, com nomes próprios para evitar reutilizar o favicon anterior em cache. O ICO genérico permanece como alternativa para clientes que o procuram diretamente.
- Favoritos salvos exibem `bookmark-solid.svg`, versão preenchida oficial Iconoir, nos cards, no destaque e na lista de salvos. O estado não pode depender apenas da cor/fundo; manter `aria-pressed` e rótulos de salvar/remover.

## Integração Antigravity autorizada

- O responsável pediu explicitamente promover o visual atual de `landing-fork-antigravity` ao Main (`landing/`). Essa apresentação substitui o seletor e a barra de capítulos da integração anterior. Os dois forks continuam independentes e preservados.
- Preferências aprovadas: composição editorial limpa, fundo creme `#F7F2E9` uniforme, banner contínuo até as laterais e três editorias ilustradas. A seleção por rotina inicialmente recolhida foi substituída por uma seção aberta por novo pedido do responsável (DEC-017).
- Sol e livro com paralaxe muito sutil: máximo de 2 px horizontal e 1,5 px vertical, sem inclinação, transição de 500 ms; estáticos em toque e com movimento reduzido.
- Café responde à rolagem nativa. Botões de pausar/retomar foram retirados por pedido explícito; respeitar movimento reduzido, carregamento sob demanda e alternativa estática para falhas de WebGL.
- Preservar o catálogo próprio do Main, símbolo compacto, favicons e favoritos em `revista-campus:prototype:favorites:v1`. Temas continuam em `revista-campus:prototype:paths:v1`; rotina usa `revista-campus:prototype:moments:v1`. Não importar seleções dos forks.
- Backup da versão anterior: `../backups/landing-before-antigravity-20261120-164010/`, com manifesto SHA-256. Aprovação em conversa não substitui QA visual por captura real.

## Primeiras opções reais de assinatura

- O responsável considerou a landing concluída e autorizou cadastrar GitHub, Google, Notion e Canva. Não alterar o visual da apresentação ao adicionar conteúdo ao catálogo.
- Logos reconhecíveis nos ícones dos itens recolhidos, com tratamento monocromático verde e molduras nos tons de papel do Hub; preservar silhuetas e documentar a origem dos vetores locais.
- Agrupar os planos por serviço. Mostrar elegibilidade, renovação, fonte oficial e data de conferência ao expandir. Teste, gratuidade, preço estudantil e acesso institucional são modalidades distintas.
- Feedback explícito: incluir o teste de 30 dias do Canva Pro, seguido de assinatura paga, e várias opções do Google. A inclusão do teste geral do Canva foi autorizada; identificá-lo como promoção geral, também acessível a universitários elegíveis, sem apresentá-lo como desconto exclusivo de estudante.
- Semente atual: GitHub Student Developer Pack; Google AI Plus, AI Pro e AI Pro com YouTube Premium; Notion Education individual; Canva Pro. Não atribuir ao Brasil a antiga oferta do AI Pro grátis dos EUA.
- Consultas oficiais em 20/11/2026. Valores não confirmados publicamente ficam como preço na conta do fornecedor. O resgate do AI Plus termina em 31/12/2026; depois, mostrar encerramento e não oferecer ativação.
- Manter as chaves locais do Main. IDs dos exemplos antigos não devem ser convertidos em favoritos de marcas reais.
- Escopo esclarecido depois pelo responsável: somente acesso pelo próprio estudante, sem programas ou links para contratação por faculdades. Canva Campus removido, assim como o filtro de acesso institucional. O teste individual do Pro continua como promoção geral previamente autorizada; seus links apontam para a página do Pro.

## Avaliação e padronização do catálogo

- O responsável solicitou `../project_state.md` para avaliar o estado real do projeto, distinguindo aprovação em conversa, implementação e QA pendente. Manter o documento coerente com o código e as evidências.
- Cards devem explicitar modalidades, quantidade de opções e ação de abrir/recolher. Ao expandir, alternativas de plano ficam visíveis, com preço, requisitos e renovação em hierarquia legível.
- Todos os logos usam uma única moldura, cor verde, fundo de papel, raio, tamanho e alinhamento, inclusive nos favoritos. Preservar as silhuetas e mostrar os logos apenas nos itens recolhidos do catálogo.
- Esta revisão é visual e documental. Preservar o conteúdo e a data de conferência das ofertas e a landing já concluída.
- O cabeçalho sticky precisa manter fundo creme opaco por toda a largura da tela, acompanhando o banner que ultrapassa a coluna central, para não deixar o banner visível ou recortado nas laterais durante a rolagem.

## Carregamento com identidade

- O responsável solicitou o logo com uma animação discreta na tela de carregamento. Usar o conjunto aprovado de sol e livro sobre o fundo creme, com flutuação mínima e indicação indeterminada em ocre.
- O responsável pediu depois uma permanência mínima de 1–2 segundos. Usar 1000 ms, seguidos de saída de 240 ms; aguardar mais se o conteúdo ainda não estiver pronto. Por novo pedido (DEC-017), aplicar também em toda entrada no catálogo e na volta à apresentação, inclusive com o módulo em cache. Essa instrução substitui a preferência anterior de revisitas diretas e de não impor espera mínima.
- CSS compartilhado em `public/assets/brand-loader.css`, com entrada sequenciada inspirada no reveal do Spell UI e saída suave. Com movimento reduzido, imagem e saída ficam estáticas. Não adicionar biblioteca de movimento nem percentual de progresso fictício; a página carrega em paralelo e fica sem interação até o fim da transição.

## Ampliação aprovada do catálogo — DEC-016

- O responsável selecionou Spotify, Apple Music, Microsoft 365 Personal estudantil e Autodesk Education individual da pesquisa `../assinaturas-candidatas.md`. São oito serviços e dez opções no Main; demais candidatas não estão autorizadas para inclusão.
- Manter acesso individual, fontes e datas, moldura padronizada e máscaras verdes nos novos logos. Spotify/Apple Music em Bem-estar; Microsoft em Estudo; Autodesk em Estudo/Criatividade. Não alterar a landing por esta ampliação.
- Microsoft: validar o valor próximo de R$ 25 mencionado pelo responsável. A página brasileira confirma 50% de desconto; o valor exato não carregou e o checkout ficou inacessível. Até evidência comercial atual, informar preço a consultar na conta; não transformar relato de usuário ou cálculo sobre preço geral em preço confirmado.
- Autodesk: gratuidade anual renovável somente para aprendizado/pesquisa educacional; não oferecer licenças institucionais nem sugerir uso comercial.

## Orientação editorial e transições — DEC-017

- O responsável rejeitou a seção de rotina escondida e o aspecto genérico do painel expandido. Deixar “Não sabe por onde começar?” sempre visível: título Fraunces, linhas numeradas com checkboxes nativos, divisórias finas, ilustração aprovada da editoria e links diretos para as sugestões. Seguir a skill `emil-design-eng`; evitar cartões com ícones, contador de seleções e painel com aparência de dashboard.
- Preservar escolhas e editorias guardadas nas chaves existentes. Uma seleção vazia também deve persistir; não restaurar automaticamente escolhas que o usuário retirou.
- Exibir a tela sol e livro em toda mudança entre catálogo e apresentação, inclusive Explorar benefícios, categorias e histórico do navegador. Manter o conteúdo sem interação durante a tela; devolver foco ao título da vista ao terminar uma navegação.
- Feedback posterior: reduzir um pouco a espera. O mínimo atual é 1000 ms, substituindo os 1500 ms anteriores; preservar a saída de 240 ms e esperar mais se o conteúdo ainda não estiver pronto.

## Páginas institucionais — DEC-018

- O responsável pediu “Quem somos” e LGPD, usando como base uma Alba gratuita, voltada a facilitar a descoberta de benefícios estudantis e aberta a ideias e atualizações. Explicar que o acesso à Alba é gratuito, mas alguns fornecedores cobram por suas assinaturas.
- Páginas em `public/quem-somos.html` e `public/privacidade.html`, com fontes locais, creme/verde e Fraunces/DM Sans. Links nos rodapés da apresentação e do catálogo. Não alterar a identidade nem acrescentar banner genérico de consentimento.
- Descrever o funcionamento atual: três grupos de preferências em localStorage, sem sincronização; conta ainda demonstrativa, sem envio de credenciais; sem analytics/pixels no aplicativo; hospedagem e políticas dos fornecedores são questões distintas.
- O botão de privacidade remove somente as três chaves de preferências da Alba. Nunca usar `localStorage.clear()`, que afetaria outros aplicativos na mesma origem.
- Nome/contato do responsável, configuração e retenção de logs de hospedagem, repositório público e licença ainda precisam ser informados antes de lançamento. Não inventar contatos, links de GitHub, licença, prazos de logs ou alegar conformidade jurídica integral.
- O responsável mencionou banco de dados e link de apoio, mas em seguida adiou ambos e pediu foco nas duas páginas. Não criar backend nem pagamento nesta etapa. A descoberta Supabase foi somente leitura; nenhum projeto, schema ou conta foi criado.

## Contas e apoio retomados — DEC-019

- O responsável retomou explicitamente cadastro e apoio e forneceu o projeto Supabase `kidqssqgmpsurekawbbh` (Alba-Hub). Autorizou conectar esse projeto após reautorizar a integração. Não usar o projeto da FAESA-TI. Esta decisão supera o adiamento anterior de DEC-018.
- O banco usa o Auth gerenciado (`auth.users`), sem tabela pública de senhas. Chave publicável moderna no cliente; jamais expor segredos, usar metadados editáveis como autorização ou conceder leitura pública de usuários.
- Cadastro, login, confirmação, recuperação e saída conectados pela API HTTPS oficial. Tokens apenas em memória, até uma hora; sem renovação automática nem persistência entre recarregamentos nesta etapa. Favoritos permanecem locais. Não prometer sincronização nem excluir conta ao apagar preferências.
- Link de apoio será criado depois, conforme resposta explícita. Manter página de apoio e `supportUrl: null`, sem checkout de exemplo. Catálogo e cadastro não dependem de contribuição.
- Antes de divulgar o cadastro ao público: conferir retornos de e-mail no painel, configurar SMTP próprio para endereços externos à equipe e concluir o aviso de privacidade. Evidências e limitações em `qa/accounts-and-support.md`.
