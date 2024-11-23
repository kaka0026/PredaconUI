import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DatePipe, JsonPipe } from "@angular/common";

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

import { PrcInwService } from 'src/app/Service/Transaction/prc-inw.service';
import { InnPrcRetSlipService } from './../../../Service/Transaction/inn-prc-ret-slip.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-inn-prc-ret-slip',
  templateUrl: './inn-prc-ret-slip.component.html',
  styleUrls: ['./inn-prc-ret-slip.component.css']
})
export class InnPrcRetSlipComponent {

  @ViewChild("inputBox") _el: ElementRef;

  setFocus() {
    this._el.nativeElement.focus();
    // $event.target.select();
  }
  ngAfterViewInit() {
    this._el.nativeElement.focus();
  }

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  TPROC_CODE: any = ''
  PRC_CODE: any = ''
  TPRC_CODE: any = 'F'
  PNT: any = this.decodedTkn.PNT
  I_DATE: any = new Date()
  RNO: any = 0;
  // RGRP_TOGGLE = false;

  PRArr = []

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []

  constructor(
    private PrcInwServ: PrcInwService,
    private InnPrcRetSlipServ: InnPrcRetSlipService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef
  ) {
    this.columnDefs = [
      {
        headerName: 'Lot',
        field: 'L_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Srno',
        field: 'SRNO',
        cellStyle: { 'text-align': 'right' },
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
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Pnt',
        field: 'PNT',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Manager',
        field: 'M_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Pcs',
        field: 'R_PCS',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Carat',
        field: 'R_CARAT',
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
      },
      {
        headerName: 'Prc Type',
        field: 'PRC_TYP',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'PEmployee',
        field: 'PEMP_CODE',
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

    this.PrcInwServ.InwPrcMastFill({ DEPT_CODE: 'POI', TYPE: 'INNER', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.PRArr = PCRes.data.map((item) => {
            return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME }
          })
          if (this.PRArr.length != 0 && this.PRArr[0].PRC_CODE) {
            this.PRC_CODE = this.PRArr[0].PRC_CODE
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  async Update() {

    let Chk;

    let ChkObj = {
      PNT: this.PNT,
      R_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, "yyyy-MM-dd") : '',
      DEPT_CODE: this.PRC_CODE,
      RNO: this.RNO,
      PRC_CODE: this.TPRC_CODE,
      IUSER: this.decodedTkn.UserId
    }

    await this.InnPrcRetSlipServ.InnPrcRetSlipUpdate(ChkObj).then((CRes) => {

      try {
        if (CRes.success == true) {
          Chk = CRes.data['']
        } else {
          this.spinner.hide();
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(CRes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    return Chk
  }

  async Save() {

    if (this.RNO == 0 || this.RNO == '') {
      this.toastr.warning("RNO No. is required.")
      return
    }

    // if (this.RNO == 0 || this.RNO == '') {
    //   this.RNO = this.DateFill()
    //   console.log("SAVE RNO:", this.RNO);
    // }


    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }

    let ChkObj = {
      PNT: this.PNT,
      R_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, "yyyy-MM-dd") : '',
      DEPT_CODE: this.PRC_CODE,
      RNO: this.RNO,
      PRC_CODE: this.TPRC_CODE,
      IUSER: this.decodedTkn.UserId
    }

    await this.InnPrcRetSlipServ.InnPrcRetSlipUpdate(ChkObj).then((CRes) => {

      try {
        if (CRes.success == true) {
          let SaveObj = {
            DEPT_CODE: this.PRC_CODE,
            PRC_CODE: this.TPRC_CODE,
            I_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, "yyyy-MM-dd") : '',
            ETYPE: 'R',
            INO: this.RNO,
            PNT: this.PNT,
          }

          this.InnPrcRetSlipServ.PrnIssSave(SaveObj).subscribe((SaveRes) => {
            try {
              if (SaveRes.success == true) {
                this.spinner.hide();
                this.toastr.success("save successfully");
                this.LoadGridData();
                this.clear();
              } else {
                this.spinner.hide();
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: JSON.stringify(SaveRes.data),
                })
              }
            } catch (error) {
              this.toastr.error(error)
            }
          })
        } else {
          this.spinner.hide();
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(CRes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  LoadGridData() {
    if (this.I_DATE == '') {
      this.toastr.warning("Enter Date.")
      return
    }
    this.spinner.show()
    let Obj = {
      PNT: this.PNT ? this.PNT : '',
      R_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, "yyyy-MM-dd") : '',
      DEPT_CODE: this.PRC_CODE,
      PRC_CODE: this.TPRC_CODE,
      IUSER: this.decodedTkn.UserId
    }
    this.InnPrcRetSlipServ.InnPrcRetSlipDisplay(Obj).subscribe((FillRes) => {
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

  DateFill() {
    if (this.RNO == 0 || this.RNO == ' ') {

      let PrnNoObj = {
        DEPT_CODE: this.PRC_CODE,
        PRC_CODE: this.TPRC_CODE,
        I_DATE: this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd'),
        ETYPE: 'R',
        PNT: this.PNT
      }

      this.InnPrcRetSlipServ.PrnIssMaxNo(PrnNoObj).subscribe((Res) => {
        try {
          if (Res.success == true) {
            this.RNO = Res.data[0].INO
            this.spinner.hide()
            this.LoadGridData()
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: JSON.stringify(Res.data),
            })
          }
        } catch (error) {
          this.toastr.warning(error)
        }
      })
    }
  }

  Fill() {

    // this.RGRP_TOGGLE = true;

    let FillObj = {
      PNT: this.PNT ? this.PNT : '',
      R_DATE: this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd'),
      DEPT_CODE: this.PRC_CODE ? this.PRC_CODE : '',
      PRC_CODE: this.TPRC_CODE ? this.TPRC_CODE : '',
      RNO: this.RNO,
      IUSER: this.decodedTkn.UserId
    }
    this.InnPrcRetSlipServ.InnPrcRetSlipFill(FillObj).subscribe((FRes) => {
      try {
        if (FRes.success == true) {
          this.spinner.hide()
          this.gridApi.setRowData(FRes.data);
          this.gridApi.sizeColumnsToFit();
        } else {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(FRes.data),
          })
        }
      } catch (error) {

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

  clear() {
    this.I_DATE = new Date();
    this.RNO = 0
    this.setFocus()
  }

  download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  async PRINT() {

    // this.RGRP_TOGGLE = false;

    // if (this.RNO == 0 || this.RNO == '') {
    //   this.RNO = this.DateFill()
    //   console.log("PRINT RNO:", this.RNO);
    // }
    if (this.RNO == 0 || this.RNO == '') {
      this.toastr.warning("RNO No. is required.")
      return
    }



    this.InnPrcRetSlipServ.InnerPrcRetSlipPrint({
      PNT: this.PNT ? this.PNT : '',
      R_DATE: this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd'),
      DEPT_CODE: this.PRC_CODE ? this.PRC_CODE : '',
      RNO: this.RNO,
      RUSER: this.decodedTkn.UserId
    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          if (Res.data.length != 0) {
            let TOTALPCS = 0
            let TOTALCRT = 0
            let TOTALLOS = 0
            let text = 'E' + this.PRArr.filter(x => x.PRC_CODE == this.PRC_CODE)[0].PRC_NAME + 'F' + ' :--Return Slip Print\n'
            text = text + 'Pointer : E' + this.PNT + 'F\n'
            text = text + '(' + this.datepipe.transform(Date(), 'dd/MM-hh:mm a') + ')\n'
            text = text + 'Receive No : E' + this.RNO + 'F\n'
            text = text + '==============================\n'
            text = text + 'LotNo    Pcs   Carat   Loss\n'
            text = text + '==============================\n'
            for (var i = 0; i < Res.data.length; i++) {
              text = text + Res.data[i].L_CODE + this.GETSPACE(10, Res.data[i].L_CODE.toString().length)
              text = text + Res.data[i].IPCS + this.GETSPACE(4, Res.data[i].IPCS.toString().length)
              text = text + Res.data[i].RCRT + this.GETSPACE(9, Res.data[i].RCRT.toString().length)
              text = text + Res.data[i].LCRT + this.GETSPACE(6, Res.data[i].LCRT.toString().length) + '\n';
              TOTALPCS = TOTALPCS + Res.data[i].IPCS
              TOTALCRT = TOTALCRT + Res.data[i].RCRT
              TOTALLOS = TOTALLOS + Res.data[i].LCRT
            }
            text = text + '==============================\n'
            text = text + 'ETotal E    ' + TOTALPCS + this.GETSPACE(2, TOTALPCS.toString().length) + 'E' + TOTALCRT + this.GETSPACE(8, TOTALCRT.toString().length) + 'E' + TOTALLOS + this.GETSPACE(8, TOTALLOS.toString().length) + ' F\n'
            text = text + '==============================\n'
            text = text + 'User :' + this.decodedTkn.UserId + '\n\n'
            text = text + 'Signature: _____________\n'
            this.download("PRNPPRIDER.txt", text);
          } else {
            this.toastr.warning('No data')
          }
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  GETSPACE(totspace: any, itemspace: any) {
    let SPACE = ''
    for (let l = 0; l < totspace - itemspace; l++) {
      SPACE = SPACE + ' '
    }
    return SPACE
  }
}
