import { Connection, PublicKey } from "@solana/web3.js";
import axios, {AxiosResponse} from 'axios';
import { HELIUS_API, RPC_URL } from "../constants/constants";
import { TransactionRich } from "../model/TransactionRich";
import * as _ from 'lodash'
import * as fs from 'fs'
import * as bonfida from '@bonfida/spl-name-service'

var CONNECTION: Connection

export function initTransactionUtils() {
    CONNECTION = new Connection(RPC_URL, "confirmed")
}


export async function getTransactionHistory(address: PublicKey) {

    if(process.env.MODE == "DEV") {
        return JSON.parse(String(fs.readFileSync("J:\\web3\\tx-viewer\\backend\\dist\\testdata.json")))
    }
    
    let res: AxiosResponse<TransactionRich[]> = await axios.get(
        `${HELIUS_API}/addresses/${address}/transactions`,
        {
            params: {"api-key": process.env.HELIUS_API_KEY}
        }
    )

    let txs = res.data
    .filter(d => d.transactionError == null)
    .map(tr => parseTransaction(tr, address))

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

function parseTransaction(transaction: TransactionRich, address: PublicKey) {
    switch(transaction.source) {
        case "JUPITER": return parseJupiterTx(transaction, address);
        case "HADESWAP": return parseHadeswapTx(transaction, address);
        case "Elixir": return parseHadeswapTx(transaction, address);
        default: return parseDefaultTransaction(transaction, address)
    }
}

function parseJupiterTx(transaction: TransactionRich, address: PublicKey) {
    
    if(transaction.tokenTransfers.length == 2) return parseDefaultTransaction(transaction, address);
    
    let transfers = extractTokenTransfers(transaction, address.toString())

    return {
        signature: transaction.signature,
        timestamp: transaction.timestamp,
        source: transaction.source,
        tokenTransfers: transaction.tokenTransfers.filter(t => transfers.get(t.mint) != 0),
        nativeTransfers: transaction.nativeTransfers.filter(t => t.fromUserAccount == address.toString() || t.toUserAccount == address.toString()),
        nft: transaction.events.nft,
        type: getType(transaction)
    }
}

function parseHadeswapTx(transaction: TransactionRich, address: PublicKey) {

    let transfer = transaction.tokenTransfers[0]
    let isBuyer = (transfer.toUserAccount == address.toString())

    return {
        signature: transaction.signature,
        timestamp: transaction.timestamp,
        source: transaction.source,
        tokenTransfers: transaction.tokenTransfers.filter(t => t.fromUserAccount == address.toString() || t.toUserAccount == address.toString()),
        nativeTransfers: transaction.nativeTransfers.filter(t => t.fromUserAccount == address.toString() || t.toUserAccount == address.toString()),
        nft: {
            type: "NFT_SALE",
            source: "HADESWAP",
            saleType: "NFT_SWAP",
            signature: transaction.signature,
            buyer: (isBuyer ? transfer.fromUserAccount : transfer.toUserAccount),
            seller: (isBuyer ? transfer.toUserAccount : transfer.fromUserAccount),
            amount: (
                    isBuyer ?
                    transaction.nativeTransfers.find(n => n.fromUserAccount == address.toString()).amount :
                    transaction.nativeTransfers.find(n => n.toUserAccount == address.toString()).amount
                ),
            nfts: [
                {
                    mint: transaction.tokenTransfers[0].mint,
                    tokenStandard: "NonFungible"
                }
            ]
        },
        type: "NFT"
    }
}

function parseDefaultTransaction(transaction: TransactionRich, address: PublicKey) {
    return {
        signature: transaction.signature,
        timestamp: transaction.timestamp,
        source: transaction.source,
        tokenTransfers: transaction.tokenTransfers.filter(t => t.fromUserAccount == address.toString() || t.toUserAccount == address.toString()),
        nativeTransfers: transaction.nativeTransfers.filter(t => t.fromUserAccount == address.toString() || t.toUserAccount == address.toString()),
        nft: transaction.events.nft,
        type: getType(transaction)
    }
}

function getType(transaction: TransactionRich) {
    if(transaction.events.nft) {
        if(transaction.events.nft.type == "NFT_MINT") return "NFT_MINT"
        return "NFT"
    }
    if(["TRANSFER", "TOKEN_MINT"].includes(transaction.type)) {
        if(transaction.tokenTransfers.length == 0) return "SOL_TRANSFER"
        return "TOKEN_TRANSFER"
    }
    return transaction.type
}

function extractTokenTransfers(transaction: TransactionRich, address: string) {
    let transfers = new Map<string, number>();

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

async function getNftMetadata(mints: string[]) {
    let res: AxiosResponse = await axios.post(`${HELIUS_API}/tokens/metadata`, {mintAccounts: mints}, {params: {"api-key": process.env.HELIUS_API_KEY}})
    return res.data;
}

async function getTokenMetadata(mints: string[]) {
    let res: AxiosResponse = await axios.post(`${HELIUS_API}/tokens/metadata`, {"mintAccounts": mints}, {params: {"api-key": process.env.HELIUS_API_KEY}})
    return res.data;
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
    const owner = (await bonfida.NameRegistryState.retrieve(CONNECTION, domainKey.pubkey)).registry.owner.toBase58();
    return owner
}