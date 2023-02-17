import { Component, Input, OnInit } from '@angular/core';
import { SOLANAFM_URL, SOLSCAN_URL } from 'src/app/constants/constants';
import { Transaction } from 'src/app/model/Transaction';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {

  @Input() transaction: Transaction

  constructor() { }

  ngOnInit() {}

  showSolscan() {
    window.open(`${SOLSCAN_URL}/tx/${this.transaction.signature}`)
  }

  showSolanaFM() {
    window.open(`${SOLANAFM_URL}/tx/${this.transaction.signature}?cluster=mainnet-qn1`)
  }

}
