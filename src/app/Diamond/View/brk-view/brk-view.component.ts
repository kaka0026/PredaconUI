import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import PerfectScrollbar from 'perfect-scrollbar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EncrDecrService } from 'src/app/Service/Common/encr-decr.service';
import { LotMastService } from 'src/app/Service/Master/lot-mast.service';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';
import { BrkEntService } from 'src/app/Service/Transaction/brk-ent.service';
import { PrcInwService } from 'src/app/Service/Transaction/prc-inw.service';
import { BrkViewService } from 'src/app/Service/View/brk-view.service';
import { PrdviewService } from 'src/app/Service/View/prdview.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { BrkViewModelComponent } from './brk-view-model/brk-view-model.component';
declare let $: any;

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
  selector: 'app-brk-view',
  templateUrl: './brk-view.component.html',
  styleUrls: ['./brk-view.component.css']
})
export class BrkViewComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem('token'));

  decodedMast = JSON.parse(this.EncrDecrServ.get(localStorage.getItem("unfam1")));

  L_CODE: any = ''
  L_CARAT: any = ''
  L_NAME: any = ''

  LOTCtrl: FormControl;
  filteredLOTs: Observable<any[]>;
  LOTs: LOTInt[] = [];

  MRKCtrl: FormControl;
  filteredMRKs: Observable<any[]>;
  MRKs: Emp[] = [];

  PRCCtrl: FormControl;
  filteredPRCs: Observable<any[]>;
  PRCs: Emp[] = [];

  PCtrl: FormControl;
  filteredPs: Observable<any[]>;
  Ps: Emp[] = [];

  RECtrl: FormControl;
  filteredREs: Observable<any[]>;
  REs: Emp[] = [];

  MCtrl: FormControl;
  filteredMs: Observable<any[]>;
  Ms: Emp[] = [];

  EMPCtrl: FormControl;
  filteredEMPs: Observable<any[]>;
  EMPs: Emp[] = [];

  HIDESAVE: boolean = true

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []
  PASSWORD: any = ''
  hide = true

  MRK_CODE: any = ''
  SRNO: any = ''
  SRNOTO: any = ''
  TDATE: any = ''
  FDATE: any = ''
  TAG: any = ''
  MRK_NAME: any = ''
  GRP: any = ''
  TPROC_NAME: any = ''
  TPROC_CODE: any = ''
  P_NAME: any = ''
  P_CODE: any = ''
  RE_NAME: any = ''
  RE_CODE: any = ''
  M_NAME: any = ''
  M_CODE: any = ''
  EMP_NAME: any = ''
  EMP_CODE: any = ''

  GridHeader = []

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public rowSelection;
  public getRowStyle;

  constructor(
    private LotMastServ: LotMastService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private EncrDecrServ: EncrDecrService,
    private _FrmOpePer: FrmOpePer,
    private PrdViewServ: PrdviewService,
    private elementRef: ElementRef,
    private datePipe: DatePipe,
    private ViewParaMastServ: ViewParaMastService,
    private BrkEntServ: BrkEntService,
    private PrcInwServ: PrcInwService,
    private BrkViewServ: BrkViewService,
    private dialog: MatDialog
  ) {
    this.LOTCtrl = new FormControl()
    this.MRKCtrl = new FormControl()
    this.PRCCtrl = new FormControl()
    this.PCtrl = new FormControl()
    this.RECtrl = new FormControl()
    this.MCtrl = new FormControl()
    this.EMPCtrl = new FormControl()
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'BrkViewDisp' }).subscribe((VPRes) => {
      try {
        if (VPRes.success == 1) {
          this.GridHeader = VPRes.data.map((item) => { return item.FIELDNAME })

          let temp = []

          for (let i = 0; i < VPRes.data.length; i++) {
            if (VPRes.data[i].COLUMNSTYLE == 'CheckBox') {
              temp.push({
                headername: VPRes.data[i].DISPNAME,
                headerclass: VPRes.data[i].HEADERALIGN,
                field: VPRes.data[i].FIELDNAME,
                width: VPRes.data[i].COLWIDTH,
                cellStyle: { 'text-align': VPRes.data[i].CELLALIGN },
                resizable: VPRes.data[i].ISRESIZE,
                hide: VPRes.data[i].DISP == false ? true : false,
                cellRenderer: (params) => {
                  if (this.PASSWORD == this.PASS) {
                    if (params.data[VPRes.data[i].FIELDNAME] == true) {
                      return '<input type="checkbox" data-action-type="' + VPRes.data[i].FIELDNAME + '" checked>';
                    } else {
                      return '<input type="checkbox" data-action-type="' + VPRes.data[i].FIELDNAME + '">';
                    }
                  } else {
                    if (params.data[VPRes.data[i].FIELDNAME] == true) {
                      return '<input type="checkbox" data-action-type="' + VPRes.data[i].FIELDNAME + '" checked disabled>';
                    } else {
                      return '<input type="checkbox" data-action-type="' + VPRes.data[i].FIELDNAME + '" disabled>';
                    }
                  }

                },
              })
            } else {
              temp.push({
                headername: VPRes.data[i].DISPNAME,
                headerclass: VPRes.data[i].HEADERALIGN,
                field: VPRes.data[i].FIELDNAME,
                width: VPRes.data[i].COLWIDTH,
                cellStyle: { 'text-align': VPRes.data[i].CELLALIGN },
                resizable: VPRes.data[i].ISRESIZE,
                hide: VPRes.data[i].DISP == false ? true : false,
              })
            }
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

            if (VPRes.data[i].FIELDNAME == "BRKCRT") {
              temp[i].cellStyle = function (params) {
                if (params.data.DEPT_CODE == 'SAW' && params.data.BRKCRT >= 0.18) {
                  return { background: '#FFA0FF' };
                }
              }
            }
          }

          this.columnDefs = temp
          temp = []
        } else {
          this.toastr.warning(VPRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    this.getRowStyle = function (params) {
      if (params.data.DEPT_CODE == 'PEL') {
        return { background: '#C0C0FF' };
      } else if (params.data.DEPT_CODE == '4P') {
        return { background: '#C0FFFF' };
      } else if (params.data.DEPT_CODE == '16P') {
        return { background: '#FFC0FF' };
      } else if (params.data.DEPT_CODE == 'RSN') {
        return { background: '#FFC0C0' };
      } else if (params.data.DEPT_CODE == 'SAW') {
        return { background: '#C0FFC0' };
      } else if (params.data.DEPT_CODE == 'POI' && params.data.PRC_CODE == 'MR') {
        return { background: '#FF531A' };
      } else if (params.data.DEPT_CODE == 'POI' && params.data.PRC_CODE == 'HC') {
        return { background: '#D1E231' };
      } else if (params.data.DEPT_CODE == 'POI' && params.data.PRC_CODE == 'CM') {
        return { background: '#FDE88D' };
      }
    };
    this.LotMastServ.LotMastFill({}).subscribe((LFRes) => {
      try {
        if (LFRes.success == true) {
          this.LOTs = LFRes.data.map((item) => {
            return { CODE: item.L_CODE, NAME: item.L_NAME.toString(), CARAT: item.L_CARAT.toString() }
          })
          this.filteredLOTs = this.LOTCtrl.valueChanges.pipe(
            startWith(""),
            map(LOT => (LOT ? this.filterLOTs(LOT) : this.LOTs.slice(0, 10)))
          );
        } else {
          this.toastr.warning(LFRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  async ngOnInit() {
    this.PER = await this._FrmOpePer.UserFrmOpePer(this.constructor.name)
    this.ALLOWDEL = this.PER[0].DEL
    this.ALLOWINS = this.PER[0].INS
    this.ALLOWUPD = this.PER[0].UPD
    this.PASS = this.PER[0].PASS

    this.PrcInwServ.InwPrcMastFill({ TYPE: 'BRK', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.PRCs = PCRes.data.map((item) => {
            return { code: item.PRC_CODE, name: item.PRC_NAME }
          })
          this.filteredPRCs = this.PRCCtrl.valueChanges.pipe(
            startWith(""),
            map(PRC => (PRC ? this.filterPRCs(PRC) : this.PRCs.slice(0, 10)))
          );
        } else {
          this.toastr.warning(JSON.stringify(PCRes.data))
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    await this.BrkEntServ.BrkEntCmbFill({
      TYPE: 'MARKER'
    }).then((Res) => {
      try {
        if (Res.success == true) {
          this.MRKs = Res.data.map((item) => {
            return { code: item.EMP_CODE, name: item.EMP_NAME }
          })
          this.filteredMRKs = this.MRKCtrl.valueChanges.pipe(
            startWith(""),
            map(MRK => (MRK ? this.filterMRKs(MRK) : this.MRKs.slice(0, 10)))
          );
        } else {

        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }
  filterLOTs(code: string) {
    return this.LOTs.filter(option => option.CODE.toLocaleLowerCase().includes(code.toLowerCase()))
  }

  filterMRKs(code: string) {
    return this.MRKs.filter(option => option.code.toLocaleLowerCase().includes(code.toLowerCase()))
  }

  GetMRKName() {
    if (this.MRK_CODE) {
      if (this.MRKs.filter(option => option.code.toLocaleLowerCase().includes(this.MRK_CODE.toLowerCase())).length != 0) {
        this.MRK_NAME = this.MRKs.filter(option => option.code.toLocaleLowerCase().includes(this.MRK_CODE.toLowerCase()))[0].name
      } else {
        this.MRK_NAME = ''
      }
    } else {
      this.MRK_NAME = ''
    }
  }

  filterPRCs(code: string) {
    return this.PRCs.filter(option => option.code.toLocaleLowerCase().includes(code.toLowerCase()))
  }

  GetPRCName() {
    if (this.TPROC_CODE) {
      if (this.PRCs.filter(option => option.code.toLocaleLowerCase().includes(this.TPROC_CODE.toLowerCase())).length != 0) {
        this.TPROC_NAME = this.PRCs.filter(option => option.code.toLocaleLowerCase().includes(this.TPROC_CODE.toLowerCase()))[0].name
      } else {
        this.TPROC_NAME = ''
      }
    } else {
      this.TPROC_NAME = ''
    }
  }

  filterPs(code: string) {
    return this.Ps.filter(option => option.code.toLocaleLowerCase().includes(code.toLowerCase()))
  }

  GetPName() {
    if (this.P_CODE) {
      if (this.Ps.filter(option => option.code.toLocaleLowerCase().includes(this.P_CODE.toLowerCase())).length != 0) {
        this.P_NAME = this.Ps.filter(option => option.code.toLocaleLowerCase().includes(this.P_CODE.toLowerCase()))[0].name
      } else {
        this.P_NAME = ''
      }
    } else {
      this.P_NAME = ''
    }
  }

  filterREs(code: string) {
    return this.REs.filter(option => option.code.toLocaleLowerCase().includes(code.toLowerCase()))
  }

  GetREName() {
    if (this.RE_CODE) {
      if (this.REs.filter(option => option.code.toLocaleLowerCase().includes(this.RE_CODE.toLowerCase())).length != 0) {
        this.RE_NAME = this.REs.filter(option => option.code.toLocaleLowerCase().includes(this.RE_CODE.toLowerCase()))[0].name
      } else {
        this.RE_NAME = ''
      }
    } else {
      this.RE_NAME = ''
    }
  }

  filterEMPs(code: string) {
    return this.EMPs.filter(option => option.code.toLocaleLowerCase().includes(code.toLowerCase()))
  }

  GetEMPName() {
    if (this.EMP_CODE) {
      if (this.EMPs.filter(option => option.code.toLocaleLowerCase().includes(this.EMP_CODE.toLowerCase())).length != 0) {
        this.EMP_NAME = this.EMPs.filter(option => option.code.toLocaleLowerCase().includes(this.EMP_CODE.toLowerCase()))[0].name
      } else {
        this.EMP_NAME = ''
      }
    } else {
      this.EMP_NAME = ''
    }
  }

  filterMs(code: string) {
    return this.Ms.filter(option => option.code.toLocaleLowerCase().includes(code.toLowerCase()))
  }

  GetMName() {
    if (this.M_CODE) {
      if (this.Ms.filter(option => option.code.toLocaleLowerCase().includes(this.M_CODE.toLowerCase())).length != 0) {
        this.M_NAME = this.Ms.filter(option => option.code.toLocaleLowerCase().includes(this.M_CODE.toLowerCase()))[0].name
      } else {
        this.M_NAME = ''
      }
    } else {
      this.M_NAME = ''
    }
  }

  onEnterLOT(evt: any) {
    if (evt.source.selected) {
      this.LOTCtrl.setValue(evt.source.value)
      this.L_CODE = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).CODE : ''
      this.L_CARAT = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).CARAT : ''
    }
  }

  keypressLOT(eve: any, e: any) {
    if (e != '') {
      let val = this.LOTs.filter(option => option.CODE.toLocaleLowerCase().includes(e.toLowerCase()));
      if (val.length != 0) {
        if (val[0].NAME != "") {
          this.L_NAME = val[0].NAME
          this.L_CARAT = val[0].CARAT
        } else {
          this.LOTCtrl.setValue('')
          this.L_CODE = ''
          this.L_NAME = ''
          this.L_CARAT = ''
        }
      } else {
        this.LOTCtrl.setValue('')
        this.L_CODE = ''
        this.L_NAME = ''
        this.L_CARAT = ''
      }
    } else {
      this.LOTCtrl.setValue('')
      this.L_CODE = ''
      this.L_NAME = ''
      this.L_CARAT = ''
    }
  }
  async GETOTHERDATA() {
    let DEPT_CODE = ''
    if (this.TPROC_CODE == 'BE' || this.TPROC_CODE == 'L' || this.TPROC_CODE == 'OT') {
      DEPT_CODE = 'SAW'
    } else if (this.TPROC_CODE == 'P') {
      DEPT_CODE = 'PEL'
    } else if (this.TPROC_CODE == '4P' || this.TPROC_CODE == 'KR') {
      DEPT_CODE = '4P'
    } else if (this.TPROC_CODE == 'RSN') {
      DEPT_CODE = 'RSN'
    } else if (this.TPROC_CODE == '16P') {
      DEPT_CODE = '16P'
    } else {
      DEPT_CODE = 'POI'
    }

    await this.BrkEntServ.BrkEntCmbFill({
      TYPE: 'PCMB',
      DEPTCODE: 'POI',
      PROCESS: this.TPROC_CODE
    }).then((Res) => {
      try {
        if (Res.success == true) {
          this.Ps = Res.data.map((item) => {
            return { code: item.EMP_CODE, name: item.EMP_NAME }
          })
          this.filteredPs = this.PCtrl.valueChanges.pipe(
            startWith(""),
            map(P => (P ? this.filterPs(P) : this.Ps.slice(0, 10)))
          );
        } else {

        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    await this.BrkEntServ.BrkEntCmbFill({
      TYPE: 'REMARK',
      PROCESS: this.TPROC_CODE
    }).then((Res) => {
      try {
        if (Res.success == true) {
          this.REs = Res.data.map((item) => {
            return { code: item.R_CODE, name: item.R_NAME }
          })
          this.filteredREs = this.RECtrl.valueChanges.pipe(
            startWith(""),
            map(RE => (RE ? this.filterREs(RE) : this.REs.slice(0, 10)))
          );
        } else {

        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    await this.BrkEntServ.BrkEntCmbFill({
      TYPE: 'MACHINE',
      PROCESS: this.TPROC_CODE,
      DEPTCODE: DEPT_CODE
    }).then((Res) => {
      try {
        if (Res.success == true) {
          this.Ms = Res.data.map((item) => {
            return { code: item.EMP_CODE, name: item.EMP_NAME }
          })
          this.filteredMs = this.MCtrl.valueChanges.pipe(
            startWith(""),
            map(M => (M ? this.filterMs(M) : this.Ms.slice(0, 10)))
          );
        } else {

        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    await this.BrkEntServ.BrkEntCmbFill({
      TYPE: 'OPERATOR',
      PROCESS: this.TPROC_CODE,
      DEPTCODE: DEPT_CODE
    }).then((Res) => {
      try {
        if (Res.success == true) {
          this.EMPs = Res.data.map((item) => {
            return { code: item.EMP_CODE, name: item.EMP_NAME }
          })
          this.filteredEMPs = this.EMPCtrl.valueChanges.pipe(
            startWith(""),
            map(EMP => (EMP ? this.filterEMPs(EMP) : this.EMPs.slice(0, 10)))
          );
        } else {

        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }
  GetLotName(name: any, carat: any) {
    this.L_NAME = name
    this.L_CARAT = carat
  }
  CHANGEPASSWORD() {
    if (this.PASSWORD == this.PASS) {
      this.HIDESAVE = false
    } else {
      this.HIDESAVE = true
    }
    this.gridApi.redrawRows();
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  LoadGridData() {
    this.BrkViewServ.BrkViewDisp({

      L_CODE: this.L_CODE,
      EMP_CODE: this.EMP_CODE,
      Srno: this.SRNO ? this.SRNO : 0,
      SrnoTo: this.SRNOTO ? this.SRNOTO : 0,
      TAG: this.TAG.trim(),
      R_CODE: this.RE_CODE ? this.RE_CODE : 0,
      TYPE: this.TPROC_CODE,
      I_DATE: this.FDATE ? this.datePipe.transform(this.FDATE, 'yyyy-MM-dd') : '',
      DateTo: this.TDATE ? this.datePipe.transform(this.TDATE, 'yyyy-MM-dd') : '',
      PEMP_CODE: this.P_CODE,
      GRP: this.GRP,
      CEMP_CODE: this.MRK_CODE,
      MEMP_CODE: this.M_CODE,
      IUSER: this.decodedTkn.UserId
    }).subscribe((Res) => {
      try {

        if (Res.success == true) {
          this.gridApi.setRowData(Res.data[0]);
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
          this.toastr.warning(Res.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  Save() {
    let GridRowData = []
    let RapSaveArr = []
    this.gridApi.forEachNode(function (rowNode, index) {
      GridRowData.push(rowNode.data);
    });
    for (let i = 0; i < GridRowData.length; i++) {

      let SaveObj = {
        L_CODE: GridRowData[i].L_CODE,
        SRNO: GridRowData[i].SRNO ? GridRowData[i].SRNO : 0,
        BTAG: GridRowData[i].BTAG,
        DETID: GridRowData[i].DETNO ? GridRowData[i].DETNO : 0,
        IS_CNF: GridRowData[i].IS_CNF == true ? true : false,
        CF_USER: this.decodedTkn.UserId,
        CF_COMP: this.decodedTkn.UserId
      }
      RapSaveArr.push(SaveObj)
    }
    this.BrkViewServ.Brkconfirm(RapSaveArr).subscribe((Res) => {
      try {
        if (Res.success == true) {
          this.toastr.success('Breaking Saved SuccessFully')
          this.LoadGridData()

        } else {
          this.toastr.warning(Res.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "IS_CNF") {
      let dataObj = eve.data;
      dataObj.IS_CNF = !dataObj.IS_CNF;
      eve.node.setData(dataObj)
      eve.api.refreshCells({ force: true })
    }
  }

  onCellDoubleClicked(eve: any) {
    const PRF = this.dialog.open(BrkViewModelComponent, { panelClass: "brk-ent-dialog", autoFocus: false, minWidth: '80vw', width: '100%', data: { L_CODE: eve.data.L_CODE, DETNO: eve.data.DETNO } })
    $("#Close").click();
    PRF.afterClosed().subscribe(result => {

    });
  }

  Print() {

  }

}
