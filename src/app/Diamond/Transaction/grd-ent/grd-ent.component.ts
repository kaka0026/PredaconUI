import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DatePipe } from '@angular/common';

import { EncrDecrService } from 'src/app/Service/Common/encr-decr.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import PerfectScrollbar from 'perfect-scrollbar';

import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { RapCalcService } from 'src/app/Service/Rap/rap-calc.service';
import { GrdEntService } from 'src/app/Service/Transaction/grd-ent.service';

export interface Data {
  code: any;
  name: any;
}

export interface Data2 {
  code: any;
  name: any;
}

@Component({
  selector: 'app-grd-ent',
  templateUrl: './grd-ent.component.html',
  styleUrls: ['./grd-ent.component.css']
})
export class GrdEntComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  decodedMast = JSON.parse(this.EncrDecrServ.get(localStorage.getItem("unfam1")));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  public columnDefs2;
  public gridApi2;
  public gridColumnApi2;
  public defaultColDef2;

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  EMPDISABLE: boolean = false
  PASS: any = ''
  PER = []

  LotControl = new FormControl();
  lots: Data[];
  filteredLots: Observable<Data[]>;

  ShapeControl = new FormControl();
  shps: Data2[];
  filteredShps: Observable<Data2[]>;

  ColorControl = new FormControl();
  colors: Data[];
  filteredColors: Observable<Data[]>;

  QuaControl = new FormControl();
  quas: Data[];
  filteredQuas: Observable<Data[]>;

  CutControl = new FormControl();
  cuts: Data[];
  filteredCuts: Observable<Data[]>;

  PolControl = new FormControl();
  pols: Data[];
  filteredPols: Observable<Data[]>;

  SymControl = new FormControl();
  syms: Data[];
  filteredSyms: Observable<Data[]>;

  FloControl = new FormControl();
  flos: Data[];
  filteredFlos: Observable<Data[]>;

  ShadeControl = new FormControl();
  shades: Data[];
  filteredShades: Observable<Data[]>;

  RAPTypeControl = new FormControl();
  raptyps: Data2[];
  filteredRAPTypes: Observable<Data2[]>;

  LusterControl = new FormControl();
  lusters: Data[];
  filteredLusters: Observable<Data[]>;

  HeartControl = new FormControl();
  hearts: Data[];
  filteredHearts: Observable<Data[]>;

  CuletControl = new FormControl();
  culets: Data[];
  filteredCulets: Observable<Data[]>;

  EyeCleanControl = new FormControl();
  eyecleans: Data[];
  filteredeyeCLeans: Observable<Data[]>;

  ExtFctControl = new FormControl();
  extfcts: Data[];
  filteredextFcts: Observable<Data[]>;

  TABOpenControl = new FormControl();
  tabOepns: Data[];
  filteredtabOpens: Observable<Data[]>;

  SDOpenControl = new FormControl();
  sideOepns: Data[];
  filteredsideOpens: Observable<Data[]>;

  NaturalControl = new FormControl();
  naturals: Data[];
  filteredNaturals: Observable<Data[]>;

  COpenControl = new FormControl();
  copens: Data[];
  filteredCOpens: Observable<Data[]>;

  GOpenControl = new FormControl();
  gopens: Data[];
  filteredGOpens: Observable<Data[]>;

  GrainingControl = new FormControl();
  grainings: Data[];
  filteredGrainings: Observable<Data[]>;

  MilkyControl = new FormControl();
  milkys: Data[];
  filteredMilkys: Observable<Data[]>;

  POpenControl = new FormControl();
  popens: Data[];
  filteredPOpens: Observable<Data[]>;

  RedSpotControl = new FormControl();
  rspots: Data[];
  filteredRedSpot: Observable<Data[]>;

  SideControl = new FormControl();
  sides: Data[];
  filteredSide: Observable<Data[]>;

  TabBlackControl = new FormControl();
  tblacks: Data[];
  filteredTabBlacks: Observable<Data[]>;

  SideBlackControl = new FormControl();
  sblacks: Data[];
  filteredSideBlacks: Observable<Data[]>;

  LabControl = new FormControl();
  labs: Data[];
  filteredLabs: Observable<Data[]>;

  TabControl = new FormControl();
  tables: Data[];
  filteredTabs: Observable<Data[]>;

  IncControl = new FormControl();
  incs: Data[];
  filteredIncs: Observable<Data[]>;

  L_CODE: any = '';
  L_NAME: any = '';
  SRNO: any = '';
  TAG: any = '';
  I_CARAT: any = '';
  MSRNO: any;
  STONEID: any;
  MANPER: any = '';

  S_CODE: any = '';
  S_NAME: any = '';
  C_CODE: any = '';
  C_NAME: any = '';
  Q_CODE: any = '';
  Q_NAME: any = '';
  CT_CODE: any = '';
  CT_NAME: any = '';
  POL_CODE: any = '';
  POL_NAME: any = '';
  SYM_CODE: any = '';
  SYM_NAME: any = '';
  FL_CODE: any = '';
  FL_NAME: any = '';
  SH_CODE: any = '';
  SH_NAME: any = '';
  RAPTYPE_CODE: any = '';
  RAPTYPE_NAME: any = '';
  LS_CODE: any = '';
  LS_NAME: any = '';
  HRT_CODE: any = '';
  HRT_NAME: any = '';
  CU_CODE: any = '';
  CU_NAME: any = '';
  EC_CODE: any = '';
  EC_NAME: any = '';
  EFCT_CODE: any = '';
  EFCT_NAME: any = '';
  TABOPEN_CODE: any = '';
  TABOPEN_NAME: any = '';
  SDOPEN_CODE: any = '';
  SDOPEN_NAME: any = '';
  NATURAL_CODE: any = '';
  NATURAL_NAME: any = '';
  COPEN_CODE: any = '';
  COPEN_NAME: any = '';
  GOPEN_CODE: any = '';
  GOPEN_NAME: any = '';
  GRN_CODE: any = '';
  GRN_NAME: any = '';
  MLK_CODE: any = '';
  MLK_NAME: any = '';
  POPEN_CODE: any = '';
  POPEN_NAME: any = '';
  RSPOT_CODE: any = '';
  RSPOT_NAME: any = '';
  SIDE_CODE: any = '';
  SIDE_NAME: any = '';
  TBLACK_CODE: any = '';
  TBLACK_NAME: any = '';
  SBLACK_CODE: any = '';
  SBLACK_NAME: any = '';
  LAB_CODE: any = '';
  LAB_NAME: any = '';
  TAB_CODE: any = '';
  TAB_NAME: any = '';
  INC_CODE: any = '';
  INC_NAME: any = '';

  GRDDIA_CODE: any = '';
  GRDRAT_CODE: any = '';
  GRDDEPTH_CODE: any = '';
  GRDTAB_CODE: any = '';
  GRDGRIDLE_CODE: any = '';
  // GRDHEIGHT: any = '';
  GRDLENTH: any = '';
  GRDWIDTH: any = '';
  GRDTDEPTH: any = '';
  GRDRATE: any = '';
  GRDORATE: any = '';
  COMNT: any = '';
  SRTNOTE: any = '';
  GRDUSER: any = '';
  GRDCOMP: any = '';
  // GRDTYP: any = '';

  PEMP_CODE: any = '';
  EMP_CODE: any = '';
  I_DATE: any = '';
  OU_DATE: any = '';
  REP_DATE: any = '';
  OUNO: any = '';
  CERTNO: any = '';

  constructor(
    private GrdEntServ: GrdEntService,
    private RapCalcServ: RapCalcService,
    private EncrDecrServ: EncrDecrService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef,
    private datepipe: DatePipe,
  ) {
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

    this.columnDefs2 = [
      {
        headerName: 'EMP_CODE',
        field: 'EMP_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Q_NAME',
        field: 'Q_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'C_NAME',
        field: 'C_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'CT_NAME',
        field: 'CT_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'PO_NAME',
        field: 'PO_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'SY_NAME',
        field: 'SY_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'FL_NAME',
        field: 'FL_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'SH_NAME',
        field: 'SH_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'COMNT',
        field: 'COMNT',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
    ]
    this.defaultColDef2 = {
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

    this.lots = this.decodedMast[14].map(item => {
      return { code: item.L_CODE, name: item.L_NAME };
    });
    this.filterarr('filteredLots', 'LotControl', 'lots');

    this.shps = this.decodedMast[0].map(item => {
      return { code: item.S_CODE, name: item.S_NAME };
    });
    this.filterarr('filteredShps', 'ShapeControl', 'shps');

    this.colors = this.decodedMast[3].map(item => {
      return { code: item.C_CODE, name: item.C_NAME };
    });
    this.filterarr('filteredColors', 'ColorControl', 'colors');

    this.quas = this.decodedMast[4].map(item => {
      return { code: item.Q_CODE, name: item.Q_NAME };
    });
    this.filterarr('filteredQuas', 'QuaControl', 'quas');

    this.cuts = this.decodedMast[5].map(item => {
      return { code: item.CT_CODE, name: item.CT_NAME };
    });
    this.filterarr('filteredCuts', 'CutControl', 'cuts');

    this.pols = this.decodedMast[5].map(item => {
      return { code: item.CT_CODE, name: item.CT_NAME };
    });
    this.filterarr('filteredPols', 'PolControl', 'pols');

    this.syms = this.decodedMast[5].map(item => {
      return { code: item.CT_CODE, name: item.CT_NAME };
    });
    this.filterarr('filteredSyms', 'SymControl', 'syms');

    this.flos = this.decodedMast[6].map(item => {
      return { code: item.FL_CODE, name: item.FL_NAME };
    });
    this.filterarr('filteredFlos', 'FloControl', 'flos');

    this.shades = this.decodedMast[19].map(item => {
      return { code: item.SH_CODE, name: item.SH_NAME };
    });
    this.filterarr('filteredShades', 'ShadeControl', 'shades');

    this.raptyps = (this.decodedMast[15].filter((item) => item.ISACTIVE == true)).map((MapItem) => {
      return { code: MapItem.RAPTYPE, name: MapItem.RAPNAME };
    })
    this.filterarr('filteredRAPTypes', 'RAPTypeControl', 'raptyps');

    this.lusters = this.decodedMast[26].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredLusters', 'LusterControl', 'lusters');

    this.hearts = this.decodedMast[42].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredHearts', 'HeartControl', 'hearts');

    this.culets = this.decodedMast[21].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredCulets', 'CuletControl', 'culets');

    this.eyecleans = this.decodedMast[23].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredeyeCLeans', 'EyeCleanControl', 'eyecleans');

    this.extfcts = this.decodedMast[22].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredextFcts', 'ExtFctControl', 'extfcts');

    this.tabOepns = this.decodedMast[35].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredtabOpens', 'TABOpenControl', 'tabOepns');

    this.sideOepns = this.decodedMast[32].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredsideOpens', 'SDOpenControl', 'sideOepns');

    this.naturals = this.decodedMast[28].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredNaturals', 'NaturalControl', 'naturals');

    this.copens = this.decodedMast[20].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredCOpens', 'COpenControl', 'copens');

    this.gopens = this.decodedMast[24].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredGOpens', 'GOpenControl', 'gopens');

    this.grainings = this.decodedMast[24].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredGrainings', 'GrainingControl', 'grainings');

    this.milkys = this.decodedMast[27].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredMilkys', 'MilkyControl', 'milkys');

    this.popens = this.decodedMast[29].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredPOpens', 'POpenControl', 'popens');

    this.rspots = this.decodedMast[38].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredRedSpot', 'RedSpotControl', 'rspots');

    this.sides = this.decodedMast[30].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredSide', 'SideControl', 'sides');

    this.tblacks = this.decodedMast[34].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredTabBlacks', 'TabBlackControl', 'tblacks');

    this.sblacks = this.decodedMast[31].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredSideBlacks', 'SideBlackControl', 'sblacks');

    this.labs = this.decodedMast[43].map(item => {
      return { code: item.LB_CODE, name: item.LB_NAME };
    });
    this.filterarr('filteredLabs', 'LabControl', 'labs');

    this.tables = this.decodedMast[33].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredTabs', 'TabControl', 'tables');

    this.incs = this.decodedMast[37].map(item => {
      return { code: item.I_CODE, name: item.I_NAME };
    });
    this.filterarr('filteredIncs', 'IncControl', 'incs');

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.LoadGridData()
  }

  onGridReady2(params) {
    this.gridApi2 = params.api;
    this.gridColumnApi2 = params.columnApi;
  }

  autoSizeAll(skipHeader: boolean) {
    const allColumnIds: string[] = [];
    this.gridColumnApi2.getAllColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    this.gridColumnApi2.autoSizeColumns(allColumnIds, skipHeader);
  }

  async findrap() {
    await this.RapCalcServ.FindRap(
      {
        S_CODE: this.S_CODE,
        Q_CODE: this.Q_CODE,
        C_CODE: this.C_CODE,
        CARAT: this.I_CARAT,
        CUT_CODE: this.CT_CODE,
        POL_CODE: this.POL_CODE,
        SYM_CODE: this.SYM_CODE,
        FL_CODE: this.FL_CODE,
        IN_CODE: this.INC_CODE,
        SH_CODE: this.SH_CODE,
        TABLE: this.TAB_CODE,
        TABLE_BLACK: this.TBLACK_CODE,
        TABLE_OPEN: this.TABOPEN_CODE,
        SIDE: this.SIDE_CODE,
        SIDE_BLACK: this.SBLACK_CODE,
        SIDE_OPEN: this.SDOPEN_CODE,
        CROWN_OPEN: this.COPEN_CODE,
        GIRDLE_OPEN: this.GOPEN_CODE,
        PAV_OPEN: this.POPEN_CODE,
        CULET: this.CU_CODE,
        EXTFACET: this.EFCT_CODE,
        EYECLAEN: this.EC_CODE,
        GRAINING: this.GRN_CODE,
        LUSTER: this.LS_CODE,
        MILKY: this.MLK_CODE,
        NATURAL: this.NATURAL_CODE,
        REDSPOT: this.RSPOT_CODE,
        V_CODE: 0,
        RAPTYPE: this.RAPTYPE_CODE,
        DIA: this.GRDDIA_CODE,
        DEPTH: this.GRDDEPTH_CODE,
        RATIO: this.GRDRAT_CODE,
        TAB: this.GRDTAB_CODE
      }
    ).then((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.GRDRATE = PCRes.data[1][0][''] == null ? 0 : (PCRes.data[1][0]['']).toFixed(0)
          this.GRDORATE = PCRes.data[0][0].AMT;
          // this.AMOUNT = PCRes.data[1][0][''] == null ? 0 : (PCRes.data[1][0][''] * this.EXP).toFixed(0)
          // this.TYP = PCRes.data[2][0]['']

          this.gridApi.setRowData(PCRes.data[0]);
          // if (PCRes.data[2][0][''] == 'S') {
          //   this.RAPARR = 'GIA'
          //   this.gridApi.setRowData(PCRes.data[3]);
          // } else {
          //   this.RAPARR = 'LOOSE'
          //   this.gridApi.setRowData(PCRes.data[5]);
          // }
        } else {
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  GrdEntDisplay() {
    this.spinner.show()

    let FillObj = {
      L_CODE: this.L_CODE ? this.L_CODE : '',
      SRNO: this.SRNO ? this.SRNO : 0,
      MSRNO: this.MSRNO ? this.MSRNO : 0,
      STONEID: this.STONEID ? this.STONEID : 0,
      TAG: this.TAG ? this.TAG : '',
    }
    this.GrdEntServ.GrdEntDisplay(FillObj).subscribe((FillRes) => {
      try {
        if (FillRes.success == true) {
          this.spinner.hide()

          this.gridApi2.setRowData(FillRes.data[0]);
          this.autoSizeAll(true);

          this.PEMP_CODE = FillRes.data[1][0].PEMP_CODE;
          this.EMP_CODE = FillRes.data[1][0].EMP_CODE;
          this.I_DATE = this.datepipe.transform(FillRes.data[1][0].I_DATE, 'dd-MM-yyyy')
          this.OU_DATE = this.datepipe.transform(FillRes.data[1][0].OU_DATE, 'dd-MM-yyyy')
          this.REP_DATE = this.datepipe.transform(FillRes.data[1][0].REP_DATE, 'dd-MM-yyyy')
          this.OUNO = FillRes.data[1][0].OUNO;
          this.CERTNO = FillRes.data[1][0].CERTNO;


          this.I_CARAT = FillRes.data[2][0].I_CARAT;
          this.MSRNO = FillRes.data[2][0].MSRNO;
          this.STONEID = FillRes.data[2][0].STONEID;
          this.S_CODE = FillRes.data[2][0].GRDS_CODE;
          this.C_CODE = FillRes.data[2][0].GRDC_CODE;
          this.Q_CODE = FillRes.data[2][0].GRDQ_CODE;
          this.CT_CODE = FillRes.data[2][0].GRDCUT_CODE;
          this.POL_CODE = FillRes.data[2][0].GRDPOL_CODE;
          this.SYM_CODE = FillRes.data[2][0].GRDSYM_CODE;
          this.FL_CODE = FillRes.data[2][0].GRDFL_CODE;
          this.SH_CODE = FillRes.data[2][0].GRDSH_CODE;
          this.SH_CODE = FillRes.data[2][0].GRDSH_CODE;
          this.RAPTYPE_CODE = FillRes.data[2][0].GRDRAPTYPE;
          this.LS_CODE = FillRes.data[2][0].GRDLUSTER;
          this.HRT_CODE = FillRes.data[2][0].GRDHNA_CODE;
          this.CU_CODE = FillRes.data[2][0].GRDCULET;
          this.EC_CODE = FillRes.data[2][0].GRDEYECLEAN;
          this.EFCT_CODE = FillRes.data[2][0].GRDEXTFACET;
          this.TABOPEN_CODE = FillRes.data[2][0].GRDTABLE_OPEN;
          this.SDOPEN_CODE = FillRes.data[2][0].GRDSIDE_OPEN;
          this.NATURAL_CODE = FillRes.data[2][0].GRDNATURAL;
          this.COPEN_CODE = FillRes.data[2][0].GRDCROWN_OPEN;
          this.GOPEN_CODE = FillRes.data[2][0].GRDGIRDLE_OPEN;
          this.GRN_CODE = FillRes.data[2][0].GRDGRAINING;
          this.MLK_CODE = FillRes.data[2][0].GRDMILKY;
          this.POPEN_CODE = FillRes.data[2][0].GRDPAV_OPEN;
          this.RSPOT_CODE = FillRes.data[2][0].GRDREDSPOT;
          this.SIDE_CODE = FillRes.data[2][0].GRDSIDE;
          this.TBLACK_CODE = FillRes.data[2][0].GRDTABLE_BLACK;
          this.SBLACK_CODE = FillRes.data[2][0].GRDSIDE_BLACK;
          this.LAB_CODE = FillRes.data[2][0].LAB;
          this.TAB_CODE = FillRes.data[2][0].GRDTABLE;
          this.INC_CODE = FillRes.data[2][0].GRDIN_CODE;
          this.COMNT = FillRes.data[2][0].COMNT;
          this.SRTNOTE = FillRes.data[2][0].SRTNOTE;
          this.GRDTAB_CODE = FillRes.data[2][0].GRDTAB;
          this.GRDLENTH = FillRes.data[2][0].GRDLENTH;
          this.GRDDIA_CODE = FillRes.data[2][0].GRDDIA;
          this.GRDWIDTH = FillRes.data[2][0].GRDWIDTH;
          this.GRDTDEPTH = FillRes.data[2][0].GRDDEPTH;
          this.GRDGRIDLE_CODE = FillRes.data[2][0].GRDGRIDLE;
          this.GRDDEPTH_CODE = FillRes.data[2][0].GRDDEPTH;
          this.GRDRAT_CODE = FillRes.data[2][0].GRDRATIO;

          this.findrap();
        } else {
          this.spinner.hide()
          this.toastr.warning(FillRes.data.originalError.info.message)
        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })
  }

  Save() {
    this.spinner.show()
    let SaveObj = {
      L_CODE: this.L_CODE ? this.L_CODE : '',
      SRNO: this.SRNO ? this.SRNO : 0,
      TAG: this.TAG ? this.TAG : '',
      GRDS_CODE: this.S_CODE ? this.S_CODE : '',
      GRDQ_CODE: this.Q_CODE ? this.Q_CODE : 0,
      GRDC_CODE: this.C_CODE ? this.C_CODE : 0,
      GRDCARAT: this.I_CARAT ? this.I_CARAT : 0,
      GRDCUT_CODE: this.CT_CODE ? this.CT_CODE : 0,
      GRDPOL_CODE: this.POL_CODE ? this.POL_CODE : 0,
      GRDSYM_CODE: this.SYM_CODE ? this.SYM_CODE : 0,
      GRDFL_CODE: this.FL_CODE ? this.FL_CODE : 0,
      GRDIN_CODE: this.INC_CODE ? this.INC_CODE : 0,
      GRDSH_CODE: this.SH_CODE ? this.SH_CODE : 0,
      GRDTABLE: this.TAB_CODE ? this.TAB_CODE : 0,
      GRDTABLE_BLACK: this.TBLACK_CODE ? this.TBLACK_CODE : 0,
      GRDTABLE_OPEN: this.TABOPEN_CODE ? this.TABOPEN_CODE : 0,
      GRDSIDE: this.SIDE_CODE ? this.SIDE_CODE : 0,
      GRDSIDE_BLACK: this.SBLACK_CODE ? this.SBLACK_CODE : 0,
      GRDSIDE_OPEN: this.SDOPEN_CODE ? this.SDOPEN_CODE : 0,
      GRDCROWN_OPEN: this.COPEN_CODE ? this.COPEN_CODE : 0,
      GRDGIRDLE_OPEN: this.GOPEN_CODE ? this.GOPEN_CODE : 0,
      GRDPAV_OPEN: this.POPEN_CODE ? this.POPEN_CODE : 0,
      GRDCULET: this.CU_CODE ? this.CU_CODE : 0,
      GRDEXTFACET: this.EFCT_CODE ? this.EFCT_CODE : 0,
      GRDEYECLEAN: this.EC_CODE ? this.EC_CODE : 0,
      GRDGRAINING: this.GRN_CODE ? this.GRN_CODE : 0,
      GRDLUSTER: this.LS_CODE ? this.LS_CODE : 0,
      GRDMILKY: this.MLK_CODE ? this.MLK_CODE : 0,
      GRDNATURAL: this.NATURAL_CODE ? this.NATURAL_CODE : 0,
      GRDREDSPOT: this.RSPOT_CODE ? this.RSPOT_CODE : 0,
      GRDHNA_CODE: this.HRT_CODE ? this.HRT_CODE : 0,
      // GRDDIA_CODE: this.GRDDIA_CODE ? this.GRDDIA_CODE : 0,
      // GRDRAT_CODE: this.GRDRAT_CODE ? this.GRDRAT_CODE : 0,
      // GRDDEPTH_CODE: this.GRDDEPTH_CODE ? this.GRDDEPTH_CODE : 0,
      // GRDTAB_CODE: this.GRDTAB_CODE ? this.GRDTAB_CODE : 0,
      // GRDHEIGHT: this.GRDHEIGHT ? this.GRDHEIGHT : 0,
      GRDLENTH: this.GRDLENTH ? this.GRDLENTH : 0,
      GRDWIDTH: this.GRDWIDTH ? this.GRDWIDTH : 0,
      GRDTDEPTH: this.GRDTDEPTH ? this.GRDTDEPTH : 0,
      GRDDEPTH: this.GRDDEPTH_CODE ? this.GRDDEPTH_CODE : 0,
      GRDTAB: this.GRDTAB_CODE ? this.GRDTAB_CODE : 0,
      GRDDIA: this.GRDDIA_CODE ? this.GRDDIA_CODE : 0,
      GRDGRIDLE: this.GRDGRIDLE_CODE ? this.GRDGRIDLE_CODE : 0,
      GRDRATIO: this.GRDRAT_CODE ? this.GRDRAT_CODE : 0,
      GRDRAPTYPE: this.RAPTYPE_CODE ? this.RAPTYPE_CODE : '',
      GRDRATE: this.GRDRATE ? this.GRDRATE : 0,
      GRDORATE: this.GRDORATE ? this.GRDORATE : 0,
      COMNT: this.COMNT ? this.COMNT : '',
      SRTNOTE: this.SRTNOTE ? this.SRTNOTE : '',
      GRDUSER: this.decodedTkn.UserId,
      GRDCOMP: this.decodedTkn.UserId,
      // GRDTYP: this.RSPOT_CODE ? this.RSPOT_CODE : 0,
      LAB: this.LAB_CODE ? this.LAB_CODE : 0,
    }
    this.GrdEntServ.GrdEntSaveData(SaveObj).subscribe((SaveRes) => {
      try {
        if (SaveRes.success == true) {
          this.toastr.success("Saved succesfully.")
          this.Clear();
          this.spinner.hide()
        } else {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(SaveRes.data),
          })
        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })
  }

  Clear() {
    // clear all form fields
    this.L_CODE = ''
    this.L_NAME = ''
    this.SRNO = ''
    this.TAG = ''
    this.I_CARAT = ''
    this.MSRNO = ''
    this.STONEID = ''
    this.MANPER = ''
    this.S_CODE = ''
    this.S_NAME = ''
    this.C_CODE = ''
    this.C_NAME = ''
    this.Q_CODE = ''
    this.Q_NAME = ''
    this.CT_CODE = ''
    this.CT_NAME = ''
    this.POL_CODE = ''
    this.POL_NAME = ''
    this.SYM_CODE = ''
    this.SYM_NAME = ''
    this.FL_CODE = ''
    this.FL_NAME = ''
    this.SH_CODE = ''
    this.SH_NAME = ''
    this.RAPTYPE_CODE = ''
    this.RAPTYPE_NAME = ''
    this.LS_CODE = ''
    this.LS_NAME = ''
    this.HRT_CODE = ''
    this.HRT_NAME = ''
    this.CU_CODE = ''
    this.CU_NAME = ''
    this.EC_CODE = ''
    this.EC_NAME = ''
    this.EFCT_CODE = ''
    this.EFCT_NAME = ''
    this.TABOPEN_CODE = ''
    this.TABOPEN_NAME = ''
    this.SDOPEN_CODE = ''
    this.SDOPEN_NAME = ''
    this.NATURAL_CODE = ''
    this.NATURAL_NAME = ''
    this.COPEN_CODE = ''
    this.COPEN_NAME = ''
    this.GOPEN_CODE = ''
    this.GOPEN_NAME = ''
    this.GRN_CODE = ''
    this.GRN_NAME = ''
    this.MLK_CODE = ''
    this.MLK_NAME = ''
    this.POPEN_CODE = ''
    this.POPEN_NAME = ''
    this.RSPOT_CODE = ''
    this.RSPOT_NAME = ''
    this.SIDE_CODE = ''
    this.SIDE_NAME = ''
    this.INC_CODE = ''
    this.INC_NAME = ''
    this.TBLACK_CODE = ''
    this.TBLACK_NAME = ''
    this.SBLACK_CODE = ''
    this.SBLACK_NAME = ''
    this.TAB_CODE = ''
    this.TAB_NAME = ''
    this.LAB_CODE = ''
    this.LAB_NAME = ''
    this.COMNT = ''
    this.SRTNOTE = ''
    this.GRDTAB_CODE = ''
    this.GRDLENTH = ''
    this.GRDDIA_CODE = ''
    this.GRDWIDTH = ''
    this.GRDTDEPTH = ''
    this.GRDGRIDLE_CODE = ''
    this.GRDRATE = ''
    this.GRDDEPTH_CODE = ''
    this.GRDRAT_CODE = ''
    this.PEMP_CODE = ''
    this.EMP_CODE = ''
    this.I_DATE = ''
    this.OU_DATE = ''
    this.REP_DATE = ''
    this.OUNO = ''
    this.CERTNO = ''
    this.gridApi.setRowData([]);
    this.gridApi2.setRowData([]);
  }

  GIAImport() {
    this.spinner.show()
    let SaveObj = {
      // STONEID: this.STONEID ? this.STONEID : 0,
      // GIAQ_CODE: this.GIAQ_CODE ? this.GIAQ_CODE : 0,
      // GIAC_CODE: this.GIAC_CODE ? this.GIAC_CODE : 0,
      // GIACARAT: this.GIACARAT ? this.GIACARAT : 0,
      // GIACUT_CODE: this.GIACUT_CODE ? this.GIACUT_CODE : 0,
      // GIAPOL_CODE: this.GIAPOL_CODE ? this.GIAPOL_CODE : 0,
      // GIASYM_CODE: this.GIASYM_CODE ? this.GIASYM_CODE : 0,
      // GIAFL_CODE: this.GIAFL_CODE ? this.GIAFL_CODE : 0,
      // RATE: this.RATE ? this.RATE : '',
      // CERTNO: this.CERTNO ? this.CERTNO : '',
      // JOB_NO: this.JOB_NO ? this.JOB_NO : '',
      // CONT_NO: this.CONT_NO ? this.CONT_NO : '',
      // DIAM_DOSS: this.DIAM_DOSS ? this.DIAM_DOSS : '',
      // REP_NO: this.REP_NO ? this.REP_NO : '',
      // REP_DATE: this.REP_DATE ? this.datepipe.transform(this.REP_DATE, 'yyyy-MM-dd') : '',
      // CLIENT_REF: this.CLIENT_REF ? this.CLIENT_REF : '',
      // MEMO_NO: this.MEMO_NO ? this.MEMO_NO : 0,
      // SHAPE: this.SHAPE ? this.SHAPE : '',
      // LENGTH: this.LENGTH ? this.LENGTH : 0,
      // WIDTH: this.WIDTH ? this.WIDTH : 0,
      // DEPTH: this.DEPTH ? this.DEPTH : 0,
      // WEIGHT: this.WEIGHT ? this.WEIGHT : 0,
      // COLOR: this.COLOR ? this.COLOR : '',
      // COLOR_DESC: this.COLOR_DESC ? this.COLOR_DESC : '',
      // CLARITY: this.CLARITY ? this.CLARITY : '',
      // CLARITY_STATUS: this.CLARITY_STATUS ? this.CLARITY_STATUS : '',
      // CUT: this.CUT ? this.CUT : '',
      // POLISH: this.POLISH ? this.POLISH : '',
      // SYMMETRY: this.SYMMETRY ? this.SYMMETRY : '',
      // FLUORESCENCE: this.FLUORESCENCE ? this.FLUORESCENCE : '',
      // GIRDLE: this.GIRDLE ? this.GIRDLE : '',
      // GIRDLE_CON: this.GIRDLE_CON ? this.GIRDLE_CON : '',
      // CULET_SIZE: this.CULET_SIZE ? this.CULET_SIZE : '',
      // DEPTH_PER: this.DEPTH_PER ? this.DEPTH_PER : 0,
      // TABLE_PER: this.TABLE_PER ? this.TABLE_PER : 0,
      // CRN_AG: this.CRN_AG ? this.CRN_AG : '',
      // CRN_HT: this.CRN_HT ? this.CRN_HT : '',
      // PAV_AG: this.PAV_AG ? this.PAV_AG : '',
      // PAV_DP: this.PAV_DP ? this.PAV_DP : '',
      // STR_LN: this.STR_LN ? this.STR_LN : '',
      // LF_HALF: this.LF_HALF ? this.LF_HALF : '',
      // PAINTING: this.PAINTING ? this.PAINTING : '',
      // PROPORTION: this.PROPORTION ? this.PROPORTION : '',
      // PAINT_COMM: this.PAINT_COMM ? this.PAINT_COMM : '',
      // KTS: this.KTS ? this.KTS : '',
      // REPORT_COMMENTS: this.REPORT_COMMENTS ? this.REPORT_COMMENTS : '',
      // INSCRIPTION: this.INSCRIPTION ? this.INSCRIPTION : '',
      // SYNTHETIC_IND: this.SYNTHETIC_IND ? this.SYNTHETIC_IND : '',
      // GIRDLE_PER: this.GIRDLE_PER ? this.GIRDLE_PER : '',
      // POLISH_FEATURES: this.POLISH_FEATURES ? this.POLISH_FEATURES : '',
      // SYMMETRY_FEATURES: this.SYMMETRY_FEATURES ? this.SYMMETRY_FEATURES : '',
      // SHAPE_DESC: this.SHAPE_DESC ? this.SHAPE_DESC : '',
      // REPORT_TYPE: this.REPORT_TYPE ? this.REPORT_TYPE : '',
      // SORTING: this.SORTING ? this.SORTING : '',
    }
    this.GrdEntServ.GIAEntSave(SaveObj).subscribe((SaveRes) => {
      try {
        if (SaveRes.success == true) {
          this.spinner.hide()
        } else {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(SaveRes.data),
          })
        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })
  }

  GetName(P_CODE, P_NAME, P_ARRAY) {
    if (P_CODE == '') {
      this[P_NAME] = ''
      return
    } else {
      this[P_NAME] = P_ARRAY.filter(x => x.code == P_CODE)[0].name;
      // this.findrap()
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

}
