import { Component, Input, OnInit } from '@angular/core';
import { SOLANAFM_URL, SOLSCAN_URL } from 'src/app/constants/constants';
import { Token } from 'src/app/model/Token';
import { Transaction } from 'src/app/model/Transaction';
import { Web3Service } from 'src/app/services/web3/web3.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {

  @Input() transaction: Transaction
  @Input() token: Token

  constructor(private web3: Web3Service) { }

  ngOnInit() {}

  getNftImage() {
    return this.web3.getTokenImage(this.token)
  }
  

  showSolscan() {
    window.open(`${SOLSCAN_URL}/tx/${this.transaction.signature}`)
  }

  showSolanaFM() {
    window.open(`${SOLANAFM_URL}/tx/${this.transaction.signature}?cluster=mainnet-qn1`)
  }

}
