# Instruções do Copilot

## Tecnologias utilizadas

- Use Node.js 18 ou superior e APIs nativas do Node.js para o servidor.
- Construa o frontend com HTML semântico, CSS e JavaScript nativo.
- Não adicione frameworks, bibliotecas de frontend, dependências de runtime, banco de dados ou etapa de build sem solicitação explícita.
- Mantenha `npm start` como comando de execução da aplicação.
- Justificativa: a aplicação tem uma página e um endpoint de proxy; as APIs nativas já usadas cobrem esse escopo sem instalação, build ou atualização de dependências adicionais.

## Arquitetura do sistema

- `server.js` é responsável por servir os arquivos estáticos permitidos, validar pedidos e datas e consultar a API APOD da NASA pelo endpoint `/api/apod`.
- O endpoint `/api/apod` aceita uma data opcional no formato `YYYY-MM-DD`; o servidor valida que ela esteja entre `1995-06-16` e a data atual antes de consultar a NASA.
- `public/index.html` define a estrutura e os controles acessíveis da página.
- `public/app.js` consulta o endpoint local, apresenta título, data, explicação, crédito e mídia do APOD e atualiza os estados de carregamento e erro.
- `public/styles.css` define a apresentação visual e os ajustes para telas menores.
- Mantenha a comunicação com a API da NASA no servidor; o frontend deve chamar somente o endpoint local.
- Justificativa: a separação mantém apresentação, interação e integração HTTP em arquivos pequenos e definidos; a NASA documenta a consulta por data em `YYYY-MM-DD`, com início do arquivo em 16/06/1995.
- Antes de alterar a URL ou os parâmetros da API externa, confira a documentação APOD vigente; o repositório oficial consultado anuncia uma transição de endpoint para dezembro de 2026.

## Estilização do frontend

- Reutilize HTML semântico, os identificadores existentes e as classes CSS existentes antes de criar novos padrões.
- Preserve a identidade visual em azul-marinho, os destaques em azul-claro e o contraste legível usados pela aplicação.
- Use `Orbitron` na marca e no título principal; use `Montserrat` nos textos e no restante da interface. Mantenha a marca “AstroVisão” e o subtítulo “Inteligência espacial ao alcance de todos.” em destaque branco e legível.
- Use emojis espaciais com moderação como elementos decorativos; marque-os como ocultos para leitores de tela quando forem redundantes.
- Use bordas azuis visíveis para delimitar a barra superior, o cartão do APOD, a área de mídia, os controles e as divisões do conteúdo; mantenha espessuras e cores consistentes com as variáveis CSS.
- Mantenha as seções “Sobre Nós” e “Quem Somos” em painéis retangulares com bordas azuis; empilhe os painéis em telas menores.
- Mantenha o conteúdo centralizado e fluido, com mídia responsiva e ajustes para telas de até 600 px.
- Garanta que o seletor de data, os estados de carregamento e erro e os controles funcionem tanto em dispositivos móveis quanto em computadores.
- Respeite a preferência `prefers-reduced-motion` ao adicionar animações.
- Justificativa: o projeto adota o azul-marinho para reforçar a identidade espacial, Orbitron para diferenciar títulos, Montserrat para manter textos corridos legíveis e bordas para separar visualmente mídia, conteúdo e controles; media queries permitem adaptar a interface às características do viewport e às preferências de movimento sem código ou dependências adicionais.
- Justificativa: `input type="date"` fornece um controle nativo com valor normalizado em `YYYY-MM-DD` e limites `min`/`max`, apropriado para escolher uma data; esses limites melhoram a validação no navegador, mas não substituem a validação no servidor.

## Segurança

- Leia a chave da NASA no servidor usando `NASA_API_KEY` ou a configuração `api` existente no `.env`; nunca a coloque em arquivos de `public/`.
- Mantenha `.env` listado em `.gitignore`. Não inclua, imprima em logs, retorne ao cliente ou exponha a chave em URLs do frontend, HTML, CSS, JavaScript ou documentação.
- Faça requisições à NASA exclusivamente pelo servidor e encaminhe ao navegador somente os dados do APOD necessários à interface.
- Valide datas no servidor: formato ISO válido, entre `1995-06-16` e hoje; rejeite entradas inválidas com erro HTTP apropriado.
- Insira texto recebido da API usando `textContent` ou propriedades de texto, não `innerHTML`.
- Sirva apenas os arquivos estáticos explicitamente permitidos pelo servidor; não exponha `.env` nem outros arquivos locais por rotas estáticas.
- Em produção, forneça a chave pela configuração de segredos do ambiente de hospedagem; use `.env` apenas para desenvolvimento local.
- Justificativa: código e requisições do navegador são visíveis aos usuários, então a chave deve permanecer no processo servidor. A validação no servidor é necessária porque controles de navegador podem ser contornados; `textContent` trata dados da API como texto, evitando interpretá-los como HTML.

## Referências consultadas

- [NASA APOD API: parâmetros, datas e campos de resposta](https://github.com/nasa/apod-api) — fundamenta o formato da data, o limite histórico e a necessidade de rever o endpoint externo quando a API mudar.
- [Node.js HTTP](https://nodejs.org/api/http.html), [Node.js Fetch](https://nodejs.org/api/globals.html#fetch) e [Node.js process.env](https://nodejs.org/api/process.html#processenv) — APIs nativas usadas pelo servidor e pela configuração da chave.
- [MDN: input type="date"](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date) e [MDN: media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using) — controles de data, adaptação ao viewport e preferência por movimento reduzido.
- [OWASP: DOM-based XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) e [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) — tratamento de conteúdo não confiável e proteção de credenciais.
