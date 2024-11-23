import { Component, ElementRef, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

import { RouTrnService } from '../../../Service/Master/rou-trn.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-rou-trn',
  templateUrl: './rou-trn.component.html',
  styleUrls: ['./rou-trn.component.css']
})
export class RouTrnComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  TRNNO: any = ''
  R_CODE: any = ''
  R_NAME: any = ''
  P_CODE: any = ''
  B_CODE: any = ''
  SITE: any = ''
  SIZE: any = ''
  I_DATE: any = ''
  I_CARAT: any = ''
  I_PCS: any = ''
  RATE: any = ''

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []
  hide = true
  PASSWORD: any = ''

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private RouTrnServ: RouTrnService,
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
        headerName: 'Trn No',
        field: 'TRNNO',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Code',
        field: 'R_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Name',
        field: 'R_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'P. Code',
        field: 'P_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'B. Code',
        field: 'B_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Site',
        field: 'SITE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
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
        headerName: 'I. Date',
        field: 'I_DATE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.DateConv.bind(this)
      },
      {
        headerName: 'I. Carat',
        field: 'I_CARAT',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (!params.value) { params.value = 0; }
          return '<p>' + (params.value).toFixed(3) + '</p>';
        },
      },
      {
        headerName: 'I. Pcs',
        field: 'I_PCS',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Rate',
        field: 'RATE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (!params.value) { params.value = 0; }
          return '<p>' + (params.value).toFixed(2) + '</p>';
        },
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

  Clear() {
    this.TRNNO = ''
    this.R_CODE = ''
    this.R_NAME = ''
    this.P_CODE = ''
    this.B_CODE = ''
    this.SITE = ''
    this.SIZE = ''
    this.I_DATE = ''
    this.I_CARAT = ''
    this.I_PCS = ''
    this.RATE = ''
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
    if (this.R_CODE == '') {
      this.toastr.warning('Enter Code')
      return
    }
    if (this.R_NAME == '') {
      this.toastr.warning('Enter Name')
      return
    }
    if (!this.I_CARAT) {
      this.toastr.warning('Enter Carat')
      return
    }
    if (!this.I_PCS) {
      this.toastr.warning('Enter Pcs')
      return
    }

    this.spinner.show()

    this.RouTrnServ.RouTrnFillTrnNo({}).subscribe((TRes) => {
      try {
        if (TRes.success == true && TRes.data[0].TRNNO) {

          let SaveObj = {
            TRNNO: this.TRNNO ? this.TRNNO : TRes.data[0].TRNNO,
            R_CODE: this.R_CODE ? this.R_CODE : '',
            R_NAME: this.R_NAME ? this.R_NAME : '',
            P_CODE: this.P_CODE ? this.P_CODE : '',
            B_CODE: this.B_CODE ? this.B_CODE : '',
            SITE: this.SITE ? this.SITE : '',
            SIZE: this.SIZE ? this.SIZE : 0,
            I_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
            I_CARAT: this.I_CARAT ? this.I_CARAT : 0,
            I_PCS: this.I_PCS ? this.I_PCS : 0,
            RATE: this.RATE ? this.RATE : 0,
          }

          this.RouTrnServ.RouTrnSave(SaveObj).subscribe((SaveRes) => {
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
        } else {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(TRes.data),
          })
        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })

  }

  LoadGridData() {
    this.spinner.show()
    this.RouTrnServ.RouTrnFill({}).subscribe((FillRes) => {

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
          title: "Are you sure you want to delete rough code " + eve.data.TRNNO + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.RouTrnServ.RouTrnDelete({ TRNNO: eve.data.TRNNO, R_CODE: eve.data.R_CODE }).subscribe((DelRes) => {
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
        this.TRNNO = eve.data.TRNNO ? eve.data.TRNNO : 0
        this.R_CODE = eve.data.R_CODE ? eve.data.R_CODE : ''
        this.R_NAME = eve.data.R_NAME ? eve.data.R_NAME : ''
        this.P_CODE = eve.data.P_CODE ? eve.data.P_CODE : ''
        this.B_CODE = eve.data.B_CODE ? eve.data.B_CODE : ''
        this.SITE = eve.data.SITE ? eve.data.SITE : ''
        this.SIZE = eve.data.SIZE ? eve.data.SIZE : 0
        this.I_DATE = eve.data.I_DATE ? this.datepipe.transform(eve.data.I_DATE, 'yyyy-MM-dd') : ''
        this.I_CARAT = eve.data.I_CARAT ? eve.data.I_CARAT : 0
        this.I_PCS = eve.data.I_PCS ? eve.data.I_PCS : 0
        this.RATE = eve.data.RATE ? eve.data.RATE : 0

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

