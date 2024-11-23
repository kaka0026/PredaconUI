import { Component, ElementRef, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

import { PrcMastService } from '../../../Service/Master/prc-mast.service';
import { DeptMastService } from '../../../Service/Master/dept-mast.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import PerfectScrollbar from 'perfect-scrollbar';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

export interface Emp {
  code: string;
  name: string;
}

@Component({
  selector: 'app-prc-mast',
  templateUrl: './prc-mast.component.html',
  styleUrls: ['./prc-mast.component.css']
})
export class PrcMastComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;


  DEPT_CODE: any = ''
  PRC_CODE: any = ''
  PRC_NAME: any = ''
  PROC_CODE: any = ''
  ORD: any = ''
  ISACTIVE: boolean = false
  ACFM: boolean = false
  ISCLV: boolean = false
  SPRC_CODE: any = ''
  SDEPT_CODE: any = ''
  PRVPRC: any = ''
  INWD: boolean = false
  CFM: boolean = false
  RCV: boolean = false
  RCVINWD: boolean = false
  RTN: boolean = false
  PRTN: boolean = false
  PRTNINWD: boolean = false
  BRK: boolean = false
  INNER_PRC: boolean = false
  LPER: any = ''
  LHOUR: any = ''

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []
  hide = true
  PASSWORD: any = ''

  deptCtrl: FormControl;
  filteredDepts: Observable<any[]>;
  DEPTArr: Emp[] = [];

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private PrcMastServ: PrcMastService,
    private datepipe: DatePipe,
    private DeptMastServ: DeptMastService,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef
  ) {
    this.deptCtrl = new FormControl();
    let op = this
    this.columnDefs = [
      {
        headerName: 'Action',
        cellStyle: { 'text-align': 'center' },
        cellRenderer: function (params) {
          let a = '<span class="det_val">';
          if (op.PASS == op.PASSWORD) {
            if (op.ALLOWUPD) {
              a = a + '<i class="icon-edit grid-icon" data-action-type="EditData" style="cursor: pointer;margin-right: 5px;" ></i>';
            }
            if (op.ALLOWDEL) {
              a = a + '<i class="icon-delete grid-icon" data-action-type="DeleteData" style="cursor: pointer;margin-left: 5px;"></i>';
            }
          }
          a = a + '</span>';
          return a;
        },
        headerClass: "text-center"
      },
      {
        headerName: 'Dept. Code',
        field: 'DEPT_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Prc. Code',
        field: 'PRC_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Prc. Name',
        field: 'PRC_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Proc Code',
        field: 'PROC_CODE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Order',
        field: 'ORD',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Is Active',
        field: 'ISACTIVE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.ISACTIVE == true) {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        },
      },
      {
        headerName: 'ACFM',
        field: 'ACFM',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.ACFM == true) {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        },
      },
      {
        headerName: 'ISCLV',
        field: 'ISCLV',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.ISCLV == true) {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        },
      },
      {
        headerName: 'SPRC. Code',
        field: 'SPRC_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'PRVPRC',
        field: 'PRVPRC',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'INWD',
        field: 'INWD',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.INWD == true) {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        },
      },
      {
        headerName: 'CFM',
        field: 'CFM',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.CFM == true) {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        },
      },
      {
        headerName: 'RCV',
        field: 'RCV',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.RCV == true) {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        },
      },
      {
        headerName: 'RCVINWD',
        field: 'RCVINWD',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.RCVINWD == true) {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        },
      },
      {
        headerName: 'RNT',
        field: 'RTN',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.RTN == true) {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        },
      },
      {
        headerName: 'PRTN',
        field: 'PRTN',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.PRTN == true) {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        },
      },
      {
        headerName: 'PRTNINWD',
        field: 'PRTNINWD',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.PRTNINWD == true) {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        },
      },
      {
        headerName: 'BRK',
        field: 'BRK',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.BRK == true) {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        },
      },
      {
        headerName: 'INNERPRC',
        field: 'INNER_PRC',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.INNER_PRC == true) {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        },
      },
      {
        headerName: 'LPer',
        field: 'LPER',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'LHour',
        field: 'LHOUR',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'SDept. Code',
        field: 'SDEPT_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
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

    this.DeptMastServ.DeptMastFill({}).subscribe((DFRes) => {
      try {
        if (DFRes.success == true) {
          this.DEPTArr = DFRes.data.map((item) => {
            return { code: item.DEPT_CODE, value: item.DEPT_NAME }
          })
          this.filteredDepts = this.deptCtrl.valueChanges
            .pipe(
              startWith(''),
              map(dept => dept ? this.filterDepts(dept) : this.DEPTArr)
            );
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(DFRes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }
  filterDepts(code: string) {
    return this.DEPTArr.filter(dept =>
      dept.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  Clear() {
    this.DEPT_CODE = ''
    this.SDEPT_CODE = ''
    this.PROC_CODE = ''
    this.PRC_CODE = ''
    this.PRC_NAME = ''
    this.ORD = ''
    this.ISACTIVE = false
    this.ACFM = false
    this.ISCLV = false
    this.SPRC_CODE = ''
    this.PRVPRC = ''
    this.INWD = false
    this.CFM = false
    this.RCV = false
    this.RCVINWD = false
    this.RTN = false
    this.PRTN = false
    this.PRTNINWD = false
    this.BRK = false
    this.INNER_PRC = false
    this.LPER = ''
    this.LHOUR = ''
  }

  CHANGEPASSWORD() {
    let RowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      RowData.push(rowNode.data);
    });
    this.gridApi.setRowData(RowData);
  }

  Save() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
    if (this.DEPT_CODE.trim() == '') {
      this.toastr.warning('Enter Department Code')
      return
    }
    if (this.PRC_CODE.trim() == '') {
      this.toastr.warning('Enter Code')
      return
    }
    if (this.PRC_NAME.trim() == '') {
      this.toastr.warning('Enter Name')
      return
    }
    if (!this.ORD) {
      this.toastr.warning('Enter Order')
      return
    }

    let SaveObj = {
      DEPT_CODE: this.DEPT_CODE ? this.DEPT_CODE : '',
      PRC_CODE: this.PRC_CODE ? this.PRC_CODE : '',
      PRC_NAME: this.PRC_NAME ? this.PRC_NAME : '',
      ORD: this.ORD ? this.ORD : 0,
      ISACTIVE: this.ISACTIVE ? this.ISACTIVE : false,
      ACFM: this.ACFM ? this.ACFM : false,
      ISCLV: this.ISCLV ? this.ISCLV : false,
      SPRC_CODE: this.SPRC_CODE ? this.SPRC_CODE : '',
      PRVPRC: this.PRVPRC ? this.PRVPRC : '',
      INWD: this.INWD ? this.INWD : false,
      CFM: this.CFM ? this.CFM : false,
      RCV: this.RCV ? this.RCV : false,
      RCVINWD: this.RCVINWD ? this.RCVINWD : false,
      RTN: this.RTN ? this.RTN : false,
      PRTN: this.PRTN ? this.PRTN : false,
      PRTNINWD: this.PRTNINWD ? this.PRTNINWD : false,
      BRK: this.BRK ? this.BRK : false,
      INNER_PRC: this.INNER_PRC ? this.INNER_PRC : false,
      LPER: this.LPER ? this.LPER : 0,
      LHOUR: this.LHOUR ? this.LHOUR : 0,
      PROC_CODE: this.PROC_CODE ? this.PROC_CODE : '',
      SDEPT_CODE: this.SDEPT_CODE ? this.SDEPT_CODE : '',
    }

    this.spinner.show()
    this.PrcMastServ.PrcMastSave(SaveObj).subscribe((SaveRes) => {
      try {
        if (SaveRes.success == true) {
          this.spinner.hide()
          this.toastr.success('Save successfully.')
          this.LoadGridData()
          this.Clear()
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
    this.PrcMastServ.PrcMastFill({ DEPT_CODE: this.DEPT_CODE }).subscribe((FillRes) => {
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
    if (eve.event.target !== undefined) {
      let actionType = eve.event.target.getAttribute("data-action-type");

      if (actionType == 'DeleteData') {
        Swal.fire({
          title: "Are you sure you want to delete prc code " + eve.data.PRC_CODE + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.PrcMastServ.PrcMastDelete({ DEPT_CODE: eve.data.DEPT_CODE, PRC_CODE: eve.data.PRC_CODE }).subscribe((DelRes) => {
              try {
                if (DelRes.success == true) {
                  this.spinner.hide()
                  this.toastr.success('Delete successfully.')
                  this.LoadGridData()
                } else {
                  this.spinner.hide()
                  this.toastr.warning('Something went to wrong while delete code')
                }
              } catch (err) {
                this.spinner.hide()
                this.toastr.error(err)
              }
            })
          } else {
            return
          }
        })
      } else if (actionType == 'EditData') {

        this.DEPT_CODE = eve.data.DEPT_CODE ? eve.data.DEPT_CODE : ''
        this.PRC_CODE = eve.data.PRC_CODE ? eve.data.PRC_CODE : ''
        this.PRC_NAME = eve.data.PRC_NAME ? eve.data.PRC_NAME : ''
        this.PROC_CODE = eve.data.PROC_CODE ? eve.data.PROC_CODE : ''
        this.SDEPT_CODE = eve.data.SDEPT_CODE ? eve.data.SDEPT_CODE : ''
        this.ORD = eve.data.ORD ? eve.data.ORD : 0
        this.ISACTIVE = eve.data.ISACTIVE ? eve.data.ISACTIVE : false
        this.ACFM = eve.data.ACFM ? eve.data.ACFM : false
        this.ISCLV = eve.data.ISCLV ? eve.data.ISCLV : false
        this.SPRC_CODE = eve.data.SPRC_CODE ? eve.data.SPRC_CODE : ''
        this.PRVPRC = eve.data.PRVPRC ? eve.data.PRVPRC : ''
        this.INWD = eve.data.INWD ? eve.data.INWD : false
        this.CFM = eve.data.CFM ? eve.data.CFM : false
        this.RCV = eve.data.RCV ? eve.data.RCV : false
        this.RCVINWD = eve.data.RCVINWD ? eve.data.RCVINWD : false
        this.RTN = eve.data.RTN ? eve.data.RTN : false
        this.PRTN = eve.data.PRTN ? eve.data.PRTN : false
        this.PRTNINWD = eve.data.PRTNINWD ? eve.data.PRTNINWD : false
        this.BRK = eve.data.BRK ? eve.data.BRK : false
        this.INNER_PRC = eve.data.INNER_PRC ? eve.data.INNER_PRC : false
        this.LPER = eve.data.LPER ? eve.data.LPER : 0
        this.LHOUR = eve.data.LHOUR ? eve.data.LHOUR : 0

      }

    }
  }

}
