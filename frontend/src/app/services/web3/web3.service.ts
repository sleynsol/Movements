import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { Connection, PublicKey } from '@solana/web3.js';
import { Tx } from 'src/app/model/Tx';
import { NFTs } from 'src/app/constants/nfts';
import { environment } from 'src/environments/environment';
import { Transaction } from 'src/app/model/Transaction';
import { HistoryData } from 'src/app/model/HistoryData';
import { Token } from 'src/app/model/Token';

const ADDRESS = "6MpxjLErHqDfbRMjhRepSA17p2gkWS4W7VPSEE97a9Nf"

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  connection: Connection;

  walletAdapter: PhantomWalletAdapter | SolflareWalletAdapter = new PhantomWalletAdapter();
  isConnectedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false)
  isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject(false)
  installedWallets: string[] = [];

  tokens: Token[];
  nfts: Token[];

  constructor(private http: HttpClient,  private router: Router) {
    this.checkInstalledWallets()
    this.connectWallet()
  }

  checkInstalledWallets() {
    //@ts-ignore
    if(window.phantom) this.installedWallets.push('phantom')
    //@ts-ignore
    if(window.solflare) this.installedWallets.push('solflare')
  }

  getInstalledWallets() {
    return this.installedWallets;
  }

  selectWalletAdapter(adapter: string) {
    switch(adapter) {
      case "phantom":
        this.walletAdapter = new PhantomWalletAdapter();
        break;
      case "solflare":
        this.walletAdapter = new SolflareWalletAdapter();
      break;
    }
  }
 
  connectWallet() {
    this.walletAdapter.connect().then(() => {
      this.isConnectedSubject.next(true);
    })
  }

  disconnectWallet() {
    this.walletAdapter.disconnect().then(() => {
      this.isConnectedSubject.next(false);
      this.isLoggedInSubject.next(false);
      this.router.navigateByUrl("login");
    })
  }

  getWeb3ConnectionSubject$(): BehaviorSubject<boolean> {
    return this.isConnectedSubject;
  }

  getLoggedInSubject$(): BehaviorSubject<boolean> {
    return this.isLoggedInSubject;
  }

  getPublicKey() {
    return this.walletAdapter.publicKey
  }

  getAllTransactions(publicKey: string): Observable<HistoryData> {
    return this.http.get<HistoryData>(`${environment.url}/api/transactions`, {params: {address: publicKey.toString()}})
    .pipe(tap(
      (history: HistoryData) => {
        this.tokens = history.tokens;
        this.nfts = history.nfts;
      }
    ))
//    return TXs.filter(tx => tx.type != 'UNKNOWN');
   // return this.http.get(`https://api.helius.xyz/v0/addresses/${ADDRESS}/transactions?api-key=${API_KEY}`)
  }

  getTokenMetadata(mint: string) {
    return this.tokens.find((token: Token) => token.mint == mint)
  }

  getNftMetadata(mint: string) {
    return this.nfts.find((nft: Token) => nft.mint == mint) 
  }



  /*createRpcConnection() {
    let accessToken = this.auth.getToken()
    this.connection = new Connection(`${environment.rpc_endpoint}`, {
      commitment: 'confirmed',
      httpHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }*/

}