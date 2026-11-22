# Design QA — catálogo real no Main

> Atualização de 22/11/2026: promoção aprovada do fork de catálogo, agora com 12 serviços e 15 opções. Build alternativo, 31 testes, SSR de 15 planos/12 cards, 77 recursos e sete pares de contraste passaram. Estado atual em [docs/project_state.md](docs/project_state.md). O restante deste arquivo registra verificações históricas; não é uma captura visual da promoção.

Atualização: 21/11/2026. Fontes comerciais consultadas em 20/11/2026. Escopo autorizado: serviços reais e logos na estética da Alba, incluindo a ampliação DEC-016, preservando a landing concluída.

Resultado: **compilação alternativa, dados e verificações de integração aprovados; revisão visual automática pendente**.

## Conteúdo e interface

Oito serviços, com dez opções de acesso individual: GitHub Student Developer Pack; Google AI Plus, AI Pro e AI Pro com YouTube Premium; Notion Education; Canva Pro de 30 dias; Spotify Universitário; Apple Music Universitário; Microsoft 365 Personal estudantil; Autodesk Education individual. Canva Campus e a modalidade institucional permanecem excluídos. Fontes oficiais, elegibilidade, condições de renovação e data de conferência constam de cada plano. Detalhamento em `qa/catalog-sources.md`.

| Before | After | Why |
| --- | --- | --- |
| Exemplos fictícios e botões sem destino comercial | Opções reais com links oficiais e conferência datada | Permitir descoberta e contratação no fornecedor |
| Logos com fundos e raios diferentes | Uma moldura de papel, mesma área útil e verde para as oito marcas | Reconhecimento com tamanho e alinhamento consistentes |
| Primeira oferta automaticamente em destaque | Oito itens recolhidos, com expansão nativa | Preservar leitura limpa e mostrar condições por intenção |
| Uma modalidade por exemplo | Planos por serviço, seletor e três modalidades | Distinguir teste, gratuidade e preço estudantil |
| Alternativas escondidas em seletor fechado | Lista de planos visível no item aberto | Facilitar comparação entre as opções Google e Canva |
| Card sem indicação explícita da quantidade de planos | Modalidades, contagem de opções e ação de abrir/recolher | Deixar claro o que existe antes de expandir |
| Orientação de rotina escondida em acordeão e painel de cartões | Seção aberta, título editorial, escolhas em linhas e ilustração da editoria | Dar visibilidade e manter o acabamento da Alba, com orientação da skill Emil |
| Tela de carregamento só na abertura/primeiro catálogo | Tela em toda troca entre apresentação e catálogo, mesmo em cache | Atender ao novo comportamento solicitado pelo responsável |
| Ausência de informações institucionais e aviso de privacidade | Links nos dois rodapés para páginas editoriais próprias, com controle para apagar preferências | Explicar a proposta gratuita e o uso atual dos dados sem poluir a landing |

Os logos somem do cabeçalho do item aberto; a ilustração de categoria acompanha os detalhes. A abertura usa `details`/`summary`; botões de favoritos ficam fora do summary para evitar ações aninhadas. Preços não confirmados aparecem como valor a consultar na conta. O teste do Canva Pro está identificado como promoção geral, também utilizável por universitários elegíveis.

Na revisão de padronização, os logos passaram a compartilhar moldura de 52 × 52 px, símbolo de 30 × 30 px, raio de 8 px e fundo de papel; no celular, 48 × 48 px e símbolo de 28 × 28 px para todas as marcas. O painel aberto usa uma coluna menor para ilustração/planos e outra para preço, requisitos e renovação. Dados comerciais e vetores preservados. Estado consolidado e prioridades em `../project_state.md`.

