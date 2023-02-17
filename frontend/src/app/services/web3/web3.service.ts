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
    return this.tokens.find((token: Token) => token.mint == mint)
  }

  getNftMetadata(mint: string) {
    return this.nfts.find((nft: Token) => nft.mint == mint) 
  }

}

