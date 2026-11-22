# Design review: Revista de Campus

## Summary

**Good — revisão de código, com inspeção visual pendente.** Landing web React para estudantes brasileiros: apresentar benefícios digitais e convidar à exploração livre. Sua assinatura é o livro com sol em colagem, acompanhado do café na narrativa; preservar essa identidade, Fraunces/DM Sans e a paleta aprovada. Aplicar os fundamentos HIG à web, sem reproduzir convenções de aplicativos nativos.

## Improvements

- **Medium — alvos compactos.** Remoção de caminhos usa 36 px; login/cadastro chega a 36 px de altura no mobile. Ampliar ações para 44 × 44 CSS px como meta de conforto web. `buttons.md › Best practices`: “Make buttons easy for people to use.” Isso adapta o princípio, sem equiparar CSS px a pontos nativos.
- **Medium — texto auxiliar.** Navegação, estado de guardar e notas usam 10–12 px em vários breakpoints. Elevar controles a 14 px e notas a 13 px, com unidades rem e linhas flexíveis. `typography.md › Ensuring legibility`: “Use font sizes that most people can read easily.”
- **Medium — seleção e contraste.** Fortalecer contornos de controles, sublinhar capítulo ativo e manter check/estado textual. `accessibility.md › Vision`: “Convey information with more than color alone.”
- **Medium — recuperação e contexto.** Ao remover um caminho, manter foco dentro do diálogo, anunciar a remoção e oferecer desfazer sem prazo. `feedback.md › Best practices`: “Consider integrating status feedback into your interface.”

## Craft notes

**Medium — remover acessórios.** O cabeçalho e a barra de capítulos repetem a mesma navegação; categorias exibem números embora não sejam etapas. Remover a primeira navegação e a contagem de categorias. Manter um único índice, com títulos claros. Julgamento de composição, apoiado em `layout.md › Best practices` e na prioridade de limitar controles de `designing-for-ios.md › Best practices`.

Refinar a seleção como uma página dupla: colagem ampla, texto com largura de leitura e controles agrupados. Cantos moderados, superfície de papel e sombras leves; nenhuma nova ilustração, animação contínua ou efeito de vidro no conteúdo.

## Plano de tokens e composição

| Papel | Claro aplicado | Escuro apenas planejado | Uso |
|---|---|---|---|
| Papel | #F7F2E9 | #222621 | Superfície |
| Tinta | #222621 | #F7F2E9 | Leitura |
| Verde | #16483B | #A8D1BA | Ações |
| Ocre | #F2D38B | #F2D38B | Seleção |
| Secundário | #53604F | #C1CABD | Notas |
| Contorno | #788473 | #899A83 | Controles |

Contraste calculado e registrado em `build-checks.json`; texto exige pelo menos 4,5:1 e contorno de controle, 3:1. A direção aprovada continua clara; o modo escuro precisa de revisão das ilustrações antes de ser implementado.

Escala: título fluido 40–68 px; seções 34–48 px; corpo 16–18 px; controles 14–16 px; notas 13 px. Na web, rem permite acompanhar preferências de tamanho. Alinhamento por uma margem comum, respiro de 64–88 px entre seções.

```text
Regular: marca + conta / índice / título | livro / apresentação
         interesses / colagem | leitura + ações / café / perguntas
Compacto: marca + conta / índice adaptável / título / livro
          interesses empilhados / colagem / leitura + ações
```

O plano pertence a esta revista: o livro e o café fazem parte do universo estudantil já aprovado. Não trocar sua voz por uma interface de sistema. Movimento mantém apenas feedback breve e o café existente; preferência reduzida conserva conteúdo e estados.

## What works

Exploração sem conta, imagens por categoria, condições transparentes, diálogo nativo, rádios e perguntas nativas. `modality.md › Best practices` sustenta tarefas curtas; `icons.md › Best practices` pede consistência visual; `motion.md › Best practices` recomenda movimento opcional. Todas essas referências foram lidas na skill local.

## Platform notes

Conferir 320–1440 px, zoom/texto ampliado, foco de teclado, contraste aumentado, transparência reduzida e movimento reduzido. A leitura de código e os cálculos não comprovam essas condições no navegador. O resultado visual e o funcionamento assistivo permanecem pendentes se o host de automação não estiver disponível.

## Revisão após implementação

Implementados: navegação única e adaptável, remoção da numeração de categorias, textos auxiliares maiores, alvos de 44 px, ícones Iconoir centralizados, seleção com check/contorno, feedback com desfazer e restauração de foco, âncoras com margem baseada na altura real da barra e respostas a contraste/transparência/movimento reduzidos. A colagem e o café continuam sendo as assinaturas visuais; não foram adicionados ornamentos.

Contrastes medidos: tinta/papel 13,77:1; verde/papel 9,30:1; secundário/papel 5,97:1; contorno/papel 3,52:1. Compilação, renderização inicial, integridade e recursos HTTP foram conferidos. O host de navegador retornou indisponível novamente; avaliação visual, zoom e interação assistiva não foram aprovados.
