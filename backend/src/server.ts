import * as dotenv from 'dotenv';
dotenv.config();
import * as express from 'express';
import * as cors from 'cors';
import { initTransactionEndpoints } from './rest/transactions';


const app: express.Express = express()

if(process.env.MODE == "DEV") {
    //Use cors for development
    app.use(cors())
}

const port = process.env.PORT
app.use(express.json())


//initialze the Rest endpoints
function initEndpoints() {
    initTransactionEndpoints(app);
}

initEndpoints();

//starting the server
app.listen(port, () => {
    console.log(`Server listening at port: ${port}`)
})
