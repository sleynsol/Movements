import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HistoryData } from 'src/app/model/HistoryData';
import { Transaction } from 'src/app/model/Transaction';
import { Web3Service } from 'src/app/services/web3/web3.service';
import * as _ from 'lodash'
import { getDayOfYear, getYear, isSameDay } from 'date-fns';
import { TransactionGroup } from 'src/app/model/TransactionGroup';

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
  groupedTransactions: TransactionGroup[]
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
      this.groupedTransactions = this.groupTxByDay(this.transactions)
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
    this.groupedTransactions = this.groupTxByDay(this.transactions)
  }

  groupTxByDay(transactions: Transaction[]) {
    let grouped = _.groupBy(
      transactions.filter(tr => ["SOL_TRANSFER","TOKEN_TRANSFER","NFT","NFT_MINT","SWAP","BURN"].includes(tr.type)),
        (tr: Transaction) => `${getYear(new Date(tr.timestamp * 1000))}-${getDayOfYear(new Date(tr.timestamp * 1000))}`
      )

    let groupedTxs = []
    Object.keys(grouped).forEach(key => {
      groupedTxs.push({date: grouped[key][0].timestamp, transactions: grouped[key]})
    })

    console.log(groupedTxs)
    return groupedTxs
  }

  expand(transaction: Transaction) {
    if(this.isExpanded(transaction)) this.expandedTx = undefined;
    else this.expandedTx = transaction.signature;
  }

  isExpanded(transaction: Transaction) {
    return this.expandedTx == transaction.signature;
  }
}
