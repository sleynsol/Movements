import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatetimePipe } from './datetime.pipe';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  declarations: [
    DatetimePipe
  ],
  exports: [
    DatetimePipe
  ]
})
export class PipesModule {}
