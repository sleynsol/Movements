import { Component, Input, OnInit } from '@angular/core';
import { Token } from 'src/app/model/Token';
import { Transaction } from 'src/app/model/Transaction';
import { Web3Service } from 'src/app/services/web3/web3.service';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss'],
})
export class SwapComponent implements OnInit {

  @Input() transaction: Transaction
  @Input() publicKey: string
  @Input() expanded: boolean

  inputToken: Token;
  outputToken: Token;

  constructor(private web3: Web3Service) { }

  ngOnInit() {
    console.log(this.transaction)
    this.inputToken = this.web3.getTokenMetadata(this.transaction.tokenTransfers.find(tx => tx.fromUserAccount == this.publicKey).mint)
    this.outputToken = this.web3.getTokenMetadata(this.transaction.tokenTransfers.find(tx => tx.toUserAccount == this.publicKey).mint)
  }

  getInputTokenSymbol() {
    if(this.inputToken?.offChainData) return this.inputToken.offChainData.symbol
    if(this.inputToken?.onChainData) return this.inputToken.onChainData.data.symbol
    if(this.inputToken) return this.inputToken.mint.substring(0,6)
  }

  getOutputTokenSymbol() {
    if(this.outputToken?.offChainData) return this.outputToken.offChainData.symbol
    if(this.outputToken?.onChainData) return this.outputToken.onChainData.data.symbol
    if(this.outputToken) return this.outputToken.mint.substring(0,6)
  }

  getInputTokenAmount() {
    return Number(this.transaction.tokenTransfers.find(t => t.mint == this.inputToken.mint).tokenAmount).toFixed(2)
  }

  getOutputTokenAmount() {
    return Number(this.transaction.tokenTransfers.find(t => t.mint == this.outputToken.mint).tokenAmount).toFixed(2)
  }

  getExchangeIcon() {
    switch(this.transaction.source) {
      case "JUPITER":
         return "assets/exchanges/jupiter-logo.svg"
      case "ALDRIN":
        return "assets/exchanges/aldrin.svg"
      default: return "assets/tokens/unknown.png"
    }
  }

}
