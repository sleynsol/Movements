import { Component, Input, OnInit } from '@angular/core';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SOLANAFM_URL, SOLSCAN_URL } from 'src/app/constants/constants';
import { NFTEvent } from 'src/app/model/NftEvent';
import { Token } from 'src/app/model/Token';
import { Transaction } from 'src/app/model/Transaction';
import { Web3Service } from 'src/app/services/web3/web3.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {

  @Input() transaction: Transaction
  @Input() publicKey: string
  @Input() expanded: boolean

  token: Token;
  nft: Token;
  event: NFTEvent;

  inputToken: Token;
  outputToken: Token;

  constructor(private web3: Web3Service) { 

  }

  ngOnInit() {
    if(this.transaction.type == "TOKEN_TRANSFER") {
      this.token = this.web3.getTokenMetadata(this.transaction.tokenTransfers[0].mint)
    }
    if(this.transaction.type == "NFT") {
      this.event = this.transaction.nft;
      this.token = this.web3.getNftMetadata(this.event.nfts[0].mint)
    }
    
    if(this.transaction.type == "SWAP") {
      this.inputToken = this.web3.getTokenMetadata(this.transaction.tokenTransfers.find(tx => tx.fromUserAccount == this.publicKey).mint)
      this.outputToken = this.web3.getTokenMetadata(this.transaction.tokenTransfers.find(tx => tx.toUserAccount == this.publicKey).mint)
    }

  }

  getOther(transfer) {
    if(transfer.fromUserAccount == this.publicKey)
      return transfer.toUserAccount.substr(0,8);

    return transfer.fromUserAccount.substr(0,8)
  }

  getSolAmount(amount: number) {
    return Number(amount / LAMPORTS_PER_SOL).toFixed(2)
  }

  isReceiver(transfer) {
    return transfer.toUserAccount == this.publicKey
  }

  getMarketplaceName() {
  
    switch(this.event.source) {
      case "MAGIC_EDEN":
        return "Magic Eden";
      case "SOLANART":
        return "Solanart";
      default:
        return ""
    }

  }

  getTokenImage() {
    if(!this.token || !this.token.offChainData) return "assets/tokens/unknown.png"
    return this.token.offChainData.image
  }

  getTokenSymbol() {
    if(this.token?.offChainData) return this.token.offChainData.symbol
    if(this.token?.onChainData) return this.token.onChainData.data.symbol
    if(this.token) return this.token.mint.substring(0,6)
  }

  getInputTokenSymbol() {
    if(this.inputToken?.offChainData) return this.inputToken.offChainData.symbol
    if(this.inputToken?.onChainData) return this.inputToken.onChainData.data.symbol
    if(this.inputToken) return this.inputToken.mint.substring(0,6)
  }

  getOutputTokenSymbol() {
    if(this.outputToken?.offChainData) return this.outputToken.offChainData.symbol
    if(this.outputToken?.onChainData) return this.outputToken.onChainData.data.symbol
    if(this.outputToken) return this.outputToken.mint.substring(0,6)
  }

  getInputTokenAmount() {
    return Number(this.transaction.tokenTransfers.find(t => t.mint == this.inputToken.mint).tokenAmount).toFixed(2)
  }

  getOutputTokenAmount() {
    return Number(this.transaction.tokenTransfers.find(t => t.mint == this.outputToken.mint).tokenAmount).toFixed(2)
  }

  getNftImage() {
    if(!this.token || !this.token.offChainData) return "assets/tokens/unknown.png"
    return this.token.offChainData.image
  }

  getNftName() {
    if(this.nft?.offChainData) return this.token.offChainData.name
    if(this.token?.onChainData) return this.token.onChainData.data.name
    return ""
  }

  showSolscan() {
    window.open(`${SOLSCAN_URL}/tx/${this.transaction.signature}`)
  }

  showSolanaFM() {
    window.open(`${SOLANAFM_URL}/tx/${this.transaction.signature}?cluster=mainnet-qn1`)
  }



}
