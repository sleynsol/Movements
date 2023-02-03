import { Token } from "./Token";
import { Transaction } from "./Transaction";

export interface HistoryData {
    tokens: Token[],
    nfts: Token[],
    transactions: Transaction[]
}