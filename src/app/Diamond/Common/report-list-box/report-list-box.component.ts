import { Component, OnInit , Inject, ElementRef} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-report-list-box',
  templateUrl: './report-list-box.component.html',
  styleUrls: ['./report-list-box.component.css']
})
export class ReportListBoxComponent implements OnInit {


  ModelStateData:any;

  public columnDefs = [];
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public rowSelection;
  QuickFilter:any='';
  selectedRow = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _mdr: MatDialogRef<ReportListBoxComponent>,
    private elementRef: ElementRef
  ) {
    this.ModelStateData = data

    this.defaultColDef = {
      resizable: true,
      filter: false,
      suppressFilter: true,
      sortable: true,
      headerCheckboxSelectionFilteredOnly:true
    }

    this.rowSelection = this.ModelStateData.isMulti == true ? "multiple" : "single";
    this.CreateColDef()
  }

  ngOnInit(): void {
  }

  QuickSearch(){
    this.gridApi.setQuickFilter(this.QuickFilter);
  }

  CreateColDef(){
    for(let i=0; i<this.ModelStateData.ColDef.split(',').length;i++){
      this.columnDefs.push({
          headerName: this.ModelStateData.ColCaption.split(',')[i],
          field: this.ModelStateData.ColDef.split(',')[i],
          cellStyle: { 'text-align': 'center' },
          headerClass: 'text-center',
          filter: 'agTextColumnFilter',floatingFilter: true
      })
    }
    let HeaderCheckBox ={
      width: 28,
      field: 'CHK',
      headerCheckboxSelection: true,
      checkboxSelection:true,
      resizable: true,
      sortable: false,
      enableFilter: false,
    }
    this.columnDefs.unshift(HeaderCheckBox)
  }

  onGridReady(params){
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setRowData(this.ModelStateData.DataSet[0])

    let DefVal = this.ModelStateData.DefSelectVal.split(',').map((item)=> { return item});
    let ValueMemeber = this.ModelStateData.ValueMemeber

    this.gridApi.forEachNode(function (rowNode, index) {
      if (DefVal.includes((rowNode.data[ValueMemeber]).toString())) {
        rowNode.setSelected(true);
      }
    });
  }

  onCellDoubleClicked(e:any){
    this.selectedRow.push(e.data)
    this.Close()
  }

  onSelectionChanged(event: any) {
    this.selectedRow = event.api.getSelectedRows();
  }

  Close(){
    let ValueMemeber = [...new Set(this.selectedRow.map((item)=> { return item[this.ModelStateData.ValueMemeber]}))].toString()
    this._mdr.close({success:1,Data:ValueMemeber});
  }

  Clear(){
    this.gridApi.deselectAll();
  }
}
