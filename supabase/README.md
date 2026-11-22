# Banco de contas da Alba

Projeto autorizado: **Alba-Hub** (`kidqssqgmpsurekawbbh`), ligado ao Main. O fork de avaliação permanece desconectado. Estrutura criada em 22/11/2026 por solicitação explícita do responsável (DEC-021).

| Tabela | Uso | Escrita pelo cliente autenticado |
| --- | --- | --- |
| `auth.users` | Contas, e-mail e credenciais gerenciados pelo Supabase Auth | Somente pelas APIs de Auth existentes; sem leitura SQL pelo cliente |
| `public.profiles` | UUID da conta, nome de exibição e datas | Atualizar somente o próprio nome |
| `public.user_preferences` | Editorias e momentos escolhidos | Atualizar somente as próprias preferências |
| `public.user_favorites` | Serviços favoritos, sem duplicação por conta | Inserir e remover somente os próprios favoritos |

As três tabelas da aplicação têm RLS, chaves estrangeiras para `auth.users.id` e exclusão em cascata. O dono da linha e as datas de criação não são editáveis pelo cliente. A chave composta dos favoritos começa por `user_id`; todas as consultas de RLS e exclusões de vínculos têm índice pela conta. Não foram criadas colunas de senha, documentos, matrícula, cartão ou dados de pagamento.

Um trigger em `auth.users` cria perfil e linha de preferências no cadastro, aproveitando o `display_name` já enviado pelo Main. Aceita nome ausente ou metadados de tipo inesperado e limita nomes a 80 caracteres. Metadados nunca autorizam acesso. A função de bootstrap é `SECURITY DEFINER` no esquema não exposto `alba_private`, sem execução por `PUBLIC`, `anon`, `authenticated` ou `service_role`, com contexto de trigger restrito e `search_path` vazio. O serviço interno de Auth tem o acesso necessário. A função de atualização de datas é `SECURITY INVOKER`.

## Escopo atual

Perfis e preferências iniciais passam a ser criados automaticamente no banco. **A interface ainda não sincroniza favoritos, editorias ou momentos:** suas marcações continuam no navegador, inclusive para pessoas conectadas. Os novos registros de preferências iniciam vazios; `routine_moments = NULL` significa que a rotina ainda não foi configurada, enquanto `[]` representa uma seleção explicitamente vazia.

O catálogo continua versionado em `src/data/catalog.js`. `service_id` usa o slug do serviço; não há chave estrangeira para um catálogo remoto. Novas editorias ou momentos exigem revisar as restrições das preferências antes de habilitar sincronização. Não há tabelas de Stripe, checkout ou contribuições; o link financeiro segue pendente.

## SQL e registro

- SQL aplicado: [create_alba_account_tables.sql](sql/create_alba_account_tables.sql).
- Migração remota: **`20261122204255_create_alba_account_tables`**, registrada pelo `apply_migration` do MCP no projeto hospedado.
- A CLI não está instalada nesta sessão. O SQL foi preparado em arquivo, aplicado pela integração e preservado como artefato; este diretório não finge ser uma instalação local da CLI nem inventa seu histórico de migrações.
- Evidências: [database-schema-checks.json](../qa/database-schema-checks.json).

## Verificação

[account_tables.sql](tests/account_tables.sql) testa o banco real com fixtures sintéticas em uma transação finalizada com `ROLLBACK`. Não usa a API de cadastro, não cria identidades, não envia e-mail e não deixa contas de teste. Verifica criação automática, nomes longos/metadados inválidos, isolamento entre contas, bloqueio de anônimos, campos imutáveis, edição própria, favoritos duplicados/ilegais, exclusão em cascata e permissões das funções. Resultado: `passed`, zero fixtures restantes. Depois dos testes, as três tabelas e `auth.users` permaneceram vazias. Assessor de segurança: `lints: []`.

Esses testes verificam SQL e RLS, não entrega de e-mail ou o fluxo completo no navegador. URLs de retorno, SMTP, canal de exclusão de conta e aviso completo de privacidade continuam como pendências do lançamento.

Referências consultadas: [dados de usuários e triggers](https://supabase.com/docs/guides/auth/managing-user-data) e [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
