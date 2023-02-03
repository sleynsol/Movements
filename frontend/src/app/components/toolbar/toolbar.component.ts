import { Component, OnInit } from '@angular/core';
import { PublicKey } from '@solana/web3.js';
import { Web3Service } from 'src/app/services/web3/web3.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent{

  connected: boolean = false;
  pubKey: string

  constructor(private web3: Web3Service) {
    this.listenToConnection()
   }

  listenToConnection() {
    this.web3.getWeb3ConnectionSubject$().subscribe(value => {
      this.connected = value
      if(this.connected) this.pubKey = this.web3.getPublicKey().toString()
    })
  }

  connectWallet() {
    this.web3.connectWallet()
  }

}
