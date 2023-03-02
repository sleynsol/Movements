import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Connection, PublicKey } from '@solana/web3.js';
import { environment } from 'src/environments/environment';
import { HistoryData } from 'src/app/model/HistoryData';
import { Token } from 'src/app/model/Token';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  connection: Connection;

  tokens: Token[];
  nfts: Token[];
  publicKeySubject: BehaviorSubject<PublicKey> = new BehaviorSubject(null);

  constructor(private http: HttpClient,  private router: Router) {
  }

  getPublicKeySubject$() {
    return this.publicKeySubject;
  }

  getAllTransactions(publicKey: string): Observable<HistoryData> {
    return this.http.get<HistoryData>(`${environment.url}/api/transactions`, {params: {address: publicKey.toString()}})
    .pipe(tap(
      (history: HistoryData) => {
        this.tokens = history.tokens;
        this.nfts = history.nfts;
        this.publicKeySubject.next(new PublicKey(history.publicKey));
        
      }
    ))
  }

  getTokenMetadata(mint: string) {
    return this.tokens.find((token: Token) => token.account == mint)
  }

  getNftMetadata(mint: string) {
    return this.nfts.find((nft: Token) => nft.account == mint) 
  }

  getTokenImage(token: Token) {
    if(token?.offChainMetadata?.metadata?.image) return token.offChainMetadata.metadata.image
    if(token?.legacyMetadata?.logoURI) return token.legacyMetadata.logoURI
    return "assets/tokens/unknown.png"
  }

  getTokenSymbol(token: Token) {
    if(token?.onChainMetadata?.metadata) {
      if(token.onChainMetadata.metadata.data?.symbol) return token.onChainMetadata.metadata.data.symbol
      if(token.onChainMetadata.metadata.data?.name) return token.onChainMetadata.metadata.data.name
    }
    if(token?.offChainMetadata?.metadata){
      if(token?.offChainMetadata?.metadata.symbol) return token?.offChainMetadata?.metadata.symbol
      if(token?.offChainMetadata?.metadata.name) return token?.offChainMetadata?.metadata.name
    }
    if(token?.legacyMetadata) {
      if(token.legacyMetadata.symbol) return token.legacyMetadata.symbol
      if(token.legacyMetadata.name) return token.legacyMetadata.name
    }

    if(token?.onChainAccountInfo.accountInfo.key.length > 0) return token?.onChainAccountInfo.accountInfo.key.substring(0,6)
    return "Unknown"
  }

  getNftName(token: Token) {
    if(token?.onChainMetadata?.metadata) {
      if(token.onChainMetadata.metadata.data?.name) return token.onChainMetadata.metadata.data.name
    }
    if(token?.offChainMetadata?.metadata){
      if(token?.offChainMetadata?.metadata.name) return token?.offChainMetadata?.metadata.name
    }
    if(token?.legacyMetadata) {
      if(token.legacyMetadata.name) return token.legacyMetadata.name
    }
    if(token?.onChainMetadata?.metadata) {
      if(token.onChainMetadata.metadata.data?.symbol) return token.onChainMetadata.metadata.data.symbol
    }
    if(token?.offChainMetadata?.metadata){
      if(token?.offChainMetadata?.metadata.symbol) return token?.offChainMetadata?.metadata.symbol
    }
    if(token?.legacyMetadata) {
      if(token.legacyMetadata.symbol) return token.legacyMetadata.symbol
    }

    if(token?.onChainAccountInfo.accountInfo.key.length > 0) return token?.onChainAccountInfo.accountInfo.key.substring(0,6)
    return "Unknown"
  }
}

