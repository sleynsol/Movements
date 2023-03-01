import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatetimePipe } from './datetime.pipe';
import { DatePipe } from './dateyear.pipe';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  declarations: [
    DatePipe,
    DatetimePipe
  ],
  exports: [
    DatePipe,
    DatetimePipe
  ]
})
export class PipesModule {}
