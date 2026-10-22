# Centro Educacional Sonho Meu

Landing page institucional em tela única. Para abrir, dê dois cliques em `index.html`. Ela funciona sem internet, porque as fontes e as imagens estão dentro desta pasta.

## O que tem na pasta

```
index.html                   a página: cabeçalho com a logo, card do menu e a folha de conteúdo
css/style.css                estilos (cores, fontes e medidas ficam no topo, em :root)
js/main.js                   troca de páginas, mapa da estrutura, rotina com o sol e formulário
assets/img/                  logo oficial (PNG) e versões recortadas, favicon e ilustrações em SVG
assets/fonts/                Playwrite BR e Lexend, com as licenças (OFL)
filosofia-visual.md          a direção visual usada na logo, nas ilustrações e nos gráficos
cartaz-matriculas-2027.png   peça para redes sociais (1080 x 1350)
preview.png                  prévia da página no computador
```

## Antes de publicar, troque os dados de exemplo

- **Contato** (`index.html`, página "Contato"): endereço, telefone, WhatsApp, e-mail e horário da secretaria.
- **WhatsApp do formulário** (`js/main.js`, primeiras linhas): `WHATSAPP` (só números, com 55 e DDD) e `WHATSAPP_LEGIVEL`.
- **Fatos sobre a escola** (`index.html`): ano de fundação (2004), "Turmas de até 18 crianças", horários da rotina e a lista de espaços. O endereço da página Contato leva ao mapa oficial (https://maps.app.goo.gl/3HZgUs8pBzDncAwa6).

## Como a página funciona

- **Tela única**: no computador tudo cabe na tela. O menu da esquerda troca o conteúdo da folha à direita, e cada página tem endereço próprio (`#inicio`, `#a-escola`, `#proposta`, `#segmentos`, `#estrutura`, `#rotina`, `#contato`). Dá para enviar o link direto de uma página, e o botão Voltar do navegador funciona.
- **Celular**: o menu vira uma faixa no topo que rola para os lados, e o conteúdo desce em uma coluna.
- **Estrutura**: escolha um espaço na lista ou clique no pino do mapa.
- **Um dia aqui**: escolha um horário e o sol anda pelo céu até ele.
- **Formulário**: abre o WhatsApp da secretaria com a mensagem pronta, sem precisar de servidor.
- **Acessibilidade**: funciona pelo teclado, tem foco visível, textos alternativos nas imagens e respeita a opção "reduzir movimento" do sistema. Sem JavaScript, todas as páginas aparecem em sequência.

## Identidade visual

| Cor | Uso |
| --- | --- |
| `#581832` vinho (cor da logo oficial) | fundo, botões e emblema |
| `#3A1222` vinho-escuro | textos |
| `#EDB04A` dourado | destaque do menu, estrelas e lua |
| `#CF6A88` rosa antigo | detalhes e ilustrações |
| `#6E9466` verde-sálvia | ilustrações |
| `#9A7AA6` malva | Fundamental I e ilustrações |

A logo oficial está em `assets/img/Logo_Sonho_Meu_nova.png`. No topo do site é usada a versão horizontal em creme (`logo-horizontal-creme.png`), feita a partir da mesma arte.

Fontes: **Playwrite BR**, a cursiva ensinada nas escolas brasileiras, nos títulos e na logo; **Lexend**, criada para facilitar a leitura, no restante do texto.
