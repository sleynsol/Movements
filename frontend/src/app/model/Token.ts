export interface Token {
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
}