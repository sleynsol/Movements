import { Component, Input, OnInit } from '@angular/core';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { NFTEvent } from 'src/app/model/NftEvent';
import { Token } from 'src/app/model/Token';
import { Transaction } from 'src/app/model/Transaction';
import { Web3Service } from 'src/app/services/web3/web3.service';

@Component({
  selector: 'app-nft-mint',
  templateUrl: './nft-mint.component.html',
  styleUrls: ['./nft-mint.component.scss'],
})
export class NftMintComponent implements OnInit {

  @Input() transaction: Transaction
  @Input() publicKey: string
  @Input() expanded: boolean
  
  token: Token;
  nft: Token;
  event: NFTEvent;

  constructor(private web3: Web3Service) { }

  ngOnInit() {
    this.event = this.transaction.nft;
    this.token = this.web3.getNftMetadata(this.event.nfts[0].mint)
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

  getSolAmount(amount: number) {
    let amountFixed = Number(amount / LAMPORTS_PER_SOL)
    if(amountFixed % 1 == 0) return amountFixed.toFixed(0)
    return amountFixed.toFixed(2)
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
