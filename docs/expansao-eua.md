---
title: Alba nos EUA — plano e validação
status: proposta
updated: 2026-11-22
---

# Alba nos EUA — plano para avaliar

O responsável escolheu **planejar e validar primeiro**. Este documento não publica uma versão americana, não ativa um seletor de país e não aprova contratos, novos serviços de hospedagem ou coleta adicional de dados. A Alba atual continua voltada a estudantes no Brasil.

## Direção sugerida

Manter a mesma marca, visual editorial e acesso gratuito. Uma futura versão dos EUA teria textos revisados em inglês americano e ofertas próprias em USD, para estudantes elegíveis naquele mercado. O país onde a pessoa estuda é diferente do idioma da interface: falar português ou inglês não determina quais benefícios ela pode usar.

Começar com poucas ofertas verificadas, em vez de traduzir automaticamente o catálogo brasileiro. A seleção de país deverá ser manual, com rótulos claros; não redirecionar por IP nem converter preços de BRL para USD. Nenhuma aprovação em universidade brasileira deve ser tratada como aprovação automática nos EUA, ou vice-versa.

## Primeira lista para validação

Pesquisa de fontes oficiais em **22/11/2026**. “Confirmado na fonte” significa condição documental observada, não aprovação de uma conta real. Todas as candidatas exigem revisão final antes da publicação.

