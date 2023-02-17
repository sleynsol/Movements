import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HistoryData } from 'src/app/model/HistoryData';
import { Transaction } from 'src/app/model/Transaction';
import { Web3Service } from 'src/app/services/web3/web3.service';

@Component({
  selector: 'app-viewer',
  templateUrl: 'viewer.page.html',
  styleUrls: ['viewer.page.scss']
})
export class ViewerPage {

  @ViewChild("addressInput") addressInput: any

  connected: boolean = false;
  history: HistoryData = undefined;
  transactions: Transaction[];
  publicKey: string;
  filter: string = "all";
  loading: boolean = false;
  expandedTx: string;

  constructor(private web3: Web3Service, private toastCtrl: ToastController) {}

  loadTransactions() {
    this.loading = true;
    this.web3.getAllTransactions(this.addressInput.el.value).subscribe(
      (history: HistoryData) => {
      this.history = history;
      this.publicKey = history.publicKey;
      this.transactions = history.transactions
      this.loading = false;
    },(err: HttpErrorResponse) => {
      this.loading = false;
      this.toastCtrl.create(
        {
          message: "Not a valid address",
          position: "bottom",
          color: "danger",
          duration: 2000
        }
      ).then(t => t.present())
    })
  }

  applyFilter() {
    console.log(this.filter)
    switch(this.filter) {
      case "all":
        this.transactions = this.history.transactions;
        break;
      case "nfts":
        this.transactions = this.history.transactions.filter(tx => tx.type == "NFT")
        break;
      case "tokens":
        this.transactions = this.history.transactions.filter(tx => tx.type == "TOKEN_TRANSFER")
        break;
      case "sol":
        this.transactions = this.history.transactions.filter(tx => tx.type == "SOL_TRANSFER")
        break;
      case "mint":
        this.transactions = this.history.transactions.filter(tx => tx.type == "NFT_MINT")
        break;
      case "swap":
        this.transactions = this.history.transactions.filter(tx => tx.type == "SWAP")
    }
  }

  expand(transaction: Transaction) {
    if(this.isExpanded(transaction)) this.expandedTx = undefined;
    else this.expandedTx = transaction.signature;
  }

  isExpanded(transaction: Transaction) {
    return this.expandedTx == transaction.signature;
  }
}
