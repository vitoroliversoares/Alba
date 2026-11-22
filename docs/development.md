# Desenvolvimento da Alba

## Preparar o ambiente

Use Node.js 24 e npm. Na raiz do repositório:

```sh
npm ci
cp public/app-config.example.json public/app-config.json
npm run dev
```

Em PowerShell, a cópia equivalente é `Copy-Item public/app-config.example.json public/app-config.json`. A configuração começa desconectada; o catálogo funciona sem conta.

Para ativar contas em uma instância própria, preencha somente URL e chave **publicável** do seu projeto Supabase. Nunca adicione chave secreta, `service_role`, senha ou string de conexão ao cliente. O arquivo real de configuração é ignorado pelo Git.

## Comandos

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento Vite |
| `npm run build` | Distribuição estática em `dist/client/` |
| `npm test` | Testes de catálogo, contas, privacidade e distribuição |
| `npm run preview -- --port 4174` | Prévia da distribuição local |

Execute o build antes dos testes: a verificação de distribuição confere a entrada compilada, seus recursos e as páginas institucionais. A pasta `dist/client/` pode ser servida por uma hospedagem estática; não há worker ou empacotamento adicional.

## Estrutura

```text
src/             apresentação, catálogo, componentes e dados
public/          imagens, fontes, páginas institucionais e módulos de conta
tests/           testes com node:test
supabase/        SQL, testes de isolamento e documentação do banco
scripts/         preparação da prévia local e renderização do modelo
docs/            estado, pesquisa e documentação pública
qa/              verificações de renderização e recursos
```

Os forks e backups ficam fora do repositório. Mudanças substanciais são avaliadas em fork local antes de promoção explícita ao Main.

## Verificação adicional

Com a prévia na porta 4174, gere o módulo de SSR e execute:

```powershell
& ./node_modules/@esbuild/win32-x64/esbuild.exe qa/render-entry.jsx --bundle --platform=node --format=cjs --jsx=automatic --external:react '--external:react/*' '--external:/assets/*' --outfile=qa/app-ssr.cjs
node qa/check-build.mjs
node qa/check-saved-paths.mjs
```

O QA verifica renderização e recursos HTTP. Isso não confirma disponibilidade comercial atual de ofertas. Para uma instância conectada, `ALBA_EXPECT_CONNECTED=1` exige configuração válida de Auth; por padrão também aceita o exemplo desconectado.

## Alternativa para Windows com restrição de subprocessos

Se o comando padrão encontrar `spawn EPERM`, as ferramentas locais existentes permitem gerar a distribuição e executar os testes:

```powershell
& ./node_modules/@esbuild/win32-x64/esbuild.exe src/main.jsx --bundle --format=esm --jsx=automatic --minify --splitting --legal-comments=external '--external:/assets/*' --outdir=dist/client/assets --entry-names=main
node scripts/prepare-local-preview.mjs
node --test --test-isolation=none tests/catalog.test.mjs tests/account.test.mjs tests/privacy.test.mjs tests/build.test.mjs
```

## Limites atuais

Contas usam Supabase Auth com sessão apenas em memória, até uma hora. Recarregar exige novo login. Favoritos, editorias e rotina continuam no navegador, sem sincronização, inclusive com login. A entrega real dos e-mails de confirmação/recuperação e a configuração para público externo ainda precisam de validação. O aviso de privacidade tem pendências de contato e hospedagem.
