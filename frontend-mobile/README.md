# StockFlow: Mobile

![Expo](https://img.shields.io/badge/Expo-SDK%2058-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.88-61DAFB?logo=react&logoColor=black)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)

Aplicativo mobile do StockFlow, feito em **Expo** com **React Native**. Usa a mesma API em Spring Boot do painel web e serve para consultar o estoque pelo celular, cadastrar e editar produtos e registrar entradas e saídas.

## Tecnologias

- Expo SDK 58
- React Native 0.88 e React 19
- Expo Router para a navegação
- TypeScript 6
- Axios para chamar a API

## Como rodar

Você precisa do Node.js, da API rodando na porta 8080 e do app Expo Go (ou um emulador) no celular.

```bash
npm install
npx expo start
```

Depois aperte `a` para Android, `i` para iOS ou `w` para abrir no navegador. Também dá para ler o QR code com o Expo Go.

O app pega o IP da sua máquina pelo servidor do Expo, então celular e computador precisam estar na mesma rede. Se a API estiver em outro endereço, ajuste `src/services/produtoService.ts`.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm start` | Sobe o servidor do Expo |
| `npm run android` | Abre no Android |
| `npm run ios` | Abre no iOS |
| `npm run web` | Abre no navegador |
| `npm run lint` | Roda o ESLint |

## O que tem no app

- Lista de produtos com filtro por categoria e por estoque baixo.
- Atualização puxando a lista para baixo.
- Detalhe com saldo, estoque mínimo e aviso de estoque baixo.
- Cadastro e edição com validação, além de exclusão com confirmação.
- Movimentação de entrada e saída direto no detalhe do produto.

## Estrutura

- `index.tsx`: lista de produtos
- `produto/[id].tsx`: detalhe e movimentação
- `produto/form.tsx`: cadastro e edição
- `_layout.tsx`: navegação

As telas usam o Expo Router: cada arquivo dentro de `src/app` é uma rota.

## Qualidade

```bash
npm run lint
npx tsc --noEmit
```

## Outros projetos

- [API em Spring Boot](../backend)
- [Painel web em Angular](../frontend-angular)
