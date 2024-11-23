import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listbox',
  templateUrl: './listbox.component.html',
  styleUrls: ['./listbox.component.css']
})
export class ListboxComponent implements OnInit {

  Selected = []
  valdata = []
  selectedRow = []
  TYPE: any = ''

  Result: any = ''
  FILTER: any = ''

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public pinnedBottomRowData;
  public frameworkComponents;
  public rowSelection;
  public gridOptions;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private _mdr: MatDialogRef<ListboxComponent>,
  ) {

    this.TYPE = data.TYPE

    if (data.CODE != null) {

      this.Selected = data.CODE.split(',')
    }
    else {
      this.Selected = []
    }

    if (data.TYPE == 'TALLYVIEW') {
      this.valdata = data.arr.map((item) => {
        return { CODE: item.CODE, NAME: item.NAME.toString(), PNT: item.PNT, CARAT: item.CARAT, CKB: this.userExists(item.CODE) }
      })

      this.columnDefs = [
        {
          field: '',
          headerCheckboxSelection: true,
          checkboxSelection: true,
          resizable: false,
          sortable: false,
        },
        {
          headerName: "Lot",
          field: "CODE",
          cellStyle: { "text-align": "center" },
          headerClass: "text-center"
        },
        {
          headerName: "Name",
          field: "NAME",
          cellStyle: { "text-align": "center" },
          headerClass: "text-center"
        },
        {
          headerName: "Pnt",
          field: "PNT",
          cellStyle: { "text-align": "center" },
          headerClass: "text-center"
        },
        {
          headerName: "Carat",
          field: "CARAT",
          cellStyle: { "text-align": "center" },
          headerClass: "text-center"
        }
      ];
      this.rowSelection = "multiple";
      this.defaultColDef = {
        resizable: true,
        sortable: true,
      };
    } else if (data.TYPE == 'EMPMAST') {
      this.valdata = data.arr.map((item) => {
        return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME.toString(), CKB: this.userExists(item.PRC_CODE) }
      })

      this.columnDefs = [
        {
          field: '',
          headerCheckboxSelection: true,
          checkboxSelection: true,
          resizable: false,
          sortable: false,
        },
        {
          headerName: "code",
          field: "PRC_CODE",
          cellStyle: { "text-align": "center" },
          headerClass: "text-center"
        },
        {
          headerName: "name",
          field: "PRC_NAME",
          cellStyle: { "text-align": "center" },
          headerClass: "text-center"
        }
      ];
      this.rowSelection = "multiple";
      this.defaultColDef = {
        resizable: true,
        sortable: true,
      };
    } else if (data.TYPE == 'USERMAST') {
      this.valdata = data.arr.map((item) => {
        return { USERID: item.USERID }
      })

      this.columnDefs = [
        {
          field: '',
          headerCheckboxSelection: true,
          checkboxSelection: true,
          resizable: false,
          sortable: false,
          width: 28
        },
        {
          headerName: "UserID",
          field: "USERID",
          cellStyle: { "text-align": "center" },
          headerClass: "text-center"
        },
      ];
      this.rowSelection = "multiple";
      this.defaultColDef = {
        resizable: true,
        sortable: true,
      };
    }

  }

  ngOnInit(): void {
  }

  userExists(name) {
    return this.Selected.some(function (el) {

      return el === name;
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if (this.TYPE == 'EMPMAST') {
      this.valdata = this.valdata.map((item) => {
        return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME.toString(), CKB: item.CKB }
      })
    } else if (this.TYPE == 'TALLYVIEW') {
      this.valdata = this.valdata.map((item) => {
        return { CODE: item.CODE, NAME: item.NAME.toString(), PNT: item.PNT, CARAT: item.CARAT, CKB: item.CKB }
      })
    }
    this.gridApi.setRowData(this.valdata);
    this.gridApi.sizeColumnsToFit();
    this.gridApi.forEachNode(function (node) {
      node.setSelected(node.data.CKB === true);
    });
  }

  FILTERDATA() {
    this.gridApi.setQuickFilter(this.FILTER);
  }

  onSelectionChanged(event: any) {
    this.selectedRow = event.api.getSelectedRows();
    if (this.TYPE == 'EMPMAST') {
      let L_CODE = this.selectedRow.map((item) => { return item.PRC_CODE })
      this.Result = L_CODE.toString()
    } else if (this.TYPE == 'TALLYVIEW') {
      let L_CODE = this.selectedRow.map((item) => { return item.CODE })
      this.Result = L_CODE.toString()
    } else if (this.TYPE == 'USERMAST') {
      let L_CODE = this.selectedRow.map((item) => { return item.USERID })
      this.Result = L_CODE.toString()
    }
  }

  Close() {
    this._mdr.close(this.Result);
  }
}
