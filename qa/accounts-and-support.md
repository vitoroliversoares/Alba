# Contas e apoio — Alba

Data: 21/11/2026. Pedido: retomar cadastro real e apoio voluntário, preservando o catálogo aberto. O responsável forneceu o projeto e autorizou a conexão; o link de apoio será criado depois.

## Projeto conectado

- Projeto: **Alba-Hub**, referência `kidqssqgmpsurekawbbh`.
- [Painel do projeto](https://supabase.com/dashboard/project/kidqssqgmpsurekawbbh).
- Região consultada: `us-east-1`, Estados Unidos. Status: `ACTIVE_HEALTHY`.
- Contas gerenciadas pelo Supabase Auth em `auth.users`; a consulta inicial encontrou zero usuários. Não foram criadas contas de teste, enviados e-mails ou consultados dados pessoais.
- SQL confirmou `auth.users` existente e negou `SELECT` direto a `anon` e `authenticated`. As tabelas de contas, identidades e sessões consultadas usam o esquema privado `auth`; não foi criada tabela pública de senhas.
- `public/app-config.json` contém somente URL, chave **publicável** moderna e futuro link de apoio. Nenhuma chave secreta ou `service_role` foi obtida ou incorporada ao cliente.

## Permissões conferidas

O assessor apontou permissões públicas de execução para `public.rls_auto_enable()`, função interna de evento que ativa RLS em novas tabelas. A definição foi lida antes de qualquer alteração; a função e o evento foram preservados, restringindo somente o acesso do cliente:

```sql
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
```

A consulta posterior confirmou `anon_can_execute = false` e `client_can_execute = false`. Nova execução do assessor de segurança retornou `lints: []`.

Referências de remediação: [execução por anônimos](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable) e [execução por usuários autenticados](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable). Não foram alteradas tabelas internas nem acrescentadas funções privilegiadas.

## Implementação local

- `src/components/AccountDialog.jsx`: cadastro com nome/e-mail/senha, confirmação de e-mail, login, solicitação de recuperação, identificação da conta e saída. Disponível na apresentação e no catálogo. Formulários ficam desativados se a configuração pública não estiver válida.
- `public/assets/account-service.js`: chamadas à API HTTPS oficial de Auth, com timeouts, erros genéricos, tratamento de limite de tentativas e nenhum envio para destinos não configurados. Fonte técnica: [OpenAPI oficial do Supabase Auth](https://github.com/supabase/auth/blob/master/openapi.yaml), consultada em 21/11/2026, e [autenticação por senha](https://supabase.com/docs/guides/auth/passwords).
- A instalação do SDK npm encontrou `ENOTCACHED` e depois `ECONNREFUSED` no proxy da sessão. Por isso a integração usa a API HTTP documentada, sem nova dependência e sem implementar armazenamento ou hash de senha próprios.
- Tokens ficam somente na memória da página, com expiração de até uma hora. Não são guardados em localStorage e não há renovação automática: sair da página ou recarregar exige novo login. O refresh token retornado pelo serviço não é retido. A autorização futura de dados protegidos deve ser feita no servidor/RLS, nunca pelo objeto de usuário exibido na interface.
- `public/auth-callback.html` e `public/assets/auth-callback.js`: retorno da confirmação e da recuperação. Removem tokens do endereço, verificam o token no fornecedor antes de exibir o formulário de nova senha e usam política de referência `no-referrer`.
- Favoritos/editorias/momentos continuam locais. O botão de apagar preferências não apaga contas. A exclusão de conta ainda depende de canal de atendimento/fluxo próprio antes do lançamento público.

## E-mails e URLs — ajustes do painel

A integração MCP conectada não disponibiliza alteração das configurações de Auth. Foi solicitado ao responsável configurar, no [painel de URLs](https://supabase.com/dashboard/project/kidqssqgmpsurekawbbh/auth/url-configuration):

- Site URL: `http://127.0.0.1:4174/`.
- Redirect URL: `http://127.0.0.1:4174/auth-callback.html`.

Para publicação, substituir/adicionar as URLs exatas do domínio real; não deixar somente localhost nem configurar curingas amplos. Manter confirmação de e-mail ativa.

O [serviço padrão de e-mail](https://supabase.com/docs/guides/auth/auth-smtp) é limitado aos endereços da equipe. Para atender estudantes fora dela, configurar SMTP próprio, remetente/domínio e limites apropriados. Credenciais SMTP pertencem ao painel/servidor, nunca ao cliente ou a esta documentação. Essa configuração não foi presumida nem alterada nesta etapa.

## Apoio voluntário

`public/apoie.html` explica a independência entre apoio e acesso. O responsável informou que criará o link depois. `supportUrl` fica `null`; não há checkout inventado, cobrança automática ou coleta de cartão. Quando houver um endereço HTTPS real, ele poderá ser incluído na configuração pública e passará a aparecer como link externo na página, com orientação para conferir destinatário, valor e frequência.

## Validação e limites

Atualização de 22/11/2026 (DEC-021): criadas tabelas privadas de perfis, preferências e favoritos. Perfil e preferências iniciais passam a ser criados automaticamente no cadastro. RLS e permissões foram testados no banco com fixtures temporárias e rollback; assessor sem alertas. As marcações da interface continuam locais. Registro técnico em [Banco de contas](../supabase/README.md) e evidências em `database-schema-checks.json`. As verificações anteriores abaixo continuam como histórico da conexão inicial.

- 22 testes passaram: oito de contas com transporte simulado, sete de catálogo, três de privacidade e quatro de hospedagem.
- Cobertura: chave publicável versus segredo, URL insegura, cadastro sem configuração, payload da criação no Auth, sessão apenas em memória, expiração, logout local/servidor, recuperação, token recusado e mensagens de erro seguras.
- SQL executado no banco real e assessor de segurança sem alertas após o ajuste de permissões.
- Build alternativo local e renderização SSR usados devido ao bloqueio já conhecido de subprocessos do Vite. A confirmação por e-mail com conta real, recuperação completa e testes visuais em navegador ainda precisam ser observados; testes de transporte simulado não provam entrega de e-mail.
- Identidade/contato do responsável, retenção técnica de logs/backups e fundamento das transferências internacionais ainda precisam ser completados no aviso antes de lançamento público. A conexão de contas foi refletida no aviso; não equivale a uma declaração de conformidade jurídica integral.
