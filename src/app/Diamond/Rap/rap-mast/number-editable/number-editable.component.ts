import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';

@Component({
  selector: 'editor-cell',
  template: '<input type="number" [(ngModel)]="value" #input style="width: 100%"/>',
})
export class NumberEditableComponent implements AgEditorComponent, AfterViewInit {
  public params: any;
  public value: number;
  @ViewChild('input', { read: ViewContainerRef })
  public input: ViewContainerRef;

  ngAfterViewInit() {
    setTimeout(() => this.input.element.nativeElement.focus());
  }

  agInit(params: any): void {
    this.params = params;

    this.value = parseFloat(this.params.value);
  }
  getValue() {
    return this.value.toFixed(2);
  }
  isCancelBeforeStart() {
    return false;
  }
  isCancelAfterEnd() {
    return false
  }
}
