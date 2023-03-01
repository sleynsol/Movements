import { Component, Input, OnInit } from '@angular/core';
import { Token } from 'src/app/model/Token';
import { Transaction } from 'src/app/model/Transaction';
import { Web3Service } from 'src/app/services/web3/web3.service';

@Component({
  selector: 'app-burn',
  templateUrl: './burn.component.html',
  styleUrls: ['./burn.component.scss'],
})
export class BurnComponent implements OnInit {

  @Input() transaction: Transaction
  @Input() publicKey: string
  @Input() expanded: boolean

  token: Token

  constructor(private web3: Web3Service) { }

  ngOnInit() {
    this.token = this.web3.getTokenMetadata(this.transaction.tokenTransfers[0].mint)
  }

  getTokenImage() {
    if(!this.token || !this.token.offChainData) return "assets/tokens/unknown.png"
    return this.token.offChainData.image
  }

  getTokenSymbol() {
    if(this.token?.offChainData) {
      if(this.token.offChainData.symbol) return this.token.offChainData.symbol
      if(this.token.offChainData.name) return this.token.offChainData.name
    }
    if(this.token?.onChainData){
      if(this.token.onChainData.symbol) return this.token.onChainData.data.symbol
      if(this.token.onChainData.name) return this.token.onChainData.data.name
    }
    if(this.token?.mint?.length > 0) return this.token.mint.substring(0,6)
    return "Unknown"
  }

  isReceiver(transfer) {
    return transfer.toUserAccount == this.publicKey
  }

  

}
