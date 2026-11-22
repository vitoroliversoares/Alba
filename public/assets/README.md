# Proveniência dos assets

Escopo de reutilização e avisos integrais em [Licenças e créditos](../../THIRD_PARTY_NOTICES.md). A licença MIT do código não cobre automaticamente as ilustrações e a identidade visual.

## Ilustrações e identidade

- `sol-e-livro.png`: original fornecido pelo responsável a partir do Canva.
- `campus.png`: paisagem fornecida pelo responsável a partir do Canva.
- `hero-paper.png`: composição decorativa gerada com IA a partir da referência visual aprovada, sem texto ou marca.
- `sol-e-livro-cutout.png`: derivado do original preparado com IA, com reconstrução de detalhes e transparência real. Não é um recorte pixel a pixel.
- `category-creative.png`: ateliê ilustrado gerado com IA a partir das referências de campus e colagem.
- `category-wellbeing-v2.png`: canto de leitura gerado com IA, seguindo as referências aprovadas e a paleta da Alba.
- `category-wellbeing.png`, `sol-logo-source.png` e `sol-logo.png`: explorações históricas não utilizadas na interface atual.
- `sol-e-livro-logo.png`: exportação técnica proporcional do sol com livro, sem redesenho. Os favicons e o ícone de toque usam o mesmo conjunto, com transparência preservada.
- `models/copo-cafe.glb`: modelo de copo trabalhado no Blender. O runtime aplica a paleta da Alba aos materiais.
- `coffee-poster.png`: render transparente do mesmo modelo, usado como alternativa estática ao WebGL. Script em [render-coffee-poster.py](../../scripts/render-coffee-poster.py).

## Fontes e ícones

- `fonts/fraunces-variable.ttf` e `fonts/dm-sans-variable.ttf`: arquivos oficiais do repositório Google Fonts, diretórios `ofl/fraunces` e `ofl/dmsans`. Licenças OFL preservadas na mesma pasta.
- `icons/*.svg`: ícones regulares oficiais de Phosphor Icons, mantidos como histórico. Licença MIT em `icons/LICENSE`.
- `icons/iconoir/*.svg`: biblioteca ativa Iconoir, incluindo a versão preenchida do marcador para favoritos salvos. Licença MIT em `icons/iconoir/LICENSE`; origem e SHA-256 em `sources.json`. Os vetores originais são apresentados como máscaras CSS.

## Logos dos serviços

Os 12 vetores em `brands/` vêm de Simple Icons. Microsoft e Adobe usam a versão 11.15.0; Canva usa 14.0.0. URLs específicas, versões, hashes e datas de obtenção estão em `brands/sources.json`; a licença da coleção está em `brands/LICENSE.md`.

As silhuetas foram preservadas. Cor verde, tamanho e moldura são aplicados em CSS. Os logos aparecem nos itens recolhidos; o conteúdo expandido utiliza ilustrações por categoria. As marcas identificam serviços de terceiros e não significam parceria com a Alba.

Fontes, ícones e imagens são locais: não há carregamento de fontes ou logos por CDN durante o uso.
