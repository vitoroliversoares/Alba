# Carregamento ao abrir Apoie

Implementado no Main em 22/11/2026, por solicitação do responsável. A página estática usa o mesmo CSS, logo e animação da abertura da Alba: mínimo de 1000 ms, seguido da saída de 240 ms. Movimento reduzido mantém o tempo mínimo e dispensa a transição.

| Before | After | Why |
| --- | --- | --- |
| Apoie abria diretamente | Carregamento com o logo ao entrar por qualquer link ou abrir a URL | Manter a continuidade da navegação |
| Página podia aparecer antes de a arte estar pronta | Aguarda a imagem, sem bloquear por mais de cinco segundos | Evitar aparição abrupta sem prender a navegação em caso de falha |
| Sem tratamento próprio para histórico | Repete o carregamento na restauração por bfcache | Manter o comportamento também ao revisitar |

`public/assets/support-loader.js` inicia a transição pelo HTML, sem interceptar links e sem carregar React na página institucional. Enquanto carrega, o conteúdo fica oculto, inerte e fora da árvore acessível. Ao terminar, o título recebe foco sem rolar a página. Sem JavaScript, nenhuma classe de bloqueio é adicionada e o conteúdo permanece acessível. O link financeiro é carregado separadamente e não determina o fim da transição.

O responsável informou que criará o link do Stripe. `supportUrl` continua nulo até receber o endereço real; não foram criados produto, checkout, cobrança ou destino fictício.

Verificação: 27 testes passaram, incluindo cinco casos do carregamento (tempo mínimo/saída, movimento reduzido, falha de imagem, espera interrompida pelo limite e retorno pelo histórico). Roteiro geral com 73 recursos HTTP e sete pares de contraste passou. Empacotamento local/Sites concluído. A revisão visual em navegador permanece pendente por indisponibilidade do host, sem alegação de teste visual.

Backup: `../../backups/landing-before-support-loader-20261122-144928/`.

```powershell
node --test --test-isolation=none tests/support-loader.test.mjs
```
