import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { TransactionComponent } from './transaction/transaction.component';
import { PipesModule } from '../pipes/pipes.module';
import { TokenTransferComponent } from './token-transfer/token-transfer.component';
import { SolTransferComponent } from './sol-transfer/sol-transfer.component';
import { NftComponent } from './nft/nft.component';
import { BurnComponent } from './burn/burn.component';
import { SwapComponent } from './swap/swap.component';
import { DetailsComponent } from './details/details.component';
import { NftMintComponent } from './nft-mint/nft-mint.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PipesModule
  ],
  declarations: [
    ToolbarComponent,
    TransactionComponent,
    TokenTransferComponent,
    SolTransferComponent,
    NftComponent,
    NftMintComponent,
    BurnComponent,
    SwapComponent,
    DetailsComponent
  ],
  exports: [
    ToolbarComponent,
    TransactionComponent,
    TokenTransferComponent,
    SolTransferComponent,
    NftComponent,
    NftMintComponent,
    BurnComponent,
    SwapComponent,
    DetailsComponent
  ]
})
export class ComponentsModule {}
