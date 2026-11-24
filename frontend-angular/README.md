# StockFlow: Web

![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-5-6E9F18?logo=vitest&logoColor=white)

Painel web do StockFlow, feito em **Angular**. Ele conversa com a API em Spring Boot e permite listar, cadastrar, editar e excluir produtos, além de registrar entradas e saídas de estoque.

## Tecnologias

- Angular 22
- TypeScript 6
- SCSS
- RxJS e `HttpClient` para falar com a API
- Vitest para os testes

## Como rodar

Antes, suba a API em `http://localhost:8080`. As instruções estão no [README do backend](../backend).

```bash
npm install
npm start
```

Abra `http://localhost:4200`. A página recarrega sozinha quando você salva um arquivo.

A URL da API está em `src/app/services/produto.service.ts`. Se o backend mudar de porta, ajuste lá.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm start` | Sobe o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run watch` | Build contínuo em modo desenvolvimento |
| `npm test` | Roda os testes com Vitest |

## O que tem na tela

- Lista de produtos com filtro por todos, estoque baixo ou estoque normal.
- Detalhe com categoria, descrição, saldo atual e estoque mínimo.
- Aviso visual quando o produto está com estoque baixo.
- Formulário de cadastro e edição com validação dos campos.
- Movimentação de entrada e saída pelo detalhe do produto.

## Estrutura

- `components/`
  - `lista-produto/`
  - `detalhes-produto/`
- `models/`
- `services/`
- `app.ts`
- `app.html`
- `app.config.ts`

## Outros projetos

- [API em Spring Boot](../backend)
- [App mobile em Expo](../frontend-mobile)
