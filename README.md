<h1 align="center">
  <img alt="AsfaltaÊ" title="AsfaltaÊ" src="./mobile/assets/logo.png" width="320px" />
</h1>

<p align="center">
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-layout">Layout</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-executar">Como executar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-licença">Licença</a>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=ffae00&labelColor=000000">

 <img src="https://img.shields.io/static/v1?label=PointsApp&message=1.0.0&color=ffae00&labelColor=000000" alt="AsfaltaÊ" />
</p>

<br>

## 💻 Projeto

O AsfaltaÊ é um aplicativo para Android e iOS que registra ruas esburacadas nas vias urbanas de forma simples e objetiva.

- Demonstrativo do aplicativo em funcionamento: [Vídeo no YouTube - AsfaltaÊ](https://youtu.be/vKdL6F28ZEY).

## ✨ Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) (SDK 58)
- [React Navigation](https://reactnavigation.org/)
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [SQLite](https://sqlite.org/) com [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (SQL puro)
- [Zod](https://zod.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## 🔖 Layout

Você pode visualizar o layout do projeto através [desse link](https://www.figma.com/). É necessário ter conta no [Figma](http://figma.com/) para acessá-lo.

## 🚀 Como executar

Pré-requisitos: Node.js 22+ e Yarn.

- Clone o repositório: `git clone git@github.com:carlozfilipe/asfaltae-mobile.git`

**Backend**

- No diretório **backend**, instale as dependências com `yarn`
- (Opcional) Copie `.env.example` para `.env` para alterar porta, caminho do banco ou URL pública
- Inicie o servidor com `yarn dev` (o banco SQLite é criado automaticamente em `data/`)

**Mobile**

- No diretório **mobile**, instale as dependências com `yarn`
- Copie `.env.example` para `.env` e defina `EXPO_PUBLIC_API_URL` com o IP da sua máquina na rede local (ex.: `http://192.168.0.10:3333`)
- Inicie o app com `yarn start`

Agora você pode acessar utilizando o [Expo Go](https://expo.dev/go) no seu dispositivo real ou emulador.

## 📄 Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

---

Feito com ♥ by [Carlos Filipe](https://x.com/carlozfilipe) 👋🏻
