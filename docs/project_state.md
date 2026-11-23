---
title: Estado do projeto — Alba
updated: 2026-11-23
status: beta-em-construcao
---

# Estado do projeto — Alba

O responsável autorizou a promoção das contas para Main em 23/11/2026. O site público é https://alba-hub.vercel.app/, conectado ao repositório `vitoroliversoares/Alba`, branch `main`, na Vercel com Node 24. A página de Apoie continua apenas no fork, fora do Main.

| Área | Implementado | Limite atual |
| --- | --- | --- |
| Identidade | Creme, verde, nome Alba em Fraunces 800, sol e livro | Materiais visuais têm escopo próprio de licença |
| Catálogo | 12 serviços, 15 opções individuais no Brasil | Revisão contínua de preços e disponibilidade |
| Contas | Google como único acesso social, e-mail/senha com Supabase Auth | Consentimento/retorno completo e SMTP pendem de validação do responsável |
| Retorno OAuth | Raiz do site público e callback alternativo compatível, com PKCE S256 | Lista de retornos e credenciais são administradas no Supabase |
| Favoritos e preferências | Vinculados à conta; RLS e salvamento autenticado | Recarregar exige novo login; marcadores legados não são importados |
| Privacidade | Dados, finalidades, infraestrutura, direitos e registro temporário OAuth descritos | Contato, canal de direitos/exclusão, retenção técnica e transferência internacional ainda precisam ser concluídos |
| Versão dos EUA | Planejamento documental | Sem catálogo ou seletor americano |

## Verificação

Passaram 50 testes de Auth, dados da conta, OAuth, privacidade, catálogo, configuração e artefatos na promoção. O assessor de segurança do Supabase retornou `lints: []`; o provedor Google está ativo. As consultas anônimas às tabelas de escolhas são negadas. O agente não criou usuários nem concluiu login em conta pessoal Google.

O build local usa esbuild nativo devido à limitação de spawn EPERM deste workspace; a publicação usa o build padrão Vite na Vercel. Os relatórios de QA locais não substituem avaliação visual ou consentimento/retorno real do Google.

Mais detalhes em [Autenticação](authentication.md), [banco](../supabase/README.md) e [aviso de privacidade](../public/privacidade.html). Forks, backups e credenciais reais permanecem fora do Git; a URL e a chave publicável são configuradas no ambiente de produção.
