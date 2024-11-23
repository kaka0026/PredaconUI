import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'

import { UserMastService } from '../../../Service/ConfigMast/user-mast.service'
import { PerMastService } from '../../../Service/ConfigMast/per-mast.service'

import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { MatDialog } from '@angular/material/dialog';
import { ListboxComponent } from '../../Common/listbox/listbox.component';
declare let $: any;

export interface Emp {
  USERID: string;
}

@Component({
  selector: 'app-per-mast',
  templateUrl: './per-mast.component.html',
  styleUrls: ['./per-mast.component.css']
})

export class PerMastComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  SelectedUsers: any = '';

  hide = true
  PASSWORD: any = ''
  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []

  UserId: any = '';
  usdCtrl: FormControl;
  filteredUsds: Observable<any[]>;
  UserIdArr: Emp[] = [];

  gridShow: boolean = false;

  constructor(
    private UserMastServ: UserMastService,
    private PerMastServ: PerMastService,
    private _FrmOpePer: FrmOpePer,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {
    let op = this
    this.usdCtrl = new FormControl();

    this.columnDefs = [

      {
        headerName: 'USER_NAME',
        field: 'USER_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'FORM_GROUP',
        field: 'FORM_GROUP',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'FORM_NAME',
        field: 'FORM_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'DESCR',
        field: 'DESCR',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'DESCR1',
        field: 'DESCR1',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
      },
      {
        headerName: 'INS',
        field: 'INS',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: (params) => {
          if (op.PASS == op.PASSWORD) {
            if (params.data.INS == true) {
              return '<input type="checkbox" data-action-type="IS_INS" checked >';
            } else {
              return '<input type="checkbox" data-action-type="IS_INS">';
            }
          } else {
            if (params.data.INS == true) {
              return '<input type="checkbox" data-action-type="IS_INS" checked disabled>';
            } else {
              return '<input type="checkbox" data-action-type="IS_INS" disabled>';
            }
          }
        },
      },
      {
        headerName: 'VIW',
        field: 'VIW',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: (params) => {
          if (op.PASS == op.PASSWORD) {
            if (params.data.VIW == true) {
              return '<input type="checkbox" data-action-type="IS_VIW" checked >';
            } else {
              return '<input type="checkbox" data-action-type="IS_VIW">';
            }
          } else {
            if (params.data.VIW == true) {
              return '<input type="checkbox" data-action-type="IS_VIW" checked disabled>';
            } else {
              return '<input type="checkbox" data-action-type="IS_VIW" disabled>';
            }
          }
        },
      },
      {
        headerName: 'UPD',
        field: 'UPD',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: (params) => {
          if (op.PASS == op.PASSWORD) {
            if (params.data.UPD == true) {
              return '<input type="checkbox" data-action-type="IS_UPD" checked >';
            } else {
              return '<input type="checkbox" data-action-type="IS_UPD">';
            }
          } else {
            if (params.data.UPD == true) {
              return '<input type="checkbox" data-action-type="IS_UPD" checked disabled>';
            } else {
              return '<input type="checkbox" data-action-type="IS_UPD" disabled>';
            }
          }
        },
      },
      {
        headerName: 'DEL',
        field: 'DEL',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: (params) => {
          if (op.PASS == op.PASSWORD) {
            if (params.data.DEL == true) {
              return '<input type="checkbox" data-action-type="IS_DEL" checked >';
            } else {
              return '<input type="checkbox" data-action-type="IS_DEL">';
            }
          } else {
            if (params.data.DEL == true) {
              return '<input type="checkbox" data-action-type="IS_DEL" checked disabled>';
            } else {
              return '<input type="checkbox" data-action-type="IS_DEL" disabled>';
            }
          }
        },
      },

      {
        headerName: 'PASS',
        field: 'PASS',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: (params) => {
          if (op.PASS == op.PASSWORD) {
            return true
          } else {
            return false;
          }
        }
      }

    ]
    this.defaultColDef = {
      resizable: true,
      sortable: true
    }
  }

  async ngOnInit() {
    this.PER = await this._FrmOpePer.UserFrmOpePer(this.constructor.name)
    this.ALLOWDEL = this.PER[0].DEL
    this.ALLOWINS = this.PER[0].INS
    this.ALLOWUPD = this.PER[0].UPD
    this.PASS = this.PER[0].PASS

    this.UserMastServ.UserMastFill({ USERID: this.UserId }).subscribe((UserIdRes) => {
      try {
        if (UserIdRes.success == true) {
          this.UserIdArr = UserIdRes.data.map((item) => {
            return { USERID: item.USERID }
          })
          this.filteredUsds = this.usdCtrl.valueChanges
            .pipe(
              startWith(''),
              map(shp => shp ? this.filterUsds(shp) : this.UserIdArr.slice(0, 10))
            );
        } else {
          this.toastr.warning("Something gone wrong while get UserId")
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  filterUsds(USERID: string) {
    return this.UserIdArr.filter(usd =>
      usd.USERID.toLowerCase().indexOf(USERID.toLowerCase()) === 0);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  LoadGrid() {
    this.spinner.show()
    this.gridShow = true
    this.PerMastServ.PerMastFill({ UserId: this.UserId }).subscribe((UserIPRes) => {
      try {
        if (UserIPRes.success == true) {
          this.gridApi.setRowData(UserIPRes.data);
          this.gridApi.sizeColumnsToFit();
          this.spinner.hide();
        } else {
          this.spinner.hide()

        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })
  }

  Save() {
    let rowData = []
    this.gridApi.forEachNode(node => rowData.push(node.data));
    let PerArr = [];
    for (let i = 0; i < rowData.length; i++) {
      let SaveObj = {
        USER_NAME: rowData[i].USER_NAME,
        FORM_NAME: rowData[i].FORM_NAME,
        INS: rowData[i].INS,
        DEL: rowData[i].DEL,
        UPD: rowData[i].UPD,
        VIW: rowData[i].VIW,
        PASS: rowData[i].PASS
      };
      PerArr.push(SaveObj);
    }
    this.spinner.show()
    this.PerMastServ.PerMastSave(PerArr).subscribe((PerSaveRes) => {
      this.spinner.hide();
      try {
        if (PerSaveRes.success == true) {
          this.toastr.success('Permission upload successfully');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text:
              'Permission not change with this criteria' +
              JSON.stringify(PerSaveRes.data)
          });
        }
      } catch (error) {
        this.toastr.error(error);
      }
    })
  }

  CHANGEPASSWORD() {
    let RowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      RowData.push(rowNode.data);
    });
    this.gridApi.setRowData(RowData);
  }

  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");

    if (actionType == "IS_INS") {
      let dataObj = eve.data;
      dataObj.INS = !dataObj.INS;
      eve.node.setData(dataObj)
      eve.api.refreshCells({ force: true })
    } else if (actionType == "IS_VIW") {
      let dataObj = eve.data;
      dataObj.VIW = !dataObj.VIW;
      eve.node.setData(dataObj)
      eve.api.refreshCells({ force: true })
    } else if (actionType == "IS_UPD") {
      let dataObj = eve.data;
      dataObj.UPD = !dataObj.UPD;
      eve.node.setData(dataObj)
      eve.api.refreshCells({ force: true })
    } else if (actionType == "IS_DEL") {
      let dataObj = eve.data;
      dataObj.DEL = !dataObj.DEL;
      eve.node.setData(dataObj)
      eve.api.refreshCells({ force: true })
    }

  }

  openUserMaster() {
    const PRF = this.dialog.open(ListboxComponent, { width: '80%', data: { arr: this.UserIdArr, USERID: this.SelectedUsers, TYPE: 'USERMAST' } })
    $("#Close").click();
    PRF.afterClosed().subscribe(result => {
      this.SelectedUsers = result
    });
  }

  Copy() {
    this.PerMastServ.PerMastCopy({ USERNAME: this.UserId, USERS: this.SelectedUsers }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          this.spinner.hide();
          this.toastr.success("Permissions succesfully copied.")
        } else {
          this.spinner.hide()
          this.toastr.warning("Can't copy permissions.")
        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })
  }

}




