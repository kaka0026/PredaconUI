import { InnPrcIssService } from './../../../Service/Transaction/inn-prc-iss.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { isEmpty, map, startWith } from 'rxjs/operators';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";
import { JwtHelperService } from '@auth0/angular-jwt';
import * as $ from 'jquery';

import { LotMastService } from '../../../Service/Master/lot-mast.service';
import { ViewService } from 'src/app/Service/View/view.service';
import { PrcInwService } from '../../../Service/Transaction/prc-inw.service';
import { ViewParaMastService } from './../../../Service/Master/view-para-mast.service';
import PerfectScrollbar from 'perfect-scrollbar';


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
  selector: 'app-inn-pkt-view',
  templateUrl: './inn-pkt-view.component.html',
  styleUrls: ['./inn-pkt-view.component.css']
})
export class InnPktViewComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem('token'));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public rowSelection;
  public getRowStyle;

  L_CODE: any = ''
  L_NAME: any = ''
  L_CARAT: any = ''
  SRNO: any = ''
  SRNOTO: any = ''
  PNT: any = ''
  F_DATE: any = ''
  T_DATE: any = ''
  F_CARAT: any = ''
  T_CARAT: any = ''
  F_SLIP: any = ''
  T_SLIP: any = ''
  GRP: any = ''
  TAG: any = ''
  TPROC_CODE: any = ''
  PRC_CODE: any = ''
  PRC_NAME: any = ''
  EMP_CODE: any = ''
  EMP_NAME: any = ''
  M_CODE: any = ''
  M_NAME: any = ''
  P_CODE: any = ''
  P_NAME: any = ''
  innPrcIssTime: any = ''
  SELECTMODE: any = 'A'
  S_DATE: any = new Date()

  PRArr = []

  LOTCtrl: FormControl;
  filteredLOTs: Observable<any[]>;
  LOTs: LOTInt[] = [];

  prcCtrl: FormControl;
  filteredPrcs: Observable<any[]>;
  PRCArr: Emp[] = [];

  mCtrl: FormControl;
  filteredMs: Observable<any[]>;
  MANAGERArr: Emp[] = [];

  empCtrl: FormControl;
  filteredEmps: Observable<any[]>;
  EMPCODEArr: Emp[] = [];

  pCtrl: FormControl;
  filteredPrts: Observable<any[]>;
  PRTCODEArr: Emp[] = [];

  GridHeader = []

  SCARAT: number = 0
  SPKT: number = 0
  PCARAT: number = 0
  PPKT: number = 0
  RCARAT: number = 0
  RPKT: number = 0
  TCARAT: number = 0
  TPKT: number = 0
  LCARAT: number = 0

  constructor(
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private LotMastServ: LotMastService,
    private PrcInwServ: PrcInwService,
    private ViewParaMastServ: ViewParaMastService,
    private ViewServ: ViewService,
    private InnPrcIssServ: InnPrcIssService,
    private elementRef: ElementRef,
    private spinner: NgxSpinnerService,
  ) {

    this.defaultColDef = {
      resizable: true,
      sortable: true
    }

    this.getRowStyle = function (params) {
      if (params.data.PRC_CODE == 'ST') {
        if (params.data.R_DATE == null) {
          return { background: '#FFC0FF' };
        }
      } else if (params.data.R_DATE == null) {
        return { background: '#C0C0FF' };
      } else if (params.data.R_DATE != null && params.data.R_CARAT != 0) {
        return { background: '#C0FFC0' };
      }
    };

    this.rowSelection = "multiple";

  }

  ngOnInit(): void {
    this.FillViewPara()
    this.LOTCtrl = new FormControl()
    this.prcCtrl = new FormControl()
    this.mCtrl = new FormControl()
    this.empCtrl = new FormControl()
    this.pCtrl = new FormControl()

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

    this.PrcInwServ.InwPrcMastFill({ DEPT_CODE: 'POI', TYPE: 'INNER', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.PRArr = PCRes.data.map((item) => {
            return { code: item.PRC_CODE, name: item.PRC_NAME }
          })
          if (this.PRArr.length != 0 && this.PRArr[0].code) {
            this.TPROC_CODE = this.PRArr[0].code
          }
          this.FillSubPrc();
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

  LoadGridData() {
    let FillObj = {
      L_CODE: this.L_CODE,
      SRNO: this.SRNO ? this.SRNO : 0,
      SRNOTO: this.SRNOTO ? this.SRNOTO : 0,
      INO: this.F_SLIP ? this.F_SLIP : 0,
      INOTO: this.T_SLIP ? this.T_SLIP : 0,
      TAG: this.TAG.trim(),
      F_DATE: this.F_DATE ? this.datePipe.transform(this.F_DATE, 'yyyy-MM-dd') : '',
      T_DATE: this.T_DATE ? this.datePipe.transform(this.T_DATE, 'yyyy-MM-dd') : '',
      SELECTMODE: this.SELECTMODE,
      PNT: this.PNT ? this.PNT : 0,
      GRP: this.GRP ? this.GRP : '',
      DEPT_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
      M_CODE: this.M_CODE ? this.M_CODE : '',
      PEMP_CODE: this.P_CODE ? this.P_CODE : '',
      PRC_TYP: this.PRC_CODE ? this.PRC_CODE : '',
    }

    this.spinner.show()

    this.ViewServ.InnerPacketView(FillObj).subscribe((FillRes) => {
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
          this.ViewServ.InnerPacketViewTotal(FillObj).subscribe((FillRes) => {
            try {
              if (FillRes.success == true) {
                this.spinner.hide()
                this.SCARAT = FillRes.data[0].SCRT
                this.SPKT = FillRes.data[0].SPCS
                this.PCARAT = FillRes.data[0].PCRT
                this.PPKT = FillRes.data[0].PPCS
                this.RCARAT = FillRes.data[0].RCRT
                this.RPKT = FillRes.data[0].RPCS
                this.TCARAT = FillRes.data[0].ICRT
                this.TPKT = FillRes.data[0].IPCS
                this.LCARAT = FillRes.data[0].LCRT
              } else {
                this.spinner.hide()
                this.toastr.warning(FillRes.data)
              }
            } catch (error) {
              this.spinner.hide()
              this.toastr.error(error)
            }
          })
        } else {
          this.spinner.hide()
          this.toastr.warning(FillRes.data)
        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })
  }

  FillViewPara() {
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'VWFrmInnerPrcPktView' }).subscribe((VPRes) => {
      try {
        if (VPRes.success == 1) {
          this.GridHeader = VPRes.data.map((item) => { return item.FIELDNAME })

          let temp = []

          for (let i = 0; i < VPRes.data.length; i++) {
            temp.push({
              headername: VPRes.data[i].DISPNAME,
              headerclass: VPRes.data[i].HEADERALIGN,
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
              temp[i].CellRenderer = this.TimeFormat.bind(this)
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

  FillSubPrc() {
    this.spinner.show()
    this.PRC_CODE = ''
    this.M_CODE = ''
    this.PrcInwServ.InwPrcMastFill({ SDEPT_CODE: this.TPROC_CODE, DEPT_CODE: 'POI', TYPE: 'INNPRC', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.PRCArr = PCRes.data.map((item) => {
            return { code: item.PRC_CODE, name: item.PRC_NAME }
          })
          this.filterarr('filteredPrcs', 'prcCtrl', 'PRCArr');
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

  FillSubPrcName() {
    if (this.PRC_CODE) {
      if (this.PRCArr.filter(option => option.code.toLocaleLowerCase().includes(this.PRC_CODE.toLowerCase())).length != 0) {
        this.PRC_NAME = this.PRCArr.filter(option => option.code.toLocaleLowerCase().includes(this.PRC_CODE.toLowerCase()))[0].name
      } else {
        this.PRC_NAME = ''
      }
    } else {
      this.PRC_NAME = ''
    }
  }

  FillManager() {

    let FillObj = {
      DEPT_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
      PRC_CODE: this.PRC_CODE ? this.PRC_CODE : '',
      M_CODE: this.M_CODE ? this.M_CODE : '',
      EMP_CODE: this.EMP_CODE ? this.EMP_CODE : '',
      S_DATE: this.S_DATE ? this.datePipe.transform(this.S_DATE, 'yyyy-MM-dd') : '',
      S_CODE: this.innPrcIssTime ? this.innPrcIssTime : '',
      TYPE: 'MAN',
      IUSER: this.decodedTkn.UserId
    }

    this.InnPrcIssServ.InnPrcISSCmbFill(FillObj).then((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.MANAGERArr = PCRes.data.map((item) => {
            return { code: item.EMP_CODE, name: item.EMP_NAME }
          })
          this.filterarr('filteredMs', 'mCtrl', 'MANAGERArr');
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

  FillManagerName() {
    if (this.M_CODE) {
      if (this.MANAGERArr.filter(option => option.code.toLocaleLowerCase().includes(this.M_CODE.toLowerCase())).length != 0) {
        this.M_NAME = this.MANAGERArr.filter(option => option.code.toLocaleLowerCase().includes(this.M_CODE.toLowerCase()))[0].name
      } else {
        this.M_NAME = ''
      }
    } else {
      this.M_NAME = ''
    }
  }

  FillEmployee() {

    let FillObj = {
      DEPT_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
      PRC_CODE: this.PRC_CODE ? this.PRC_CODE : '',
      M_CODE: this.M_CODE ? this.M_CODE : '',
      EMP_CODE: this.EMP_CODE ? this.EMP_CODE : '',
      S_DATE: this.S_DATE ? this.datePipe.transform(this.S_DATE, 'yyyy-MM-dd') : '',
      S_CODE: this.innPrcIssTime ? this.innPrcIssTime : '',
      TYPE: 'EMP',
      IUSER: this.decodedTkn.UserId
    }

    this.InnPrcIssServ.InnPrcISSCmbFill(FillObj).then((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.EMPCODEArr = PCRes.data.map((item) => {
            return { code: item.EMP_CODE, name: item.EMP_NAME }
          })
          this.filterarr('filteredEmps', 'empCtrl', 'EMPCODEArr');
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

  FillEmployeeName() {
    if (this.EMP_CODE) {
      if (this.EMPCODEArr.filter(option => option.code.toLocaleLowerCase().includes(this.EMP_CODE.toLowerCase())).length != 0) {
        this.EMP_NAME = this.EMPCODEArr.filter(option => option.code.toLocaleLowerCase().includes(this.EMP_CODE.toLowerCase()))[0].name
      } else {
        this.EMP_NAME = ''
      }
    } else {
      this.EMP_NAME = ''
    }
  }

  FillParty() {
    this.PrcInwServ.FrmPrcInwEmpCodeFill({ DEPT_CODE: 'POI', PRC_CODE: this.TPROC_CODE }).subscribe((ERes) => {
      try {
        if (ERes.success == true) {
          this.PRTCODEArr = ERes.data.map((item) => {
            return { code: item.EMP_CODE, name: item.EMP_NAME }
          })
          this.filterarr('filteredPrts', 'pCtrl', 'PRTCODEArr');
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
  }

  FillPartyName() {
    if (this.P_CODE) {
      if (this.PRTCODEArr.filter(option => option.code.toLocaleLowerCase().includes(this.P_CODE.toLowerCase())).length != 0) {
        this.P_NAME = this.PRTCODEArr.filter(option => option.code.toLocaleLowerCase().includes(this.P_CODE.toLowerCase()))[0].name
      } else {
        this.P_NAME = ''
      }
    } else {
      this.P_NAME = ''
    }
  }

  filterarr(filteredarray: any, controlname: any, arrayname: any) {
    this[filteredarray] = this[controlname].valueChanges
      .pipe(
        startWith(''),
        map(grp => grp ? this.FinalFileterByChange(grp, arrayname) : this[arrayname])
      );
  }

  FinalFileterByChange(code: any, arrayname: any) {
    return this[arrayname].filter(grp =>
      grp.code.toString().indexOf(code) === 0);
  }

  SETFLOAT(e: any, flonum: any) {
    return parseFloat(this[e]).toFixed(flonum)
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

  keypressLOT(eve: any, e: any) {
    if (eve.keyCode == 9) {
      if (e != '') {
        let val = this.LOTs.filter(option => option.NAME.toLocaleLowerCase().includes(e.toLowerCase()));
        if (val.length != 0) {
          if (val[0].NAME != "") {
            this.LOTCtrl.setValue(val[0].CODE)
            this.L_CODE = val[0].CODE
            this.PNT = val[0].PNT
          } else {
            this.LOTCtrl.setValue('')
            this.L_CODE = ''
            this.PNT = ''
          }
        } else {
          this.LOTCtrl.setValue('')
          this.L_CODE = ''
          this.PNT = ''
        }
      } else {
        this.LOTCtrl.setValue('')
        this.L_CODE = ''
        this.PNT = ''
      }

    }
  }

  CheckLotVal(eve: any) {
    if (!eve) {
      this.LOTCtrl.setValue('')
      this.L_CODE = ''
      this.PNT = ''
    }
  }

  filterLOTs(code: string) {
    return this.LOTs.filter(option => option.NAME.toLocaleLowerCase().includes(code.toLowerCase()))
  }

  onEnterLOT(evt: any) {
    if (evt.source.selected) {
      this.LOTCtrl.setValue(evt.source.value)
      this.L_CODE = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).CODE : ''
      this.PNT = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).PNT : ''
    }
  }

  GetLotDetails(name: any, carat: any) {
    this.L_NAME = name
    this.L_CARAT = carat
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
    this.ViewServ.InnPktViewPrint({
      L_CODE: this.L_CODE,
      SRNO: this.SRNO ? this.SRNO : 0,
      SRNOTO: this.SRNOTO ? this.SRNOTO : 0,
      INO: this.F_SLIP ? this.F_SLIP : 0,
      INOTO: this.T_SLIP ? this.T_SLIP : 0,
      TAG: this.TAG.trim(),
      F_DATE: this.F_DATE ? this.datePipe.transform(this.F_DATE, 'yyyy-MM-dd') : '',
      T_DATE: this.T_DATE ? this.datePipe.transform(this.T_DATE, 'yyyy-MM-dd') : '',
      SELECTMODE: this.SELECTMODE,
      PNT: this.PNT ? this.PNT : 0,
      GRP: this.GRP,
      DEPT_CODE: this.TPROC_CODE,
      M_CODE: this.M_CODE,
      PEMP_CODE: this.P_CODE,
      PRC_TYP: this.PRC_CODE,
    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          if (Res.data.length != 0) {
            let TOTALPCS = 0
            let TOTALCARAT = 0

            text = 'Pel PacketView' + '\n'
            text = 'Pointer : ' + this.PNT + '\n'
            text = text + '(' + this.datePipe.transform(Date(), 'dd/MM-hh:mm a') + ')\n'
            if (this.L_CODE != null && this.L_CODE != "") {
              text = text + "Lot : " + this.L_CODE + "\n";
            }
            if (this.SRNO != 0) {
              text = text + "SrNo : E" + this.SRNO + "F\n"
            }
            if (this.SRNOTO != 0) {
              text = text + "SrNo To : " + this.SRNOTO + "\n"
            }
            if (this.F_SLIP != 0) {
              text = text + "INo : E" + this.F_SLIP + "F\n"
            }
            if (this.T_SLIP != 0) {
              text = text + "INo To : " + this.T_SLIP + "\n"
            }
            if (this.TAG != null && this.TAG != "") {
              text = text + "Tag : E" + this.TAG + "F\n"
            }
            if (this.F_DATE) {
              text = text + "Date :" + this.datePipe.transform(this.F_DATE, 'yyyy-MM-dd') + "\n"
            }
            if (this.T_DATE) {
              text = text + "Date To:" + this.datePipe.transform(this.T_DATE, 'yyyy-MM-dd') + "\n"
            }
            if (this.SELECTMODE == "A") {
              text = text + "Process : E" + "All" + "F\n"
            }
            if (this.SELECTMODE == "P") {
              text = text + "Process : E" + "Pending" + "F\n"
            }
            if (this.SELECTMODE == "R") {
              text = text + "Process : E" + "Recieve" + "F\n"
            }
            if (this.SELECTMODE == "S") {
              text = text + "Process : E" + "Stock" + "F\n"
            }
            if (this.GRP) {
              text = text + "Grp : " + this.GRP + "F\n";
            }
            if (this.TPROC_CODE) {
              text = text + "Dept. Code : " + this.TPROC_CODE + "F\n";
            }
            if (this.M_CODE) {
              text = text + "M Code : " + this.M_CODE + "F\n";
            }
            if (this.P_CODE) {
              text = text + "PEMP Code : " + this.P_CODE + "F\n";
            }
            if (this.PRC_CODE) {
              text = text + "Prc Typ : " + this.PRC_CODE + "F\n";
            }

            text = text + "=======================\n"
            text = text + "Lot        Pcs    Carat\n"
            text = text + "=======================\n"

            for (var i = 0; i < Res.data.length; i++) {

              TOTALPCS = TOTALPCS + Res.data[i].IPcs
              TOTALCARAT = TOTALCARAT + Res.data[i].ICrt
              text = text + Res.data[i].L_CODE + this.GETSPACE(11, Res.data[i].L_CODE.toString().length) + Res.data[i].IPcs + this.GETSPACE(7, Res.data[i].IPcs.toString().length) + Res.data[i].ICrt + '\n';
            }

            text = text + "=======================\n"
            text = text + 'ETotal  : E  ' + TOTALPCS + this.GETSPACE(7, TOTALPCS.toString().length) + 'E' + TOTALCARAT + this.GETSPACE(10, TOTALCARAT.toString().length) + 'F\n'
            text = text + "=======================\n"
            this.download("PRNINNPKTVIEW.txt", text);
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
