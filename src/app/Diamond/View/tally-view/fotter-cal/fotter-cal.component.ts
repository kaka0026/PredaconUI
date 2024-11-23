import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-fotter-cal',
  template: `<span [ngStyle]="style">{{ params.value }}</span>`,
  styles: [``]
})
export class FotterCalComponent implements ICellRendererAngularComp {
  public params: any;
  public style: string;

  agInit(params: any): void {
    this.params = params;
    this.style = this.params.style;
  }

  refresh(): boolean {
    return false;
  }

}

