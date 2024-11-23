import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';

@Component({
  selector: 'app-dock-view',
  templateUrl: './dock-view.component.html',
  styleUrls: ['./dock-view.component.css']
})
export class DockViewComponent implements OnInit {
  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public pinnedBottomRowData;
  public frameworkComponents;
  public rowSelection;
  public gridOptions;

  VIEWPARA: any = ''
  GridHeader = []
  griddata = []
  style = {
    width: '100%',
    height: 'calc(95vh - 130px)'
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private _mdr: MatDialogRef<DockViewComponent>,
    private ViewParaMastServ: ViewParaMastService,
    private datePipe: DatePipe,
  ) {
    this.VIEWPARA = this.data.VIEWPARA
    this.griddata = this.data.data;
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: this.data.VIEWPARA }).subscribe((VPRes) => {
      try {
        if (VPRes.success == 1) {
          this.GridHeader = VPRes.data.map((item) => { return item.FIELDNAME })

          let temp = []
          let tempwidth = 0
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
            tempwidth = tempwidth + VPRes.data[i].COLWIDTH
          }
          this.setWidthAndHeight(tempwidth);
          this.columnDefs = temp
          temp = []

        } else {
          this.toastr.warning(JSON.stringify(VPRes.data))
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

  }

  ngOnInit(): void {

  }

  setWidthAndHeight(width) {
    this.style = {
      width: width + 'px',
      height: 'calc(95vh - 130px)'
    };
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setRowData(this.griddata)
    if (this.VIEWPARA == "DockPrcPenDet") {
      let tempIcarat = 0
      let tempIpcs = 0
      for (let i = 0; i < this.griddata.length; i++) {
        tempIcarat = tempIcarat + this.griddata[i].I_CARAT
        tempIpcs = tempIpcs + this.griddata[i].I_PCS
      }
      this.pinnedBottomRowData = this.FooterCalPrcPen(tempIcarat, tempIpcs);
    } else if (this.VIEWPARA == "DockCurRollDet") {
      let tempIcarat = 0
      let tempIpcs = 0
      for (let i = 0; i < this.griddata.length; i++) {
        tempIcarat = tempIcarat + this.griddata[i].I_CARAT
        tempIpcs = tempIpcs + this.griddata[i].I_PCS
      }
      this.pinnedBottomRowData = this.FooterCalCurRoll(tempIcarat, tempIpcs);
    }
  }
  FooterCalPrcPen(Carat: any, Pcs: any) {
    var result = [];
    result.push({
      L_CODE: this.griddata.length,
      SRNO: '',
      TAG: '',
      EMP_CODE: '',
      GRP: '',
      PRC_TYP: '',
      PEMP_CODE: '',
      I_PCS: Pcs,
      I_CARAT: Carat,
      I_DATE: '',
      I_TIME: '',
      INO: '',
      DIFFHR: ''
    })
    return result
  }

  FooterCalCurRoll(Carat: any, Pcs: any) {
    var result = [];
    result.push({
      L_CODE: this.griddata.length,
      SRNO: '',
      TAG: '',
      EMP_CODE: '',
      GRP: '',
      DETID: '',
      PRC: '',
      I_PCS: Pcs,
      I_CARAT: Carat
    })
    return result
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
  Close() {
    this._mdr.close();
  }
}
