# Hub Charles Ideias Lab — capa de cineasta

**Data:** 20/10/2026
**Status:** aprovado por Charles (conceito)

## Conceito

Uma capa de filme. Uma tela preta, sem imagens e sem enfeites, com o nome grande à esquerda, uma frase curta e um menu discreto no rodapé. O site é uma porta: cada item do menu leva ao seu destino (bio, contato e, no futuro, Cicatriz Sonora e portfólio).

O que foi descartado da versão anterior: violeta, serifada, grão, brilho, seções numeradas, etiquetas, cards e qualquer efeito decorativo.

## Estrutura

- **Home (`index.html`)** — capa em tela cheia: wordmark em duas linhas, frase de uma linha, menu no rodapé (Bio, Contato) e e-mail discreto à direita.
- **Bio (`bio.html`)** — página curta, mesmo idioma visual, texto em coluna estreita.
- **Contato (`contato.html`)** — e-mail como elemento principal, WhatsApp e Instagram em linhas.

## Tipografia

Uma única família: **Archivo** (variável, self-hosted). Wordmark em caixa alta, peso 500, entrelinha 0.84 e espaçamento -0.045em. Texto em 15px, entrelinha 1.85. Menu em caixa baixa, 15px, com número discreto.

## Cor

Preto `#050505`, branco quente `#EDEAE3`, cinza `#7C7A74`, linha `#1C1B19`. Nenhuma cor de destaque.

## Comportamento

- Sem JavaScript.
- Sem imagens.
- Hover do menu: traço que cresce da esquerda.
- Entrada: fade de 600ms; desligado em `prefers-reduced-motion`.
- Foco visível em todos os links.

## Fora de escopo

- Cicatriz Sonora e Portfólio no menu (entram quando Charles pedir).
- Texto definitivo da bio (versão provisória nesta entrega).
- Publicação: só depois de aprovação visual.

## Critério de aceite

Abrir a home em 1440 e 492px e sentir uma capa silenciosa: nome legível de longe, menu encontrável, nada competindo por atenção.
