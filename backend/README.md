# StockFlow — Backend (Spring Boot)

API REST do StockFlow, com banco H2 em memória e camadas Entity, Repository, Service, Mapper, DTO e Controller.

## Executar

```bash
cd backend
./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080`.

- Console H2: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:stockflowdb`, usuário `sa`, senha vazia)
- CORS liberado para todas as origens (Angular/Expo)

## Endpoints

| Método | Rota | Operação | Sucesso |
| --- | --- | --- | --- |
| GET | `/api/produtos` | Listar produtos (filtro opcional `?categoria=Papelaria`) | 200 |
| GET | `/api/produtos/{id}` | Consultar produto | 200 / 404 |
| POST | `/api/produtos` | Cadastrar produto | 201 / 400 |
| PUT | `/api/produtos/{id}` | Editar produto | 200 / 400 / 404 |
| PATCH | `/api/produtos/{id}/movimentacao` | Registrar entrada ou saída | 200 / 400 / 404 |
| DELETE | `/api/produtos/{id}` | Excluir produto | 204 / 404 |

## Corpo do produto

```json
{
  "nome": "Caderno",
  "descricao": "Caderno 100 folhas",
  "categoria": "Papelaria",
  "quantidade": 10,
  "estoqueMinimo": 3
}
```

`nome`, `categoria`, `quantidade` e `estoqueMinimo` são obrigatórios; quantidades não podem ser negativas. A resposta inclui o campo calculado `estoqueBaixo` (`quantidade <= estoqueMinimo`).

## Movimentação

```json
{ "tipo": "SAIDA", "quantidade": 8 }
```

`tipo` aceita `ENTRADA` ou `SAIDA` e `quantidade` deve ser maior que zero. Uma saída maior que o saldo retorna **400** com a mensagem de estoque insuficiente e não altera o produto.

## Testes

```bash
./mvnw test
```
