import { Component, ElementRef, OnInit } from '@angular/core';
import { DatePipe } from "@angular/common";

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { isEmpty, map, startWith } from 'rxjs/operators';

import { ViewService } from './../../../Service/View/view.service';
import { ViewParaMastService } from './../../../Service/Master/view-para-mast.service';
import { LotMastService } from '../../../Service/Master/lot-mast.service';
import PerfectScrollbar from 'perfect-scrollbar';
import { PrcInwService } from 'src/app/Service/Transaction/prc-inw.service';
import { BrkEntService } from 'src/app/Service/Transaction/brk-ent.service';
import { ThrowStmt } from '@angular/compiler';

export interface LOTInt {
  CODE: string;
  NAME: string;
  PNT: string;
}

export interface Emp {
  code: string;
  name: string;
}

@Component({
  selector: 'app-process-view',
  templateUrl: './process-view.component.html',
  styleUrls: ['./process-view.component.css']
})

export class ProcessViewComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem('token'));

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
  PEMP_CODE: any = '';
  PEMP_NAME: any = '';
  SRNO: any = 0;
  SRNOTO: any = 0;
  TAG: any = '';
  F_INO: any = 0;
  T_INO: any = 0;
  F_DATE = null;
  T_DATE: any = null;
  F_TIME: any = null;
  T_TIME: any = null;
  SELECTMODE: any = 'A';
  PNT: any = 0;
  TPROC_CODE: any = '';
  TPROC_NAME: any = '';
  PRC_TYP: any = '';
  GRP: any = '';
  L_NAME: any = '';
  F_SLIP: any = 0;
  T_SLIP: any = 0;

  TOTALCARAT: number = 0
  TOTALOPKT: number = 0
  TOTALPKT: number = 0
  TOTAL2CARAT: number = 0
  TOTAL2PKT: number = 0
  LOSSCARAT: number = 0
  LOSSPKT: number = 0
  EXTRACARAT: number = 0
  EXTRAPKT: number = 0
  EXTRAPCS: number = 0
  MAKEABLECARAT: number = 0
  MAKEABLEPKT: number = 0
  STOCKCARAT: number = 0
  STOCKPKT: number = 0
  PENDINGCARAT: number = 0
  PENDINGPKT: number = 0
  CPCARAT: number = 0
  CPPKT: number = 0
  PCPCARAT: number = 0
  PCPPKT: number = 0
  ISSUECARAT: number = 0
  ISSUEPKT: number = 0

  GridHeader = []

  LOTCtrl: FormControl;
  filteredLOTs: Observable<any[]>;
  LOTs: LOTInt[] = [];

  typCtrl: FormControl;
  filteredTyps: Observable<any[]>;
  SPRArr: Emp[] = [];

  prcCtrl: FormControl;
  filteredPrcs: Observable<any[]>;
  PRArr: Emp[] = [];

  empCtrl: FormControl;
  filteredEmps: Observable<any[]>;
  EMPArr: Emp[] = [];

  pCtrl: FormControl;
  filteredPs: Observable<any[]>;
  PARTYArr: Emp[] = [];

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private ViewServ: ViewService,
    private ViewParaMastServ: ViewParaMastService,
    private datePipe: DatePipe,
    private LotMastServ: LotMastService,
    private elementRef: ElementRef,
    private PrcInwServ: PrcInwService,
    private BrkEntServ: BrkEntService
  ) {

    this.defaultColDef = {
      resizable: true,
      sortable: true,
    }

    this.getRowStyle = function (params) {
      if (params.data.ST_DATE != null && params.data.SYN == true) {
        return { background: '#FFC0FF' };
      } else if (params.data.R_DATE == null && params.data.PC_DATE != null) {
        return { background: '#C0C0FF' };
      } else if (params.data.R_DATE != null && params.data.R_CARAT != 0 && params.data.TPROC_CODE == "MR") {
        return { background: '#99e9f2' };
      } else if ((params.data.PC_DATE == null && params.data.R_DATE == null) || (params.data.ST_DATE == null && params.data.SYN == true)) {
        return { background: '#fff0f5' };
      } else if (params.data.PC_DATE == null && params.data.R_DATE == null) {
        return { background: '#ffc080' };
      }
    };

    this.rowSelection = "multiple";

    this.PrcInwServ.InwPrcMastFill({ DEPT_CODE: 'POI', TYPE: 'INWD', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.PRArr = PCRes.data.map((item) => {
            return { code: item.PRC_CODE, name: item.PRC_NAME }
          })
          this.filteredPrcs = this.prcCtrl.valueChanges
            .pipe(
              startWith(''),
              map(grp => grp ? this.filterPrcs(grp) : this.PRArr)
            );
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

    this.BrkEntServ.BrkEntCmbFill({ TYPE: 'MARKER' }).then((Res) => {
      try {
        if (Res.success == true) {
          this.EMPArr = Res.data.map((item) => {
            return { code: item.EMP_CODE, name: item.EMP_NAME }
          })
          this.filteredEmps = this.empCtrl.valueChanges
            .pipe(
              startWith(''),
              map(grp => grp ? this.filterEmps(grp) : this.EMPArr.slice(10))
            );
        } else {

        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  ngOnInit(): void {
    this.FillViewPara()
    this.LOTCtrl = new FormControl()
    this.typCtrl = new FormControl()
    this.prcCtrl = new FormControl()
    this.empCtrl = new FormControl()
    this.pCtrl = new FormControl()

    this.LotMastServ.LotMastFill({}).subscribe((LFRes) => {
      try {
        if (LFRes.success == true) {
          this.LOTs = LFRes.data.map((item) => {
            return { CODE: item.L_CODE, NAME: item.L_NAME.toString(), PNT: item.PNT }
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
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  LoadGridData() {
    let SaveObj = {
      L_CODE: this.L_CODE,
      EMP_CODE: this.EMP_CODE,
      PEMP_CODE: this.PEMP_CODE,
      SRNO: this.SRNO ? this.SRNO : 0,
      SRNOTO: this.SRNOTO ? this.SRNOTO : 0,
      TAG: this.TAG.trim(),
      F_INO: this.F_SLIP ? this.F_SLIP : 0,
      T_INO: this.T_SLIP ? this.T_SLIP : 0,
      F_DATE: this.F_DATE ? this.datePipe.transform(this.F_DATE, 'yyyy-MM-dd') : '',
      T_DATE: this.T_DATE ? this.datePipe.transform(this.T_DATE, 'yyyy-MM-dd') : '',
      SELECTMODE: this.SELECTMODE,
      PNT: this.PNT,
      TPROC_CODE: this.TPROC_CODE,
      PRC_TYP: this.PRC_TYP,
      GRP: this.GRP,
    }

    this.spinner.show()

    this.ViewServ.ProcessView(SaveObj).subscribe((FillRes) => {
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

    this.ViewServ.ProcessViewTotal(SaveObj).subscribe((FillRes) => {
      try {
        if (FillRes.success == true) {
          this.spinner.hide()
          this.TOTALCARAT = FillRes.data[0].Tcrt
          this.TOTALPKT = FillRes.data[0].Tpkt
          this.TOTALOPKT = FillRes.data[0].Opkt
          this.ISSUECARAT = FillRes.data[0].Icrt
          this.ISSUEPKT = FillRes.data[0].Ipkt
          this.PCPCARAT = FillRes.data[0].PCcrt
          this.PCPPKT = FillRes.data[0].PCpkt
          this.CPCARAT = FillRes.data[0].CPcrt
          this.CPPKT = FillRes.data[0].CPpkt
          this.PENDINGCARAT = FillRes.data[0].Pcrt
          this.PENDINGPKT = FillRes.data[0].Ppkt
          this.STOCKCARAT = FillRes.data[0].Scrt
          this.STOCKPKT = FillRes.data[0].Spkt
          this.MAKEABLECARAT = FillRes.data[0].Mcrt
          this.MAKEABLEPKT = FillRes.data[0].Mpkt
          this.EXTRACARAT = FillRes.data[0].Ecrt
          this.EXTRAPKT = FillRes.data[0].Epkt
          this.EXTRAPCS = FillRes.data[0].Epcs
          this.LOSSCARAT = FillRes.data[0].Lcrt
          this.LOSSPKT = (FillRes.data[0].Lcrt / FillRes.data[0].Tcrt) * 100
          this.TOTAL2CARAT = (FillRes.data[0].CPcrt + FillRes.data[0].Pcrt + FillRes.data[0].Scrt + FillRes.data[0].Ecrt + FillRes.data[0].Mcrt + FillRes.data[0].Lcrt)
          this.TOTAL2PKT = (FillRes.data[0].CPpkt + FillRes.data[0].Ppkt + FillRes.data[0].Spkt + FillRes.data[0].Epkt + FillRes.data[0].Mpkt)
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
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'VWFrmPrcView' }).subscribe((VPRes) => {
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

  GETPRCNAME() {
    if (this.TPROC_CODE) {
      if (this.PRArr.filter(x => x.code == this.TPROC_CODE).length != 0) {
        this.TPROC_NAME = this.PRArr.filter(x => x.code == this.TPROC_CODE)[0].name
      } else {
        this.TPROC_NAME = ''
      }
    } else {
      this.TPROC_NAME = ''
    }
    this.PrcInwServ.FrmPrcInwEmpCodeFill({ DEPT_CODE: 'POI', PRC_CODE: this.TPROC_CODE }).subscribe((ERes) => {
      try {
        if (ERes.success == true) {
          this.PARTYArr = ERes.data.map((item) => {
            return {
              code: item.EMP_CODE,
              name: item.EMP_NAME,
            }
          })
          this.filteredPs = this.pCtrl.valueChanges
            .pipe(
              startWith(''),
              map(grp => grp ? this.filterPs(grp) : this.PARTYArr)
            );
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(ERes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    this.PrcInwServ.GetSubPrcMastFill({ DEPT_CODE: 'POI', SPRC_CODE: this.TPROC_CODE }).subscribe((SRes) => {
      try {
        if (SRes.success == true) {
          this.spinner.hide()
          this.SPRArr = SRes.data.map((item) => {
            return { code: item.PRC_CODE, name: item.PRC_NAME }
          })
          this.filteredTyps = this.typCtrl.valueChanges
            .pipe(
              startWith(''),
              map(grp => grp ? this.filterTyps(grp) : this.SPRArr)
            );
        } else {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(SRes.data),
          })
        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })

  }

  GETEMPNAME() {
    this.EMP_NAME = this.EMPArr.filter(x => x.code == this.EMP_CODE)[0].name
  }

  GETPARTYNAME() {
    this.PEMP_NAME = this.PARTYArr.filter(x => x.code == this.PEMP_CODE)[0].name
  }

  filterEmps(code: string) {
    return this.EMPArr.filter(grp =>
      grp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }

  filterPrcs(code: string) {
    return this.PRArr.filter(grp =>
      grp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }

  filterTyps(code: string) {
    return this.SPRArr.filter(grp =>
      grp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }

  filterPs(code: string) {
    return this.PARTYArr.filter(grp =>
      grp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
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
    this.ViewServ.PrcViewPrint({
      L_CODE: this.L_CODE,
      EMP_CODE: this.EMP_CODE,
      PEMP_CODE: this.PEMP_CODE,
      SRNO: this.SRNO ? this.SRNO : 0,
      SRNOTO: this.SRNOTO ? this.SRNOTO : 0,
      TAG: this.TAG.trim(),
      INO: this.F_SLIP ? this.F_SLIP : 0,
      INOTO: this.T_SLIP ? this.T_SLIP : 0,
      F_DATE: this.F_DATE ? this.datePipe.transform(this.F_DATE, 'yyyy-MM-dd') : '',
      T_DATE: this.T_DATE ? this.datePipe.transform(this.T_DATE, 'yyyy-MM-dd') : '',
      SELECTMODE: this.SELECTMODE,
      PNT: this.PNT,
      TPROC_CODE: this.TPROC_CODE,
      PRC_TYP: this.PRC_TYP,
      GRP: this.GRP
    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          if (Res.data.length != 0) {
            let TOTALPCS = 0
            let TOTALWEG = 0
            let TOTALSPACE = ''
            text = 'Pointer : ' + this.PNT + '\n'
            text = text + 'Party : ' + this.PEMP_CODE + '\n'
            text = text + '(' + this.datePipe.transform(Date(), 'dd/MM-hh:mm a') + ')\n'

            if (this.L_CODE != null && this.L_CODE != "") {
              text = text + "Lot : " + this.L_CODE + "\n";
            }
            if (this.SELECTMODE == "C") {
              text = text + "Process : " + "Confirm Pending\n";
            }
            if (this.SELECTMODE == "R") {
              text = text + "Process : E" + "Receive PendingF\n";
            }
            if (this.SELECTMODE == "S") {
              text = text + "Process : E" + "StockF\n";
            }
            if (this.SELECTMODE == "Rec") {
              text = text + "Process : E" + "ReceiveF\n";
            }
            if (this.EMP_CODE != null && this.EMP_CODE != "") {
              text = text + "Employee : E" + this.EMP_CODE + "F\n";
            }
            if (this.SRNO != 0) {
              text = text + "SrNo : E" + this.SRNO + "F\n";
            }
            if (this.SRNOTO != 0) {
              text = text + "SrNo To : E" + this.SRNOTO + "F\n";
            }
            if (this.TAG != null && this.TAG != "") {
              text = text + "Tag : E" + this.TAG + "F\n";
            }
            if (this.TPROC_CODE != null && this.TPROC_CODE != "") {
              text = text + "Process : E" + this.TPROC_NAME + "F\n";
            }
            if (this.PRC_TYP != null && this.PRC_TYP != "") {
              text = text + "Prc Type :E" + this.PRC_TYP + "F\n";
            }
            if (this.F_SLIP) {
              text = text + "Ino :E" + this.F_SLIP + "F\n";
            }
            if (this.T_SLIP) {
              text = text + "To Ino :E" + this.T_SLIP + "F\n";
            }
            if (this.F_DATE) {
              text = text + "Date :" + this.datePipe.transform(this.F_DATE, 'yyyy-MM-dd') + "\n";
            }
            if (this.T_DATE) {
              text = text + "Date To:" + this.datePipe.transform(this.T_DATE, 'yyyy-MM-dd') + "\n";
            }
            if (this.GRP) {
              text = text + "Group:-E" + this.GRP + "F\n";
            }
            text = text + "===============================\n"
            text = text + "Lot     Pcs    Carat\n"
            text = text + "===============================\n"
            for (var i = 0; i < Res.data.length; i++) {
              let LCODESPACE = ''
              let IPCSSPACE = ''
              for (let l = 0; l < 10 - Res.data[i].L_CODE.length; l++) {
                LCODESPACE = LCODESPACE + ' '
              }
              for (let l = 0; l < 5 - Res.data[i].IPCS.toString().length; l++) {
                IPCSSPACE = IPCSSPACE + ' '
              }

              TOTALPCS = TOTALPCS + Res.data[i].IPCS
              TOTALWEG = TOTALWEG + Res.data[i].ICRT
              text = text + Res.data[i].L_CODE + LCODESPACE + Res.data[i].IPCS + IPCSSPACE + Res.data[i].ICRT + '\n';
            }
            for (let l = 0; l < 5 - (TOTALPCS.toString()).length; l++) {
              TOTALSPACE = TOTALSPACE + ' '
            }
            text = text + "===============================\n"
            text = text + 'ETotal :   E' + TOTALPCS + TOTALSPACE + 'E' + TOTALWEG + 'F\n'
            text = text + "===============================\n"
            this.download("PRNPRCVIEW.txt", text);
          } else {
            this.toastr.warning('No data')
          }
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  CLEAR() {
    this.L_CODE = ''
    this.L_NAME = ''
    this.SRNO = 0
    this.SRNOTO = 0
    this.TAG = ''
    this.TPROC_NAME = ''
    this.TPROC_CODE = ''
    this.PRC_TYP = ''
    this.EMP_CODE = ''
    this.EMP_NAME = ''
    this.PEMP_CODE = ''
    this.PEMP_NAME = ''
    this.T_SLIP = 0
    this.F_SLIP = 0
    this.F_DATE = ''
    this.T_DATE = ''
    this.PNT = 0
    this.GRP = ''
  }

  SETFLOAT(e: any, flonum: any) {
    return parseFloat(this[e]).toFixed(flonum)
  }

  SUMMARY() {
    let text
    this.ViewServ.PrcViewDetPrint({
      L_CODE: this.L_CODE,
      EMP_CODE: this.EMP_CODE,
      PEMP_CODE: this.PEMP_CODE,
      SRNO: this.SRNO ? this.SRNO : 0,
      SRNOTO: this.SRNOTO ? this.SRNOTO : 0,
      TAG: this.TAG.trim(),
      INO: this.F_SLIP ? this.F_SLIP : 0,
      INOTO: this.T_SLIP ? this.T_SLIP : 0,
      F_DATE: this.F_DATE ? this.datePipe.transform(this.F_DATE, 'yyyy-MM-dd') : '',
      T_DATE: this.T_DATE ? this.datePipe.transform(this.T_DATE, 'yyyy-MM-dd') : '',
      SELECTMODE: this.SELECTMODE,
      PNT: this.PNT ? this.PNT : 0,
      TPROC_CODE: this.TPROC_CODE,
      PRC_TYP: this.PRC_TYP,
      GRP: this.GRP
    }).subscribe((Res) => {
      try {

        if (Res.success == true) {
          if (Res.data.length != 0) {
            let TOTALICRT = 0
            let TOTALRCRT = 0
            let TOTALLCRT = 0
            let TOTALECRT = 0
            let TOTALSCRT = 0
            text = 'Pointer : ' + this.PNT + '\n'
            text = text + 'Party : ' + this.PEMP_CODE + '\n'
            text = text + '(' + this.datePipe.transform(Date(), 'dd/MM-hh:mm a') + ')\n'

            if (this.L_CODE != null && this.L_CODE != "") {
              text = text + "Lot : " + this.L_CODE + "\n";
            }
            if (this.SELECTMODE == "C") {
              text = text + "Process : " + "Confirm Pending\n";
            }
            if (this.SELECTMODE == "R") {
              text = text + "Process : E" + "Receive PendingF\n";
            }
            if (this.SELECTMODE == "S") {
              text = text + "Process : E" + "StockF\n";
            }
            if (this.SELECTMODE == "Rec") {
              text = text + "Process : E" + "ReceiveF\n";
            }
            if (this.EMP_CODE != null && this.EMP_CODE != "") {
              text = text + "Employee : E" + this.EMP_CODE + "F\n";
            }
            if (this.SRNO != 0) {
              text = text + "SrNo : E" + this.SRNO + "F\n";
            }
            if (this.SRNOTO != 0) {
              text = text + "SrNo To : E" + this.SRNOTO + "F\n";
            }
            if (this.TAG != null && this.TAG != "") {
              text = text + "Tag : E" + this.TAG + "F\n";
            }
            if (this.TPROC_CODE != null && this.TPROC_CODE != "") {
              text = text + "Process : E" + this.TPROC_NAME + "F\n";
            }
            if (this.PRC_TYP != null && this.PRC_TYP != "") {
              text = text + "Prc Type :E" + this.PRC_TYP + "F\n";
            }
            if (this.F_SLIP) {
              text = text + "Ino :E" + this.F_SLIP + "F\n";
            }
            if (this.T_SLIP) {
              text = text + "To Ino :E" + this.T_SLIP + "F\n";
            }
            if (this.F_DATE) {
              text = text + "Date :" + this.datePipe.transform(this.F_DATE, 'yyyy-MM-dd') + "\n";
            }
            if (this.T_DATE) {
              text = text + "Date To:" + this.datePipe.transform(this.T_DATE, 'yyyy-MM-dd') + "\n";
            }
            if (this.GRP) {
              text = text + "Group:-E" + this.GRP + "F\n";
            }
            text = text + "==============================================================================================================\n"
            text = text + "LCode  SrNo Tag Emp  GRP  Prc    IDate     ITime   ICarat    RDate    RTime   RCarat   LCarat   ECarat   SCarat\n"
            text = text + "==============================================================================================================\n"
            for (var i = 0; i < Res.data.length; i++) {
              TOTALICRT = TOTALICRT + Res.data[i].ICRT
              TOTALRCRT = TOTALRCRT + Res.data[i].RCRT
              TOTALLCRT = TOTALLCRT + Res.data[i].LCRT
              TOTALECRT = TOTALECRT + Res.data[i].ECRT
              TOTALSCRT = TOTALSCRT + Res.data[i].SCRT
              text = text + Res.data[i].LCODE + this.GETSPACE(7, Res.data[i].LCODE.toString().length);
              text = text + Res.data[i].SRNO + this.GETSPACE(5, Res.data[i].SRNO.toString().length);
              text = text + Res.data[i].TAG + this.GETSPACE(4, Res.data[i].TAG.toString().length);
              text = text + Res.data[i].EMP + this.GETSPACE(5, Res.data[i].EMP.toString().length);
              text = text + Res.data[i].GR + this.GETSPACE(5, Res.data[i].GR.toString().length);
              text = text + Res.data[i].PRC + this.GETSPACE(7, Res.data[i].PRC.toString().length)
              if (Res.data[i].IDATE == null) {
                text = text + this.GETSPACE(10, 0)
              } else {
                text = text + Res.data[i].IDATE + this.GETSPACE(10, Res.data[i].IDATE.toString().length)
              }
              if (Res.data[i].ITIME == null) {
                text = text + this.GETSPACE(9, 0)
              } else {
                text = text + Res.data[i].ITIME + this.GETSPACE(9, Res.data[i].ITIME.toString().length)
              }
              text = text + Res.data[i].ICRT + this.GETSPACE(10, Res.data[i].ICRT.toString().length)
              if (Res.data[i].RDATE == null) {
                text = text + this.GETSPACE(9, 0)
              } else {
                text = text + Res.data[i].RDATE + this.GETSPACE(9, Res.data[i].RDATE.toString().length)
              }
              if (Res.data[i].RTIME == null) {
                text = text + this.GETSPACE(8, 0)
              } else {
                text = text + Res.data[i].RTIME + this.GETSPACE(8, Res.data[i].RTIME.toString().length)
              }
              text = text + Res.data[i].RCRT + this.GETSPACE(9, Res.data[i].RCRT.toString().length)
              text = text + Res.data[i].LCRT + this.GETSPACE(9, Res.data[i].LCRT.toString().length)
              text = text + Res.data[i].ECRT + this.GETSPACE(9, Res.data[i].ECRT.toString().length)
              text = text + Res.data[i].SCRT + '\n';

            }
            text = text + "==============================================================================================================\n"
            text = text + 'ETotal  :                 E               ' + Res.data.length + 'E' + this.GETSPACE(9, Res.data.length.toString().length) + TOTALICRT.toFixed(2) + 'E' + this.GETSPACE(26, TOTALICRT.toString().length) + TOTALRCRT.toFixed(2) + 'E' + this.GETSPACE(11, TOTALRCRT.toString().length) + TOTALLCRT.toFixed(2) + 'E' + this.GETSPACE(9, TOTALLCRT.toString().length) + TOTALECRT.toFixed(2) + 'E' + this.GETSPACE(8, TOTALECRT.toString().length) + TOTALSCRT.toFixed(2) + 'F' + '\n'
            text = text + "==============================================================================================================\n"
            this.download("PRNPRCDETVIEW.txt", text);
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
