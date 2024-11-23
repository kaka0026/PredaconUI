import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";
import { Subscription } from 'rxjs';

import { DashboardService } from './../../../Service/Dashboard/dashboard.service';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';
import { DatePipe } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-dash-recieve',
  templateUrl: './dash-recieve.component.html',
  styleUrls: ['./dash-recieve.component.css']
})
export class DashRecieveComponent implements OnInit {

  clickEventsubscription: Subscription;

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public rowSelection;

  EMP_CODE: any = '';
  PNT: any = 0;
  GRP: any = '';

  L_CODE: any = '';
  SRNO: any = 0;
  TAG: any = '';
  DETID: any = 0;
  R_DATE: any = '';
  TPROC_CODE: any = '';
  RNO: any = 0;
  STCOMP: any = '';

  GridHeader = []

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private ViewParaMastServ: ViewParaMastService,
    private datePipe: DatePipe,
    private DashboardServ: DashboardService
  ) {

    this.defaultColDef = {
      resizable: true,
      sortable: true,
      filter: true,
      floatingFilter: true,
    }
    this.rowSelection = 'multiple';
  }

  ngOnInit(): void {
    this.FillViewPara()
  }

  closeChild(componentName) {
    this.DashboardServ.sendClickEvent(componentName);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData()
  }

  FillViewPara() {
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'DashReceive' }).subscribe((VPRes) => {
      try {
        if (VPRes.success == 1) {
          this.GridHeader = VPRes.data.map((item) => { return item.FIELDNAME })

          let temp = []

          for (let i = 0; i < VPRes.data.length; i++) {
            temp.push({
              headerName: VPRes.data[i].DISPNAME,
              headerClass: VPRes.data[i].HEADERALIGN,
              field: VPRes.data[i].FIELDNAME,
              width: VPRes.data[i].COLWIDTH,
              cellStyle: { 'text-align': VPRes.data[i].CELLALIGN },
              resizable: VPRes.data[i].ISRESIZE,
              hide: VPRes.data[i].DISP == false ? true : false,
              filter: true,
              floatingFilter: true,
            })
            if (VPRes.data[i].FORMAT == 'NumberFormat') {
              temp[i].valueFormatter = this.NumberFormat
            } else if (VPRes.data[i].FORMAT == '') {
              temp[i].valueFormatter = this.StringFormat
            } else if (VPRes.data[i].FORMAT == 'DateFormat') {
              temp[i].cellRenderer = this.DateFormat.bind(this)
              delete temp[i].valueFormatter
            } else if (VPRes.data[i].FORMAT == 'TimeFormat') {
              temp[i].cellRenderer = this.TimeFormat.bind(this)
              delete temp[i].valueFormatter
            } else {
              temp[i].valueFormatter = this.StringFormat
            }
          }

          this.columnDefs = temp
          temp = []
          let SelectionCol = {
            width: 28,
            field: 'CHK',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            resizable: false,
            sortable: false,
          }
          this.columnDefs.unshift(SelectionCol)

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(VPRes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  Save() {
    let a = this.gridApi.getSelectedRows()
    let PerArr = [];
    for (let i = 0; i < a.length; i++) {
      let SaveObj = {
        L_CODE: a[i].L_CODE,
        SRNO: a[i].SRNO,
        TAG: a[i].TAG,
        DETID: a[i].DETID,
        R_DATE: a[i].R_DATE,
        TPROC_CODE: a[i].TPROC_CODE,
        RNO: a[i].RNO,
        EMP_CODE: a[i].EMP_CODE,
        STCOMP: this.decodedTkn.UserId,
        STUSER: this.decodedTkn.UserId,
        PNT: a[i].PNT,
      };
      PerArr.push(SaveObj);
    }
    this.spinner.show()
    this.DashboardServ.DashReceiveStockConfirm(PerArr).subscribe((SaveRes) => {
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
          return
        }
      } catch (err) {
        this.spinner.hide()
        this.toastr.error(err)
        return
      }
    })
  }

  LoadGridData() {
    let SaveObj = {
      EMP_CODE: this.EMP_CODE,
      PNT: this.PNT,
      GRP: this.GRP,
    }

    this.spinner.show()

    this.DashboardServ.DashReceiveFill(SaveObj).subscribe((FillRes) => {

      try {
        if (FillRes.success == true) {
          this.spinner.hide()
          this.gridApi.setRowData(FillRes.data);
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

  NumberFormat(params) {
    if (params.value != 'NaN' && params.value != null) {
      return parseFloat(params.value).toFixed(2);
    } else {
      return '0.00'
    }
  }

  StringFormat(params) {
    if (params.value != 'NaN' && params.value != null) {
      return params.value
    } else {
      return ''
    }
  }

  DateFormat(params) {
    if (params.value) {
      return this.datePipe.transform(params.value, 'dd-MM-yyyy')
    } else {
      return ''
    }
  }

  TimeFormat(params) {
    if (params.value) {
      return this.datePipe.transform(params.value, 'HH:mm a', 'UTC+0')
    } else {
      return ''
    }
  }

}
