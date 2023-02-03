import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Tab1PageRoutingModule } from './viewer-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { ViewerPage } from './viewer.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    ComponentsModule
  ],
  declarations: [ViewerPage]
})
export class Tab1PageModule {}
