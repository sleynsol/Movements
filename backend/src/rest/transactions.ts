import { PublicKey } from '@solana/web3.js';
import { Express, Request, Response } from 'express';
import { getPublicKeyFromSolDomain, getTransactionHistory } from '../util/transaction-utils';

const ENDPOINT_URL = "/api/transactions"

export function initTransactionEndpoints(app: Express) {

    app.get(`${ENDPOINT_URL}`, async (req: Request, res: Response) => {

        let address = req.query.address;
        let pubkey;

        if(!address) return res.sendStatus(400);

        try {
            pubkey = new PublicKey(address);
        } catch(err) {
            try {
                pubkey = await getPublicKeyFromSolDomain(String(address))
            } catch(err) {
                return res.sendStatus(400);
            }
        }

        try {
            let history = await getTransactionHistory(pubkey);
            res.send({...history, publicKey: pubkey});
        } catch(err) {
            console.log(err)
            res.status(500);
            res.send(err);
        }

    })

}