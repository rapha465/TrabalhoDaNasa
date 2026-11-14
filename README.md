# AstroVisão — NASA APOD

Aplicação web para consultar o APOD (*Astronomy Picture of the Day*) da NASA. Exibe título, data, imagem ou vídeo, explicação e crédito; o seletor permite consultar outras datas do arquivo, iniciado em 16/06/1995.

## Requisitos

- Node.js 18 ou superior.
- Uma chave da [NASA API](https://api.nasa.gov/) para usar o endpoint APOD.

Não há dependências de npm para instalar: o servidor usa APIs nativas do Node.js.

## Configuração e execução

1. Clone o repositório e entre na pasta do projeto.
2. Crie um arquivo `.env` na raiz com sua chave:

   ```env
   NASA_API_KEY=sua_chave_da_nasa
   ```

   O servidor também reconhece a variável `api` no `.env`, para compatibilidade com a configuração existente. Não publique nem compartilhe esse arquivo; ele está excluído pelo `.gitignore`.
3. Inicie o servidor:

   ```bash
   npm start
   ```
4. Abra [http://localhost:3000](http://localhost:3000) no navegador.

Para usar outra porta, defina `PORT` no ambiente antes de iniciar. Em hospedagem, configure `NASA_API_KEY` como segredo do ambiente em vez de manter um `.env` no servidor.

## Como funciona

O navegador consulta somente `/api/apod` no servidor local. O servidor valida datas no formato `YYYY-MM-DD`, entre `1995-06-16` e a data atual, e consulta a API da NASA. A chave não é enviada ao frontend. Para consultar uma data manualmente, use, por exemplo, `/api/apod?date=2024-01-01`.

## Arquivos principais

- `server.js`: servidor HTTP, arquivos estáticos permitidos e proxy da API APOD.
- `public/index.html`: estrutura da página.
- `public/app.js`: consulta local, seletor de data e estados da interface.
- `public/styles.css`: identidade visual e estilos responsivos.
- `.github/copilot-instructions.md`: instruções de desenvolvimento para o Copilot.
- `.github/COPILOT-CHAT-LOG.md`: registro retrospectivo das cinco interações importantes.

## Revisão e testes

Não há suíte de testes automatizados configurada. Para uma verificação manual, inicie o servidor com uma chave válida, abra a página, consulte uma data válida e teste uma data inválida diretamente na rota `/api/apod`. Verifique também o estado de erro sem chave ou sem conexão com a NASA.