No carregamento, o responsável solicitou uma abertura de 1–2 s e depois sua repetição nas transições (DEC-017). A implementação mantém 1000 ms e encerra em 240 ms após o conteúdo ficar pronto, aproveitando o primeiro paint do shell quando disponível. A entrada é sequenciada em passos de 60 ms, com transform/opacity, inspirada no [reveal do Spell UI](https://spell.sh/docs/blur-reveal); o [Craft Docs no Refero](https://styles.refero.design/style/9f228e72-997a-4410-9190-68359028e3d0) foi consultado como referência de composição sobre papel. Não foram instaladas bibliotecas nem alterados os tokens de identidade. O conteúdo permanece `inert` durante a tela; toda mudança entre catálogo e apresentação reinicia o ciclo, mesmo em cache. Ao terminar a navegação, o foco vai ao título da vista. A percepção do tempo e da transição ainda precisa de conferência visual.

A composição aprovada da landing foi preservada. Na correção do cabeçalho, a análise do CSS identificou o fundo limitado à coluna de 1240 px, enquanto o banner usa 100vw. O fundo opaco do cabeçalho sticky agora acompanha toda a largura da tela, em camada própria, mantendo a navegação na coluna e o banner abaixo. A conferência visual durante a rolagem continua pendente. Os dois forks permanecem históricos.

## Verificação executada

- Compilação pela CLI nativa do esbuild com JSX automático e chunks separados.
- Empacotamento pelos scripts originais; saídas de Sites em `dist/client`, `dist/server` e `dist/.openai` presentes.
- 22 testes passaram: oito de contas, sete de catálogo, três de privacidade e quatro de hospedagem, usando `--test-isolation=none`.
- Verificadas fontes HTTPS em domínios oficiais, campos obrigatórios, modalidade de cada opção e ausência de preço zero inventado para planos não confirmados.
- Busca, categoria e modalidade combinadas; pesquisa por YouTube mostra apenas o plano correspondente.
- Prazo do AI Plus testado no limite de 31/12/2026, com horário de São Paulo.
- Armazenamento inválido, duplicado e bloqueado não quebra a leitura; IDs antigos não se tornam favoritos de serviços reais.
- SSR da apresentação, três categorias, dez detalhes individuais, oito itens inicialmente recolhidos, temas salvos e favoritos com ícones preenchidos/vazios nas oito marcas.
- SSR da rotina em seis estados: inicial, vazio, projeto criativo, pausas, todos os momentos e dados corrompidos. Conferidos também caminhos já guardados e armazenamento bloqueado. A seleção vazia permanece vazia após leitura, sem reativar a sugestão inicial.
- 70 recursos HTTP retornaram 200; logos, fontes, ilustrações, favicons, loader, GLB, páginas institucionais, apoio, retorno de autenticação, configuração pública e módulos de conta incluídos.
- Revisão estrutural do carregamento: logo sol e livro no HTML inicial e no controlador React, com CSS compartilhado, status acessível e alternativa para JavaScript desativado. O layout effect de cada vista inicia o ciclo; a apresentação sinaliza prontidão imediatamente e o catálogo ao montar, inclusive nas revisitas. Os tempos reais e os cliques ainda não foram observados em navegador.
- Conferidos IDs únicos no catálogo e referências dos controles de plano. A ampliação mantém os quatro serviços anteriores e adiciona quatro; fontes, SVGs e hashes dos novos logos registrados. Microsoft permanece sem valor numérico, pois os R$ 25 não foram confirmados comercialmente.
- GLB analisado pelo Three.js e sete pares de contraste passaram nos cálculos existentes. Isso não constitui auditoria WCAG completa.

## Limitações

`npm run build` encontra `spawn EPERM` ao iniciar subprocessos. A compilação alternativa e os testes sem isolamento passaram; isso não equivale a afirmar que o comando Vite padrão passou.

Prévia local: `http://127.0.0.1:4174/#catalogo`. Em 21/11 o inventário nativo voltou a funcionar, mas o acesso à janela do Opera foi encerrado pela ferramenta por não conseguir determinar a URL com segurança. Não foram obtidas capturas. Enquadramento, overflow, operação visual dos seletores, teclado, diálogos e ciclos reais de carregamento ainda exigem verificação em navegador. Links e condições comerciais foram consultados nas fontes oficiais; não foram feitas inscrições, pagamentos ou validações de identidade.

Backup anterior: `../backups/landing-before-real-catalog-20261120-164701/`. Evidências atuais: `qa/build-checks.json`, `qa/catalog-sources.md` e `public/assets/brands/sources.json`. Relatórios de integrações anteriores são históricos.

## Integração do apoio — DEC-020

Revisão posterior de perguntas frequentes: títulos mais curtos, instruções pelos controles do catálogo, dica de teclado complementar somente em telas maiores com hover e ponteiro preciso, e respostas com melhor aproveitamento da largura no celular. Compilação, SSR e 72 recursos passaram; detalhes e limites em [Perguntas no celular](qa/mobile-faq.md).

Em 22/11/2026, a versão aprovada de `landing-fork-apoio` foi promovida ao Main. Cabeçalhos, textos e render Blender transparente foram integrados com a configuração de contas preservada. Na versão final, 22 testes, 72 recursos HTTP e sete pares de contraste passaram. Os comandos padrão seguem bloqueados por `spawn EPERM`; compilação nativa e testes sem isolamento passaram. Evidências e backup em [Integração do apoio](qa/support-integration.md). Não houve publicação externa ou nova captura no navegador.

## Privacidade e conteúdo institucional

Páginas independentes `public/quem-somos.html` e `public/privacidade.html` seguem os tokens existentes, com fontes locais, largura de leitura contida e links acessíveis nos dois rodapés. A página de privacidade informa armazenamento local, cadastro opcional conectado ao Supabase, sessão em memória, fornecedores externos e pendências da hospedagem. O botão remove exclusivamente as chaves de favoritos, editorias e momentos; casos de falha parcial e armazenamento bloqueado retornam aviso de erro. O fluxo sem JavaScript explica como usar as configurações do navegador.

As orientações de direitos foram consultadas em 21/11/2026 na [ANPD](https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares) e no [texto da LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm). Isso fundamenta a redação do aviso, sem equivaler a auditoria de conformidade jurídica. Identidade/contato do responsável e configuração/retenção dos registros técnicos da hospedagem continuam pendentes. Não há repositório público/licença de código confirmados no workspace: a página apresenta a proposta aberta e informa essa pendência.

Após DEC-018, o responsável retomou o cadastro e autorizou a conexão do projeto Alba-Hub que ele criou (DEC-019). SQL confirmou o Auth e as permissões, e o assessor de segurança ficou sem alertas após restringir a execução de uma função interna de evento. A aplicação usa somente chave publicável moderna. Não foram criadas contas de teste nem enviado e-mail. O link de apoio segue adiado por decisão explícita; a página está preparada e não apresenta checkout fictício. Detalhes e limites em [Contas e apoio](qa/accounts-and-support.md). QA visual continua bloqueado pelo host de navegador indisponível.
