/*export interface Token {
    mint: string,
    onChainData: any,
    offChainData: {
        creators: any,
        description: string,
        external_url: string,
        image: string,
        name: string,
        seller_fee_basis_points: number,
        symbol: string
    }
}*/

export interface Token {

    account: string,
    onChainAccountInfo: {
        accountInfo: {
            key: string,
            isSigner: boolean,
            isWritable: boolean,
            lamports: number,
            data: {
                parsed: {
                    info: {
                        decimals: number,
                        freezeAuthority: string,
                        isInitialized: boolean,
                        mintAuthority: string,
                        supply: string
                    },
                    type: string
                },
                program: string,
                space: number,
                owner: string,
                executable: boolean,
                rentEpoch: number,
            }
            owner: string,
            executable: boolean,
            rentEpoch: number
        },
        error: string
    },
    onChainMetadata: {
        metadata: {
            tokenStandard: string,
            key: string,
            updateAuthority: string,
            mint: string,
            data: {
                name: string,
                symbol: string,
                uri: string,
                sellerFeeBasisPoints: number,
                creators: any,
                primarySaleHappened: boolean,
                isMutable: boolean,
                editionNonce: number,
                collection: any,
                collectionDetails: any
            }
        },
        error: string
    },
    offChainMetadata: {
        metadata: {
            attributes: any[],
            description: string,
            image: string,
            name: string,
            properties: any,
            sellerFeeBasisPoints: number,
            symbol: string,
        },
        uri: string,
        error: string
    },
    legacyMetadata: {
        chainId: number,
        address: string,
        symbol: string,
        name: string,
        decimals: number,
        logoURI: string,
        tags: string[],

    }

}