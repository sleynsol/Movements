import { Component, Input, OnInit } from '@angular/core';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { NFTEvent } from 'src/app/model/NftEvent';
import { Token } from 'src/app/model/Token';
import { Transaction } from 'src/app/model/Transaction';
import { Web3Service } from 'src/app/services/web3/web3.service';

@Component({
  selector: 'app-nft',
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.scss'],
})
export class NftComponent implements OnInit {

  @Input() transaction: Transaction
  @Input() publicKey: string
  @Input() expanded: boolean
  
  token: Token;
  event: NFTEvent;

  constructor(private web3: Web3Service) { }

  ngOnInit() {
    this.event = this.transaction.nft;
    this.token = this.web3.getNftMetadata(this.event.nfts[0].mint)
  }

  showNft() {
    window.open(`https://solscan.io/token/${this.token.account}`, "_blank")
  }

  getNftImage() {
    return this.web3.getTokenImage(this.token)
  }
  
  getNftName() {
    return this.web3.getNftName(this.token)
  }

  getTextByNftType() {

    switch(this.event.type) {
      case "NFT_BID": return `Bidded ${this.getSolAmount(this.event.amount)} on ${this.getNftName()}`
      case "NFT_BID_CANCELLED": return `Canceled Bid for ${this.getNftName()}`
      case "NFT_LISTING": return `Listed ${this.getNftName()} for ${this.getSolAmount(this.event.amount)} on ${this.getMarketplaceName()}`
      case "NFT_CANCEL_LISTING": return `Canceled Listing for ${this.getNftName()}`
      case "NFT_SALE": return `${this.getNftName()} for ${this.getSolAmount(this.event.amount)} SOL on ${this.getMarketplaceName()}`
      case "SFT_MINT": return `Received ${this.getNftName()} as an Airdrop`
      default: return ""
    }

  }

  getClassByNftType() {
    switch(this.event.type) {
      case "NFT_SALE": return (this.event.buyer == this.publicKey ? 'nft-receive' : 'nft-sent')
      case "SFT_MINT": return 'tx-receive'
      default: return ""
    }
  }

  getSolAmount(amount: number) {
    return Number(amount / LAMPORTS_PER_SOL).toFixed(2)
  }

  getMarketplaceName() {
    switch(this.event.source) {
      case "MAGIC_EDEN":
        return "Magic Eden";
      case "SOLANART":
        return "Solanart";
      case "HADESWAP":
        return "Hadeswap";
      default:
        return this.event.source
    }
  }

}
