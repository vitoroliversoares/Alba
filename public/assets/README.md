# Proveniência dos assets

Escopo de reutilização e avisos integrais em [Licenças e créditos](../../THIRD_PARTY_NOTICES.md). A licença MIT do código não cobre automaticamente as ilustrações e a identidade visual.

- `brands/figma.svg`: vetor original de Simple Icons, incluído no fork e promovido ao Main após aprovação em 22/11/2026. URL, versão e SHA-256 em `brands/sources.json`; mesma máscara verde dos outros serviços. Ao expandir, a ficha utiliza a ilustração da categoria, conforme preferência final do responsável.

- Ampliação de 22/11/2026: `brands/adobe.svg` vem de Simple Icons 11.15.0; `brands/youtube.svg` e `brands/jetbrains.svg` da branch `develop`. Arquivos obtidos pelo conector GitHub e preservados como vetores originais, com URLs e SHA-256 em `brands/sources.json`. Reutilizam a máscara verde e a moldura do `BrandMark`, sem geração ou redesenho das marcas.

- `support-still-life-transparent.png`: arte aprovada no fork de apoio e promovida ao Main em 22/11/2026. Render Cycles no Blender 5.2 do copo GLB existente sobre duas camadas de tecido modeladas com dobras suaves. Sem piso captador de sombras, com alpha zero nas quatro bordas e sombra de contato apenas entre copo e tecido. Cena editável em `../../design/support-still-life.blend`; script em `../../scripts/render-support-still-life.py`. O PNG foi copiado integralmente do fork, sem geração adicional de imagem.

- `sol-e-livro.png`: cópia preservada de `Assets/Sol e Livro.png`, fornecida pelo responsável a partir do Canva.
- `campus.png`: cópia preservada de `Assets/Estética de imagem.png`, fornecida pelo responsável a partir do Canva.
- `hero-paper.png`: camada decorativa gerada com image_gen built-in, usando `Assets/Site.png` como referência. Papel creme, recortes ocre/verde e área livre para o título HTML; sem texto, livro ou sol. Saída de 2172 × 724 px. Os componentes fornecidos foram reaproveitados, não substituídos.
- `sol-e-livro-cutout.png`: edição derivada do componente fornecido via image_gen built-in, com transparência real e saída de 1672 × 941 px. O gerador ampliou/reconstruiu a imagem; não é um recorte pixel a pixel. O original permanece preservado.
- `category-creative.png`: ateliê criativo em colagem de papel, gerado com image_gen built-in usando o campus e o mock como referências de acabamento. Saída 1536 × 1024 px, sem texto ou marcas.
- `category-wellbeing.png`: primeira versão, preservada como histórico; o responsável a considerou artificial e fora do acabamento desejado. Não é mais consumida pelo app.
- `category-wellbeing-v2.png`: versão ativa para Modo Foco/Bem-estar, gerada com image_gen built-in a partir da referência original do campus e da paleta aprovada. Canto de leitura com poltrona verde, mesa, caderno e janela; formas mais planas, perspectiva solta e textura de papel sutil. Prompt completo e referências em `qa/modo-foco-v2.md`.
- `models/copo-cafe.glb`: cópia byte a byte do modelo Blender em `hub-objetos/copo-cafe.glb`. O runtime aplica papel/verde/ocre aos materiais sem alterar o original.
- `coffee-poster.png`: render transparente do mesmo GLB no Blender, com a paleta editorial; alternativa estática ao WebGL. Script: `scripts/render-coffee-poster.py`.
- `sol-logo-source.png` e `sol-logo.png`: exploração de sol isolado, preservada como histórico e não utilizada. O responsável esclareceu que o símbolo deve incluir o livro.
- `sol-e-livro-logo.png`: exportação técnica de `sol-e-livro-cutout.png` em 512 × 288 px, sem redesenho. O conjunto completo também foi exportado, com proporções e transparência preservadas, para os favicons PNG/ICO e ícone de toque em `public/`.
- `fonts/fraunces-variable.ttf` e `fonts/dm-sans-variable.ttf`: arquivos oficiais do repositório `google/fonts`, diretórios `ofl/fraunces` e `ofl/dmsans`. Licenças OFL incluídas na mesma pasta.
- `icons/*.svg`: ícones regulares oficiais de `phosphor-icons/core`, preservados como histórico da primeira versão. Licença MIT em `icons/LICENSE`.
- `icons/iconoir/*.svg`: biblioteca ativa para landing e catálogo, com 16 SVGs oficiais de `iconoir-icons/iconoir`, diretório `icons/regular`, e `bookmark-solid.svg`, do diretório `icons/solid`, para favoritos salvos. Licença MIT em `icons/iconoir/LICENSE`; URL e SHA de cada arquivo em `sources.json`. `src/Icon.jsx` centraliza os aliases de nomes anteriores. Os SVGs são máscaras externas; não houve desenho manual de ícones.

Fontes e ícones foram obtidos pelo conector GitHub e salvos localmente. Não há chamadas a Google Fonts, CDN de ícones ou serviços de imagem durante o uso da página.

## Logos dos serviços reais

`brands/github.svg`, `google.svg`, `notion.svg`, `canva.svg`, `spotify.svg`, `apple-music.svg`, `microsoft.svg` e `autodesk.svg` vêm do repositório Simple Icons, obtidos pelo conector GitHub. Microsoft usa o arquivo da versão 11.15.0 da coleção; Canva usa 14.0.0. SVGs preservados; a estilização editorial acontece em CSS, com máscara verde e uma moldura única de papel, com tamanho, área útil, raio, contorno e alinhamento padronizados. Não há geração ou redesenho das marcas. URLs, SHA-256 e data em `brands/sources.json`; licença da coleção em `brands/LICENSE.md`. Os sinais identificam serviços de terceiros; não implicam parceria com a Alba.
