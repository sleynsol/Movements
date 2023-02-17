import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import axios, {AxiosResponse} from 'axios';
import { HELIUS_API } from "../constants/constants";
import { TransactionRich } from "../model/TransactionRich";
import * as _ from 'lodash'
import * as fs from 'fs'


export async function getTransactionHistory(address: PublicKey) {

    //return JSON.parse(String(fs.readFileSync("J:\\web3\\tx-viewer\\backend\\dist\\testdata.json")))
    let res: AxiosResponse<TransactionRich[]> = await axios.get(
        `${HELIUS_API}/addresses/${address}/transactions`,
        {
            params: {"api-key": process.env.HELIUS_API_KEY}
        }
    )

    let txs = res.data
    .filter(d => d.transactionError == null)
    .map(tr => {
        return {
            signature: tr.signature,
            timestamp: tr.timestamp,
            source: tr.source,
            tokenTransfers: tr.tokenTransfers.filter(t => t.fromUserAccount == address.toString() || t.toUserAccount == address.toString()),
            nativeTransfers: tr.nativeTransfers.filter(t => t.fromUserAccount == address.toString() || t.toUserAccount == address.toString()),
            nft: tr.events.nft,
            type: getType(tr)
        }
    })

    let nfts = []

    for(let tx of txs) {
        if(!tx.nft) continue;
        tx.nft.nfts.forEach(n => nfts.push(n.mint))
    }

    let tokens = []

    for(let tx of txs) {
        tx.tokenTransfers.forEach(transfer => {
            tokens.push(transfer.mint)
        })
    }

    tokens = _.uniq(tokens).filter(token => !nfts.includes(token));

    let nftMetadata = await getNftMetadata(nfts);
    let tokenMetadata = await getTokenMetadata(tokens);

    return {tokens: tokenMetadata, nfts: nftMetadata, transactions: txs};
}

function getType(transaction: TransactionRich) {
    if(transaction.events.nft) return "NFT"
    if(transaction.type == "TRANSFER") {
        if(transaction.tokenTransfers.length == 0) return "SOL_TRANSFER"
        return "TOKEN_TRANSFER"
    }
    return transaction.type
}

async function getNftMetadata(mints: string[]) {
    let res: AxiosResponse = await axios.post(`${HELIUS_API}/tokens/metadata`, {mintAccounts: mints}, {params: {"api-key": process.env.HELIUS_API_KEY}})
    return res.data;
}

async function getTokenMetadata(mints: string[]) {
    let res: AxiosResponse = await axios.post(`${HELIUS_API}/tokens/metadata`, {"mintAccounts": mints}, {params: {"api-key": process.env.HELIUS_API_KEY}})
    return res.data;
}


function extractTransactions(transactions: TransactionRich[], address: string) {
    let txs = [];

    for(let tx of transactions) {
        let transfers = extractTransfers(tx, address)
        console.log(tx.signature)
        console.log(transfers)
    }

    return txs;
}

function extractTransfers(transaction: TransactionRich, address: string) {

    let transfers = new Map<string, number>();

    //filter transfers without the user
    let native = transaction.nativeTransfers.filter(
        n => n.fromUserAccount == address || n.toUserAccount == address
    )

    let nativeAmount = 0;

    //cumulate the amount of Sol
    native.forEach(n => {
        if(n.fromUserAccount == address) nativeAmount -= n.amount;
        else nativeAmount -= n.amount;
    })

    transfers.set("sol", nativeAmount)
    
    //filter transfers without the user
    let tokenTransfers = transaction.tokenTransfers.filter(
        t => t.fromUserAccount == address || t.toUserAccount == address
    )
    
    //Cumulate the token amount to the mint
    tokenTransfers.forEach(transfer => {
        let amount = transfer.tokenAmount;
        if(transfer.fromUserAccount == address) amount *= (-1);

        if(transfers.get(transfer.mint) == undefined) transfers.set(transfer.mint, amount)
        else {
            transfers.set(
                transfer.mint, 
                transfers.get(transfer.mint) + amount
            )
        }
    })


    return transfers;

}

export async function getPublicKeyFromSolDomain(domain: string):Promise<string>{
    const domainKey = await bonfida.getDomainKey(domain);
    console.log(domainKey.pubkey.toString())
    const owner = (await bonfida.NameRegistryState.retrieve(CONNECTION, domainKey.pubkey)).registry.owner.toBase58();
    //console.log(`The owner of SNS Domain: ${domain} is: `,owner);
    console.log(owner)
    return owner
}