import { Type } from "./Type";

export interface TransactionRich {
    description: string;
    type: Type;
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
    accountData: {
        account: string;
        nativeBalanceChange: number;
        tokenBalanceChange: {
            userAccount: string;
            tokenAccount: string;
            mint: string;
            rawTokenAmount: {
                tokenAmount: string;
                decimals: number;
            }[]
        }
    }[];
    instructions: {
        accounts: string[];
        data: string;
        programId: string;
        innerInstructions: {
            accounts: string[];
            data: string;
            programId: string
        }[];
    }[];
    events: {
        nft?: {
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
    };
    transactionError: {};
}
