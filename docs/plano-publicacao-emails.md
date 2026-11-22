---
title: Publicação e e-mails transacionais — Alba
status: proposta-para-validacao
verifiedAt: 2026-11-22
---

# Publicação e e-mails da Alba

Este documento é um planejamento. Não foram criados serviços, alterados DNS/SMTP, publicados deployments ou enviados e-mails nesta etapa.

## O que precisa vir antes

O repositório guarda o código; a hospedagem disponibiliza o site. Para o envio regular pelo Resend, precisamos de um domínio controlado pelo responsável e acesso ao DNS. Verificar esse domínio não depende de o site já estar publicado. Podemos preparar os e-mails em paralelo à hospedagem. A exigência documentada é o [domínio verificado no Resend](https://resend.com/docs/add-a-domain).

Para testar a jornada em outros dispositivos, recomendo primeiro obter uma URL HTTPS estável de avaliação. O teste local também é possível, mas um link que retorna para localhost só funciona no dispositivo com a aplicação local disponível.

## Arquitetura proposta

```text
Alba → Supabase Auth → SMTP do Resend → caixa de entrada
          ↑                                  |
          └─ validação do link ← clique ──────┘
                       |
                       └→ Alba /auth-callback.html
```

A Alba já solicita cadastro e recuperação ao Supabase. Vamos manter esse fluxo e configurar o Resend como transporte SMTP. Não precisamos adicionar um servidor de envio nem o SDK do Resend ao navegador para esses dois casos. A integração é descrita no [guia Resend + Supabase SMTP](https://resend.com/docs/send-with-supabase-smtp).

## Etapas propostas

| Etapa | Trabalho | Condição para avançar |
| --- | --- | --- |
| 1. Endereços | Escolher hospedagem, domínio e remetente | Acesso às contas e ao DNS confirmado |
| 2. Site de avaliação | Publicar o catálogo em HTTPS e preparar sua configuração | Catálogo, páginas e callback acessíveis diretamente |
| 3. Domínio de e-mail | Verificar o remetente no Resend e configurar DNS | Domínio verificado e autenticação de e-mail conferida |
| 4. SMTP e mensagens | Configurar Supabase e revisar os templates | Confirmação e recuperação enviadas pelo fluxo real |
| 5. Validação e lançamento | Testar em contas autorizadas e concluir pendências | Jornada completa aprovada antes da divulgação |

### 1. Endereços e remetente

Minha proposta é Vercel para a aplicação React/Vite existente, sem trocar o framework. O provedor [suporta Vite e integração com Git](https://vercel.com/docs/frameworks/frontend/vite). Essa escolha ainda depende da decisão do responsável.

Escolher um domínio próprio para a Alba e um subdomínio de envio. Exemplo ilustrativo: verificar `auth.exemplo.com` e usar `Alba <conta@auth.exemplo.com>`. O endereço precisa corresponder ao domínio efetivamente verificado. A [documentação do Resend](https://resend.com/docs/dashboard/domains/introduction) recomenda separar envios por subdomínio.

Definir também um contato real que receba respostas. SMTP de saída não deve ser confundido com uma caixa de atendimento já configurada. Conferir os custos do domínio e as cotas dos planos antes de contratar qualquer serviço.

### 2. Preparar a publicação

- Importar o repositório Alba, branch `main`, usando a raiz `.`. A pasta `landing/` do workspace já corresponde à raiz do repositório.
- Usar Node.js 24, `npm ci`, `npm run build` e saída `dist/client/`, conforme a configuração atual.
- Validar o build padrão no ambiente da hospedagem: a alternativa local passou, mas este workspace restringe subprocessos com `spawn EPERM`.
- Preparar a geração de `app-config.json` no deploy com URL e chave publicável do Supabase. O arquivo real local não está no Git. Variáveis da hospedagem, sozinhas, não são lidas pelo código atual: precisamos gerar o JSON ou adaptar sua leitura.
- Preservar o catálogo sem login. A primeira publicação pode permanecer com cadastro desconectado enquanto validamos o envio.
- Verificar `/auth-callback.html` e seus módulos, cache da configuração e acesso ao callback pelos participantes dos testes.

### 3. Preparar o Resend

Adicionar os registros DNS exibidos para o domínio escolhido e conferir SPF e DKIM. Depois, revisar DMARC e registros existentes, sem substituir a configuração de outro serviço de e-mail inadvertidamente. As instruções estão em [verificação de domínio](https://resend.com/docs/add-a-domain) e [DMARC](https://resend.com/docs/dashboard/domains/dmarc).

Criar uma chave específica para envio, limitada ao domínio quando possível. Ela ficará no campo de senha SMTP do Supabase, fora do código, do JSON público e do Git. O Resend documenta [chaves com acesso de envio e restrição por domínio](https://resend.com/docs/create-an-api-key).

### 4. Configurar o Supabase e os templates

No projeto existente, usar SMTP com `smtp.resend.com`, porta `465`, usuário `resend` e chave Resend como senha, além de nome e endereço de remetente. Conferir o resultado com o [guia oficial da integração](https://resend.com/docs/send-with-supabase-smtp).

Definir `Site URL` como a origem HTTPS escolhida e autorizar o retorno exato `/auth-callback.html`. Manter endereços locais de desenvolvimento separados. Em produção, usar URLs específicas na lista permitida, conforme a [documentação de redirecionamentos](https://supabase.com/docs/guides/auth/redirect-urls).

Começar com confirmação de cadastro e recuperação de senha, em português, com logo, creme, verde, botão legível e layout simples para celular. Preservar os links de verificação gerados pelo Supabase. Desativar rastreamento de cliques e abertura nesses envios; conferir o tratamento de links por scanners de e-mail. Consultar [templates e comportamento dos links](https://supabase.com/docs/guides/auth/auth-email-templates).

Conferir cotas do Resend e limites do Auth antes de liberar cadastro público. O SMTP padrão do Supabase é restrito a testes e membros da equipe; [SMTP personalizado é a rota indicada para o público externo](https://supabase.com/docs/guides/auth/auth-smtp).

### 5. Critérios de aceite

- Cadastro por um endereço autorizado recebe a confirmação; clicar permite concluir e entrar.
- Recuperação permite trocar a senha; a nova senha funciona e a antiga deixa de funcionar.
- Links expirados ou já usados apresentam mensagem compreensível, sem prender a pessoa na página.
- Testar Gmail, Outlook e um endereço acadêmico autorizado, observando entrega, spam e links.
- Confirmar renderização no celular, remetente, SPF/DKIM/DMARC e ausência de retorno acidental para localhost.
- Acompanhar falhas e devoluções sem copiar senhas, tokens ou links completos para relatórios.
- Revisar limites de envio e proteção contra abuso conforme o volume previsto.
- Atualizar o aviso de privacidade com o serviço de entrega e concluir contato e informações de hospedagem.

Envios de boas-vindas separados, campanhas e novidades ficam para uma etapa posterior. Não serão ativados automaticamente com a confirmação de cadastro.

## Próxima decisão

Confirmar se já existe domínio próprio, onde o DNS é administrado e se Vercel será a hospedagem escolhida. Com esses pontos definidos, podemos preparar o deploy de avaliação e a verificação do domínio em paralelo.
