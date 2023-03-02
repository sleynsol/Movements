import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Web3Service } from 'src/app/services/web3/web3.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent{

  connected: boolean = false;
  pubKey: string
  smallScreen: boolean = false;
  filter: string = 'all'

  @Input('showFilter') showFilter: boolean
  @Output('filter') filterOutput = new EventEmitter<string>();

  constructor(private web3: Web3Service) {
    if(window.innerWidth <= 768) this.smallScreen = true 
    this.listenToPublicKey()
   }

  listenToPublicKey() {
    this.web3.getPublicKeySubject$().subscribe(value => {
      if(value) this.pubKey = value.toString()
    })
  }

  applyFilter() {
    this.filterOutput.emit(this.filter)
  }

}
