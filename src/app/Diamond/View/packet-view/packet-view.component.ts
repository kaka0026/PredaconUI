import { Component, OnInit, APP_ID, ElementRef } from '@angular/core';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

import { JwtHelperService } from '@auth0/angular-jwt';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { isEmpty, map, startWith } from 'rxjs/operators';

import { ViewService } from './../../../Service/View/view.service';
import { DatePipe } from "@angular/common";
import { ViewParaMastService } from './../../../Service/Master/view-para-mast.service';
import { EncrDecrService } from 'src/app/Service/Common/encr-decr.service';
import { LotMastService } from '../../../Service/Master/lot-mast.service';
import PerfectScrollbar from 'perfect-scrollbar';
import { CommonService } from 'src/app/Service/Common/common.service';

export interface LOTInt {
  CODE: string;
  NAME: string;
  PNT: string;
  CARAT: string;
}

export interface Emp {
  code: string;
  name: string;
}

@Component({
  selector: 'app-packet-view',
  templateUrl: './packet-view.component.html',
  styleUrls: ['./packet-view.component.css']
})
export class PacketViewComponent implements OnInit {

  empCtrl: FormControl;
  filteredEmps: Observable<any[]>;
  emps: Emp[] = [];

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem('token'));

  decodedMast = JSON.parse(this.EncrDecrServ.get(localStorage.getItem("unfam1")));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public pinnedBottomRowData;
  public frameworkComponents;
  public rowSelection;
  public getRowStyle;

  L_CODE: any = '';
  EMP_CODE: any = '';
  EMP_NAME: any = '';
  GRP: any = '';
  F_DATE = null;
  T_DATE: any = null;
  SRNO: any = 0;
  SRNOTO: any = 0;
  TAG: any = '';
  F_CARAT: any = 0;
  T_CARAT: any = 0;
  L_CARAT: any = 0;
  F_EXCARAT: any = 0;
  T_EXCARAT: any = 0;
  F_TIME: any = null;
  T_TIME: any = null;
  SELECTMODE: any = 'A';
  GRD: any = 0;
  PNT: any = 0;
  L_NAME: any = '';

  GridHeader = []

  LOTCtrl: FormControl;
  filteredLOTs: Observable<any[]>;
  LOTs: LOTInt[] = [];

  TOTPKT: any = 0;
  TOTOPKT: any = 0;
  TOTCRT: any = 0;
  MAKPKT: any = 0;
  MAKCRT: any = 0;
  RCVCRT: any = 0;
  RCVPKT: any = 0;
  PENCRT: any = 0;
  PENPKT: any = 0;
  LOSSCRT: any = 0;
  LOSSPER: any = 0;
  STKCRT: any = 0;
  STKPKT: any = 0;
  MAKPER: any = 0;
  EXTCRT: any = 0;
  EXTPKT: any = 0;
  EXTPCS: any = 0;

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private ViewServ: ViewService,
    private ViewParaMastServ: ViewParaMastService,
    private datePipe: DatePipe,
    private LotMastServ: LotMastService,
    private EncrDecrServ: EncrDecrService,
    private elementRef: ElementRef,
    private CommonServ: CommonService
  ) {

    this.defaultColDef = {
      resizable: true,
      sortable: true
    }
    this.getRowStyle = function (params) {
      if (params.data.R_DATE == null) {
        return { background: '#C0C0FF' };
      } else if (params.data.R_DATE != null && params.data.R_CARAT == 0) {
        return { background: '#ffc0ff' };
      } else if (params.data.R_DATE != null && params.data.R_CARAT != 0) {
        return { background: '#99e9f2' };
      }
    };
    this.rowSelection = "multiple";
  }

  ngOnInit(): void {
    this.FillViewPara()

    this.LOTCtrl = new FormControl()
    this.LotMastServ.LotMastFill({}).subscribe((LFRes) => {
      try {
        if (LFRes.success == true) {
          this.LOTs = LFRes.data.map((item) => {
            return { CODE: item.L_CODE, NAME: item.L_NAME.toString(), PNT: item.PNT, CARAT: item.L_CARAT }
          })
          this.filteredLOTs = this.LOTCtrl.valueChanges.pipe(
            startWith(""),
            map(LOT => (LOT ? this.filterLOTs(LOT) : this.LOTs.slice(0, 10)))
          );
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(LFRes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    this.empCtrl = new FormControl();

    this.emps = this.decodedMast[12].map(item => {
      return { code: item.EMP_CODE, name: item.EMP_NAME };
    });

    this.filteredEmps = this.empCtrl.valueChanges
      .pipe(
        startWith(''),
        map(emp => emp ? this.filterEmps(emp) : this.emps.slice(0, 10))
      );
  }

  filterEmps(code: string) {
    return this.emps.filter(emp =>
      emp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);


  }

  GetEmpName() {
    if (this.EMP_CODE) {
      if (this.emps.filter(option => option.code.toLocaleLowerCase().includes(this.EMP_CODE.toLowerCase())).length != 0) {
        this.EMP_NAME = this.emps.filter(option => option.code.toLocaleLowerCase().includes(this.EMP_CODE.toLowerCase()))[0].name
      } else {
        this.EMP_NAME = ''
      }
    } else {
      this.EMP_NAME = ''
    }


  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  LoadGridData() {

    let SaveObj = {
      L_CODE: this.L_CODE,
      EMP_CODE: this.EMP_CODE,
      GRP: this.GRP,
      F_DATE: this.F_DATE,
      T_DATE: this.T_DATE,
      SRNO: this.SRNO,
      SRNOTO: this.SRNOTO,
      TAG: this.TAG.trim(),
      F_CARAT: parseFloat(this.F_CARAT),
      T_CARAT: parseFloat(this.T_CARAT),
      F_TIME: this.F_TIME,
      T_TIME: this.T_TIME,
      GRD: this.GRD,
      SELECTMODE: this.SELECTMODE,
      PNT: this.PNT,
    }

    this.spinner.show()
    this.ViewServ.PacketView(SaveObj).subscribe((FillRes) => {
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

    this.ViewServ.PacketViewTotal({
      L_CODE: this.L_CODE,
      EMP_CODE: this.EMP_CODE,
      GRP: this.GRP,
      F_DATE: this.F_DATE,
      T_DATE: this.T_DATE,
      SRNO: this.SRNO,
      SRNOTO: this.SRNOTO,
      TAG: this.TAG.trim(),
      F_CARAT: parseFloat(this.F_CARAT),
      T_CARAT: parseFloat(this.T_CARAT),
      SELECTMODE: this.SELECTMODE,
      PNT: this.PNT,
    }).subscribe((FillRes) => {
      try {
        if (FillRes.success == true) {
          this.spinner.hide()

          this.TOTPKT = FillRes.data[0].Tpkt ? FillRes.data[0].Tpkt.toFixed(0) : 0
          this.TOTOPKT = FillRes.data[0].Opkt ? FillRes.data[0].Opkt.toFixed(0) : 0
          this.TOTCRT = FillRes.data[0].Tcrt ? FillRes.data[0].Tcrt.toFixed(3) : 0
          this.MAKPKT = FillRes.data[0].Mpkt ? FillRes.data[0].Mpkt.toFixed(0) : 0
          this.MAKCRT = FillRes.data[0].Mcrt ? FillRes.data[0].Mcrt.toFixed(3) : 0
          this.RCVCRT = FillRes.data[0].Rcrt ? FillRes.data[0].Rcrt.toFixed(3) : 0
          this.RCVPKT = FillRes.data[0].Rpkt ? FillRes.data[0].Rpkt.toFixed(0) : 0
          this.PENCRT = (FillRes.data[0].Tcrt - FillRes.data[0].Rcrt) ? (FillRes.data[0].Tcrt - FillRes.data[0].Rcrt).toFixed(3) : 0
          this.PENPKT = (FillRes.data[0].Tpkt - FillRes.data[0].Rpkt) ? (FillRes.data[0].Tpkt - FillRes.data[0].Rpkt).toFixed(0) : 0
          this.LOSSCRT = FillRes.data[0].Lcrt ? FillRes.data[0].Lcrt.toFixed(3) : 0
          this.LOSSPER = ((FillRes.data[0].Lcrt / FillRes.data[0].Tcrt) * 100) ? ((FillRes.data[0].Lcrt / FillRes.data[0].Tcrt) * 100).toFixed(2) : 0
          this.STKCRT = FillRes.data[0].Scrt ? FillRes.data[0].Scrt.toFixed(3) : 0
          this.STKPKT = FillRes.data[0].Spkt ? FillRes.data[0].Spkt.toFixed(0) : 0
          this.MAKPER = ((FillRes.data[0].Mcrt / FillRes.data[0].Tcrt) * 100) ? ((FillRes.data[0].Mcrt / FillRes.data[0].Tcrt) * 100).toFixed(2) : 0
          this.EXTCRT = FillRes.data[0].Ecrt ? FillRes.data[0].Ecrt.toFixed(0) : 0
          this.EXTPKT = FillRes.data[0].Epkt ? FillRes.data[0].Epkt.toFixed(0) : 0
          this.EXTPCS = FillRes.data[0].Epcs ? FillRes.data[0].Epcs.toFixed(0) : 0

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

  FillViewPara() {
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'VWFrmPktView' }).subscribe((VPRes) => {
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

  keypressLOT(eve: any, e: any) {
    if (e != '') {
      let val = this.LOTs.filter(option => option.CODE.toLocaleLowerCase().includes(e.toLowerCase()));
      if (val.length != 0) {
        if (val[0].NAME != "") {
          this.L_NAME = val[0].NAME
        } else {
          this.LOTCtrl.setValue('')
          this.L_CODE = ''
          this.L_NAME = ''
        }
      } else {
        this.LOTCtrl.setValue('')
        this.L_CODE = ''
        this.L_NAME = ''
      }
    } else {
      this.LOTCtrl.setValue('')
      this.L_CODE = ''
      this.L_NAME = ''
    }
  }


  filterLOTs(code: string) {
    return this.LOTs.filter(option => option.CODE.toLocaleLowerCase().includes(code.toLowerCase()))
  }

  onEnterLOT(evt: any) {
    if (evt.source.selected) {
      this.LOTCtrl.setValue(evt.source.value)
      this.L_CODE = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).CODE : ''
      this.PNT = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).PNT : ''
    }
  }

  GetLotName(name: any) {
    this.L_NAME = name
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


  BARCODE() {
    this.CommonServ.BarCode({
      TYPE: 'VIEW',
      L_CODE: this.L_CODE,
      SRNO: this.SRNO,
      SRNOTO: this.SRNOTO,
      TAG: this.TAG.trim()
    }).subscribe((Res) => {
      try {

        if (Res.success == true) {
          let text = ''
          for (var i = 0; i < Res.data.length; i++) {
            text = text + Res.data[i].BCODE + '\n';
          }
          if (Res.data.length != 0) {
            this.download("BARCODE.txt", text);
          } else {
            this.toastr.warning('No data')
          }

        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
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

  PRINT() {
    let text
    this.ViewServ.PktViewPrint({
      L_CODE: this.L_CODE,
      EMP_CODE: this.EMP_CODE,
      GRP: this.GRP,
      F_DATE: this.F_DATE ? this.datePipe.transform(this.F_DATE, 'yyyy-MM-dd') : '',
      T_DATE: this.T_DATE ? this.datePipe.transform(this.T_DATE, 'yyyy-MM-dd') : '',
      SRNO: this.SRNO,
      SRNOTO: this.SRNOTO,
      TAG: this.TAG.trim(),
      F_CARAT: parseFloat(this.F_CARAT),
      T_CARAT: parseFloat(this.T_CARAT),
      GRD: this.GRD,
      SELECTMODE: this.SELECTMODE,
      PNT: this.PNT
    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          if (Res.data.length != 0) {
            let TOTALPCS = 0
            let TOTALWEG = 0
            let TOTALSPACE = ''
            text = 'Pointer : ' + this.PNT + '\n'
            text = text + '(' + this.datePipe.transform(Date(), 'dd/MM-hh:mm a') + ')\n'

            if (this.L_CODE != null && this.L_CODE != "") {
              text = text + "Lot : " + this.L_CODE + "\n";
            }
            if (this.GRP) {
              text = text + "Grp : " + this.GRP + "F\n";
            }
            if (this.SELECTMODE == "E") {
              text = text + "Process : E" + "Extra" + "F\n"
            }
            if (this.SELECTMODE == "P") {
              text = text + "Process : E" + "Pending" + "F\n"
            }
            if (this.SELECTMODE == "SE") {
              text = text + "Process : E" + "Second" + "F\n"
            }
            if (this.SELECTMODE == "O") {
              text = text + "Process : E" + "Origional" + "F\n"
            }
            if (this.EMP_CODE != null && this.EMP_CODE != "") {
              text = text + "Employee : E" + this.EMP_CODE + "F\n"
            }
            if (this.SRNO != 0) {
              text = text + "SrNo : E" + this.SRNO + "F\n"
            }
            if (this.SRNOTO != 0) {
              text = text + "SrNo To : " + this.SRNOTO + "\n"
            }
            if (this.TAG != null && this.TAG != "") {
              text = text + "Tag : E" + this.TAG + "F\n"
            }
            if (this.F_CARAT != null && this.F_CARAT != 0) {
              text = text + "Carat : " + this.F_CARAT + "\n"
            }
            if (this.T_CARAT != null && this.T_CARAT != 0) {
              text = text + "Carat To : " + this.T_CARAT + "\n"
            }
            if (this.F_DATE != null) {
              text = text + "Date :" + this.datePipe.transform(this.F_DATE, 'yyyy-MM-dd') + "\n"
            }
            if (this.T_DATE != null) {
              text = text + "Date To:" + this.datePipe.transform(this.T_DATE, 'yyyy-MM-dd') + "\n"
            }

            text = text + "===============================\n"
            text = text + "Lot     Emp-Grp   Pcs    Carat\n"
            text = text + "===============================\n"

            for (var i = 0; i < Res.data.length; i++) {
              let LCODESPACE = ''
              let EMPSPACE = ''
              let IPCSSPACE = ''
              for (let l = 0; l < 8 - Res.data[i].L_CODE.length; l++) {
                LCODESPACE = LCODESPACE + ' '
              }
              for (let l = 0; l < 10 - Res.data[i].EMP.length; l++) {
                EMPSPACE = EMPSPACE + ' '
              }
              for (let l = 0; l < 7 - Res.data[i].IPCS.toString().length; l++) {
                IPCSSPACE = IPCSSPACE + ' '
              }

              TOTALPCS = TOTALPCS + Res.data[i].IPCS
              TOTALWEG = TOTALWEG + Res.data[i].ICRT
              text = text + Res.data[i].L_CODE + LCODESPACE + Res.data[i].EMP + EMPSPACE + Res.data[i].IPCS + IPCSSPACE + Res.data[i].ICRT + '\n';
            }
            for (let l = 0; l < 7 - (TOTALPCS.toString()).length; l++) {
              TOTALSPACE = TOTALSPACE + ' '
            }

            text = text + "===============================\n"
            text = text + 'ETotal :    E    ' + TOTALPCS + TOTALSPACE + 'E' + TOTALWEG + 'F\n'
            text = text + "===============================\n"
            this.download("PRNPKTVIEW.txt", text);
          } else {
            this.toastr.warning('No data')
          }
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  SETFLOAT(e: any, flonum: any) {
    return parseFloat(this[e]).toFixed(flonum)
  }
}
