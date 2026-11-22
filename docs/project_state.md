---
title: Estado do projeto — Alba
updated: 2026-11-22
status: prototipo-funcional
---

# Estado do projeto — Alba

O Main reúne a landing aprovada e o catálogo avaliado em fork. O repositório público é [vitoroliversoares/Alba](https://github.com/vitoroliversoares/Alba), com a branch `main`. Forks, backups e arquivos privados do workspace não integram o repositório. A configuração real de contas continua somente no Main local; o Git inclui um exemplo desconectado.

| Área | Implementado | Limite atual |
| --- | --- | --- |
| Identidade | Creme, verde, Fraunces, DM Sans, sol e livro | Materiais visuais têm escopo de licença próprio |
| Catálogo brasileiro | 12 serviços e 15 opções individuais | Preços e disponibilidade exigem revisão contínua |
| Figma | Gratuidade educacional pesquisada e aprovada | Reverificação e vencimento na conta; fontes divergem sobre duração |
| Itens expandidos | Ilustrações por categoria restauradas | Logos permanecem nos itens recolhidos |
| Navegação | Todos ao abrir/recarregar o catálogo | Categoria explícita ainda abre sua própria seleção |
| Carregamento | Sol e livro, mínimo de 1 s e saída de 240 ms | Movimento reduzido respeitado |
| Contas | Supabase Auth e tabelas com RLS por usuário | Validação de e-mail real e configuração pública pendentes |
| Favoritos e preferências | Persistência no navegador | Sem sincronização com banco, inclusive com login |
| Privacidade | Página com explicação da versão e limpeza local | Contato, hospedagem/logs e exclusão de conta precisam ser concluídos |
| Versão dos EUA | Planejamento documental | Sem catálogo ou seletor americano |

## Verificação

Na revisão de 22/11/2026, **26 testes passaram**, cobrindo catálogo, contas, privacidade, arquivos da distribuição estática e geração segura de configuração para deploy. O QA adicional passou na renderização dos 15 planos, 12 itens recolhidos, três categorias e entrada direta em Todos; 72 recursos retornaram HTTP 200, o GLB foi lido e sete pares de contraste atenderam aos limiares definidos. Persistência, corrupção e bloqueio de armazenamento também passaram. O build padrão encontrou `spawn EPERM` neste workspace; a distribuição foi validada pela alternativa com esbuild nativo. Relatórios locais em `qa/` são gerados durante a validação e não são publicados como evidência visual.

A avaliação visual do responsável foi dada em conversa. Não há captura automatizada de navegador desta promoção. SSR, testes unitários e leitura de CSS não substituem teste visual ou fluxo completo de cadastro. Não foram criados usuários nem enviados e-mails de teste nesta promoção.

## Pendências para lançamento

- Validar confirmação e recuperação com e-mail real e configurar envio para público externo.
- Concluir contato e obrigações de privacidade conforme a hospedagem escolhida.
- Rever ofertas com prazo: campanha Adobe até 27/11/2026 e resgate Google AI Plus até 31/12/2026.
- Fazer QA visual em celular e desktop e observar navegação, foco e WebGL no navegador.

O protótipo público para colaboração não deve ser descrito como lançamento concluído. A licença do código, os créditos e a documentação de contribuição estão prontos para o repositório.
