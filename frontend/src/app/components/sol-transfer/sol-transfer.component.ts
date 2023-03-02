import { Component, Input, OnInit } from '@angular/core';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Transaction } from 'src/app/model/Transaction';

@Component({
  selector: 'app-sol-transfer',
  templateUrl: './sol-transfer.component.html',
  styleUrls: ['./sol-transfer.component.scss'],
})
export class SolTransferComponent implements OnInit {

  @Input() transaction: Transaction
  @Input() publicKey: string
  @Input() expanded: boolean

  constructor() {}

  ngOnInit() {}

  getOther(transfer) {
    if(transfer.fromUserAccount == this.publicKey)
    return `${transfer.toUserAccount.substr(0,4)}...${transfer.toUserAccount.substr(-4)}`;
    return `${transfer.fromUserAccount.substr(0,4)}...${transfer.fromUserAccount.substr(-4)}`
  }

  getOtherLink(transfer) {
    if(transfer.fromUserAccount == this.publicKey) return `https://solscan.io/account/${transfer.toUserAccount}`
    return `https://solscan.io/account/${transfer.fromUserAccount}`
  }

  getSolAmount(amount: number) {
    let amountFixed = Number(amount / LAMPORTS_PER_SOL)
    if(amountFixed % 1 == 0) return amountFixed.toFixed(0)
    return amountFixed.toFixed(2)
  }
  
  isReceiver(transfer) {
    return transfer.toUserAccount == this.publicKey
  }

}