# Movements
#### is a Solana transactions viewer app

## Architecture
### Frontend
The frontend is written in TypeScript with the [Ionic/Angular framework](https://ionicframework.com/).

To start a local dev client you need the ionic CLI
`npm install -g @ionic/cli`

Then you execute following command
`ionic serve`

To build the current frontend use
`ionic build --prod`


### Backend
The backend is also written in TypeScript and uses [Node.js](https://nodejs.org/en/) + [Express](https://expressjs.com/de/).

To start a local dev server you first need to add a Solana RPC URL and the Helius.xyz API key in the `.env` file.
Change the `MODE` in .env DEV for testing purposes and in PROD for production.
Then execute the following command to start the server
`npm run start`

To build the current backend use
`npm run build`
