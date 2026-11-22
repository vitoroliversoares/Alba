# Perguntas frequentes no celular

Revisão de 22/11/2026, solicitada após a integração do apoio ao Main. Implementação em `src/data/editorialData.js`, `src/components/InteractiveSections.jsx` e `src/interactive-antigravity.css`.

| Before | After | Why |
| --- | --- | --- |
| Pergunta principal sobre Ctrl K / ⌘ K | “Como encontro um benefício?”, com Explorar benefícios, busca e Filtrar | Descrever controles disponíveis também no celular |
| Atalho como orientação central | Dica complementar apenas acima de 780 px com hover e ponteiro preciso | Não mostrar instruções de teclado para navegação por toque |
| Títulos longos e detalhe técnico sobre autenticação | Perguntas curtas sobre conta, requisitos, documentos e favoritos | Priorizar dúvidas de uso e facilitar a leitura em tela pequena |
| Resposta com recuo lateral e texto de 14 px | Largura disponível e texto de 15 px nas telas de até 780 px | Evitar linhas excessivamente estreitas e melhorar leitura |
| Chevron poderia perder espaço para a pergunta | Ícone sem encolhimento e texto com quebra de linha | Preservar o indicador do acordeão |

As cinco perguntas são as mesmas em qualquer tela. Somente a dica extra de teclado é controlada por CSS, sem identificação de navegador ou JavaScript para detectar dispositivo. Os atributos de expansão, associação entre botões e painéis, foco e estado inicial foram preservados.

Backup anterior: `../../backups/landing-before-mobile-faq-20261122-144353/`.

A conferência em navegador continua limitada pelo host indisponível; registrar separadamente as verificações de compilação, SSR e recursos HTTP, sem tratá-las como teste visual de celular.

Verificações concluídas: compilação nativa e empacotamento, SSR com cinco perguntas e cinco painéis associados, dica de teclado separada das perguntas e CSS responsivo presente na distribuição servida. O roteiro geral passou com 72 recursos HTTP e sete pares de contraste. Não houve alteração de contas, catálogo ou pagamentos nesta revisão.
