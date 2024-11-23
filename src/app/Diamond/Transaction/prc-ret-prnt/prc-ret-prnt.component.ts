import { Component, ElementRef, OnInit } from '@angular/core';
import { DatePipe, JsonPipe } from "@angular/common";

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

import { PrcInwService } from 'src/app/Service/Transaction/prc-inw.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PrcRetPrntService } from 'src/app/Service/Transaction/prc-ret-prnt.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import PerfectScrollbar from 'perfect-scrollbar';


@Component({
  selector: 'app-prc-ret-prnt',
  templateUrl: './prc-ret-prnt.component.html',
  styleUrls: ['./prc-ret-prnt.component.css']
})
export class PrcRetPrntComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  griddata = []
  TPROC_CODE: any = ''
  PROC_CODE: any = ''
  L_CODE: any = ''
  SRNO: any = ''
  TAG: any = ''
  PNT: any = this.decodedTkn.PNT
  DETID: any = ''
  FPROC_CODE: any = ''
  RNO: any = ''
  R_CARAT: any = ''
  R_PCS: any = ''
  R_DATE: any = new Date()
  E_CARAT: any = ''
  E_PCS: any = ''
  L_CARAT: any = ''
  S_CARAT: any = ''
  S_PCS: any = ''
  SYN: any = ''
  RUSER: any = ''
  RCOMP: any = ''

  PRArr = []

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  constructor(
    private PrcInwServ: PrcInwService,
    private PrcRetPrntServ: PrcRetPrntService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef
  ) {
    this.columnDefs = [
      {
        headerName: 'Dept',
        field: 'DEPT_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Lot',
        field: 'L_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Srno',
        field: 'SRNO',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Tag',
        field: 'TAG',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'DetId',
        field: 'DETID',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'DetNo',
        field: 'DETNO',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Pnt',
        field: 'PNT',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'IPcs',
        field: 'I_PCS',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'ICarat',
        field: 'I_CARAT',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'RPcs',
        field: 'R_PCS',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'RCarat',
        field: 'R_CARAT',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'EPcs',
        field: 'E_PCS',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'ECarat',
        field: 'E_CARAT',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'SPcs',
        field: 'S_PCS',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'SCarat',
        field: 'S_CARAT',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'LCarat',
        field: 'L_CARAT',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'RNO',
        field: 'RNO',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Date',
        field: 'R_DATE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.IDateConv.bind(this)
      },
      {
        headerName: 'Time',
        field: 'R_TIME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.ITimeConv.bind(this)
      },
      {
        headerName: 'Process',
        field: 'PRC_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'MEmployee',
        field: 'MEMP_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Grp',
        field: 'GRP',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
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

    this.PrcInwServ.InwPrcMastFill({ DEPT_CODE: 'POI', TYPE: 'RTN', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.PRArr = PCRes.data.map((item) => {
            return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME }
          })
          if (this.PRArr.length != 0 && this.PRArr[0].PRC_CODE) {
            this.TPROC_CODE = this.PRArr[0].PRC_CODE
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(PCRes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }
  ITimeConv(params) {

    if (params.value) {
      return this.datepipe.transform(params.value, 'hh:mm a', 'UTC+0')
    } else {
      return ''
    }
  }
  IDateConv(params) {
    if (params.value) {
      return this.datepipe.transform(params.value, 'dd/MM/yyyy', 'UTC+0')
    } else {
      return ''
    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
  }

  Save() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
    for (let i = 0; i < this.griddata.length; i++) {
      let SaveObj = {
        L_CODE: this.griddata[i].L_CODE,
        SRNO: this.griddata[i].SRNO,
        TAG: this.griddata[i].TAG,
        PNT: this.griddata[i].PNT,
        DETID: this.griddata[i].DETID,
        FPROC_CODE: this.TPROC_CODE,
        TPROC_CODE: 'MR',
        RNO: this.griddata[i].RNO,
        R_CARAT: this.griddata[i].R_CARAT,
        R_PCS: this.griddata[i].R_PCS,
        R_DATE: this.griddata[i].R_DATE,
        E_CARAT: this.griddata[i].E_CARAT,
        E_PCS: this.griddata[i].E_PCS,
        L_CARAT: this.griddata[i].L_CARAT,
        S_CARAT: this.griddata[i].S_CARAT,
        S_PCS: this.griddata[i].S_PCS,
        SYN: 0,
        RUSER: this.decodedTkn.UserId,
        RCOMP: this.decodedTkn.UserId,
        RPROC_CODE: this.griddata[i].PRC_CODE,
      }
      this.spinner.show()
      this.PrcRetPrntServ.PrcRetSlipSave(SaveObj).subscribe((SaveRes) => {
        try {
          if (SaveRes.success == true) {
            this.spinner.hide()
            if (i == this.griddata.length - 1) {
              this.toastr.success('Save successfully.')
            }
            this.clear()
            this.gridApi.setRowData([]);
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
  }

  async tagFillCheck(eve: any) {
    if (eve.keyCode == 13 || eve.keyCode == 9) {
      let ChkObj = {
        PNT: this.PNT ? this.PNT : '',
        R_DATE: this.R_DATE ? this.datepipe.transform(this.R_DATE, 'yyyy-MM-dd') : '',
        RNO: this.RNO ? this.RNO : '',
        PROC_CODE: this.PROC_CODE ? this.PROC_CODE : '',
      }
      this.PrcRetPrntServ.FNPrcRetPrntDisp(ChkObj).then((Res) => {
        try {
          if (Res.success == true) {
            if (Res.data[''] == "TRUE") {
              let FillObj = {
                DEPT_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
                RNO: this.RNO ? this.RNO : '',
                R_DATE: this.R_DATE ? this.datepipe.transform(this.R_DATE, 'yyyy-MM-dd') : '',
                PNT: this.PNT ? this.PNT : '',
              }
              this.PrcRetPrntServ.PrcRetSlipFill(FillObj).subscribe((Res) => {
                try {
                  if (Res.success == true) {
                    this.spinner.hide()
                    this.griddata = Res.data
                    this.gridApi.setRowData(Res.data);
                    this.gridApi.sizeColumnsToFit();
                  } else {
                    this.spinner.hide()
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: JSON.stringify(Res.data),
                    })
                  }
                } catch (error) {
                  this.spinner.hide()
                }
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Packet Not Found.!",
              })
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: JSON.stringify(Res.data),
            })
          }
        } catch (error) {
          this.toastr.error(error)
        }
      })
    }
  }

  LoadGridData() {

  }
  clear() {
    this.RNO = ''
    this.R_DATE = new Date()
  }
}
