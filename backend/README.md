# StockFlow: API

![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.2-6DB33F?logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-25-ED8B00?logo=openjdk&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-6DB33F?logo=spring&logoColor=white)
![H2](https://img.shields.io/badge/H2-4479A1)
![Maven](https://img.shields.io/badge/Maven-wrapper-C71A36?logo=apachemaven&logoColor=white)

API REST do StockFlow, feita em **Spring Boot** com **Java 25**. Ela guarda os produtos, registra entradas e saídas e informa quando o saldo está abaixo do mínimo.

## Tecnologias

- Java 25
- Spring Boot 4.2 (Web MVC e Data JPA)
- H2 em memória
- Maven, com wrapper incluído

## Como rodar

Você só precisa do Java 25. O Maven já vem pelo wrapper.

```bash
./mvnw spring-boot:run
```

No Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

A API sobe em `http://localhost:8080`.

O banco é o H2 em memória: os dados somem quando a aplicação para. A cada start, o `data.sql` cadastra três produtos de exemplo.

Console do banco em `http://localhost:8080/h2-console`:

- JDBC URL: `jdbc:h2:mem:stockflowdb`
- Usuário: `sa`
- Senha: em branco

O CORS está liberado para qualquer origem, então o painel Angular e o app Expo chamam a API direto.

## Endpoints

| Método | Rota | Operação | Sucesso |
| --- | --- | --- | --- |
| GET | `/api/produtos` | Listar produtos (filtro opcional `?categoria=Papelaria`) | 200 |
| GET | `/api/produtos/{id}` | Consultar produto | 200 / 404 |
| POST | `/api/produtos` | Cadastrar produto | 201 / 400 |
| PUT | `/api/produtos/{id}` | Editar produto | 200 / 400 / 404 |
| PATCH | `/api/produtos/{id}/movimentacao` | Registrar entrada ou saída | 200 / 400 / 404 |
| DELETE | `/api/produtos/{id}` | Excluir produto | 204 / 404 |

## Produto

```json
{
  "nome": "Caderno",
  "descricao": "Caderno 100 folhas",
  "categoria": "Papelaria",
  "quantidade": 10,
  "estoqueMinimo": 3
}
```

`nome`, `categoria`, `quantidade` e `estoqueMinimo` são obrigatórios. As quantidades não podem ser negativas e a descrição é opcional.

Na resposta aparece também o campo `estoqueBaixo`, que é `true` quando `quantidade <= estoqueMinimo`.

## Movimentação

```json
{ "tipo": "SAIDA", "quantidade": 8 }
```

`tipo` aceita `ENTRADA` ou `SAIDA`, e `quantidade` precisa ser maior que zero. Se a saída for maior que o saldo, a API responde **400** com a mensagem de estoque insuficiente e não altera nada.

## Estrutura

- `controllers/`: endpoints HTTP
- `services/`: regras de negócio
- `repositories/`: acesso ao banco
- `entities/`: modelo JPA
- `dtos/`: entrada e saída da API
- `mappers/`: conversão entre entity e DTO
- `config/`: CORS

## Testes

```bash
./mvnw test
```

## Outros projetos

- [Painel web em Angular](../frontend-angular)
- [App mobile em Expo](../frontend-mobile)
