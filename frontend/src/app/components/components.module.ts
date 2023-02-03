import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { TransactionComponent } from './transaction/transaction.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PipesModule
  ],
  declarations: [
    ToolbarComponent,
    TransactionComponent
  ],
  exports: [
    ToolbarComponent,
    TransactionComponent
  ]
})
export class ComponentsModule {}