| Candidata | Condição observada / proposta | Diferença relevante | Validação restante |
| --- | --- | --- | --- |
| Spotify Premium Student | **US$ 6,99/mês**, com Hulu com anúncios; primeiro mês gratuito para novas contas qualificadas. [Página dos EUA](https://www.spotify.com/us/student/), [condições do Hulu](https://support.spotify.com/us/article/hulu-premium-bundle/) | Instituição americana Title IV elegível; maior de 18 anos; verificação SheerID e revalidação anual, com limite de quatro anos. Não transportar o pacote Hulu para o Brasil | Conferir elegibilidade da instituição, migração de assinaturas e impostos no checkout |
| Apple Music Student | **US$ 6,99/mês** na [página americana](https://www.apple.com/apple-music/). [Regras de estudante](https://support.apple.com/en-us/106008) | Oferta vinculada à Conta Apple e ao vínculo acadêmico; acesso adicional ao Apple TV não deve ser prometido como permanente | Confirmar região da conta, verificação e condições atuais do benefício de TV |
| YouTube Premium / Music Premium | Duas alternativas estudantis; EUA constam nos [países oficiais](https://support.google.com/youtube/answer/9158808?hl=en) | Premium já inclui Music Premium; revalidação anual e duração máxima de quatro anos | Preço em USD e eventual avaliação precisam ser conferidos na conta americana; não reaproveitar preço ou pacote do Brasil |
| Adobe Creative Cloud Pro | Campanha de 13 a 27/11/2026: **US$ 15,99/mês no primeiro ano**, compromisso anual; referência de renovação **US$ 39,99/mês**, sujeita a mudança. [Termos americanos](https://www.adobe.com/offer-terms/ste-special-offer) | Promoção para novos assinantes qualificados, 18+. Tem prazo curto e renovação diferente da oferta brasileira | **Revalidar após 27/11**; revisar cancelamento dos EUA sem copiar a regra brasileira |
| Microsoft 365 Personal estudantil | A [página dos EUA](https://www.microsoft.com/en-us/microsoft-365/college-student-pricing) anuncia 50% de desconto, mas o valor não foi exposto nesta consulta | Conta Microsoft pessoal; comprovação universitária e reverificação. Não é contratação institucional de Office | Confirmar preço final em USD e impostos; não calcular o preço a partir do plano comum |
| GitHub Student Developer Pack | Candidato gratuito, a partir do [programa individual](https://education.github.com/pack) já usado na Alba | Ofertas dos parceiros podem ter regiões, limites e renovação próprios | Revalidar o fluxo com instituição americana elegível; não anunciar que todos os parceiros são gratuitos indefinidamente |
| JetBrains Student Pack | Licença educacional individual, sem custo enquanto elegível. [Programa](https://www.jetbrains.com/academy/student-pack/) e [elegibilidade](https://sales.jetbrains.com/hc/en-gb/articles/11557849416594-Who-is-eligible-for-free-individual-educational-licenses) | Uso não comercial; programa credenciado de longa duração. Recursos de IA não são uma assinatura gratuita permanente | Validar instituição e duração mínima no formulário americano |
| Notion Education | Candidato do [programa individual de educação](https://www.notion.com/help/notion-for-education) | Espaço com um membro, e-mail institucional e requisitos acadêmicos; não prometer IA paga incluída | Rever termos e procedimento na conta americana antes de publicar |

**Sugestão para uma primeira versão:** GitHub, JetBrains, Notion, Spotify, Apple Music e YouTube. Adobe só entra com uma condição comercial válida na data de lançamento. Microsoft depende da conferência do valor exibido para a conta.

## Candidatas que ainda não entram

| Programa | Motivo |
| --- | --- |
| Figma Education | O Brasil tem agora evidência regional da [RNP](https://www.rnpmais.rnp.br/figma) e caso real do responsável. Isso não substitui a conferência americana. Para os EUA, validar conta/instituição e registrar a divergência de vigência nas fontes; usar somente solicitação individual de ensino superior. [Pesquisa brasileira](pesquisas/assinaturas/figma-education.md) |
| Obsidian Sync / Publish | Há [desconto educacional de 40%](https://obsidian.md/help/discounts), mas faltam validar conta, cobrança e renovação do mercado escolhido. O aplicativo básico já é gratuito; os serviços pagos são opcionais |
| Amazon Prime for Young Adults | A [oferta oficial](https://www.aboutamazon.com/news/retail/amazon-prime-for-young-adults) também atende pessoas por idade. Avaliar separadamente o caminho estudantil e se um pacote de varejo combina com o foco digital da Alba, antes de incluí-lo |
| Google AI | Não transportar o teste brasileiro de AI Plus nem presumir que promoções do Google têm os mesmos planos, prazos ou público em ambos os países. Pesquisar uma oferta americana vigente antes de selecioná-la |

## Como implementar depois da aprovação

1. Separar identidade do serviço de cada oferta regional. Preservar os IDs atuais; adicionar `market`, `currency`, `locale`, requisitos e fontes por oferta, sem sobrescrever os dados brasileiros.
2. Tratar preço, cobrança mensal/anual, impostos e compromisso separadamente. `locale` só formata a apresentação; não converte moeda nem determina elegibilidade.
3. Manter a data de conferência em cada oferta. Prazos de campanhas devem trazer o fuso aplicável ou uma condição explícita; o corte atual em São Paulo não serve automaticamente para os EUA.
4. Preservar favoritos locais existentes. Um serviço salvo não pode ser relabelado como outro produto, nem dar a entender que uma oferta americana se aplica a quem estuda no Brasil.
5. Preparar navegação e textos em inglês revisados por contexto, incluindo mensagens de conta, dúvidas, privacidade e carregamento. Não ativar uma interface parcialmente traduzida.
6. Revisar aviso de privacidade, contato do responsável, público etário, domínio e e-mails de Auth para a operação americana. Não criar outro banco apenas por alterar o idioma do catálogo.

## Critérios para publicar

- [ ] Seleção de ofertas americanas aprovada pelo responsável.
- [ ] Preços, elegibilidade, fontes, renovação e cancelamento locais conferidos novamente.
- [ ] Testes para evitar mistura de países, moedas, prazos e IDs de favoritos.
- [ ] Escolha de país e idioma acessível e conferida em celular.
- [ ] Textos completos em inglês, incluindo contas e páginas institucionais.
- [ ] Domínio, e-mails e privacidade preparados para o público escolhido.
- [ ] Autorização para implementar e publicar a versão americana.

Não houve criação de conta de estudante, matrícula enviada, checkout concluído ou contratação durante a pesquisa.
