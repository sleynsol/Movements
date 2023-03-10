export interface Transaction {
    type: "SOL_TRANSFER" | "TOKEN_TRANSFER" | "NFT" | "SWAP" | "BURN",
    source: string;
    signature: string;
    timestamp: number;
    tokenTransfers: {
        fromTokenAccount: string;
        toTokenAccount: string;
        fromUserAccount: string;
        toUserAccount: string;
        tokenAmount: number;
        mint: string;
        tokenStandard: string;
    }[];
    nativeTransfers: {
        fromUserAccount: string;
        toUserAccount: string;
        amount: number;
    }[];
}
