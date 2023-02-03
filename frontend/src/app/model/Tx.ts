export interface Tx {
    description: string;
    type: string;
    source: string;
    fee: number;
    feePayer: string;
    signature: string;
    slot: number;
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
    events: {
        nft: any
    }
}
