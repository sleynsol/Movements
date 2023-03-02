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
    this.inputToken = this.web3.getTokenMetadata(this.transaction.tokenTransfers.find(tx => tx.fromUserAccount == this.publicKey).mint)
    this.outputToken = this.web3.getTokenMetadata(this.transaction.tokenTransfers.find(tx => tx.toUserAccount == this.publicKey).mint)
  }

  getInputTokenSymbol() {
    return this.web3.getTokenSymbol(this.inputToken)
  }
  
  getOutputTokenSymbol() {
    return this.web3.getTokenSymbol(this.outputToken)
  }

  getInputTokenAmount() {
    return Number(this.transaction.tokenTransfers.find(t => t.mint == this.inputToken.account).tokenAmount).toFixed(2)
  }

  getOutputTokenAmount() {
    return Number(this.transaction.tokenTransfers.find(t => t.mint == this.outputToken.account).tokenAmount).toFixed(2)
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
