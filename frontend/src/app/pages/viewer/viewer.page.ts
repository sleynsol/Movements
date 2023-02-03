import { Component, ViewChild } from '@angular/core';
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

  constructor(private web3: Web3Service) {
  }

  listenToConnection() {
    this.web3.getWeb3ConnectionSubject$().subscribe((value) => {
      this.connected = value
      if(this.connected){
      } 
    })
  }

  loadTransactions() {
    this.publicKey = this.addressInput.el.value;
    /*this.web3.getAllTransactions().subscribe((txs: Tx[]) => {
      this.transactions = txs
      console.log(this.transactions)

    })*/
    //@ts-ignore
    this.loading = true;
    this.web3.getAllTransactions(this.publicKey).subscribe((history: HistoryData) => {
      this.history = history;
      this.transactions = history.transactions
      this.loading = false;
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
