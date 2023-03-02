import { Component, Input, OnInit } from '@angular/core';
import { Token } from 'src/app/model/Token';
import { Transaction } from 'src/app/model/Transaction';
import { Web3Service } from 'src/app/services/web3/web3.service';

@Component({
  selector: 'app-token-transfer',
  templateUrl: './token-transfer.component.html',
  styleUrls: ['./token-transfer.component.scss'],
})
export class TokenTransferComponent implements OnInit {

  @Input() transaction: Transaction
  @Input() publicKey: string
  @Input() expanded: boolean


  token: Token;

  constructor(private web3: Web3Service) { }

  ngOnInit() {
    this.token = this.web3.getTokenMetadata(this.transaction.tokenTransfers[0].mint)
  }

  showToken() {
    window.open(`https://solscan.io/token/${this.token.account}`, "_blank")
  }


  getOther(transfer) {
    if(transfer.fromUserAccount.length == 0) return "an Airdrop"
    if(transfer.fromUserAccount == this.publicKey)
      return `${transfer.toUserAccount.substr(0,4)}...${transfer.toUserAccount.substr(-4)}`;

    return `${transfer.fromUserAccount.substr(0,4)}...${transfer.fromUserAccount.substr(-4)}`
  }

  getOtherLink(transfer) {
    if(transfer.fromUserAccount == this.publicKey) return `https://solscan.io/account/${transfer.toUserAccount}`
    return `https://solscan.io/account/${transfer.fromUserAccount}`
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
