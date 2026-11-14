# Cosmos de Hoje — NASA APOD

Aplicação web simples para exibir o APOD (Astronomy Picture of the Day) da NASA:
título, data, imagem ou vídeo e explicação. Use o seletor de data para consultar
outra publicação do arquivo da NASA (a partir de 16/06/1995).

## Executar

Requer Node.js 18 ou superior. A chave da API fica somente no servidor e deve
ser configurada no arquivo `.env`:

```env
NASA_API_KEY=sua_chave_da_nasa
```

O servidor também reconhece a variável `api` usada no `.env` existente. Inicie
a aplicação com:

```bash
npm start
```

Abra [http://localhost:3000](http://localhost:3000). A página consulta a NASA
por meio de `/api/apod`; a chave nunca é enviada ao navegador.