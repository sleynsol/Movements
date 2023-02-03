import { PublicKey } from '@solana/web3.js';
import { Express, Request, Response } from 'express';
import { getTransactionHistory } from '../util/transaction-utils';

const ENDPOINT_URL = "/api/transactions"

export function initTransactionEndpoints(app: Express) {

    app.get(`${ENDPOINT_URL}`, async (req: Request, res: Response) => {

        let address = req.query.address;

        if(!address) return res.sendStatus(401);

        try {
            let history = await getTransactionHistory(new PublicKey(address));
            res.send(history);
        } catch(err) {
            res.status(500);
            res.send(err);
        }

    })

}