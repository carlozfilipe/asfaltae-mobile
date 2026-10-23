# Backend AsfaltaÊ

API REST em Express + SQLite (SQL puro via `better-sqlite3`), com validação em Zod.

## Scripts

| Comando          | Descrição                                  |
| ---------------- | ------------------------------------------ |
| `yarn dev`       | Servidor em modo desenvolvimento (watch)   |
| `yarn build`     | Compila para `dist/`                       |
| `yarn start`     | Executa a versão compilada                 |
| `yarn typecheck` | Verifica os tipos                          |

## Variáveis de ambiente

Veja [.env.example](.env.example). Todas são opcionais.

| Variável        | Padrão                    | Descrição                                                   |
| --------------- | ------------------------- | ----------------------------------------------------------- |
| `PORT`          | `3333`                    | Porta HTTP                                                  |
| `DATABASE_PATH` | `./data/database.sqlite`  | Arquivo do banco (criado automaticamente)                   |
| `PUBLIC_URL`    | host da requisição        | URL base usada para montar as URLs das imagens              |

## Rotas

| Método   | Rota          | Descrição                                                         |
| -------- | ------------- | ----------------------------------------------------------------- |
| `GET`    | `/points`     | Lista os pontos com suas imagens                                  |
| `GET`    | `/points/:id` | Detalha um ponto                                                  |
| `POST`   | `/points`     | Cria um ponto (`multipart/form-data`: `name`, `about`, `latitude`, `longitude`, `images[]`) |
| `DELETE` | `/points/:id` | Remove o ponto, suas imagens no banco e os arquivos enviados      |

O schema do banco fica em [src/database/schema.ts](src/database/schema.ts) e é aplicado na inicialização.
