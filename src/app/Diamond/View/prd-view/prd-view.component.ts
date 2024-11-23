import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import PerfectScrollbar from 'perfect-scrollbar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EncrDecrService } from 'src/app/Service/Common/encr-decr.service';
import { LotMastService } from 'src/app/Service/Master/lot-mast.service';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';
import { PrdviewService } from 'src/app/Service/View/prdview.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';

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
  selector: 'app-prd-view',
  templateUrl: './prd-view.component.html',
  styleUrls: ['./prd-view.component.css']
})
export class PrdViewComponent implements OnInit {
  empCtrl: FormControl;
  filteredEmps: Observable<any[]>;
  emps: Emp[] = [];

  prdCtrl: FormControl;
  filteredPrds: Observable<any[]>;
  Prds: Emp[] = [{ code: 'A', name: 'All' }, { code: 'O', name: 'Original' }, { code: 'OP', name: 'Optional' }];

  shpCtrl: FormControl;
  filteredShps: Observable<any[]>;
  Shps: Emp[] = [];

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem('token'));

  decodedMast = JSON.parse(this.EncrDecrServ.get(localStorage.getItem("unfam1")));

  L_CODE: any = ''
  L_CARAT: any = ''
  L_NAME: any = ''
  EMP_CODE: any = '';
  EMP_NAME: any = '';
  PRD_CODE: any = '';
  PRD_NAME: any = '';
  SHP_CODE: any = '';
  SHP_NAME: any = '';
  TAG: any = '';
  SRNO: any = 0;
  T_CARAT: any = 0;
  F_CARAT: any = 0;
  TYP: any = 'A';

  TOTPCS: number = 0
  ROUGH: number = 0
  FINPCS: number = 0
  FINCARAT: number = 0
  ECARAT: number = 0
  ECARATPER: any = ''
  PENPCS: number = 0
  PENCARAT: number = 0
  RATE: number = 0
  AMT: number = 0
  AVG: any = ''
  GIAPER: any = ''
  LOOSEPER: any = ''
  RPER: any = ''
  FPER: any = ''

  LOTCtrl: FormControl;
  filteredLOTs: Observable<any[]>;
  LOTs: LOTInt[] = [];

  HIDESAVE: boolean = true

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []
  PASSWORD: any = ''
  hide = true
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
    private ViewParaMastServ: ViewParaMastService
  ) {

    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'PrdviewDisp' }).subscribe((VPRes) => {
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
                  if (VPRes.data[i].FIELDNAME != 'IS_BRK') {
                    if (this.PASSWORD == this.PASS) {
                      if (params.data.PRDTYPE != 'OP') {
                        if (params.data[VPRes.data[i].FIELDNAME] == true) {
                          return '<input type="checkbox" data-action-type="' + VPRes.data[i].FIELDNAME + '" checked >';
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
                    } else {
                      if (params.data[VPRes.data[i].FIELDNAME] == true) {
                        return '<input type="checkbox" data-action-type="' + VPRes.data[i].FIELDNAME + '" checked disabled>';
                      } else {
                        return '<input type="checkbox" data-action-type="' + VPRes.data[i].FIELDNAME + '" disabled>';
                      }
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
      if (params.data.PRDTYPE == 'O' && params.data.FPLNSEL == true) {
        return { background: '#F0EA87' };
      } else if (params.data.PRDTYPE == 'O' && params.data.FPLNSEL == false) {
        return { background: '#E6ACAF' };
      }
    };

    this.LOTCtrl = new FormControl()
    this.empCtrl = new FormControl();
    this.prdCtrl = new FormControl();
    this.shpCtrl = new FormControl();

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

    this.emps = this.decodedMast[12].map(item => {
      return { code: item.EMP_CODE, name: item.EMP_NAME };
    });

    this.filteredEmps = this.empCtrl.valueChanges
      .pipe(
        startWith(''),
        map(emp => emp ? this.filterEmps(emp) : this.emps.slice(0, 10))
      );

    this.filteredPrds = this.prdCtrl.valueChanges
      .pipe(
        startWith(''),
        map(prd => prd ? this.filterPrds(prd) : this.Prds.slice(0, 10))
      );

    this.Shps = this.decodedMast[0].map(item => {
      return { code: item.S_CODE, name: item.S_NAME };
    });

    this.filteredShps = this.shpCtrl.valueChanges
      .pipe(
        startWith(''),
        map(shp => shp ? this.filterShps(shp) : this.Shps.slice(0, 10))
      );

  }
  async ngOnInit() {
    this.PER = await this._FrmOpePer.UserFrmOpePer(this.constructor.name)
    this.ALLOWDEL = this.PER[0].DEL
    this.ALLOWINS = this.PER[0].INS
    this.ALLOWUPD = this.PER[0].UPD
    this.PASS = this.PER[0].PASS
  }
  filterEmps(code: string) {
    return this.emps.filter(emp =>
      emp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
  filterShps(code: string) {
    return this.Shps.filter(shp =>
      shp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
  filterPrds(code: string) {
    return this.Prds.filter(prd =>
      prd.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  filterLOTs(code: string) {
    return this.LOTs.filter(option => option.CODE.toLocaleLowerCase().includes(code.toLowerCase()))
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
  GetLotName(name: any, carat: any) {
    this.L_NAME = name
    this.L_CARAT = carat
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
  GetPrdName() {
    if (this.PRD_CODE) {
      if (this.Prds.filter(option => option.code.toLocaleLowerCase().includes(this.PRD_CODE.toLowerCase())).length != 0) {
        this.PRD_NAME = this.Prds.filter(option => option.code.toLocaleLowerCase().includes(this.PRD_CODE.toLowerCase()))[0].name
      } else {
        this.PRD_NAME = ''
      }
    } else {
      this.PRD_NAME = ''
    }
  }
  GetShpName() {
    if (this.SHP_CODE) {
      if (this.Shps.filter(option => option.code.toLocaleLowerCase().includes(this.SHP_CODE.toLowerCase())).length != 0) {
        this.SHP_NAME = this.Shps.filter(option => option.code.toLocaleLowerCase().includes(this.SHP_CODE.toLowerCase()))[0].name
      } else {
        this.SHP_NAME = ''
      }
    } else {
      this.SHP_NAME = ''
    }
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

  LoadGridData() {
    this.PrdViewServ.PrdViewDisp({
      L_CODE: this.L_CODE,
      SRNO: this.SRNO ? this.SRNO : 0,
      TAG: this.TAG.trim(),
      EMP_CODE: this.EMP_CODE,
      PRDTYPE: this.PRD_CODE,
      PNT: this.decodedTkn.PNT ? this.decodedTkn.PNT : 0,
      TYP: this.TYP,
      F_CARAT: this.F_CARAT ? this.F_CARAT : 0,
      T_CARAT: this.T_CARAT ? this.T_CARAT : 0,
      S_CODE: this.SHP_CODE,
      GRP: this.decodedTkn.UserId
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
          this.TOTPCS = Res.data[1][0].I_PCS ? Res.data[1][0].I_PCS.toFixed(0) : 0
          this.ROUGH = Res.data[1][0].I_CARAT ? Res.data[1][0].I_CARAT.toFixed(3) : 0.000
          this.FINPCS = Res.data[1][0].FPCS ? Res.data[1][0].FPCS.toFixed(0) : 0
          this.FINCARAT = Res.data[1][0].FCRT ? Res.data[1][0].FCRT.toFixed(3) : 0.000
          this.ECARAT = Res.data[1][0].ECRT ? Res.data[1][0].ECRT.toFixed(3) : 0.000
          this.ECARATPER = ((Res.data[1][0].ECRT * 100) / Res.data[1][0].I_CARAT) ? ((Res.data[1][0].ECRT * 100) / Res.data[1][0].I_CARAT).toFixed(3) : 0.000
          this.PENPCS = Res.data[1][0].REMPCS ? Res.data[1][0].REMPCS.toFixed(0) : 0
          this.PENCARAT = Res.data[1][0].REMCRT ? Res.data[1][0].REMCRT.toFixed(3) : 0.000
          this.RATE = Res.data[1][0].RATE ? Res.data[1][0].RATE.toFixed(2) : 0.00
          this.AMT = Res.data[1][0].AMT ? Res.data[1][0].AMT.toFixed(0) : 0
          this.AVG = (Res.data[1][0].AMT / Res.data[1][0].FCRT) ? (Res.data[1][0].AMT / Res.data[1][0].FCRT).toFixed(0) : 0
          this.GIAPER = ((Res.data[1][0].GIAAMT * 100) / Res.data[1][0].AMT) ? ((Res.data[1][0].GIAAMT * 100) / Res.data[1][0].AMT).toFixed(0) : 0
          this.LOOSEPER = ((Res.data[1][0].LOOSEAMT * 100) / Res.data[1][0].AMT) ? ((Res.data[1][0].LOOSEAMT * 100) / Res.data[1][0].AMT).toFixed(0) : 0
          this.RPER = ((Res.data[1][0].RAMT * 100) / Res.data[1][0].AMT) ? ((Res.data[1][0].RAMT * 100) / Res.data[1][0].AMT).toFixed(0) : 0
          this.FPER = ((Res.data[1][0].FAMT * 100) / Res.data[1][0].AMT) ? ((Res.data[1][0].FAMT * 100) / Res.data[1][0].AMT).toFixed(0) : 0

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
    if (actionType == "PLNSEL") {
      let GridRowData = []
      this.gridApi.forEachNode(function (rowNode, index) {
        GridRowData.push(rowNode.data);
      });
      let dataObj = eve.data;
      dataObj.PLNSEL = !dataObj.PLNSEL;
      this.gridApi.forEachNode(function (rowNode, index) {
        if (rowNode.data.L_CODE == dataObj.L_CODE && rowNode.data.SRNO == dataObj.SRNO
          && rowNode.data.TAG == dataObj.TAG && rowNode.data.PRDTYPE == dataObj.PRDTYPE
          && rowNode.data.PLANNO == dataObj.PLANNO && rowNode.data.EMP_CODE == dataObj.EMP_CODE) {
          rowNode.data.PLNSEL = dataObj.PLNSEL
        } else {
          rowNode.data.PLNSEL = false
        }
        rowNode.setData(rowNode.data)
      });
    }
    if (actionType == "FPLNSEL") {
      let GridRowData = []
      this.gridApi.forEachNode(function (rowNode, index) {
        GridRowData.push(rowNode.data);
      });
      let dataObj = eve.data;
      dataObj.FPLNSEL = !dataObj.FPLNSEL;
      this.gridApi.forEachNode(function (rowNode, index) {
        if (rowNode.data.L_CODE == dataObj.L_CODE && rowNode.data.SRNO == dataObj.SRNO
          && rowNode.data.TAG == dataObj.TAG && rowNode.data.PRDTYPE == dataObj.PRDTYPE
          && rowNode.data.PLANNO == dataObj.PLANNO && rowNode.data.EMP_CODE == dataObj.EMP_CODE) {
          rowNode.data.FPLNSEL = dataObj.FPLNSEL
        } else {
          rowNode.data.FPLNSEL = false
        }
        rowNode.setData(rowNode.data)
      });
    }
    if (actionType == "ISLOCK") {
      let GridRowData = []
      this.gridApi.forEachNode(function (rowNode, index) {
        GridRowData.push(rowNode.data);
      });
      let dataObj = eve.data;
      dataObj.ISLOCK = !dataObj.ISLOCK;
      this.gridApi.forEachNode(function (rowNode, index) {
        if (rowNode.data.L_CODE == dataObj.L_CODE && rowNode.data.SRNO == dataObj.SRNO
          && rowNode.data.TAG == dataObj.TAG && rowNode.data.PRDTYPE == dataObj.PRDTYPE
          && rowNode.data.PLANNO == dataObj.PLANNO && rowNode.data.EMP_CODE == dataObj.EMP_CODE) {
          rowNode.data.ISLOCK = dataObj.ISLOCK
        } else {
          rowNode.data.ISLOCK = false
        }
        rowNode.setData(rowNode.data)
      });
    }
  }
  Save() {
    if (!this.L_CODE.trim()) {
      this.toastr.warning('Lot Is required')
      return
    }
    if (this.SRNO == '' || this.SRNO == 0 || this.SRNO == null) {
      this.toastr.warning('Srno Is required')
      return
    }
    if (!this.TAG.trim()) {
      this.toastr.warning('Tag Is required')
      return
    }
    let GridRowData = []
    let RapSaveArr = []
    this.gridApi.forEachNode(function (rowNode, index) {
      GridRowData.push(rowNode.data);
    });
    for (let i = 0; i < GridRowData.length; i++) {

      let SaveObj = {
        L_CODE: GridRowData[i].L_CODE,
        SRNO: GridRowData[i].SRNO ? GridRowData[i].SRNO : 0,
        TAG: GridRowData[i].TAG,
        PTAG: GridRowData[i].PTAG,
        PRDTYPE: GridRowData[i].PRDTYPE,
        PLANNO: GridRowData[i].PLANNO,
        EMP_CODE: GridRowData[i].EMP_CODE,
        FPLNSEL: GridRowData[i].FPLNSEL == true ? true : false,
        ISLOCK: GridRowData[i].ISLOCK == true ? true : false
      }
      RapSaveArr.push(SaveObj)
    }
    this.PrdViewServ.PrdViewSave(RapSaveArr).subscribe((Res) => {
      try {
        if (Res.success == true) {
          this.toastr.success('Prediction Saved SuccessFully')
          this.LoadGridData()

        } else {
          this.toastr.warning(Res.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }
  Print() {

  }
  SETFLOAT(e: any, flonum: any) {
    return parseFloat(this[e]).toFixed(flonum)
  }
}
