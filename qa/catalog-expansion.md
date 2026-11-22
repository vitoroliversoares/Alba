# Ampliação de assinaturas — 22/11/2026

Solicitação: ampliar o catálogo e estudar uma possível versão dos EUA. O responsável escolheu planejar e validar a versão americana antes de implementá-la.

| Before | After | Why |
| --- | --- | --- |
| Oito serviços e dez opções | 11 serviços e 14 opções: Adobe, JetBrains e YouTube Premium/Music | Ampliar criação, desenvolvimento e entretenimento com acesso individual |
| Uma data global compartilhada por todos os registros | Data de cada plano preservada; revisão mais recente no rodapé | Não apresentar evidência antiga como reconferida |
| Campanha Adobe apenas na pesquisa | Oferta com contrato anual, renovação e prazo de resgate explícitos | Exibir as condições necessárias para decidir antes de contratar |
| Marcas disponíveis só para os serviços anteriores | Três SVGs originais com o mesmo `BrandMark`, sem mudar CSS | Manter o padrão visual aprovado |
| Possibilidade de uma versão EUA sem escopo definido | Plano separado em `../../expansao-eua.md` | Validar mercado, idioma, moeda e elegibilidade antes de ativar navegação |

A campanha brasileira da Adobe consultada termina em 27/11/2026 e precisa de nova revisão após essa data. O resgate é desativado pelo controle de prazo existente. YouTube permanece sem preço numérico inventado; Premium inclui Music Premium e foi apresentado como alternativa ao pacote Google já existente. JetBrains mantém uso educacional não comercial e verificação de instituição/curso. Figma e Obsidian seguem pendentes.

Fontes: [catálogo](catalog-sources.md). Os dez planos anteriores mantêm `verifiedAt: 2026-11-20`; os quatro novos usam `2026-11-22`. Não houve teste de aprovação acadêmica, criação de conta, compra ou envio de matrícula.

Verificação concluída:

- 29 testes passaram, incluindo nove do catálogo. Cobrem combinação de busca/filtros, alternativas e pacotes, dados de renovação, datas de conferência e corte de prazo da Adobe no Brasil.
- SSR dos 14 planos e 11 marcas; 76 recursos HTTP 200; sete pares de contraste.
- Hashes dos 11 logos conferidos com sua proveniência. Sete arquivos protegidos — contas, configuração, componente/estilos de marca, dependências e hospedagem — permaneceram iguais.
- Compilação com esbuild nativo e empacotamento local/Sites. O limite conhecido de subprocessos do comando padrão continua documentado no README.
- Não foi possível conferir o layout em navegador, pois o host permanece indisponível. Os componentes visuais existentes foram reutilizados.

Backup: `../../backups/landing-before-catalog-expansion-20261122-175137/`. Manifestos: `catalog-expansion-before.json`, `catalog-expansion-checks.json`, `build-checks.json` e `../public/assets/brands/sources.json`.
