import { Component, ElementRef, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

import { LotMastService } from '../../../Service/Master/lot-mast.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-lot-mast',
  templateUrl: './lot-mast.component.html',
  styleUrls: ['./lot-mast.component.css']
})
export class LotMastComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  L_CODE: any = ''
  TRNNO: any = ''
  R_CODE: any = ''
  L_NAME: any = ''
  L_DATE: any = ''
  L_PCS: any = ''
  L_CARAT: any = ''
  SIZE: any = ''
  C_DATE: any = ''
  PNT: any = ''
  GRP: any = ''
  LOVER: boolean = false
  RAP_TYPE: any = ''
  IS_URGENT: boolean = false
  LOCK_TYPE: any = ''
  M_DATE: any = ''
  MDAY: any = ''
  P_DATE: any = ''
  PDAY: any = ''
  hide = true
  PASSWORD: any = ''

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private LotMastServ: LotMastService,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef
  ) {
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
        headerName: 'L. Code',
        field: 'L_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Trn No',
        field: 'TRNNO',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'R. Code',
        field: 'R_CODE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'L. Name',
        field: 'L_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'L. Date',
        field: 'L_DATE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.DateConv.bind(this)
      },
      {
        headerName: 'L. Pcs',
        field: 'L_PCS',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'L. Carat',
        field: 'L_CARAT',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (!params.value) { params.value = 0; }
          return '<p>' + (params.value).toFixed(2) + '</p>';
        },
      },
      {
        headerName: 'Size',
        field: 'SIZE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (!params.value) { params.value = 0; }
          return '<p>' + (params.value).toFixed(2) + '</p>';
        },
      },
      {
        headerName: 'C. Date',
        field: 'C_DATE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.DateConv.bind(this)
      },
      {
        headerName: 'PNT',
        field: 'PNT',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'GRP',
        field: 'GRP',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Lover',
        field: 'LOVER',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.LOVER == true) {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        },
      },
      {
        headerName: 'Rap Type',
        field: 'RAP_TYPE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Is Urgent',
        field: 'IS_URGENT',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.IS_URGENT == true) {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        },
      },
      {
        headerName: 'Lock Type',
        field: 'LOCK_TYPE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'M. Date',
        field: 'M_DATE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.DateConv.bind(this)
      },
      {
        headerName: 'M. Day',
        field: 'MDAY',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'P. Date',
        field: 'P_DATE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.DateConv.bind(this)
      },
      {
        headerName: 'P. Day',
        field: 'PDAY',
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
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData()
  }

  CHANGEPASSWORD() {
    let RowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      RowData.push(rowNode.data);
    });
    this.gridApi.setRowData(RowData);
  }

  Clear() {
    this.L_CODE = ''
    this.TRNNO = ''
    this.R_CODE = ''
    this.L_NAME = ''
    this.L_DATE = ''
    this.L_PCS = ''
    this.L_CARAT = ''
    this.SIZE = ''
    this.C_DATE = ''
    this.PNT = ''
    this.GRP = ''
    this.LOVER = false
    this.RAP_TYPE = ''
    this.IS_URGENT = false
    this.LOCK_TYPE = ''
    this.M_DATE = ''
    this.MDAY = ''
    this.P_DATE = ''
    this.PDAY = ''
  }

  Save() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
    if (this.L_CODE.trim() == '') {
      this.toastr.warning('Enter Code')
      return
    }
    if (this.L_NAME.trim() == '') {
      this.toastr.warning('Enter Name')
      return
    }
    if (this.L_DATE == '') {
      this.toastr.warning('Enter L Date')
      return
    }
    if (this.C_DATE == '') {
      this.toastr.warning('Enter C Date')
      return
    }
    if (!this.L_PCS) {
      this.toastr.warning('Enter Pcs')
      return
    }
    if (!this.L_CARAT) {
      this.toastr.warning('Enter Carat')
      return
    }
    if (!this.PNT) {
      this.toastr.warning('Enter PNT')
      return
    }

    this.spinner.show()
    let SaveObj = {
      L_CODE: this.L_CODE ? this.L_CODE : '',
      TRNNO: this.TRNNO ? this.TRNNO : 0,
      R_CODE: this.R_CODE ? this.R_CODE : '',
      L_NAME: this.L_NAME ? this.L_NAME : '',
      L_DATE: this.L_DATE ? this.datepipe.transform(this.L_DATE, 'yyyy-MM-dd') : '',
      L_PCS: this.L_PCS ? this.L_PCS : 0,
      L_CARAT: this.L_CARAT ? this.L_CARAT : 0,
      SIZE: this.SIZE ? this.SIZE : 0,
      C_DATE: this.C_DATE ? this.datepipe.transform(this.L_DATE, 'yyyy-MM-dd') : '',
      PNT: this.PNT ? this.PNT : 0,
      GRP: this.GRP ? this.GRP : '',
      LOVER: this.LOVER ? this.LOVER : false,
      RAP_TYPE: this.RAP_TYPE ? this.RAP_TYPE : '',
      IS_URGENT: this.IS_URGENT ? this.IS_URGENT : false,
      LOCK_TYPE: this.LOCK_TYPE ? this.LOCK_TYPE : '',
      M_DATE: this.M_DATE ? this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd') : '',
      MDAY: this.MDAY ? this.MDAY : 0,
      P_DATE: this.P_DATE ? this.datepipe.transform(this.P_DATE, 'yyyy-MM-dd') : '',
      PDAY: this.PDAY ? this.PDAY : 0,
    }

    this.LotMastServ.LotMastSave(SaveObj).subscribe((SaveRes) => {
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
    this.LotMastServ.LotMastFill({}).subscribe((FillRes) => {

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
          title: "Are you sure you want to delete lot code " + eve.data.TRNNO + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.LotMastServ.LotMastDelete({ L_CODE: eve.data.L_CODE }).subscribe((DelRes) => {
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
        this.L_CODE = eve.data.L_CODE ? eve.data.L_CODE : ''
        this.TRNNO = eve.data.TRNNO ? eve.data.TRNNO : 0
        this.R_CODE = eve.data.R_CODE ? eve.data.R_CODE : ''
        this.L_NAME = eve.data.L_NAME ? eve.data.L_NAME : ''
        this.L_DATE = eve.data.L_DATE ? this.datepipe.transform(eve.data.L_DATE, 'yyyy-MM-dd') : ''
        this.L_PCS = eve.data.L_PCS ? eve.data.L_PCS : 0
        this.L_CARAT = eve.data.L_CARAT ? eve.data.L_CARAT : 0
        this.SIZE = eve.data.SIZE ? eve.data.SIZE : 0
        this.C_DATE = eve.data.C_DATE ? this.datepipe.transform(eve.data.C_DATE, 'yyyy-MM-dd') : ''
        this.PNT = eve.data.PNT ? eve.data.PNT : 0
        this.GRP = eve.data.GRP ? eve.data.GRP : ''
        this.LOVER = eve.data.LOVER ? eve.data.LOVER : false
        this.RAP_TYPE = eve.data.RAP_TYPE ? eve.data.RAP_TYPE : ''
        this.IS_URGENT = eve.data.IS_URGENT ? eve.data.IS_URGENT : false
        this.LOCK_TYPE = eve.data.LOCK_TYPE ? eve.data.LOCK_TYPE : ''
        this.M_DATE = eve.data.M_DATE ? this.datepipe.transform(eve.data.M_DATE, 'yyyy-MM-dd') : ''
        this.MDAY = eve.data.MDAY ? eve.data.MDAY : 0
        this.P_DATE = eve.data.P_DATE ? this.datepipe.transform(eve.data.P_DATE, 'yyyy-MM-dd') : ''
        this.PDAY = eve.data.PDAY ? eve.data.PDAY : 0
      }
    }

  }

  DateConv(params) {
    if (params.value) {
      return this.datepipe.transform(params.value, 'dd/MM/yyyy', 'UTC+0')
    } else {
      return ''
    }
  }

}
