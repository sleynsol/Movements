import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from 'src/app/model/Transaction';

@Component({
  selector: 'app-burn',
  templateUrl: './burn.component.html',
  styleUrls: ['./burn.component.scss'],
})
export class BurnComponent implements OnInit {

  @Input() transaction: Transaction
  @Input() publicKey: string
  @Input() expanded: boolean

  constructor() { }

  ngOnInit() {}

}
