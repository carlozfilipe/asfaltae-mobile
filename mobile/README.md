# Mobile AsfaltaÊ

Aplicativo Expo (SDK 58) / React Native.

## Configuração

Copie [.env.example](.env.example) para `.env`:

- `EXPO_PUBLIC_API_URL` (obrigatória): URL do backend acessível pelo celular, ex. `http://192.168.0.10:3333`.
- `GOOGLE_MAPS_API_KEY`: necessária apenas em builds nativos Android (não no Expo Go).

## Scripts

| Comando          | Descrição                      |
| ---------------- | ------------------------------ |
| `yarn start`     | Inicia o Metro / Expo          |
| `yarn android`   | Abre no Android                |
| `yarn ios`       | Abre no iOS                    |
| `yarn typecheck` | Verifica os tipos              |

## Estrutura

```
src/
  components/   componentes reutilizáveis
  config/       variáveis de ambiente (validadas com Zod)
  hooks/        hooks (ex.: localização atual)
  navigation/   navegação tipada (React Navigation 7, API estática)
  schemas/      schemas Zod e tipos derivados
  screens/      telas
  services/     cliente da API
  theme/        cores e fontes
  utils/        utilitários (mapa, seletor de imagens)
```
