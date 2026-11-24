# StockFlow

![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.2-6DB33F?logo=springboot&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-SDK%2058-000020?logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)

Sistema de controle de estoque com três projetos: uma **API em Spring Boot**, um **painel web em Angular** e um **app mobile em Expo**.

Você cadastra produtos, define um estoque mínimo e registra entradas e saídas. Quando o saldo chega ao mínimo, o produto aparece como estoque baixo.

## Projetos

| Projeto | O que é | Tecnologias | README |
| --- | --- | --- | --- |
| `backend` | API REST | Spring Boot 4.2, Java 25, H2 | [Abrir](backend/README.md) |
| `frontend-angular` | Painel web | Angular 22, TypeScript 6 | [Abrir](frontend-angular/README.md) |
| `frontend-mobile` | App mobile | Expo SDK 58, React Native 0.88 | [Abrir](frontend-mobile/README.md) |

## Rodando tudo

Abra três terminais na raiz do repositório.

**1. API (Spring Boot)**

```bash
cd backend
./mvnw spring-boot:run
```

No Windows, use `.\mvnw.cmd spring-boot:run`.

**2. Painel web (Angular)**

```bash
cd frontend-angular
npm install
npm start
```

**3. App mobile (Expo)**

```bash
cd frontend-mobile
npm install
npx expo start
```

A API fica em `http://localhost:8080` e o painel em `http://localhost:4200`. O app roda no Expo Go ou em um emulador.

## Endpoints

A API expõe o CRUD de produtos e a rota de movimentação em `/api/produtos`. Detalhes de payloads, regras e respostas estão no [README do backend](backend/README.md).
