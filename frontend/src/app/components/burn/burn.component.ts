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
    return this.web3.getTokenImage(this.token)
  }
  
  getTokenSymbol() {
    return this.web3.getTokenSymbol(this.token)
  }

  isReceiver(transfer) {
    return transfer.toUserAccount == this.publicKey
  }

}
