import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-modal-transaction',
  templateUrl: './modal-transaction.component.html',
  styleUrls: ['./modal-transaction.component.scss']
})
export class ModalTransactionComponent implements OnInit {

  type;
  points;
  date;
  value;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.type = data.type;
    this.points = data.points;
    this.date = data.date;
    this.value = data.value;
  }

  ngOnInit() {
  }

}
