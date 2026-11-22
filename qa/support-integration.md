# Integração do apoio ao Main — DEC-020

Em 22/11/2026, o responsável aprovou a versão final de `landing-fork-apoio` e pediu sua migração ao Main. Integração local concluída; não houve publicação externa.

Prévia principal: http://127.0.0.1:4174/ e página de apoio: http://127.0.0.1:4174/apoie.html.

## Resultado

- “Apoie” imediatamente antes de “Entrar” nos cabeçalhos da apresentação e do catálogo, com os ajustes responsivos aprovados.
- “De estudantes para estudantes” e convite a uma contribuição simbólica no valor de um café. A Alba não tem fins lucrativos; o apoio é voluntário e somente motivação, sem vantagens no catálogo.
- Arte Blender aprovada com fundo transparente. PNG copiado integralmente do fork; as quatro bordas têm alpha zero. Cena e script acompanham o Main. O destino de render da cena foi ajustado para um caminho relativo ao Main, sem novo render.
- Configuração de contas, serviço de autenticação, dados do catálogo, dependências e infraestrutura de hospedagem mantidos com seus hashes originais. `app-config.json` do fork não foi copiado. Link financeiro segue pendente.

## Evidências

- Backup antes da promoção: `../../backups/landing-before-support-integration-20261122-143548/`, com arquivos afetados e manifesto do Main anterior.
- Manifesto dos 11 arquivos integrados, hashes finais e nove arquivos protegidos: `support-integration.json`. Todos os arquivos aprovados são idênticos ao fork, exceto pelo caminho de saída portátil da cena Blender.
- 22 testes passaram, cobrindo contas, catálogo, privacidade e hospedagem. Compilação nativa, empacotamento, SSR dos cabeçalhos, dez planos, oito marcas, 72 recursos HTTP e sete pares de contraste passaram.
- `npm run build` e `npm run test:sites` encontram `spawn EPERM` nesta sessão. Foram usados o esbuild nativo e o executor de testes com `--test-isolation=none`; não registrar os comandos padrão como aprovados.
- Verificação visual em navegador não foi refeita: host indisponível. O responsável aprovou o fork em conversa, e a arte transparente integrada mantém o mesmo hash.

O fork continua disponível na porta 4176 como referência da versão aprovada. Nenhuma conta, inscrição, cobrança ou transferência foi criada durante esta integração.
