export interface NFTEvent{
    description: string;
    type: string;
    source: string;
    amount: number;
    fee: number;
    feePayer: string;
    signature: string;
    slot: number;
    timestamp: number;
    saleType: string;
    buyer: string;
    seller: string;
    staker: string;
    nfts: {
        mint: string;
        tokenStandard: string;
    }[]
}