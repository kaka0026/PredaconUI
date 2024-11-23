import { UserMastService } from './../../../Service/ConfigMast/user-mast.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { map, startWith } from 'rxjs/operators';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { RptPerMastService } from 'src/app/Service/ConfigMast/rpt-per-mast.service';
import { MatDialog } from '@angular/material/dialog';
import { ListboxComponent } from '../../Common/listbox/listbox.component';
import PerfectScrollbar from 'perfect-scrollbar';
declare let $: any;

export interface Emp {
  USERID: string;
  USERNAME: string
}

@Component({
  selector: 'app-rpt-per-mast',
  templateUrl: './rpt-per-mast.component.html',
  styleUrls: ['./rpt-per-mast.component.css']
})
export class RptPerMastComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  SelectedUsers: any = '';

  UserId: any = '';
  USERNAME: any = '';
  usdCtrl: FormControl;
  filteredUsds: Observable<any[]>;
  UserIdArr: Emp[] = [];

  USER_NAME: any = '';
  REP_ID: any = '';
  VIEWFLG: false;
  DEPT_CODE: any = '';

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []
  hide = true
  PASSWORD: any = ''

  constructor(
    private UserMastServ: UserMastService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private RptPerMastServ: RptPerMastService,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef,
    public dialog: MatDialog
  ) {
    let op = this
    this.columnDefs = [
      {
        headerName: 'Dept Name',
        field: 'DEPT_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
      },
      {
        headerName: 'Paret Id',
        field: 'PARENT_ID',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Rep Id',
        field: 'REP_ID',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Rrp Name',
        field: 'REP_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
      },
      {
        headerName: 'VIEWFLG',
        field: 'VIEWFLG',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: (params) => {
          // if (params.data.VIEWFLG == true) {
          //   return '<input type="checkbox" data-action-type="VIEWFLGE" checked >';
          // } else {
          //   return '<input type="checkbox" data-action-type="VIEWFLGE">';
          // }
          if (op.PASS == op.PASSWORD) {
            if (params.data.VIEWFLG == true) {
              return '<input type="checkbox" data-action-type="VIEWFLGE" checked >';
            } else {
              return '<input type="checkbox" data-action-type="VIEWFLGE">';
            }
          } else {
            if (params.data.INS == true) {
              return '<input type="checkbox" data-action-type="VIEWFLGE" checked disabled>';
            } else {
              return '<input type="checkbox" data-action-type="VIEWFLGE" disabled>';
            }
          }
        },
      },
    ]

    this.defaultColDef = {
      resizable: true,
      sortable: true
    }
  }

  async ngOnInit() {
    this.PER = await this._FrmOpePer.UserFrmOpePer('RptPerMastComponent')
    this.ALLOWDEL = this.PER[0].DEL
    this.ALLOWINS = this.PER[0].INS
    this.ALLOWUPD = this.PER[0].UPD
    this.PASS = this.PER[0].PASS

    this.usdCtrl = new FormControl();

    this.UserMastServ.UserMastFill({ USERID: this.UserId }).subscribe((UserIdRes) => {
      try {
        if (UserIdRes.success == true) {
          this.UserIdArr = UserIdRes.data.map((item) => {
            return { USERID: item.USERID, USERNAME: item.USER_FULLNAME }
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.LoadGridData();
  }

  Save() {

    let rowData = []
    this.gridApi.forEachNode(node => rowData.push(node.data));
    let PerArr = [];
    for (let i = 0; i < rowData.length; i++) {
      let SaveObj = {
        USERNAME: this.UserId,
        REP_ID: rowData[i].REP_ID,
        VIEWFLG: rowData[i].VIEWFLG,
      };
      PerArr.push(SaveObj);
    }

    this.RptPerMastServ.RptPerMastSave(PerArr).subscribe((SaveRes) => {
      try {

        if (SaveRes.success == true) {
          this.spinner.hide()
          this.toastr.success('Save successfully.')
          this.LoadGridData()
        } else {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(SaveRes.data),
          })
        }
      } catch (err) {
        this.spinner.hide()
        this.toastr.error(err)
      }
    })
  }

  LoadGridData() {
    this.spinner.show()

    let FillObj = {
      DEPT_CODE: this.DEPT_CODE ? this.DEPT_CODE : '',
      USER_NAME: this.USERNAME ? this.USERNAME : '',
    }

    this.RptPerMastServ.RptPerMastFill(FillObj).subscribe((FillRes) => {
      try {
        if (FillRes.success == true) {
          this.spinner.hide()
          this.gridApi.setRowData(FillRes.data);
          const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector(".ag-body-viewport");
          const agBodyHorizontalViewport: HTMLElement = this.elementRef.nativeElement.querySelector(".ag-body-horizontal-scroll-viewport");

          if (agBodyViewport) {
            const psV = new PerfectScrollbar(agBodyViewport);
            psV.update();
          }
          if (agBodyHorizontalViewport) {
            const psH = new PerfectScrollbar(agBodyHorizontalViewport);
            psH.update();
          }
          this.gridApi.sizeColumnsToFit();
        } else {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(FillRes.data),
          })
        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })
  }

  onGridRowClicked(eve: any) {

    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "VIEWFLGE") {
      let dataObj = eve.data;
      dataObj.VIEWFLG = !dataObj.VIEWFLG;
      eve.node.setData(dataObj)
      eve.api.refreshCells({ force: true })
    }
    // if (eve.event.target !== undefined) {
    //   if (actionType == 'DeleteData') {
    //     Swal.fire({
    //       title: "Are you sure you want to delete " + eve.data.FORM_ID + "?",
    //       icon: "warning",
    //       cancelButtonText: "No",
    //       showCancelButton: true,
    //       confirmButtonText: "Yes"
    //     }).then(result => {
    //       if (result.value) {
    //         this.spinner.show()
    //         this.RptPerMastServ.RptPerMastDelete({ FORM_ID: eve.data.Form_ID }).subscribe((DelRes) => {
    //           try {
    //             if (DelRes.success == true) {
    //               this.spinner.hide()
    //               this.toastr.success('Delete successfully.')
    //               this.LoadGridData();
    //             } else {
    //               this.spinner.hide()
    //               Swal.fire({
    //                 icon: 'error',
    //                 title: 'Oops...',
    //                 text: JSON.stringify(DelRes.data),
    //               })
    //             }
    //           } catch (err) {
    //             this.spinner.hide()
    //             this.toastr.error(err)
    //           }
    //         })
    //       } else {
    //         return
    //       }
    //     })
    //   } else if (actionType == 'EditData') {
    //     this.USER_NAME = eve.data.USER_NAME ? eve.data.USER_NAME : ''
    //     this.REP_ID = eve.data.REP_ID ? eve.data.REP_ID : ''
    //     this.VIEWFLG = eve.data.VIEWFLG ? eve.data.VIEWFLG : ''
    //   }

    // }
  }

  filterUsds(USERID: string) {
    return this.UserIdArr.filter(usd =>
      usd.USERID.toLowerCase().indexOf(USERID.toLowerCase()) === 0);
  }

  getUserName() {
    if (this.UserId) {
      if (this.UserIdArr.filter(option => option.USERID.toLocaleLowerCase().includes(this.UserId.toLowerCase())).length != 0) {
        this.USERNAME = this.UserIdArr.filter(option => option.USERID.toLocaleLowerCase().includes(this.UserId.toLowerCase()))[0].USERNAME
      } else {
        this.USERNAME = ''
      }
    } else {
      this.USERNAME = ''
    }

  }

  CHANGEPASSWORD() {
    let RowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      RowData.push(rowNode.data);
    });
    this.gridApi.setRowData(RowData);
  }


  openUserMaster() {
    const PRF = this.dialog.open(ListboxComponent, { width: '80%', data: { arr: this.UserIdArr, USERID: this.SelectedUsers, TYPE: 'USERMAST' } })
    $("#Close").click();
    PRF.afterClosed().subscribe(result => {
      this.SelectedUsers = result
    });
  }

  Copy() {
    this.RptPerMastServ.RptPerMastCopy({ USERNAME: this.UserId, USERS: this.SelectedUsers }).subscribe((Res) => {
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
