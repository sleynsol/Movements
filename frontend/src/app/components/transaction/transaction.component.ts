import { Component, Input, OnInit } from '@angular/core';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { NFTEvent } from 'src/app/model/NftEvent';
import { Token } from 'src/app/model/Token';
import { Transaction } from 'src/app/model/Transaction';
import { Tx } from 'src/app/model/Tx';
import { Web3Service } from 'src/app/services/web3/web3.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {

  @Input() transaction: Transaction
  @Input() publicKey: string
  @Input() expanded: boolean

  token: Token;
  nft: Token;
  event: NFTEvent;

  constructor(private web3: Web3Service) { 

  }

  ngOnInit() {
    if(this.transaction.type == "TOKEN_TRANSFER") {
      this.token = this.web3.getTokenMetadata(this.transaction.tokenTransfers[0].mint)
    }
    if(this.transaction.type == "NFT") {
      this.event = this.transaction.nft;
      this.token = this.web3.getNftMetadata(this.event.nfts[0].mint)
    }

  }

  getOther(transfer) {

    if(transfer.fromUserAccount == this.publicKey)
      return transfer.toUserAccount.substr(0,8);

    return transfer.fromUserAccount.substr(0,8)
    

  }

  getSolAmount(amount: number) {
    return amount / LAMPORTS_PER_SOL
  }

  isReceiver(transfer) {
    return transfer.toUserAccount == this.publicKey
  }

  getMarketplaceName() {
  
    switch(this.event.source) {
      case "MAGIC_EDEN":
        return "Magic Eden";
      case "SOLANART":
        return "Solanart";
      default:
        return ""
    }

  }

  getTokenImage() {
    if(!this.token || !this.token.offChainData) return "assets/tokens/unknown.png"
    return this.token.offChainData.image
  }

  getTokenSymbol() {
    if(this.token?.offChainData) return this.token.offChainData.symbol
    if(this.token?.onChainData) return this.token.onChainData.data.symbol
    if(this.token) return this.token.mint.substring(0,6)
  }

  getNftImage() {
    if(!this.token || !this.token.offChainData) return "assets/tokens/unknown.png"
    return this.token.offChainData.image
  }

  getNftName() {
    if(this.nft?.offChainData) return this.token.offChainData.name
    if(this.token?.onChainData) return this.token.onChainData.data.name
    return ""
  }

}
