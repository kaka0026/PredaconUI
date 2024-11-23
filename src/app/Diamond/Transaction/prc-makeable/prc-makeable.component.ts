import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DatePipe } from "@angular/common";

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";
import * as $ from 'jquery';

import { JwtHelperService } from '@auth0/angular-jwt';
import { EncrDecrService } from 'src/app/Service/Common/encr-decr.service';
import { PrcMakeableService } from '../../../Service/Transaction/prc-makeable.service';
import { RapCalcService } from 'src/app/Service/Rap/rap-calc.service';
import { RapMastService } from 'src/app/Service/Rap/rap-mast.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import PerfectScrollbar from 'perfect-scrollbar';

export interface LOTInt {
  code: string;
  name: string;
  carat: string
}

export interface Emp {
  code: string;
  name: string;
}

@Component({
  selector: 'app-prc-makeable',
  templateUrl: './prc-makeable.component.html',
  styleUrls: ['./prc-makeable.component.css']
})
export class PrcMakeableComponent implements OnInit {

  autoHIDE: boolean = false

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));
  decodedMast = JSON.parse(this.EncrDecrServ.get(localStorage.getItem("unfam1")));

  lotArray = []

  L_CODE: any = ''
  L_NAME: any = ''
  L_CARAT: any = ''
  RATE: any = ''
  AMOUNT: any = ''
  TIME: any = this.datepipe.transform(new Date(), 'HH:mm')
  PCS: any = ''
  CARAT: any = ''
  M_CARAT: any = ''
  VERSION: any = ''
  EXP: any = ''
  S_CODE: any = ''
  S_NAME: any = ''
  Q_CODE: any = ''
  Q_NAME: any = ''
  C_CODE: any = ''
  C_NAME: any = ''
  CT_CODE: any = ''
  CT_NAME: any = ''
  PL_CODE: any = ''
  PL_NAME: any = ''
  SYM_CODE: any = ''
  SYM_NAME: any = ''
  FL_CODE: any = ''
  FL_SHORTNAME: any = ''
  SH_CODE: any = ''
  TYP: any = ''
  RAPTYPE: any = ''
  SH_NAME: any = ''
  CO_CODE: any = ''
  CO_NAME: any = ''
  CU_CODE: any = ''
  CU_NAME: any = ''
  EF_CODE: any = ''
  EF_NAME: any = ''
  EC_CODE: any = ''
  EC_NAME: any = ''
  GO_CODE: any = ''
  GO_NAME: any = ''
  GRN_CODE: any = ''
  GRN_NAME: any = ''
  LSTR_CODE: any = ''
  LSTR_NAME: any = ''
  MLK_CODE: any = ''
  MLK_NAME: any = ''
  NAT_CODE: any = ''
  NAT_NAME: any = ''
  PO_CODE: any = ''
  PO_NAME: any = ''
  SD_CODE: any = ''
  SD_NAME: any = ''
  SB_CODE: any = ''
  SB_NAME: any = ''
  SO_CODE: any = ''
  SO_NAME: any = ''
  TAB_CODE: any = ''
  TAB_NAME: any = ''
  TB_CODE: any = ''
  TB_NAME: any = ''
  TO_CODE: any = ''
  TO_NAME: any = ''
  REG_CODE: any = ''
  REG_NAME: any = ''
  RS_CODE: any = ''
  RS_NAME: any = ''

  RATIO_CODE: any = ''
  TABLE_CODE: any = ''
  DIAMETER_CODE: any = ''
  DEPTH_CODE: any = ''
  RATIO_NAME: any = ''
  TABLE_NAME: any = ''
  DIAMETER_NAME: any = ''
  DEPTH_NAME: any = ''
  RAPARR: any = ''

  DATE: any = new Date()

  SRNO: Number = 0
  TAG: any = ''
  DETNO: any = ''

  RAPTArray = []

  rapArray = []

  shpCtrl: FormControl;
  filteredShps: Observable<any[]>;
  shapeArray: Emp[] = [];

  dptCtrl: FormControl;
  filteredDpts: Observable<any[]>;
  deptharray: Emp[] = [];

  diaCtrl: FormControl;
  filteredDias: Observable<any[]>;
  diameterarray: Emp[] = [];

  tableCtrl: FormControl;
  filteredTables: Observable<any[]>;
  tablearray: Emp[] = [];

  ratioCtrl: FormControl;
  filteredRatios: Observable<any[]>;
  ratioarray: Emp[] = [];

  quaCtrl: FormControl;
  filteredQuas: Observable<any[]>;
  clarityArray: Emp[] = [];

  colCtrl: FormControl;
  filteredCols: Observable<any[]>;
  colorArray: Emp[] = [];

  cutCtrl1: FormControl;
  filteredCuts1: Observable<any[]>;
  cutArray1: Emp[] = [];

  cutCtrl2: FormControl;
  filteredCuts2: Observable<any[]>;
  cutArray2: Emp[] = [];

  cutCtrl3: FormControl;
  filteredCuts3: Observable<any[]>;
  cutArray3: Emp[] = [];

  floCtrl: FormControl;
  filteredFlos: Observable<any[]>;
  floArray: Emp[] = [];

  shdCtrl: FormControl;
  filteredShds: Observable<any[]>;
  shdArray: Emp[] = [];

  croCtrl: FormControl;
  filteredCrOs: Observable<any[]>;
  crownOpenArray: Emp[] = [];

  culCtrl: FormControl;
  filteredCuls: Observable<any[]>;
  culetArray: Emp[] = [];

  exfCtrl: FormControl;
  filteredExFs: Observable<any[]>;
  extraFacetArray: Emp[] = [];

  eycCtrl: FormControl;
  filteredEycs: Observable<any[]>;
  eyeCleanArray: Emp[] = [];

  groCtrl: FormControl;
  filteredGrOs: Observable<any[]>;
  gridleOpenArray: Emp[] = [];

  grnCtrl: FormControl;
  filteredGrns: Observable<any[]>;
  grainingArray: Emp[] = [];

  luCtrl: FormControl;
  filteredLus: Observable<any[]>;
  lusterArray: Emp[] = [];

  mlCtrl: FormControl;
  filteredMls: Observable<any[]>;
  milkyArray: Emp[] = [];

  naCtrl: FormControl;
  filteredNas: Observable<any[]>;
  naturalArray: Emp[] = [];

  poCtrl: FormControl;
  filteredPOs: Observable<any[]>;
  pavOpenArray: Emp[] = [];

  sideCtrl: FormControl;
  filteredSides: Observable<any[]>;
  sideArray: Emp[] = [];

  sbCtrl: FormControl;
  filteredSBs: Observable<any[]>;
  sideBlackArray: Emp[] = [];

  soCtrl: FormControl;
  filteredSOs: Observable<any[]>;
  sideOpenArray: Emp[] = [];

  tabCtrl: FormControl;
  filteredTabs: Observable<any[]>;
  tableArray: Emp[] = [];

  tbCtrl: FormControl;
  filteredTBs: Observable<any[]>;
  tableBlackArray: Emp[] = [];

  toCtrl: FormControl;
  filteredTOs: Observable<any[]>;
  tableOpenArray: Emp[] = [];

  regCtrl: FormControl;
  filteredRegs: Observable<any[]>;
  regularArray: Emp[] = [];

  rsCtrl: FormControl;
  filteredRSs: Observable<any[]>;
  redSpotArray: Emp[] = [];

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  LOTCtrl: FormControl;
  filteredLOTs: Observable<any[]>;
  LOTs: LOTInt[] = [];

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private EncrDecrServ: EncrDecrService,
    private PrcMakeableServ: PrcMakeableService,
    private RapCalcServ: RapCalcService,
    private RapMastServ: RapMastService,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef
  ) {
    this.LOTCtrl = new FormControl();
    this.shpCtrl = new FormControl();
    this.dptCtrl = new FormControl();
    this.diaCtrl = new FormControl();
    this.tableCtrl = new FormControl();
    this.ratioCtrl = new FormControl();
    this.quaCtrl = new FormControl();
    this.colCtrl = new FormControl();
    this.cutCtrl1 = new FormControl();
    this.cutCtrl2 = new FormControl();
    this.cutCtrl3 = new FormControl();
    this.floCtrl = new FormControl();
    this.shdCtrl = new FormControl();
    this.croCtrl = new FormControl();
    this.culCtrl = new FormControl();
    this.exfCtrl = new FormControl();
    this.eycCtrl = new FormControl();
    this.groCtrl = new FormControl();
    this.grnCtrl = new FormControl();
    this.luCtrl = new FormControl();
    this.mlCtrl = new FormControl();
    this.poCtrl = new FormControl();
    this.naCtrl = new FormControl();
    this.sideCtrl = new FormControl();
    this.sbCtrl = new FormControl();
    this.soCtrl = new FormControl();
    this.tabCtrl = new FormControl();
    this.tbCtrl = new FormControl();
    this.toCtrl = new FormControl();
    this.regCtrl = new FormControl();
    this.rsCtrl = new FormControl();

    this.columnDefs = [
      {
        headerName: 'Descr',
        field: 'DESCR',
        width: 100,
        cellStyle: { 'text-align': 'left' },
        headerClass: "text-center"
      },
      {
        headerName: '%',
        field: 'PER',
        width: 70,
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (!params.value) { params.value = 0; }
          return '<p>' + (params.value).toFixed(2) + '</p>';
        },
      },
      {
        headerName: 'Amt',
        field: 'AMT',
        width: 80,
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (!params.value) { params.value = 0; }
          return '<p>' + (params.value).toFixed(2) + '</p>';
        },
      },
    ]
    this.defaultColDef = {
      resizable: true,
      sortable: true
    }

    this.RapMastServ.RapTypeFill({ TYPE: "RAP", TABNAME: "" }).subscribe(rapres => {
      try {
        if (rapres.success == true) {
          this.RAPTArray = rapres.data.map(item => {
            return { code: item.RAPTYPE, name: item.RAPNAME };
          });
          this.RAPTYPE = rapres.data[0].RAPTYPE
        } else {
          this.spinner.hide();
          this.toastr.warning('Something gone wrong while get shape');
        }
      } catch (error) {
        this.spinner.hide();
        this.toastr.error(error);
      }
    });
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

  async ngOnInit() {
    this.PER = await this._FrmOpePer.UserFrmOpePer(this.constructor.name)
    this.ALLOWDEL = this.PER[0].DEL
    this.ALLOWINS = this.PER[0].INS
    this.ALLOWUPD = this.PER[0].UPD
    this.PASS = this.PER[0].PASS

    this.lotFill();

    this.shapeArray = this.decodedMast[0].map(item => {
      return { code: item.S_CODE.toString(), name: item.S_NAME };
    });

    this.filterarr('filteredShps', 'shpCtrl', 'shapeArray');

    this.clarityArray = this.decodedMast[4].map(item => {
      return { code: item.Q_CODE.toString(), name: item.Q_NAME };
    });

    this.filterarr('filteredQuas', 'quaCtrl', 'clarityArray');

    this.colorArray = this.decodedMast[3].map(item => {
      return { code: item.C_CODE.toString(), name: item.C_NAME };
    });

    this.filterarr('filteredCols', 'colCtrl', 'colorArray');

    this.cutArray1 = this.decodedMast[5].map(item => {
      return { code: item.CT_CODE.toString(), name: item.CT_NAME };
    });

    this.filterarr('filteredCuts1', 'cutCtrl1', 'cutArray1');

    this.cutArray2 = this.decodedMast[5].map(item => {
      return { code: item.CT_CODE.toString(), name: item.CT_NAME };
    });

    this.filterarr('filteredCuts2', 'cutCtrl2', 'cutArray2');

    this.cutArray3 = this.decodedMast[5].map(item => {
      return { code: item.CT_CODE.toString(), name: item.CT_NAME };
    });

    this.filterarr('filteredCuts3', 'cutCtrl3', 'cutArray3');
    this.floArray = this.decodedMast[6].map(item => {
      return { code: item.FL_CODE.toString(), name: item.FL_SHORTNAME };
    });

    this.filterarr('filteredFlos', 'floCtrl', 'floArray');

    this.shdArray = this.decodedMast[19].map(item => {
      return { code: item.SH_CODE.toString(), name: item.SH_NAME };
    });

    this.filterarr('filteredShds', 'shdCtrl', 'shdArray');

    this.crownOpenArray = this.decodedMast[20].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredCrOs', 'croCtrl', 'crownOpenArray');

    this.culetArray = this.decodedMast[21].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredCuls', 'culCtrl', 'culetArray');

    this.extraFacetArray = this.decodedMast[22].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredExFs', 'exfCtrl', 'extraFacetArray');

    this.eyeCleanArray = this.decodedMast[23].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredEycs', 'eycCtrl', 'eyeCleanArray');

    this.gridleOpenArray = this.decodedMast[24].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredGrOs', 'groCtrl', 'gridleOpenArray');

    this.grainingArray = this.decodedMast[25].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredGrns', 'grnCtrl', 'grainingArray');

    this.lusterArray = this.decodedMast[26].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredLus', 'luCtrl', 'lusterArray');

    this.milkyArray = this.decodedMast[27].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredMls', 'mlCtrl', 'milkyArray');
    this.naturalArray = this.decodedMast[28].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredNas', 'naCtrl', 'naturalArray');

    this.pavOpenArray = this.decodedMast[29].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredPOs', 'poCtrl', 'pavOpenArray');

    this.sideArray = this.decodedMast[30].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredSides', 'sideCtrl', 'sideArray');

    this.sideBlackArray = this.decodedMast[31].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredSBs', 'sbCtrl', 'sideBlackArray');

    this.sideOpenArray = this.decodedMast[32].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredSOs', 'soCtrl', 'sideOpenArray');

    this.tableArray = this.decodedMast[33].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredTabs', 'tabCtrl', 'tableArray');

    this.tableBlackArray = this.decodedMast[34].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredTBs', 'tbCtrl', 'tableBlackArray');

    this.tableOpenArray = this.decodedMast[35].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredTOs', 'toCtrl', 'tableOpenArray');

    this.regularArray = this.decodedMast[37].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredRegs', 'regCtrl', 'regularArray');

    this.redSpotArray = this.decodedMast[38].map(item => {
      return { code: item.I_CODE.toString(), name: item.I_SHORTNAME };
    });

    this.filterarr('filteredRSs', 'rsCtrl', 'redSpotArray');

    this.rapArray = this.decodedMast[16].filter(x => x.ISACTIVE == true)
    this.rapArray = this.rapArray.map(item => {
      return { name: item.RAPNAME };
    });
    this.RAPARR = this.rapArray[0].name

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

  async GETANOTHERARR(e: any) {
    let depth = this.decodedMast[40].filter(x => x.PARAM_NAME == 'DEPTH' && x.S_CODE == e)
    this.deptharray = depth.map(item => {
      return { code: item.PARAM_CODE.toString(), name: '' + item.FMETER + '' + ' - ' + '' + item.TMETER + '' };
    });
    this.filterarr('filteredDpts', 'dptCtrl', 'deptharray');
    let ratio = this.decodedMast[40].filter(x => x.PARAM_NAME == 'RATIO' && x.S_CODE == e)
    this.ratioarray = ratio.map(item => {
      return { code: item.PARAM_CODE.toString(), name: '' + item.FMETER + '' + ' - ' + '' + item.TMETER + '' };
    });
    this.filterarr('filteredRatios', 'ratioCtrl', 'ratioarray');
    let diameter = this.decodedMast[40].filter(x => x.PARAM_NAME == 'DIAMETER' && x.S_CODE == e)
    this.diameterarray = diameter.map(item => {
      return { code: item.PARAM_CODE.toString(), name: '' + item.FMETER + '' + ' - ' + '' + item.TMETER + '' };
    });
    this.filterarr('filteredDias', 'diaCtrl', 'diameterarray');
    let table = this.decodedMast[40].filter(x => x.PARAM_NAME == 'TABLE' && x.S_CODE == e)
    this.tablearray = table.map(item => {
      return { code: item.PARAM_CODE.toString(), name: '' + item.FMETER + '' + ' - ' + '' + item.TMETER + '' };
    });
    this.filterarr('filteredTables', 'tableCtrl', 'tablearray');
  }

  lotFill() {
    this.LOTs = this.decodedMast[14].map(item => {
      return { code: item.L_CODE, name: item.L_NAME, carat: item.L_CARAT };
    })
    this.filteredLOTs = this.LOTCtrl.valueChanges.pipe(
      startWith(""),
      map(LOT => (LOT ? this.filterLOTs(LOT) : this.LOTs.slice(0, 10)))
    );
  }

  filterLOTs(code: string) {
    return this.LOTs.filter(option => option.code.toLocaleLowerCase().includes(code.toLowerCase()))
  }

  onEnterLOT(evt: any) {
    if (evt.source.selected) {
      this.LOTCtrl.setValue(evt.source.value)
      this.L_NAME = this.LOTs.find(option => option.code == evt.source.value) ? this.LOTs.find(option => option.code == evt.source.value).name : ''
      this.L_CARAT = this.LOTs.find(option => option.code == evt.source.value) ? this.LOTs.find(option => option.code == evt.source.value).carat : ''
    }
  }

  async getName(e, par, name) {
    if (e != 0) {
      this[par] = name.filter(x => x.code == e)[0].name;
    } else {
      this[par] = ''
    }
    // await this.findrap()
  }

  async Tagvalidation() {
    await this.PrcMakeableServ.PrcMakTagCheck({ L_CODE: this.L_CODE, SRNO: this.SRNO, TAG: this.TAG, FRM_NAME: 'PrcMakeableComponent' }).then(async (SaveRes) => {
      this.spinner.hide()
      try {
        if (SaveRes.success == true) {
          if (SaveRes.data[''] == 'TRUE') {

            await this.PrcMakeableServ.FrmPrcMakDisp({ L_CODE: this.L_CODE, SRNO: this.SRNO, TAG: this.TAG }).then(async (SaveRes) => {
              this.spinner.hide()
              try {
                if (SaveRes.success == true) {
                  this.DATE = SaveRes.data[0].R_DATE
                  this.TIME = this.datepipe.transform(SaveRes.data[0].R_TIME, 'hh:mm a', 'UTC+0')
                  this.PCS = SaveRes.data[0].I_PCS
                  this.CARAT = SaveRes.data[0].R_CARAT
                  this.M_CARAT = SaveRes.data[0].M_CARAT
                  this.EXP = SaveRes.data[0].CARAT
                  this.S_CODE = SaveRes.data[0].S_CODE
                  this.getName(this.S_CODE, 'S_NAME', this.shapeArray)
                  await this.GETANOTHERARR(this.S_CODE)
                  this.CO_CODE = SaveRes.data[0].CROWN_OPEN
                  this.getName(this.CO_CODE, 'CO_NAME', this.crownOpenArray)
                  this.PO_CODE = SaveRes.data[0].PAV_OPEN
                  this.getName(this.PO_CODE, 'PO_NAME', this.pavOpenArray)
                  this.Q_CODE = SaveRes.data[0].Q_CODE
                  this.getName(this.Q_CODE, 'Q_NAME', this.clarityArray)
                  this.CU_CODE = SaveRes.data[0].CULET
                  this.getName(this.CU_CODE, 'CU_NAME', this.culetArray)
                  this.SD_CODE = SaveRes.data[0].SIDE
                  this.getName(this.SD_CODE, 'SD_NAME', this.sideArray)
                  this.C_CODE = SaveRes.data[0].C_CODE
                  this.getName(this.C_CODE, 'C_NAME', this.colorArray)
                  this.EF_CODE = SaveRes.data[0].EXTFACET
                  this.getName(this.EF_CODE, 'EF_NAME', this.extraFacetArray)
                  this.SB_CODE = SaveRes.data[0].SIDE_BLACK
                  this.getName(this.SB_CODE, 'SB_NAME', this.sideBlackArray)
                  this.CT_CODE = SaveRes.data[0].CUT_CODE
                  this.getName(this.CT_CODE, 'CT_NAME', this.cutArray1)
                  this.EC_CODE = SaveRes.data[0].EYECLEAN
                  this.getName(this.EC_CODE, 'EC_NAME', this.eyeCleanArray)
                  this.SO_CODE = SaveRes.data[0].SIDE_OPEN
                  this.getName(this.SO_CODE, 'SO_NAME', this.sideOpenArray)
                  this.PL_CODE = SaveRes.data[0].POL_CODE
                  this.getName(this.PL_CODE, 'PL_NAME', this.cutArray2)
                  this.GO_CODE = SaveRes.data[0].GIRDLE_OPEN
                  this.getName(this.GO_CODE, 'GO_NAME', this.gridleOpenArray)
                  this.TAB_CODE = SaveRes.data[0].TAB
                  this.getName(this.TAB_CODE, 'TAB_NAME', this.tableArray)
                  this.SYM_CODE = SaveRes.data[0].SYM_CODE
                  this.getName(this.SYM_CODE, 'SYM_NAME', this.cutArray3)
                  this.GRN_CODE = SaveRes.data[0].GRAINING
                  this.getName(this.GRN_CODE, 'GRN_NAME', this.grainingArray)
                  this.TB_CODE = SaveRes.data[0].TABLE_BLACK
                  this.getName(this.TB_CODE, 'TB_NAME', this.tableBlackArray)
                  this.FL_CODE = SaveRes.data[0].FL_CODE
                  this.getName(this.FL_CODE, 'FL_NAME', this.floArray)
                  this.LSTR_CODE = SaveRes.data[0].LUSTER
                  this.getName(this.LSTR_CODE, 'LSTR_NAME', this.lusterArray)
                  this.TO_CODE = SaveRes.data[0].TABLE_OPEN
                  this.getName(this.TO_CODE, 'TO_NAME', this.tableOpenArray)
                  this.SH_CODE = SaveRes.data[0].SH_CODE
                  this.getName(this.SH_CODE, 'SH_NAME', this.shdArray)
                  this.MLK_CODE = SaveRes.data[0].PRDMILKY
                  this.getName(this.MLK_CODE, 'MLK_NAME', this.milkyArray)
                  this.NAT_CODE = SaveRes.data[0].NATURAL
                  this.getName(this.NAT_CODE, 'NAT_NAME', this.naturalArray)
                  this.REG_CODE = SaveRes.data[0].IN_CODE
                  this.getName(this.REG_CODE, 'REG_NAME', this.regularArray)
                  this.RS_CODE = SaveRes.data[0].REDSPOT
                  this.getName(this.RS_CODE, 'RS_NAME', this.redSpotArray)
                  this.DEPTH_CODE = SaveRes.data[0].DEPTH
                  this.getName(this.DEPTH_CODE, 'DEPTH_NAME', this.deptharray)
                  this.RATIO_CODE = SaveRes.data[0].RATIO
                  this.getName(this.RATIO_CODE, 'RATIO_NAME', this.ratioarray)
                  this.DIAMETER_CODE = SaveRes.data[0].DIA_CODE
                  this.getName(this.DIAMETER_CODE, 'DIAMETER_NAME', this.diameterarray)
                  this.TABLE_CODE = SaveRes.data[0].TABCODE
                  this.getName(this.TABLE_CODE, 'TABLE_NAME', this.tablearray)
                  this.RAPTYPE = SaveRes.data[0].RAPTYPE
                  await this.findrap()
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went Wrong :' + JSON.stringify(SaveRes.data)
                  });
                }
              } catch (error) {
                this.toastr.error(error)
              }
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: SaveRes.data['']
            });
            this.L_CODE = ''
            this.SRNO = 0
            this.TAG = ''
            $('#lcode').focus()
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went Wrong :' + JSON.stringify(SaveRes.data)
          });
          this.L_CODE = ''
          this.SRNO = 0
          this.TAG = ''
          $('#lcode').focus()
        }
      } catch (error) {
        this.toastr.error(error)
        this.L_CODE = ''
        this.SRNO = 0
        this.TAG = ''
        $('#lcode').focus()
      }
    })
  }

  async findrap() {

    if (!this.EXP) {
      $('#exp').focus()
      this.toastr.clear()
      this.toastr.warning("Exp Carat is required")
      return
    } else if (!this.S_CODE) {
      $('#shp').focus()
      this.toastr.clear()
      this.toastr.warning("Shape is required")
      return
    } else if (!this.Q_CODE) {
      $('#qua').focus()
      this.toastr.clear()
      this.toastr.warning("Clarity is required")
      return
    } else if (!this.C_CODE) {
      $('#col').focus()
      this.toastr.clear()
      this.toastr.warning("Color is required")
      return
    } else if (!this.CT_CODE) {
      $('#cut').focus()
      this.toastr.clear()
      this.toastr.warning("Cut is required")
      return
    } else if (!this.PL_CODE) {
      $('#pol').focus()
      this.toastr.clear()
      this.toastr.warning("Polish is required")
      return
    } else if (!this.SYM_CODE) {
      $('#sym').focus()
      this.toastr.clear()
      this.toastr.warning("Sym is required")
      return
    } else if (!this.FL_CODE) {
      $('#flo').focus()
      this.toastr.clear()
      this.toastr.warning("Flo is required")
      return
    }

    await this.RapCalcServ.FindRap(
      {
        S_CODE: this.S_CODE,
        Q_CODE: this.Q_CODE,
        C_CODE: this.C_CODE,
        CARAT: this.EXP,
        CUT_CODE: this.CT_CODE,
        POL_CODE: this.PL_CODE,
        SYM_CODE: this.SYM_CODE,
        FL_CODE: this.FL_CODE,
        IN_CODE: this.REG_CODE,
        SH_CODE: this.SH_CODE,
        TABLE: this.TAB_CODE,
        TABLE_BLACK: this.TB_CODE,
        TABLE_OPEN: this.TO_CODE,
        SIDE: this.SD_CODE,
        SIDE_BLACK: this.SB_CODE,
        SIDE_OPEN: this.SO_CODE,
        CROWN_OPEN: this.CO_CODE,
        GIRDLE_OPEN: this.GO_CODE,
        PAV_OPEN: this.PO_CODE,
        CULET: this.CU_CODE,
        EXTFACET: this.EF_CODE,
        EYECLAEN: this.EC_CODE,
        GRAINING: this.GRN_CODE,
        LUSTER: this.LSTR_CODE,
        MILKY: this.MLK_CODE,
        NATURAL: this.NAT_CODE,
        REDSPOT: this.RS_CODE,
        V_CODE: 0,
        RAPTYPE: this.RAPTYPE,
        DIA: this.DIAMETER_CODE,
        DEPTH: this.DEPTH_CODE,
        RATIO: this.RATIO_CODE,
        TAB: this.TABLE_CODE
      }
    ).then((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.RATE = PCRes.data[1][0][''] == null ? 0 : (PCRes.data[1][0]['']).toFixed(0)
          this.AMOUNT = PCRes.data[1][0][''] == null ? 0 : (PCRes.data[1][0][''] * this.EXP).toFixed(0)
          this.TYP = PCRes.data[2][0]['']
          this.gridApi.setRowData(PCRes.data[0]);
          if (PCRes.data[2][0][''] == 'S') {
            this.RAPARR = 'GIA'
            this.gridApi.setRowData(PCRes.data[3]);
          } else {
            this.RAPARR = 'LOOSE'
            this.gridApi.setRowData(PCRes.data[5]);
          }
        } else {
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  SAVE() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
    if (!this.EXP) {
      $('#exp').focus()
      this.toastr.clear()
      this.toastr.warning("Exp Carat is required")
      return
    } else if (!this.S_CODE) {
      $('#shp').focus()
      this.toastr.clear()
      this.toastr.warning("Shape is required")
      return
    } else if (!this.Q_CODE) {
      $('#qua').focus()
      this.toastr.clear()
      this.toastr.warning("Clarity is required")
      return
    } else if (!this.C_CODE) {
      $('#col').focus()
      this.toastr.clear()
      this.toastr.warning("Color is required")
      return
    } else if (!this.CT_CODE) {
      $('#cut').focus()
      this.toastr.clear()
      this.toastr.warning("Cut is required")
      return
    } else if (!this.PL_CODE) {
      $('#pol').focus()
      this.toastr.clear()
      this.toastr.warning("Polish is required")
      return
    } else if (!this.SYM_CODE) {
      $('#sym').focus()
      this.toastr.clear()
      this.toastr.warning("Sym is required")
      return
    } else if (!this.FL_CODE) {
      $('#flo').focus()
      this.toastr.clear()
      this.toastr.warning("Flo is required")
      return
    }
    this.PrcMakeableServ.FrmPrcMakSaveData({
      L_CODE: this.L_CODE,
      SRNO: this.SRNO,
      TAG: this.TAG.trim(),
      Q_CODE: this.Q_CODE,
      C_CODE: this.C_CODE,
      CUT_CODE: this.CT_CODE,
      CARAT: this.EXP,
      S_CODE: this.S_CODE,
      FL_CODE: this.FL_CODE,
      RATE: this.RATE,
      FRM_NAME: 'PrcMakeableComponent'
    }).subscribe((SaveRes) => {
      this.spinner.hide()
      try {
        if (SaveRes.success == true) {
          if (SaveRes.data == 'TRUE') {
            this.PrcMakeableServ.FrmPrcMakEntSave({
              L_CODE: this.L_CODE,
              SRNO: this.SRNO,
              TAG: this.TAG.trim(),
              I_CARAT: this.CARAT,
              I_PCS: this.PCS,
              IUSER: this.decodedTkn.UserId,
              ICOMP: this.decodedTkn.UserId,
              S_CODE: this.S_CODE,
              Q_CODE: this.Q_CODE,
              C_CODE: this.C_CODE,
              CARAT: this.EXP,
              CUT_CODE: this.CT_CODE,
              POL_CODE: this.PL_CODE,
              SYM_CODE: this.SYM_CODE,
              FL_CODE: this.FL_CODE,
              IN_CODE: this.REG_CODE,
              SH_CODE: this.SH_CODE,
              TABLE: this.TAB_CODE,
              TABLE_BLACK: this.TB_CODE,
              TABLE_OPEN: this.TO_CODE,
              SIDE: this.SD_CODE,
              SIDE_BLACK: this.SB_CODE,
              SIDE_OPEN: this.SO_CODE,
              CROWN_OPEN: this.CO_CODE,
              GIRDLE_OPEN: this.GO_CODE,
              PAV_OPEN: this.PO_CODE,
              CULET: this.CU_CODE,
              EXTFACET: this.EF_CODE,
              EYECLEAN: this.EC_CODE,
              GRAINING: this.GRN_CODE,
              LUSTER: this.LSTR_CODE,
              MILKY: this.MLK_CODE,
              NATURAL: this.NAT_CODE,
              REDSPOT: this.RS_CODE,
              DIA: this.DIAMETER_CODE,
              DEPTH: this.DEPTH_CODE,
              RATIO: this.RATIO_CODE,
              TAB: this.TABLE_CODE,
              RATE: this.RATE,
              TYP: this.TYP,
              RAPTYPE: this.RAPTYPE
            }).subscribe(Res => {
              try {
                if (Res.success == true) {
                  this.toastr.success('Data Save SuccessFully!!!!!!')
                  this.CLEAR()
                } else {
                  this.spinner.hide();
                  this.toastr.warning('Something gone wrong while get shape');
                }
              } catch (error) {
                this.spinner.hide();
                this.toastr.error(error);
              }
            });
          } else {
            this.toastr.warning(SaveRes.data)
          }

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: SaveRes.data
          });
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  DELETE() {
    if (!this.ALLOWDEL) {
      this.toastr.warning("Delete Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
  }

  GETLOT() {
    if (this.L_CODE) {
      if (this.LOTs.filter(x => x.code == this.L_CODE).length != 0) {
        this.L_NAME = this.LOTs.filter(x => x.code == this.L_CODE)[0].name
        this.L_CARAT = this.LOTs.filter(x => x.code == this.L_CODE)[0].carat
      } else {
        this.L_NAME = ''
        this.L_CARAT = ''
      }
    } else {
      this.L_NAME = ''
      this.L_CARAT = ''
    }
  }

  displayFn(user?: LOTInt): string | undefined {
    return user ? user.toString() : undefined;
  }

  CLEAR() {
    this.RAPARR = 'GIA'
    this.gridApi.setRowData([]);
    this.L_CODE = ''
    this.L_NAME = ''
    this.L_CARAT = ''
    this.SRNO = 0
    this.TAG = ''
    this.RAPTYPE = this.RAPTArray[0].code
    this.DATE = new Date()
    this.TIME = this.datepipe.transform(new Date(), 'HH:mm')
    this.PCS = 0
    this.CARAT = 0
    this.M_CARAT = 0
    this.EXP = 0
    this.S_CODE = ''
    this.S_NAME = ''
    this.REG_CODE = ''
    this.REG_NAME = ''
    this.CO_CODE = ''
    this.CO_NAME = ''
    this.PO_CODE = ''
    this.PO_NAME = ''
    this.Q_CODE = ''
    this.Q_NAME = ''
    this.RS_CODE = ''
    this.RS_NAME = ''
    this.CU_CODE = ''
    this.CU_NAME = ''
    this.SD_CODE = ''
    this.SD_NAME = ''
    this.C_CODE = ''
    this.C_NAME = ''
    this.EF_CODE = ''
    this.EF_NAME = ''
    this.DEPTH_CODE = ''
    this.DEPTH_NAME = ''
    this.SB_CODE = ''
    this.SB_NAME = ''
    this.CT_CODE = ''
    this.CT_NAME = ''
    this.RATIO_CODE = ''
    this.RATIO_NAME = ''
    this.EC_CODE = ''
    this.EC_NAME = ''
    this.SO_CODE = ''
    this.SO_NAME = ''
    this.PL_CODE = ''
    this.PL_NAME = ''
    this.TABLE_CODE = ''
    this.TABLE_NAME = ''
    this.GO_CODE = ''
    this.GO_NAME = ''
    this.TAB_CODE = ''
    this.TAB_NAME = ''
    this.SYM_CODE = ''
    this.SYM_NAME = ''
    this.DIAMETER_CODE = ''
    this.DIAMETER_NAME = ''
    this.GRN_CODE = ''
    this.GRN_NAME = ''
    this.TB_CODE = ''
    this.TB_NAME = ''
    this.FL_CODE = ''
    this.FL_SHORTNAME = ''
    this.RATE = ''
    this.LSTR_CODE = ''
    this.LSTR_NAME = ''
    this.TO_CODE = ''
    this.TO_NAME = ''
    this.SH_CODE = ''
    this.SH_NAME = ''
    this.AMOUNT = ''
    this.MLK_CODE = ''
    this.MLK_NAME = ''
    this.NAT_CODE = ''
    this.NAT_NAME = ''
    this.TYP = ''
  }

}
