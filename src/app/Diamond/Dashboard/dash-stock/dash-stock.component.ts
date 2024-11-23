import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";
import { Subscription } from 'rxjs';

import { DashboardService } from './../../../Service/Dashboard/dashboard.service';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-dash-stock',
  templateUrl: './dash-stock.component.html',
  styleUrls: ['./dash-stock.component.css']
})
export class DashStockComponent implements OnInit {

  clickEventsubscription: Subscription;

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  EMP_CODE: any = '';
  PNT: any = 0;
  GRP: any = '';

  GridHeader = []

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private DashboardServ: DashboardService,
    private datePipe: DatePipe,
    private ViewParaMastServ: ViewParaMastService
  ) {

    this.defaultColDef = {
      resizable: true,
      sortable: true
    }
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
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'DashStock' }).subscribe((VPRes) => {
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

  LoadGridData() {
    let FillObj = {
      EMP_CODE: this.EMP_CODE,
      PNT: this.PNT,
      GRP: this.GRP,
    }

    this.spinner.show()
    this.DashboardServ.DashStockFill(FillObj).subscribe((FillRes) => {

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
      return this.datePipe.transform(params.value, 'hh:mm a', 'UTC+0')
    } else {
      return ''
    }
  }
}
