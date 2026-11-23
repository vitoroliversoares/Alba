# Autenticação da Alba

Google é a única opção de acesso social. O formulário de e-mail/senha continua disponível; confirmação e recuperação por e-mail dependem do envio configurado no Supabase. O catálogo é aberto, mas favoritos e editorias exigem autenticação e são armazenados nas tabelas da conta, com RLS pelo proprietário.

## Produção

| Uso | URL |
| --- | --- |
| Site e retorno OAuth principal | `https://alba-hub.vercel.app/` |
| Callback que deve ser cadastrado no cliente Google | `https://kidqssqgmpsurekawbbh.supabase.co/auth/v1/callback` |
| Retorno de confirmação e recuperação de e-mail | `https://alba-hub.vercel.app/auth-callback.html` |
| Retorno OAuth alternativo compatível | `https://alba-hub.vercel.app/oauth-callback.html` |

No Supabase, a Site URL deve apontar para o site público e a lista Redirect URLs deve incluir os retornos utilizados. O callback do Google passa primeiro pelo Supabase; ele não deve ser confundido com o retorno à aplicação. O código recebe retornos na raiz e no caminho alternativo, remove os parâmetros do histórico e abre o catálogo.

## Configuração pública

Na Vercel, as variáveis de produção `ALBA_SUPABASE_URL` e `ALBA_SUPABASE_PUBLISHABLE_KEY` geram `app-config.json` durante o build. Esse arquivo é ignorado pelo Git. Apenas a URL e a chave publicável do projeto chegam ao cliente. Client Secret do Google, service-role, senha de banco e credenciais de SMTP não entram nessas variáveis nem no frontend. A configuração de Google fica no painel Supabase.

Novas cópias do projeto começam desconectadas. Configure um projeto próprio e os retornos apropriados antes de habilitar contas em outra instância.

## Sessão e dados

A API REST documentada do Supabase Auth executa PKCE S256 com comprovante aleatório em sessionStorage. O registro é vinculado à origem e ao projeto, aceito por até quinze minutos e removido ao processar o retorno. O código é de uso único; a identidade é conferida em `/user` antes de abrir a sessão. Tokens do provedor e refresh tokens são descartados. A sessão da Alba fica na memória por até uma hora; recarregar exige novo login.

O guia de rotina pode ser experimentado sem conta. A persistência das escolhas ocorre somente quando a pessoa autenticada salva. A interface confirma o salvamento após a resposta do banco; respostas de sessões anteriores não podem preencher a conta atual.

## Validação e limites

Testes cobrem início/retorno/cancelamento OAuth, prova inválida ou expirada, bloqueio de outros provedores, sessão, isolamento, rede e persistência. O início real do fluxo foi conferido até o redirecionamento para accounts.google.com, com callback do Supabase. O agente não acessa a conta Google do responsável; o consentimento e o retorno completo devem ser validados pelo titular.

Permanecem pendentes SMTP público, contato/canal de direitos e exclusão e a complementação operacional de privacidade descrita no aviso. O envio de confirmação por e-mail não foi desativado para contornar SMTP.

Referências: [Google no Supabase](https://supabase.com/docs/guides/auth/social-sign-in/auth-google), [retornos](https://supabase.com/docs/guides/auth/redirect-urls), [PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow) e [API REST](https://github.com/supabase/auth/blob/master/openapi.yaml).
