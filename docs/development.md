# Desenvolvimento da Alba

## Preparar o ambiente

Use Node.js 24 e npm. Na raiz deste repositório:

```sh
npm ci
cp public/app-config.example.json public/app-config.json
npm run dev
```

Em PowerShell, a cópia equivalente é `Copy-Item public/app-config.example.json public/app-config.json`. A configuração começa desconectada; o catálogo funciona sem conta. Para ativar contas em uma instância própria, preencha somente URL e chave **publicável** do seu projeto. Nunca adicione chave secreta, `service_role`, senha ou string de conexão ao cliente. O arquivo real de configuração é ignorado pelo Git. O Main local mantém a conexão já autorizada.

`supportUrl` recebe um link HTTPS real quando o responsável o disponibilizar. Até lá, mantenha `null`. Não existe checkout nem integração financeira ativa.

## Comandos

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento Vite |
| `npm run build` | Build React e empacotamento compatível com Sites |
| `npm test` | Testes de catálogo, contas, privacidade, carregamento e hospedagem |
| `npm run test:sites` | Verificação específica do worker e dos artefatos de hospedagem |
| `npm run preview -- --port 4174` | Prévia da distribuição local |

Execute o build antes dos testes: os testes de hospedagem conferem arquivos em `dist/`.

## Estrutura

```text
src/             apresentação, catálogo, componentes e dados
public/          imagens, fontes, páginas institucionais e módulos de conta
tests/           testes com node:test
supabase/        SQL, testes de isolamento e documentação do banco
worker/          entrega estática compatível com Sites
scripts/         empacotamento e renderização de arte
docs/            estado, pesquisa e documentação pública
qa/              scripts de verificação e registros técnicos
design/          cena Blender da composição de apoio
```

Os forks e backups ficam fora do repositório. Mudanças substanciais são avaliadas em fork local antes de promoção explícita ao Main.

## Verificação adicional

Com a prévia na porta 4174, gere o módulo de SSR e execute:

```powershell
& ./node_modules/@esbuild/win32-x64/esbuild.exe qa/render-entry.jsx --bundle --platform=node --format=cjs --jsx=automatic --external:react '--external:react/*' '--external:/assets/*' --outfile=qa/app-ssr.cjs
node qa/check-build.mjs
node qa/check-saved-paths.mjs
```

O QA verifica renderização e recursos HTTP, sem afirmar que uma oferta continua comercialmente disponível. Para QA de uma instância conectada, `ALBA_EXPECT_CONNECTED=1` exige configuração válida de Auth; por padrão também aceita o exemplo desconectado.

## Alternativa para este workspace Windows restrito

Nesta sessão, o comando padrão encontrou `spawn EPERM` ao abrir subprocessos. As ferramentas locais existentes permitem validar sem instalação adicional:

```powershell
& ./node_modules/@esbuild/win32-x64/esbuild.exe src/main.jsx --bundle --format=esm --jsx=automatic --minify --splitting --legal-comments=external '--external:/assets/*' --outdir=dist/client/assets --entry-names=main
node scripts/prepare-local-preview.mjs
node scripts/prepare-sites-build.mjs
node --test --test-isolation=none tests/catalog.test.mjs tests/account.test.mjs tests/privacy.test.mjs tests/support-loader.test.mjs tests/sites-worker.test.mjs
```

Isso produz `dist/client/index.html`, `dist/server/index.js` e `dist/.openai/hosting.json`. Não altere o worker ou a configuração de hospedagem para contornar problemas de compilação.

## Limites atuais

Contas usam Supabase Auth com sessão apenas em memória, até uma hora. Recarregar exige novo login. Favoritos, editorias e rotina continuam no navegador, sem sincronização, inclusive com login. A entrega real dos e-mails de confirmação/recuperação e a configuração para público externo ainda precisam de validação. O aviso de privacidade ainda tem pendências de contato e hospedagem. O repositório é público para colaboração; isso não significa que a aplicação esteja pronta para lançamento.
