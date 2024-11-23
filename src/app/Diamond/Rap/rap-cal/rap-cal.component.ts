import { Component, OnInit, ViewChild } from '@angular/core';
import { EncrDecrService } from 'src/app/Service/Common/encr-decr.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { RapCalcService } from '../../../Service/Rap/rap-calc.service'
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { RapMastService } from 'src/app/Service/Rap/rap-mast.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BrkEntComponent } from '../../Transaction/brk-ent/brk-ent.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/Service/Utility/login.service';
import { environment } from '../../../../environments/environment'

export interface Emp {
  name: string;
  code: string;
}

export interface Depth {
  name: string;
  code: string;
}

export interface Diameter {
  name: string;
  code: string;
}

export interface Table {
  name: string;
  code: string;
}

export interface Ratio {
  name: string;
  code: string;
}

@Component({
  selector: 'app-rap-cal',
  templateUrl: './rap-cal.component.html',
  styleUrls: ['./rap-cal.component.css']
})
export class RapCalComponent implements OnInit {

  @ViewChild("rapcalcsrno", { static: true }) RAPCALCSRNO: any;

  @ViewChild("grid") myGrid: jqxGridComponent;
  @ViewChild('Import') Import: any;

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  decodedMast = JSON.parse(this.EncrDecrServ.get(localStorage.getItem("unfam1")));
  on: string = "Off";

  empCtrl: FormControl;
  filteredemps: Observable<any[]>;
  EMP_CODE: any = ''
  emps: Emp[] = [];
  empName: any = '';

  vCtrl: FormControl;
  filteredVs: Observable<any[]>;
  versionArray: Emp[] = [];

  lotCtrl: FormControl;
  filteredLots: Observable<any[]>;
  lotArray: Emp[] = [];

  depthCtrl: FormControl;
  filtereddepths: Observable<any[]>;
  DEPTH: any = ''
  deptharray: Depth[] = [];
  DEPTHNAME: any = '';

  diameterCtrl: FormControl;
  filtereddiameters: Observable<any[]>;
  DIAMETER: any = ''
  diameterarray: Diameter[] = [];
  DIAMETERNAME: any = '';

  tableCtrl: FormControl;
  filteredtables: Observable<any[]>;
  TABLE: any = ''
  tablearray: Table[] = [];
  TABLENAME: any = '';

  ratioCtrl: FormControl;
  filteredratios: Observable<any[]>;
  RATIO: any = ''
  ratioarray: Ratio[] = [];
  RATIONAME: any = '';

  grpCtrl: FormControl;
  filteredGrps: Observable<any[]>;
  GrpArr: Emp[] = [];

  currentNumber = '0';
  firstOperand = null;
  waitForSecondNumber = false;
  validationrap = true

  V_CODE: any = ''
  L_CODE: any = ''
  QPAMTCOL: any = ''
  QMAMTCOL: any = ''
  CPAMTCOL: any = ''
  CMAMTCOL: any = ''
  TAG: any = 'A'
  SRNO: any = 0
  input: any = '0'
  RAPARR: any = ''
  RAPTYPE: any = '';
  ROUCARAT: any = 0
  POLCARAT: any = 0
  PERCARAT: any = 0
  NETPER: any = 0
  TOTAMT: any = 0

  shapeArray = []
  clarityArray = []
  colorArray = []
  PLANGRIDARR = []
  cutArray = []
  polArray = []
  symArray = []
  floArray = []
  rapArray = []
  shadeArray = []
  crownOpenArray = []
  culetArray = []
  extraFacetArray = []
  SizeGridArray = []
  eyeCleanArray = []
  gridleOpenArray = []
  grainingArray = []
  lusterArray = []
  milkyArray = []
  naturalArray = []
  pavOpenArray = []
  sideArray = []
  sideBlackArray = []
  sideOpenArray = []
  tableArray = []
  tableBlackArray = []
  tableOpenArray = []
  TagArray = []
  RegArray = []
  RSpotArray = []
  RAPTArray = []
  MANPRICEGIAARR = []
  MANPRICELOOSEARR = []
  disabled = false
  tagdisabled = false

  DISABLELOTSRNO: boolean = false;

  PlanArray = [
    { name: 1, selected: false },
    { name: 2, selected: false },
    { name: 3, selected: false },
    { name: 4, selected: false },
    { name: 5, selected: false },
    { name: 6, selected: false },
    { name: 7, selected: false },
    { name: 8, selected: false },
    { name: 9, selected: false },
    { name: 10, selected: false },
    { name: 11, selected: false },
    { name: 12, selected: false },
    { name: 13, selected: false },
    { name: 14, selected: false },
    { name: 15, selected: false },
    { name: 16, selected: false },
    { name: 17, selected: false },
    { name: 18, selected: false },
    { name: 19, selected: false },
    { name: 20, selected: false }
  ]
  DIAMArray = []
  TABELArray = []
  RATIOArray = []
  VIEWPERARR = []

  public PricecolumnDefs;
  public PricegridApi;
  public PricegridColumnApi;
  public PricedefaultColDef;

  public SizecolumnDefs;
  public SizegridApi;
  public SizegridColumnApi;
  public SizedefaultColDef;
  public SizerowSelection

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public rowSelection;

  public MaincolumnDefs;
  public MaingridApi;
  public MaingridColumnApi;
  public MaindefaultColDef;
  public getRowStyle;

  constructor(
    private EncrDecrServ: EncrDecrService,
    private RapCalcServ: RapCalcService,
    private ViewParaMastServ: ViewParaMastService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private RapMastServ: RapMastService,
    public dialog: MatDialog,
    private LoginServ: LoginService
  ) {
    //VIEW PARA MAIN GRID
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'FrmRapCalc' }).subscribe((VPRes) => {
      try {
        if (VPRes.success == 1) {
          let temp = []

          for (let i = 0; i < VPRes.data.length; i++) {
            if (VPRes.data[i].FIELDNAME == "PLNSEL") {
              temp.push({
                headerName: VPRes.data[i].DISPNAME,
                headerClass: VPRes.data[i].HEADERALIGN,
                field: VPRes.data[i].FIELDNAME,
                width: VPRes.data[i].COLWIDTH,
                cellStyle: { 'text-align': VPRes.data[i].CELLALIGN },
                resizable: VPRes.data[i].ISRESIZE,
                hide: VPRes.data[i].DISP == false ? true : false,
                cellRenderer: (params) => {
                  if (params.data.PLNSEL == true) {
                    return '<input type="checkbox" data-action-type="IS_VIW" checked >';
                  } else {
                    return '<input type="checkbox" data-action-type="IS_VIW">';
                  }
                },
              })
            } else if (VPRes.data[i].FIELDNAME == "QPAMT" || VPRes.data[i].FIELDNAME == "QMAMT" ||
              VPRes.data[i].FIELDNAME == "CPAMT" || VPRes.data[i].FIELDNAME == "CMAMT" ||
              VPRes.data[i].FIELDNAME == "RRATE" || VPRes.data[i].FIELDNAME == "RAMT" ||
              VPRes.data[i].FIELDNAME == "SRATE" || VPRes.data[i].FIELDNAME == "SAMT" ||
              VPRes.data[i].FIELDNAME == "RATE" || VPRes.data[i].FIELDNAME == "AMT") {
              temp.push({
                headerName: VPRes.data[i].DISPNAME,
                headerClass: VPRes.data[i].HEADERALIGN,
                field: VPRes.data[i].FIELDNAME,
                width: VPRes.data[i].COLWIDTH,
                cellStyle: { 'text-align': VPRes.data[i].CELLALIGN },
                resizable: VPRes.data[i].ISRESIZE,
                hide: VPRes.data[i].DISP == false ? true : false,
                cellRenderer: function (params) {
                  if (!params.value) { params.value = 0; }
                  return (parseFloat(params.value)).toFixed(0);
                },
              })
            } else {
              temp.push({
                headerName: VPRes.data[i].DISPNAME,
                headerClass: VPRes.data[i].HEADERALIGN,
                field: VPRes.data[i].FIELDNAME,
                width: VPRes.data[i].COLWIDTH,
                cellStyle: { 'text-align': VPRes.data[i].CELLALIGN },
                resizable: VPRes.data[i].ISRESIZE,
                hide: VPRes.data[i].DISP == false ? true : false,
              })
            }


            if (VPRes.data[i].FIELDNAME != "PLANNO" && VPRes.data[i].FIELDNAME != "PTAG") {
              temp[i].cellStyle = function (params) {
                if (params.data.TYP == 'S') {
                  return { background: '#b4ffb4' };
                } else if (params.data.TYP == 'R') {
                  return { background: '#FFFFFF' };
                }
              }
            }
            if (VPRes.data[i].FIELDNAME == "QPAMT") {
              temp[i].cellStyle = function (params) {
                if (params.data.QPAMTCOL == 'S') {
                  return { 'text-align': 'center', background: 'limegreen' };
                } else if (params.data.QPAMTCOL == 'R') {
                  return { 'text-align': 'center', background: 'Tomato' };
                }
              }
            }
            if (VPRes.data[i].FIELDNAME == "QMAMT") {
              temp[i].cellStyle = function (params) {
                if (params.data.QMAMTCOL == 'S') {
                  return { 'text-align': 'center', background: 'limegreen' };
                } else if (params.data.QMAMTCOL == 'R') {
                  return { 'text-align': 'center', background: 'Tomato' };
                }
              }
            }
            if (VPRes.data[i].FIELDNAME == "CPAMT") {
              temp[i].cellStyle = function (params) {
                if (params.data.CPAMTCOL == 'S') {
                  return { 'text-align': 'center', background: 'limegreen' };
                } else if (params.data.CPAMTCOL == 'R') {
                  return { 'text-align': 'center', background: 'Tomato' };
                }
              }
            }
            if (VPRes.data[i].FIELDNAME == "CMAMT") {
              temp[i].cellStyle = function (params) {
                if (params.data.CMAMTCOL == 'S') {
                  return { 'text-align': 'center', background: 'limegreen' };
                } else if (params.data.CMAMTCOL == 'R') {
                  return { 'text-align': 'center', background: 'Tomato' };
                }
              }
            }
          }
          this.rowSelection = 'multiple';
          this.MaincolumnDefs = temp
          this.MaindefaultColDef = {
            resizable: true,
            sortable: true
          }
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

    //FOR LB & LC RENDER
    this.RapMastServ.RapTypeFill({ TYPE: "RAP", TABNAME: "" }).subscribe(rapres => {
      try {
        if (rapres.success == true) {
          this.RAPTArray = rapres.data.map(item => {
            if (item.RAPNAME == rapres.data[0].RAPTYPE) {
              return { code: item.RAPTYPE, name: item.RAPNAME, selected: true };
            } else {
              return { code: item.RAPTYPE, name: item.RAPNAME, selected: false };
            }
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

    //FOR GRID 2
    this.columnDefs = [
      {
        headerName: 'No',
        field: 'PLANNO',
        width: 30,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Amt',
        field: 'AMT',
        width: 70,
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (!params.value) { params.value = 0; }
          return (parseFloat(params.value)).toFixed(0);
        },
      },
      {
        headerName: 'Pcrt',
        field: 'PCARAT',
        width: 70,
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (!params.value) { params.value = 0; }
          return (parseFloat(params.value)).toFixed(2);
        },
      },
    ]
    this.defaultColDef = {
      resizable: true,
      sortable: true
    }

    //FOR GRID 1
    this.PricecolumnDefs = [
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
    this.PricedefaultColDef = {
      resizable: true,
      sortable: true
    }

    //FOR GRID 3
    this.SizecolumnDefs = [
      {
        headerName: 'Code',
        field: 'SZ_CODE',
        width: 50,
        cellStyle: { 'text-align': 'left' },
        headerClass: "text-center"
      },
      {
        headerName: 'FCarat',
        field: 'F_SIZE',
        width: 100,
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (!params.value) { params.value = 0; }
          return '<p>' + (params.value).toFixed(3) + '</p>';
        },
      },
      {
        headerName: 'TCarat',
        field: 'T_SIZE',
        width: 100,
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (!params.value) { params.value = 0; }
          return '<p>' + (params.value).toFixed(3) + '</p>';
        },
      },
    ]
    this.SizerowSelection = 'single';
    this.SizedefaultColDef = {
      resizable: true,
      sortable: true
    }
    this.empCtrl = new FormControl();
    this.depthCtrl = new FormControl();
    this.diameterCtrl = new FormControl();
    this.tableCtrl = new FormControl();
    this.ratioCtrl = new FormControl();
    this.vCtrl = new FormControl();
    this.lotCtrl = new FormControl();
  }

  async ngOnInit() {

    // FOR PAGE PERMISSION
    await this.LoginServ.UserFrmPer({ USER_NAME: this.decodedTkn.UserId }).then(res => {
      try {
        if (res.success == true) {
          this.VIEWPERARR = res.data.map(item => {
            return item.FORM_NAME
          });

        } else {
          this.spinner.hide();
          this.toastr.warning('Something gone wrong while get shape');
        }
      } catch (error) {
        this.spinner.hide();
        this.toastr.error(error);
      }
    });

    this.shapeArray = this.decodedMast[0].map(item => {
      return { code: item.S_CODE, name: item.S_NAME, selected: false };
    });


    this.clarityArray = this.decodedMast[4].map(item => {
      return { code: item.Q_CODE, name: item.Q_NAME, selected: false };
    });

    this.colorArray = this.decodedMast[3].map(item => {
      return { code: item.C_CODE, name: item.C_NAME, selected: false };
    });

    this.cutArray = this.decodedMast[5].map(item => {
      return { code: item.CT_CODE, name: item.CT_NAME, selected: false };
    });

    this.polArray = this.decodedMast[5].map(item => {
      return { code: item.CT_CODE, name: item.CT_NAME, selected: false };
    });

    this.symArray = this.decodedMast[5].map(item => {
      return { code: item.CT_CODE, name: item.CT_NAME, selected: false };
    });

    this.floArray = this.decodedMast[6].map(item => {
      return { code: item.FL_CODE, name: item.FL_SHORTNAME, selected: false };
    });

    this.rapArray = this.decodedMast[16].filter(x => x.ISACTIVE == true)
    this.rapArray = this.rapArray.map(item => {
      return { name: item.RAPNAME, selected: false };
    });
    this.RAPARR = this.rapArray[0].name

    this.shadeArray = this.decodedMast[19].map(item => {
      return { code: item.SH_CODE, name: item.SH_NAME, selected: false };
    });

    this.crownOpenArray = this.decodedMast[20].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.culetArray = this.decodedMast[21].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.extraFacetArray = this.decodedMast[22].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.eyeCleanArray = this.decodedMast[23].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.gridleOpenArray = this.decodedMast[24].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.grainingArray = this.decodedMast[25].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.lusterArray = this.decodedMast[26].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.milkyArray = this.decodedMast[27].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.naturalArray = this.decodedMast[28].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.pavOpenArray = this.decodedMast[29].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.sideArray = this.decodedMast[30].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.sideBlackArray = this.decodedMast[31].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.sideOpenArray = this.decodedMast[32].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.tableArray = this.decodedMast[33].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.tableBlackArray = this.decodedMast[34].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.tableOpenArray = this.decodedMast[35].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.RegArray = this.decodedMast[37].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.RSpotArray = this.decodedMast[38].map(item => {
      return { code: item.I_CODE, name: item.I_SHORTNAME, selected: false };
    });

    this.versionArray = this.decodedMast[36].map(item => {
      return { code: item.V_CODE, selected: false };
    });

    this.TagArray = this.decodedMast[39].map(item => {
      return { name: item.TAG, selected: false };
    });

    this.lotArray = this.decodedMast[14].map(item => {
      return { code: item.L_CODE };
    });
    this.filteredVs = this.vCtrl.valueChanges
      .pipe(
        startWith(''),
        map(grp => grp ? this.filterVs(grp) : this.versionArray)
      );
    this.filteredLots = this.lotCtrl.valueChanges
      .pipe(
        startWith(''),
        map(lot => lot ? this.filterLots(lot) : this.lotArray)
      );

  }

  filteremps(code: string) {
    return this.emps.filter(
      shp => shp.code.toLowerCase().indexOf(code.toLowerCase()) === 0
    );
  }

  filterVs(code: string) {
    return this.versionArray.filter(
      shp => shp.code.toLowerCase().indexOf(code.toLowerCase()) === 0
    );
  }

  filterLots(code: string) {
    return this.lotArray.filter(
      shp => shp.code.toLowerCase().indexOf(code.toLowerCase()) === 0
    );
  }

  SelectEmp(e: any) {
    const a = this.emps.filter(option =>
      option.code.toLocaleLowerCase().includes(e.toLowerCase())
    );

    if (a.length == 0) {
      this.empCtrl.setValue('');
      this.EMP_CODE = '';
    } else {
      let x = this.emps.some(item => {
        return item.code === e.toUpperCase();
      });

      if (x == true) {
        this.empName = this.emps.find(x => x.code == e.toUpperCase()).name;
        this.EMP_CODE = e.toUpperCase();
      } else if (x == false) {
        this.empName = '';
        this.EMP_CODE = '';
      }
    }
  }

  onEnterEmp(evt: any) {
    if (evt.source.selected) {
      this.empName = this.emps.find(
        x => x.code.toString() == evt.source.value
      ).name;
      let a = this.empName;
    }
  }

  //GRID 1 READY
  onPriceGridReady(params) {
    this.PricegridApi = params.api;
    this.PricegridColumnApi = params.columnApi;
    this.PriceLoadGridData([])
    this.PricegridApi.sizeColumnsToFit();
  }

  //GRID 2 READY
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData([])
    this.gridApi.sizeColumnsToFit();
  }

  //GRID 3 READY
  onGridSizeReady(params) {
    this.SizegridApi = params.api;
    this.SizegridColumnApi = params.columnApi;
    this.SizeGridArray = this.decodedMast[2].filter(x => x.SZ_TYPE == 'RAP')
    this.SizeLoadGridData(this.SizeGridArray)
    this.SizegridApi.sizeColumnsToFit();
  }

  //MAIN GRID READY
  MainonGridReady(params) {
    this.MaingridApi = params.api;
    this.MaingridColumnApi = params.columnApi;
    this.MainLoadGridData()
  }

  //WHEN PAGE SHOW THAT TIME ENTRY EMPTY ROW & SELECT THAT ROW
  async MainLoadGridData() {
    await this.MaingridApi.applyTransaction({
      add: [{
        PLNSEL: false, PLANNO: 0, PTAG: '',
        EMP_CODE: '', PRDS_CODE: '', PRDQ_CODE: 0,
        Q_NAME: '', PRDC_CODE: 0, C_NAME: '',
        PRDMC_CODE: 0, PRDMFL_CODE: 0,
        PRDCARAT: 0, PRDCUT_CODE: 1, CUT_NAME: 'EX',
        PRDPOL_CODE: 1, POL_NAME: 'EX', PRDSYM_CODE: 1,
        SYM_NAME: 'EX', PRDFL_CODE: 1, FL_NAME: 'N',
        PRDIN_CODE: 1, IN_NAME: 'NONE', PRDSH_CODE: 1,
        SH_NAME: 'NONE', RATE: 0, AMT: 0,
        SRATE: 0, SAMT: 0, RRATE: 0,
        RAMT: 0, CPAMT: 0, CMAMT: 0,
        QPAMT: 0, QMAMT: 0, PRDTABLE: 0,
        PRDTABLE_BLACK: 0, PRDTABLE_OPEN: 0, PRDSIDE: 0,
        PRDSIDE_BLACK: 0, PRDSIDE_OPEN: 0, PRDCROWN_OPEN: 0,
        PRDGIRDLE_OPEN: 0, PRDPAV_OPEN: 0, PRDCULET: 0,
        PRDEXTFACET: 0, PRDEYECLEAN: 0, PRDGRAINING: 0,
        PRDLUSTER: 0, PRDMILKY: 0, PRDNATURAL: 0,
        PRDREDSPOT: 0, TYP: '', ISLOCK: false,
        CMAMTCOL: '', CPAMTCOL: '', QMAMTCOL: '', QPAMTCOL: '',
        PRDDIA_CODE: 0, PRDDEPTH_CODE: 0, PRDTAB_CODE: 0, PRDRAT_CODE: 0,
        RAPTYPE: 'LB', V_CODE: 0
      }],
      addIndex: 0
    });
    this.MaingridApi.getRowNode(0).setSelected(true);
  }

  //LOAD GRID 1
  PriceLoadGridData(e: any) {
    this.PricegridApi.setRowData(e);
    this.PricegridApi.sizeColumnsToFit();
  }

  //LOAD GRID 3
  SizeLoadGridData(e: any) {
    this.SizegridApi.setRowData(e);
    this.SizegridApi.sizeColumnsToFit();
  }

  //LOAD GRID 2
  LoadGridData(e: any) {
    this.gridApi.setRowData(e);
    this.gridApi.sizeColumnsToFit();
  }

  async pressNum(num: string) {

    if ((this.input.toString()).length == 10) {
      return;
    }

    if (num == ".") {
      if ((this.input.toString()).includes(".")) {
        return;
      }
      if (this.input == "0") {
        this.input = "0.";
        return;
      }
    }

    if (num == "0") {
      if (this.input == "") {
        return;
      }
    }
    this.input == "0" ? this.input = num : this.input += num;

    // SELECT SIZE GRID ROW AS PER CAL INPUT
    var selectedRows = this.MaingridApi.getSelectedNodes()
    for (let i = 0; i < this.MaingridApi.getSelectedRows().length; i++) {
      selectedRows[i].setDataValue('PRDCARAT', this.input)
    }
    const index = this.SizeGridArray.findIndex(x => this.input >= x.F_SIZE && this.input <= x.T_SIZE)
    // const index = this.SizeGridArray.indexOf(filtersize);
    this.SizegridApi.getRowNode(index).setSelected(true);
    this.SizegridApi.ensureIndexVisible(index, null);
    await this.findRap()
  }

  async backSpace() {
    this.input = this.input.slice(0, -1);
    if (this.input.length == 0) {
      this.input = '0';
    }
    var selectedRows = this.MaingridApi.getSelectedNodes()
    for (let i = 0; i < this.MaingridApi.getSelectedRows().length; i++) {
      selectedRows[i].setDataValue('PRDCARAT', this.input)
    }
    await this.findRap()
  }

  clear() {
    this.input = '0';
  }

  ClearSRNO() {
    this.SRNO = ''
  }

  //SET USER WISE PREDECTION
  GetPrd() {
    this.DISABLELOTSRNO = true;
    let IUSER = ''
    if (this.decodedTkn.U_CAT == 'S' || this.decodedTkn.PROC_CODE == 2 || this.decodedTkn.PROC_CODE == 5 || this.decodedTkn.PROC_CODE == 22 || this.decodedTkn.PROC_CODE == 23) {
      IUSER = ''
    } else {
      IUSER = this.decodedTkn.UserId
      this.empCtrl.disable()
      this.empCtrl.disabled
    }
    //FOR EMP FILL
    this.RapCalcServ.PrdEmpFill({ L_CODE: this.L_CODE, SRNO: this.SRNO, TAG: this.TAG, IUSER: IUSER }).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {

          this.emps = PCRes.data[0].map(item => {
            return { code: item.EMP_CODE, name: item.EMP_NAME };
          });
          this.empCtrl.setValue(PCRes.data[1][0].EMP_CODE)
          this.filteredemps = this.empCtrl.valueChanges
            .pipe(
              startWith(''),
              map(emp => emp ? this.filteremps(emp) : this.emps)
            );
          this.EMP_CODE = PCRes.data[1][0].EMP_CODE
          this.ROUCARAT = PCRes.data[1][0].I_CARAT
          // THIS FUNCTION FOR PREDECTION FILL
          this.FILLDATA();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(PCRes.data.originalError.info.message),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  // THIS FUNCTION FOR PREDECTION FILL
  async FILLDATA() {

    this.RapCalcServ.RapCalcDisp({ L_CODE: this.L_CODE, SRNO: this.SRNO, TAG: this.TAG, EMP_CODE: this.EMP_CODE }).subscribe(async (PCRes) => {
      try {
        if (PCRes.success == true) {
          let a = PCRes.data.map(item => {
            return {
              PLNSEL: item.PLNSEL,
              PLANNO: item.PLANNO,
              PTAG: item.PTAG,
              EMP_CODE: item.EMP_CODE,
              PRDS_CODE: item.PRDS_CODE,
              PRDQ_CODE: item.PRDQ_CODE,
              Q_NAME: this.clarityArray.filter(x => x.code == item.PRDQ_CODE).length != 0 ? this.clarityArray.filter(x => x.code == item.PRDQ_CODE)[0].name : '',
              PRDC_CODE: item.PRDC_CODE,
              C_NAME: this.colorArray.filter(x => x.code == item.PRDC_CODE).length != 0 ? this.colorArray.filter(x => x.code == item.PRDC_CODE)[0].name : '',
              PRDCARAT: item.PRDCARAT,
              PRDCUT_CODE: item.PRDCUT_CODE,
              CUT_NAME: this.cutArray.filter(x => x.code == item.PRDCUT_CODE).length != 0 ? this.cutArray.filter(x => x.code == item.PRDCUT_CODE)[0].name : '',
              PRDMC_CODE: item.PRDMC_CODE,
              PRDMFL_CODE: item.PRDMFL_CODE,
              PRDPOL_CODE: item.PRDPOL_CODE,
              POL_NAME: this.polArray.filter(x => x.code == item.PRDPOL_CODE)[0].name,
              PRDSYM_CODE: item.PRDSYM_CODE,
              SYM_NAME: this.symArray.filter(x => x.code == item.PRDSYM_CODE)[0].name,
              PRDFL_CODE: item.PRDFL_CODE,
              FL_NAME: this.floArray.filter(x => x.code == item.PRDFL_CODE)[0].name,
              PRDIN_CODE: item.PRDIN_CODE,
              IN_NAME: this.RegArray.filter(x => x.code == item.PRDIN_CODE)[0].name,
              PRDSH_CODE: item.PRDSH_CODE,
              SH_NAME: this.shadeArray.filter(x => x.code == item.PRDSH_CODE)[0].name,
              RATE: item.RATE,
              AMT: item.AMT,
              SRATE: item.SRATE,
              SAMT: item.SAMT,
              RRATE: item.RRATE,
              RAMT: item.RAMT,
              CPAMT: item.CPAMT,
              CMAMT: item.CMAMT,
              QPAMT: item.QPAMT,
              QMAMT: item.QMAMT,
              PRDTABLE: item.PRDTABLE,
              PRDTABLE_BLACK: item.PRDTABLE_BLACK,
              PRDTABLE_OPEN: item.PRDTABLE_OPEN,
              PRDSIDE: item.PRDSIDE,
              PRDSIDE_BLACK: item.PRDSIDE_BLACK,
              PRDSIDE_OPEN: item.PRDSIDE_OPEN,
              PRDCROWN_OPEN: item.PRDCROWN_OPEN,
              PRDGIRDLE_OPEN: item.PRDGIRDLE_OPEN,
              PRDPAV_OPEN: item.PRDPAV_OPEN,
              PRDCULET: item.PRDCULET,
              PRDEXTFACET: item.PRDEXTFACET,
              PRDEYECLEAN: item.PRDEYECLEAN,
              PRDGRAINING: item.PRDGRAINING,
              PRDLUSTER: item.PRDLUSTER,
              PRDMILKY: item.PRDMILKY,
              PRDNATURAL: item.PRDNATURAL,
              PRDREDSPOT: item.PRDREDSPOT,
              TYP: item.TYP,
              ISLOCK: item.ISLOCK,
              PRDDIA_CODE: item.PRDDIA_CODE,
              PRDDEPTH_CODE: item.PRDDEPTH_CODE,
              PRDTAB_CODE: item.PRDTAB_CODE,
              PRDRAT_CODE: item.PRDRAT_CODE,
              CMAMTCOL: '',
              CPAMTCOL: '',
              QMAMTCOL: '',
              QPAMTCOL: '',
              RAPTYPE: item.RAPTYPE,
              V_CODE: item.V_CODE
            }
          });
          //SET DATE AS PER API RES
          this.MaingridApi.setRowData(a);
          if (a.length == 0) {
            this.MainLoadGridData()
            this.UPDATEGRID()
            this.MaingridApi.redrawRows();
          } else {
            if (a[0].EMP_CODE != '') {
              this.MaingridApi.getRowNode(0).setSelected(true);
              await this.findRap()

              //FOR APPLY COLOR EFFET
              this.MaingridApi.redrawRows({ rowNodes: a });
              this.MaingridApi.redrawRows();
            } else {
              for (let i = 0; i < a.length; i++) {
                this.MaingridApi.getRowNode(i).setSelected(true);
                await this.findRap()
                this.MaingridApi.redrawRows({ rowNodes: a });
                this.MaingridApi.redrawRows();
                this.MaingridApi.getRowNode(i).setSelected(false);
              }
              this.MaingridApi.getRowNode(0).setSelected(true);
            }

          }

        } else {
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  //SELECT CHIP
  SelectItem(Data: any, Mast: any) {
    let selectedRowsdata = this.MaingridApi.getSelectedRows()
    let GridRowData = []
    this.MaingridApi.forEachNode(function (rowNode, index) {
      GridRowData.push(rowNode.data);
    });
    this[Mast] = this[Mast].map(item =>
      item.name == Data.name
        ? {
          name: item.name,
          code: item.code,
          selected: true
        }
        : {
          name: item.name,
          code: item.code,
          selected: false
        }
    );

    //GET SELECTED ROW
    let selectedRows = this.MaingridApi.getSelectedNodes()
    if (Mast == 'TagArray') {
      if (this.MaingridApi.getSelectedRows().length == 1) {
        for (let i = 0; i < GridRowData.length; i++) {
          if (GridRowData[i].PTAG == this[Mast].filter(x => x.selected == true)[0].name && GridRowData[i].PLANNO == selectedRowsdata[0].PLANNO && GridRowData[i].PTAG != '') {
            this.toastr.warning('ENTER ANOTHER TAG OR PLANNO')
            return
          }
        }
        selectedRows[0].setDataValue('PTAG', this[Mast].filter(x => x.selected == true)[0].name)
      }
    }
    else {
      //GridRowData FOR FULL DATA
      //selectedRowsdata FOR SELECT DATA
      //SET DATA IN GRID AS PER SELECT CHIPS
      for (let i = 0; i < this.MaingridApi.getSelectedRows().length; i++) {
        switch (Mast) {
          case 'PlanArray':
            for (let i = 0; i < GridRowData.length; i++) {
              for (let j = 0; j < selectedRowsdata.length; j++) {
                if (GridRowData[i].PTAG == selectedRowsdata[j].PTAG && GridRowData[i].PLANNO == this[Mast].filter(x => x.selected == true)[0].name && GridRowData[i].PTAG != '') {
                  this.toastr.warning('ENTER ANOTHER TAG OR PLANNO')
                  return
                }
              }
            }
            selectedRows[i].setDataValue('PLANNO', this[Mast].filter(x => x.selected == true)[0].name)
            break
          case 'shapeArray':
            selectedRows[i].setDataValue('PRDS_CODE', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'clarityArray':
            selectedRows[i].setDataValue('PRDQ_CODE', this[Mast].filter(x => x.selected == true)[0].code)
            selectedRows[i].setDataValue('Q_NAME', this[Mast].filter(x => x.selected == true)[0].name)
            break
          case 'colorArray':
            selectedRows[i].setDataValue('PRDC_CODE', this[Mast].filter(x => x.selected == true)[0].code)
            selectedRows[i].setDataValue('C_NAME', this[Mast].filter(x => x.selected == true)[0].name)
            break
          case 'cutArray':
            selectedRows[i].setDataValue('PRDCUT_CODE', this[Mast].filter(x => x.selected == true)[0].code)
            selectedRows[i].setDataValue('CUT_NAME', this[Mast].filter(x => x.selected == true)[0].name)
            break
          case 'polArray':
            selectedRows[i].setDataValue('PRDPOL_CODE', this[Mast].filter(x => x.selected == true)[0].code)
            selectedRows[i].setDataValue('POL_NAME', this[Mast].filter(x => x.selected == true)[0].name)
            break
          case 'symArray':
            selectedRows[i].setDataValue('PRDSYM_CODE', this[Mast].filter(x => x.selected == true)[0].code)
            selectedRows[i].setDataValue('SYM_NAME', this[Mast].filter(x => x.selected == true)[0].name)
            break
          case 'floArray':
            selectedRows[i].setDataValue('PRDFL_CODE', this[Mast].filter(x => x.selected == true)[0].code)
            selectedRows[i].setDataValue('FL_NAME', this[Mast].filter(x => x.selected == true)[0].name)
            break
          case 'shadeArray':
            selectedRows[i].setDataValue('PRDSH_CODE', this[Mast].filter(x => x.selected == true)[0].code)
            selectedRows[i].setDataValue('SH_NAME', this[Mast].filter(x => x.selected == true)[0].name)
            break
          case 'RegArray':
            selectedRows[i].setDataValue('PRDIN_CODE', this[Mast].filter(x => x.selected == true)[0].code)
            selectedRows[i].setDataValue('IN_NAME', this[Mast].filter(x => x.selected == true)[0].name)
            break
          case 'crownOpenArray':
            selectedRows[i].setDataValue('PRDCROWN_OPEN', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'culetArray':
            selectedRows[i].setDataValue('PRDCULET', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'extraFacetArray':
            selectedRows[i].setDataValue('PRDEXTFACET', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'eyeCleanArray':
            selectedRows[i].setDataValue('PRDEYECLEAN', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'gridleOpenArray':
            selectedRows[i].setDataValue('PRDGIRDLE_OPEN', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'grainingArray':
            selectedRows[i].setDataValue('PRDGRAINING', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'lusterArray':
            selectedRows[i].setDataValue('PRDLUSTER', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'milkyArray':
            selectedRows[i].setDataValue('PRDMILKY', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'naturalArray':
            selectedRows[i].setDataValue('PRDNATURAL', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'pavOpenArray':
            selectedRows[i].setDataValue('PRDPAV_OPEN', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'sideArray':
            selectedRows[i].setDataValue('PRDSIDE', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'sideBlackArray':
            selectedRows[i].setDataValue('PRDSIDE_BLACK', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'sideOpenArray':
            selectedRows[i].setDataValue('PRDSIDE_OPEN', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'tableArray':
            selectedRows[i].setDataValue('PRDTABLE', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'tableBlackArray':
            selectedRows[i].setDataValue('PRDTABLE_BLACK', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'tableOpenArray':
            selectedRows[i].setDataValue('PRDTABLE_OPEN', this[Mast].filter(x => x.selected == true)[0].code)
            break
          case 'RSpotArray':
            selectedRows[i].setDataValue('PRDREDSPOT', this[Mast].filter(x => x.selected == true)[0].code)
            break
          default:
            break
        }
      }
    }
    this.findRap()
  }

  //FOR LB & LC SELECT
  SELECTRAPTITEM(Data: any, Mast: any) {
    this[Mast] = this[Mast].map(item =>
      item.name == Data.name
        ? {
          name: item.name,
          selected: true
        }
        : {
          name: item.name,
          selected: false
        }
    );
    this.RAPTYPE = this[Mast].filter(x => x.selected == true)[0].name
    let selectedRows = this.MaingridApi.getSelectedNodes()
    for (let i = 0; i < this.MaingridApi.getSelectedRows().length; i++) {
      selectedRows[i].setDataValue('RAPTYPE', this[Mast].filter(x => x.selected == true)[0].code)
    }
    if (this.MaingridApi.getSelectedRows().length == 1) {
      this.findRap()
    }
  }

  //ADD EMPTY ROW
  AddRow() {
    const newItems = [
      {
        PLNSEL: false, PLANNO: 0, PTAG: '',
        EMP_CODE: this.EMP_CODE, PRDS_CODE: '', PRDQ_CODE: 0,
        Q_NAME: '', PRDC_CODE: 0, C_NAME: '',
        PRDCARAT: 0, PRDCUT_CODE: 1, CUT_NAME: 'EX',
        PRDMC_CODE: 0, PRDMFL_CODE: 0,
        PRDPOL_CODE: 1, POL_NAME: 'EX', PRDSYM_CODE: 1,
        SYM_NAME: 'EX', PRDFL_CODE: 1, FL_NAME: 'N',
        PRDIN_CODE: 1, IN_NAME: 'NONE', PRDSH_CODE: 1,
        SH_NAME: 'NONE', RATE: 0, AMT: 0,
        SRATE: 0, SAMT: 0, RRATE: 0,
        RAMT: 0, CPAMT: 0, CMAMT: 0,
        QPAMT: 0, QMAMT: 0, PRDTABLE: 0,
        PRDTABLE_BLACK: 0, PRDTABLE_OPEN: 0, PRDSIDE: 0,
        PRDSIDE_BLACK: 0, PRDSIDE_OPEN: 0, PRDCROWN_OPEN: 0,
        PRDGIRDLE_OPEN: 0, PRDPAV_OPEN: 0, PRDCULET: 0,
        PRDEXTFACET: 0, PRDEYECLEAN: 0, PRDGRAINING: 0,
        PRDLUSTER: 0, PRDMILKY: 0, PRDNATURAL: 0,
        PRDREDSPOT: 0, TYP: '', ISLOCK: false,
        PRDDIA_CODE: 0, PRDDEPTH_CODE: 0, PRDTAB_CODE: 0, PRDRAT_CODE: 0,
        CMAMTCOL: '', CPAMTCOL: '', QMAMTCOL: '', QPAMTCOL: '', RAPTYPE: 'LB', V_CODE: 0
      }
    ];
    let GridRowData = []
    this.MaingridApi.forEachNode(function (rowNode, index) {
      GridRowData.push(rowNode.data);
    });
    const res = this.MaingridApi.applyTransaction({
      add: newItems,
      addIndex: GridRowData.length + 1,
    });

  }

  //CLICK ON MAIN GRID ROW
  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "IS_VIW") {
      let GridRowData = []
      this.MaingridApi.forEachNode(function (rowNode, index) {
        GridRowData.push(rowNode.data);
      });
      let dataObj = eve.data;
      dataObj.PLNSEL = !dataObj.PLNSEL;
      this.MaingridApi.forEachNode(function (rowNode, index) {
        if (rowNode.data.PLANNO == dataObj.PLANNO) {
          rowNode.data.PLNSEL = dataObj.PLNSEL
        } else {
          rowNode.data.PLNSEL = false
        }
        rowNode.setData(rowNode.data)
      });
    }
    if (eve.event.target.getAttribute("col-id") == "PLANNO") {
      document.getElementById("planDropdown").click();
    }
    if (eve.event.target.getAttribute("col-id") == "PTAG") {
      document.getElementById("tagDropdown").click();
    }
    this.MaingridApi.redrawRows();
  }

  //GEID ROW SELECT CHANGE ACTIVE CHIP AS PER CODE
  COLORDATACODE(Data: any, Mast: any) {
    this[Mast] = this[Mast].map(item =>
      item.code == Data
        ? {
          name: item.name,
          code: item.code,
          selected: true
        }
        : {
          name: item.name,
          code: item.code,
          selected: false
        }
    );
  }

  //GEID ROW SELECT CHANGE ACTIVE CHIP AS PER NAME
  COLORDATA(Data: any, Mast: any) {

    this[Mast] = this[Mast].map(item =>
      item.name == Data
        ? {
          name: item.name,
          code: item.code,
          selected: true
        }
        : {
          name: item.name,
          code: item.code,
          selected: false
        }
    );
  }
  //TRIGGER ON ROW SELECTION CHANGE
  async onSelectionChanged(eve: any) {
    let RowData = eve.api.getSelectedRows()[0]
    if (this.decodedTkn.U_CAT == 'S' || this.decodedTkn.PROC_CODE == 2 || this.decodedTkn.PROC_CODE == 5 || this.decodedTkn.PROC_CODE == 22 || this.decodedTkn.PROC_CODE == 23) {
      this.disabled = false
      this.depthCtrl.enable()
      this.tableCtrl.enable()
      this.ratioCtrl.enable()
      this.diameterCtrl.enable()
    } else {
      if (RowData.ISLOCK == true) {
        this.disabled = true
        this.depthCtrl.disable()
        this.tableCtrl.disable()
        this.ratioCtrl.disable()
        this.diameterCtrl.disable()
      } else {
        this.disabled = false
        this.depthCtrl.enable()
        this.tableCtrl.enable()
        this.ratioCtrl.enable()
        this.diameterCtrl.enable()
      }
    }
    if (this.L_CODE != '' || this.SRNO != 0 || RowData.PTAG != '' || RowData.PLANNO != 0) {
      //CALL RAP CAL SELECTION VALIDATION
      await this.RapCalcServ.RapCalcSelectValidation({
        L_CODE: this.L_CODE,
        SRNO: this.SRNO,
        PTAG: RowData.PTAG,
        EMP_CODE: this.EMP_CODE,
        PLANNO: RowData.PLANNO,
      }).then((RAPVAL) => {
        try {
          if (RAPVAL.success == 1) {
            if (RAPVAL.data == 'TRUE') {
              this.tagdisabled = false
            } else {
              this.tagdisabled = true
            }
          }
          else {
            this.tagdisabled = false
          }
        }
        catch (error) {
          this.toastr.error(error)
          this.tagdisabled = false
        }
      })
    }
    // COLORDATACODE && COLORDATA THIS TWO METHOD FOR SELECT CHIP
    this.COLORDATACODE(RowData.PRDS_CODE, 'shapeArray')
    this.COLORDATA(RowData.PLANNO, 'PlanArray')
    this.COLORDATA(RowData.PTAG, 'TagArray')
    this.COLORDATA(RowData.Q_NAME, 'clarityArray')
    this.COLORDATA(RowData.C_NAME, 'colorArray')
    this.COLORDATA(RowData.CUT_NAME, 'cutArray')
    this.COLORDATA(RowData.POL_NAME, 'polArray')
    this.COLORDATA(RowData.SYM_NAME, 'symArray')
    this.COLORDATA(RowData.FL_NAME, 'floArray')
    this.COLORDATA(RowData.SH_NAME, 'shadeArray')
    this.COLORDATACODE(RowData.PRDIN_CODE, 'RegArray')
    this.COLORDATACODE(RowData.PRDCROWN_OPEN, 'crownOpenArray')
    this.COLORDATACODE(RowData.PRDCULET, 'culetArray')
    this.COLORDATACODE(RowData.PRDEXTFACET, 'extraFacetArray')
    this.COLORDATACODE(RowData.PRDEYECLEAN, 'eyeCleanArray')
    this.COLORDATACODE(RowData.PRDGIRDLE_OPEN, 'gridleOpenArray')
    this.COLORDATACODE(RowData.PRDGRAINING, 'grainingArray')
    this.COLORDATACODE(RowData.PRDLUSTER, 'lusterArray')
    this.COLORDATACODE(RowData.PRDMILKY, 'milkyArray')
    this.COLORDATACODE(RowData.PRDNATURAL, 'naturalArray')
    this.COLORDATACODE(RowData.PRDPAV_OPEN, 'pavOpenArray')
    this.COLORDATACODE(RowData.PRDSIDE, 'sideArray')
    this.COLORDATACODE(RowData.PRDSIDE_BLACK, 'sideBlackArray')
    this.COLORDATACODE(RowData.PRDSIDE_OPEN, 'sideOpenArray')
    this.COLORDATACODE(RowData.PRDTABLE, 'tableArray')
    this.COLORDATACODE(RowData.PRDTABLE_BLACK, 'tableBlackArray')
    this.COLORDATACODE(RowData.PRDTABLE_OPEN, 'tableOpenArray')
    this.COLORDATACODE(RowData.PRDREDSPOT, 'RSpotArray')
    this.COLORDATACODE(RowData.RAPTYPE, 'RAPTArray')
    this.input = RowData.PRDCARAT

    if (this.deptharray.filter(x => x.code == RowData.PRDDEPTH_CODE).length != 0) {
      this.depthCtrl.setValue(this.deptharray.filter(x => x.code == RowData.PRDDEPTH_CODE)[0].name)
      this.DEPTH = this.deptharray.filter(x => x.code == RowData.PRDDEPTH_CODE)[0].name
    } else {
      this.depthCtrl.setValue(0)
      this.DEPTH = 0
    }

    if (this.diameterarray.filter(x => x.code == RowData.PRDDIA_CODE).length != 0) {
      this.diameterCtrl.setValue(this.diameterarray.filter(x => x.code == RowData.PRDDIA_CODE)[0].name)
      this.DIAMETER = this.diameterarray.filter(x => x.code == RowData.PRDDIA_CODE)[0].name
    } else {
      this.diameterCtrl.setValue(0)
      this.DIAMETER = 0
    }

    if (this.tablearray.filter(x => x.code == RowData.PRDTAB_CODE).length != 0) {
      this.tableCtrl.setValue(this.tablearray.filter(x => x.code == RowData.PRDTAB_CODE)[0].name)
      this.TABLE = this.tablearray.filter(x => x.code == RowData.PRDTAB_CODE)[0].name
    } else {
      this.tableCtrl.setValue(0)
      this.TABLE = 0
    }

    if (this.ratioarray.filter(x => x.code == RowData.PRDRAT_CODE).length != 0) {
      this.ratioCtrl.setValue(this.ratioarray.filter(x => x.code == RowData.PRDRAT_CODE)[0].name)
      this.RATIO = this.ratioarray.filter(x => x.code == RowData.PRDRAT_CODE)[0].name
    } else {
      this.ratioCtrl.setValue(0)
      this.RATIO = 0
    }
    this.findRap()
  }

  //FILL BY EMPLOYEE
  UPDATEGRID() {
    let EMP = this.EMP_CODE
    if (this.MaingridApi) {
      this.MaingridApi.forEachNode(function (rowNode, index) {
        rowNode.data.EMP_CODE = EMP
        rowNode.setData(rowNode.data)
      });
    }
  }

  //COPY ROW AS PER NEW ITEM ARRY
  COPY() {
    if (this.MaingridApi.getSelectedRows().length == 1) {
      let oldplan = this.MaingridApi.getSelectedRows()
      const newItems = [
        {
          PLNSEL: false, PLANNO: oldplan[0].PLANNO, PTAG: '',
          EMP_CODE: oldplan[0].EMP_CODE, PRDS_CODE: oldplan[0].PRDS_CODE, PRDQ_CODE: oldplan[0].PRDQ_CODE,
          Q_NAME: oldplan[0].Q_NAME, PRDC_CODE: oldplan[0].PRDC_CODE, C_NAME: oldplan[0].C_NAME,
          PRDCARAT: oldplan[0].PRDCARAT, PRDCUT_CODE: oldplan[0].PRDCUT_CODE, CUT_NAME: oldplan[0].CUT_NAME,
          PRDMC_CODE: oldplan[0].PRDMC_CODE, PRDMFL_CODE: oldplan[0].PRDMFL_CODE,
          PRDPOL_CODE: oldplan[0].PRDPOL_CODE, POL_NAME: oldplan[0].POL_NAME, PRDSYM_CODE: oldplan[0].PRDSYM_CODE,
          SYM_NAME: oldplan[0].SYM_NAME, PRDFL_CODE: oldplan[0].PRDFL_CODE, FL_NAME: oldplan[0].FL_NAME,
          PRDIN_CODE: oldplan[0].PRDIN_CODE, IN_NAME: oldplan[0].IN_NAME, PRDSH_CODE: oldplan[0].PRDSH_CODE,
          SH_NAME: oldplan[0].SH_NAME, RATE: oldplan[0].RATE, AMT: oldplan[0].AMT,
          SRATE: oldplan[0].SRATE, SAMT: oldplan[0].SAMT, RRATE: oldplan[0].RRATE,
          RAMT: oldplan[0].RAMT, CPAMT: oldplan[0].CPAMT, CMAMT: oldplan[0].CMAMT,
          QPAMT: oldplan[0].QPAMT, QMAMT: oldplan[0].QMAMT, PRDTABLE: oldplan[0].PRDTABLE,
          PRDTABLE_BLACK: oldplan[0].PRDTABLE_BLACK, PRDTABLE_OPEN: oldplan[0].PRDTABLE_OPEN, PRDSIDE: oldplan[0].PRDSIDE,
          PRDSIDE_BLACK: oldplan[0].PRDSIDE_BLACK, PRDSIDE_OPEN: oldplan[0].PRDSIDE_OPEN, PRDCROWN_OPEN: oldplan[0].PRDCROWN_OPEN,
          PRDGIRDLE_OPEN: oldplan[0].PRDGIRDLE_OPEN, PRDPAV_OPEN: oldplan[0].PRDPAV_OPEN, PRDCULET: oldplan[0].PRDCULET,
          PRDEXTFACET: oldplan[0].PRDEXTFACET, PRDEYECLEAN: oldplan[0].PRDEYECLEAN, PRDGRAINING: oldplan[0].PRDGRAINING,
          PRDLUSTER: oldplan[0].PRDLUSTER, PRDMILKY: oldplan[0].PRDMILKY, PRDNATURAL: oldplan[0].PRDNATURAL,
          PRDREDSPOT: oldplan[0].PRDREDSPOT, TYP: oldplan[0].TYP, ISLOCK: false,
          PRDDIA_CODE: oldplan[0].PRDDIA_CODE, PRDDEPTH_CODE: oldplan[0].PRDDEPTH_CODE,
          PRDTAB_CODE: oldplan[0].PRDTAB_CODE, PRDRAT_CODE: oldplan[0].PRDRAT_CODE,
          CMAMTCOL: oldplan[0].CMAMTCOL, CPAMTCOL: oldplan[0].CPAMTCOL, QMAMTCOL: oldplan[0].QMAMTCOL, QPAMTCOL: oldplan[0].QPAMTCOL,
          RAPTYPE: oldplan[0].RAPTYPE, V_CODE: oldplan[0].V_CODE
        }
      ];
      let GridRowData = []
      this.MaingridApi.forEachNode(function (rowNode, index) {
        GridRowData.push(rowNode.data);
      });
      const res = this.MaingridApi.applyTransaction({
        add: newItems,
        addIndex: GridRowData.length + 1,
      });

    } else {
      this.toastr.warning("Please Select Only One Plan")
    }
  }

  async findRap() {
    let selectedRows = this.MaingridApi.getSelectedNodes()
    let oldplan = this.MaingridApi.getSelectedRows()
    for (let i = 0; i < oldplan.length; i++) {
      if (oldplan[i].PRDS_CODE == "") { return }
      if (oldplan[i].PRDQ_CODE == "") { return }
      if (oldplan[i].PRDC_CODE == "") { return }
      if (oldplan[i].PRDCARAT == "") { return }
      if (oldplan[i].PRDCUT_CODE == "") { return }
      if (oldplan[i].PRDPOL_CODE == "") { return }
      if (oldplan[i].PRDSYM_CODE == "") { return }
      if (oldplan[i].PRDSH_CODE == "") { return }
      await this.RapCalcServ.FindRap(
        {
          S_CODE: oldplan[i].PRDS_CODE,
          Q_CODE: oldplan[i].PRDQ_CODE,
          C_CODE: oldplan[i].PRDC_CODE,
          CARAT: oldplan[i].PRDCARAT,
          CUT_CODE: oldplan[i].PRDCUT_CODE,
          POL_CODE: oldplan[i].PRDPOL_CODE,
          SYM_CODE: oldplan[i].PRDSYM_CODE,
          FL_CODE: oldplan[i].PRDFL_CODE,
          IN_CODE: oldplan[i].PRDIN_CODE,
          SH_CODE: oldplan[i].PRDSH_CODE,
          TABLE: oldplan[i].PRDTABLE_CODE,
          TABLE_BLACK: oldplan[i].PRDTABLE_BLACK,
          TABLE_OPEN: oldplan[i].PRDTABLE_OPEN,
          SIDE: oldplan[i].PRDSIDE,
          SIDE_BLACK: oldplan[i].PRDSIDE_BLACK,
          SIDE_OPEN: oldplan[i].PRDSIDE_OPEN,
          CROWN_OPEN: oldplan[i].PRDCROWN_OPEN,
          GIRDLE_OPEN: oldplan[i].PRDGIRDLE_OPEN,
          PAV_OPEN: oldplan[i].PRDPAV_OPEN,
          CULET: oldplan[i].PRDCULET,
          EXTFACET: oldplan[i].PRDEXTFACET,
          EYECLAEN: oldplan[i].PRDEYECLEAN,
          GRAINING: oldplan[i].PRDGRAINING,
          LUSTER: oldplan[i].PRDLUSTER,
          MILKY: oldplan[i].PRDMILKY,
          NATURAL: oldplan[i].PRDNATURAL,
          REDSPOT: oldplan[i].PRDREDSPOT,
          V_CODE: this.V_CODE == null ? 0 : this.V_CODE,
          RAPTYPE: this.RAPTYPE,
          DIA: oldplan[i].PRDDIA_CODE,
          DEPTH: oldplan[i].PRDDEPTH_CODE,
          RATIO: oldplan[i].PRDRAT_CODE,
          TAB: oldplan[i].PRDTAB_CODE
        }
      ).then((PCRes) => {
        try {
          if (PCRes.success == true) {
            this.MANPRICEGIAARR = PCRes.data[3]
            this.MANPRICELOOSEARR = PCRes.data[5]

            selectedRows[i].setDataValue('QPAMTCOL', PCRes.data[8][0][''])
            selectedRows[i].setDataValue('QMAMTCOL', PCRes.data[10][0][''])
            selectedRows[i].setDataValue('CPAMTCOL', PCRes.data[12][0][''])
            selectedRows[i].setDataValue('CMAMTCOL', PCRes.data[14][0][''])

            selectedRows[i].setDataValue('RATE', PCRes.data[1][0][''])
            selectedRows[i].setDataValue('AMT', (PCRes.data[1][0][''] * oldplan[i].PRDCARAT))
            selectedRows[i].setDataValue('SRATE', PCRes.data[4][0][''])
            selectedRows[i].setDataValue('SAMT', (PCRes.data[4][0][''] * oldplan[i].PRDCARAT))
            selectedRows[i].setDataValue('RRATE', PCRes.data[6][0][''])
            selectedRows[i].setDataValue('RAMT', (PCRes.data[6][0][''] * oldplan[i].PRDCARAT))
            selectedRows[i].setDataValue('QPAMT', (PCRes.data[7][0][''] * oldplan[i].PRDCARAT))
            selectedRows[i].setDataValue('QMAMT', (PCRes.data[9][0][''] * oldplan[i].PRDCARAT))
            selectedRows[i].setDataValue('CPAMT', (PCRes.data[11][0][''] * oldplan[i].PRDCARAT))
            selectedRows[i].setDataValue('CMAMT', (PCRes.data[13][0][''] * oldplan[i].PRDCARAT))
            if (PCRes.data[2][0][''] == 'S') {
              this.RAPARR = 'GIA'
              this.PriceLoadGridData(PCRes.data[0])
            } else if (PCRes.data[2][0][''] == 'R') {
              this.RAPARR = 'LOOSE'
              this.PriceLoadGridData(PCRes.data[0])
            }
            let GridRowData = []
            this.MaingridApi.forEachNode(function (rowNode, index) {
              GridRowData.push(rowNode.data);
            });
            let planarrys = GridRowData.map(item => {
              return { PLANNO: item.PLANNO, AMT: item.AMT, CARAT: item.PRDCARAT, PLNSEL: item.PLNSEL };
            });
            const a = (data) =>
              data.reduce((acc, { PLANNO, AMT, CARAT, PLNSEL }) => {
                const item = acc.find((el) => el.PLANNO === PLANNO);
                if (item) item.AMT += AMT;
                if (item) item.CARAT = parseFloat(item.CARAT) + parseFloat(CARAT);
                if (item) item.PLNSEL = PLNSEL;
                else acc.push({ PLANNO, AMT, CARAT, PLNSEL });
                return acc;
              }, []);
            this.PLANGRIDARR = a(planarrys)
            this.PLANGRIDARR = this.PLANGRIDARR.map(item => {
              return { PLANNO: item.PLANNO, AMT: item.AMT, CARAT: item.CARAT, PLNSEL: item.PLNSEL, PCARAT: (item.AMT / this.ROUCARAT) };
            });
            this.LoadGridData(this.PLANGRIDARR);
            let POL = 0
            for (let m = 0; m < GridRowData.length; m++) {
              if (GridRowData[m].PLANNO == oldplan[i].PLANNO) {
                POL += parseFloat(GridRowData[m].PRDCARAT)
              }
            }
            this.POLCARAT = POL.toFixed(3)
            this.TOTAMT = parseInt(this.PLANGRIDARR.filter(x => x.PLANNO == oldplan[i].PLANNO)[0].AMT)
            this.NETPER = ((parseFloat(this.POLCARAT) / parseFloat(this.ROUCARAT)) * 100).toFixed(2)
            this.PERCARAT = (parseFloat(this.TOTAMT) / parseFloat(this.ROUCARAT)).toFixed(2)


            this.RapCalcServ.FindRapType(
              {
                S_CODE: oldplan[i].PRDS_CODE,
                Q_CODE: oldplan[i].PRDQ_CODE,
                C_CODE: oldplan[i].PRDC_CODE,
                CARAT: oldplan[i].PRDCARAT,
                CUT_CODE: oldplan[i].PRDCUT_CODE,
                POL_CODE: oldplan[i].PRDPOL_CODE,
                SYM_CODE: oldplan[i].PRDSYM_CODE,
                FL_CODE: oldplan[i].PRDFL_CODE,
                IN_CODE: oldplan[i].PRDIN_CODE,
                SH_CODE: oldplan[i].PRDSH_CODE,
                TABLE: oldplan[i].PRDTABLE_CODE,
                TABLE_BLACK: oldplan[i].PRDTABLE_BLACK,
                TABLE_OPEN: oldplan[i].PRDTABLE_OPEN,
                SIDE: oldplan[i].PRDSIDE,
                SIDE_BLACK: oldplan[i].PRDSIDE_BLACK,
                SIDE_OPEN: oldplan[i].PRDSIDE_OPEN,
                CROWN_OPEN: oldplan[i].PRDCROWN_OPEN,
                GIRDLE_OPEN: oldplan[i].PRDGIRDLE_OPEN,
                PAV_OPEN: oldplan[i].PRDPAV_OPEN,
                CULET: oldplan[i].PRDCULET,
                EXTFACET: oldplan[i].PRDEXTFACET,
                EYECLAEN: oldplan[i].PRDEYECLEAN,
                GRAINING: oldplan[i].PRDGRAINING,
                LUSTER: oldplan[i].PRDLUSTER,
                MILKY: oldplan[i].PRDMILKY,
                NATURAL: oldplan[i].PRDNATURAL,
                REDSPOT: oldplan[i].PRDREDSPOT,
                V_CODE: this.V_CODE == null ? 0 : this.V_CODE,
                RAPTYPE: oldplan[i].RAPTYPE,
                DIA: oldplan[i].PRDDIA_CODE,
                DEPTH: oldplan[i].PRDDEPTH_CODE,
                RATIO: oldplan[i].PRDRAT_CODE,
                TAB: oldplan[i].PRDTAB_CODE
              }).then((RAPTYP) => {
                try {
                  if (RAPTYP.success == 1) {
                    selectedRows[i].setDataValue('TYP', RAPTYP.data)
                    this.MaingridApi.redrawRows();
                  }
                  else { }
                }
                catch (error) { this.toastr.error(error) }
              })
          } else {
          }
        } catch (error) {
          this.toastr.error(error)
        }
      })
    }
    this.MaingridApi.redrawRows();
  }

  radioChange(e: any) {
    if (e.value == 'GIA') {
      this.PriceLoadGridData(this.MANPRICEGIAARR)
    }
    else if (e.value == 'LOOSE') {
      this.PriceLoadGridData(this.MANPRICELOOSEARR)
    }
  }

  PARAMCOMBO(e: any) {

    let a = this.decodedMast[40].filter(x => x.PARAM_NAME == 'DEPTH' && x.S_CODE == e)
    this.deptharray = a.map(item => {
      return { code: item.PARAM_CODE, name: '' + item.FMETER + '' + ' - ' + '' + item.TMETER + '' };
    });
    this.filtereddepths = this.depthCtrl.valueChanges.pipe(
      startWith(''),
      map(depth => (depth ? this.filterdepths(depth) : this.deptharray))
    );

    let b = this.decodedMast[40].filter(x => x.PARAM_NAME == 'DIAMETER' && x.S_CODE == e)
    this.diameterarray = b.map(item => {
      return { code: item.PARAM_CODE, name: '' + item.FMETER + '' + ' - ' + '' + item.TMETER + '' };
    });
    this.filtereddiameters = this.diameterCtrl.valueChanges.pipe(
      startWith(''),
      map(diameter => (diameter ? this.filterdiameters(diameter) : this.diameterarray))
    );

    let c = this.decodedMast[40].filter(x => x.PARAM_NAME == 'TABLE' && x.S_CODE == e)
    this.tablearray = c.map(item => {
      return { code: item.PARAM_CODE, name: '' + item.FMETER + '' + ' - ' + '' + item.TMETER + '' };
    });
    this.filteredtables = this.tableCtrl.valueChanges.pipe(
      startWith(''),
      map(table => (table ? this.filtertables(table) : this.tablearray))
    );

    let d = this.decodedMast[40].filter(x => x.PARAM_NAME == 'RATIO' && x.S_CODE == e)
    this.ratioarray = d.map(item => {
      return { code: item.PARAM_CODE, name: '' + item.FMETER + '' + ' - ' + '' + item.TMETER + '' };
    });
    this.filteredratios = this.ratioCtrl.valueChanges.pipe(
      startWith(''),
      map(ratio => (ratio ? this.filterratios(ratio) : this.ratioarray))
    );

  }

  filterdepths(code: string) {
    return this.deptharray.filter(
      depth => depth.name.toLowerCase().indexOf(code.toLowerCase()) === 0
    );
  }

  filterdiameters(code: string) {
    return this.diameterarray.filter(
      diameter => diameter.name.toLowerCase().indexOf(code.toLowerCase()) === 0
    );
  }

  filtertables(code: string) {
    return this.tablearray.filter(
      table => table.name.toLowerCase().indexOf(code.toLowerCase()) === 0
    );
  }

  filterratios(code: string) {
    return this.ratioarray.filter(
      ratio => ratio.name.toLowerCase().indexOf(code.toLowerCase()) === 0
    );
  }

  GETDEPTHNAME() {
    if (this.MaingridApi) {
      if (this.deptharray.filter(x => x.name == this.DEPTH).length != 0) {
        this.DEPTHNAME = this.deptharray.filter(x => x.name == this.DEPTH)[0].code
        let selectedRows = this.MaingridApi.getSelectedNodes()
        let oldplan = this.MaingridApi.getSelectedRows()
        for (let i = 0; i < oldplan.length; i++) {
          selectedRows[i].setDataValue('PRDDEPTH_CODE', this.deptharray.filter(x => x.name == this.DEPTH)[0].code)
        }
      } else {
        this.DEPTHNAME = 0
        let selectedRows = this.MaingridApi.getSelectedNodes()
        let oldplan = this.MaingridApi.getSelectedRows()
        for (let i = 0; i < oldplan.length; i++) {
          selectedRows[i].setDataValue('PRDDEPTH_CODE', 0)
        }
      }
      if (this.DEPTH != 0) {
        this.findRap()
      }
    }
  }

  GETDIAMETERNAME() {
    if (this.MaingridApi) {
      if (this.diameterarray.filter(x => x.name == this.DIAMETER).length != 0) {
        this.DIAMETERNAME = this.diameterarray.filter(x => x.name == this.DIAMETER)[0].code
        let selectedRows = this.MaingridApi.getSelectedNodes()
        let oldplan = this.MaingridApi.getSelectedRows()
        for (let i = 0; i < oldplan.length; i++) {
          selectedRows[i].setDataValue('PRDDIA_CODE', this.diameterarray.filter(x => x.name == this.DIAMETER)[0].code)
        }
      } else {
        this.DIAMETERNAME = 0
        let selectedRows = this.MaingridApi.getSelectedNodes()
        let oldplan = this.MaingridApi.getSelectedRows()
        for (let i = 0; i < oldplan.length; i++) {
          selectedRows[i].setDataValue('PRDDIA_CODE', 0)
        }
      }
      if (this.DIAMETER != 0) {
        this.findRap()
      }
    }
  }

  GETTABLENAME() {
    if (this.MaingridApi) {
      if (this.tablearray.filter(x => x.name == this.TABLE).length != 0) {
        this.TABLENAME = this.tablearray.filter(x => x.name == this.TABLE)[0].code
        let selectedRows = this.MaingridApi.getSelectedNodes()
        let oldplan = this.MaingridApi.getSelectedRows()
        for (let i = 0; i < oldplan.length; i++) {
          selectedRows[i].setDataValue('PRDTAB_CODE', this.tablearray.filter(x => x.name == this.TABLE)[0].code)
        }
      } else {
        this.TABLENAME = 0
        let selectedRows = this.MaingridApi.getSelectedNodes()
        let oldplan = this.MaingridApi.getSelectedRows()
        for (let i = 0; i < oldplan.length; i++) {
          selectedRows[i].setDataValue('PRDTAB_CODE', 0)
        }
      }
      if (this.TABLE != 0) {
        this.findRap()
      }
    }
  }

  GETRATIONAME() {
    if (this.MaingridApi) {
      if (this.ratioarray.filter(x => x.name == this.RATIO).length != 0) {
        this.RATIONAME = this.ratioarray.filter(x => x.name == this.RATIO)[0].code
        let selectedRows = this.MaingridApi.getSelectedNodes()
        let oldplan = this.MaingridApi.getSelectedRows()
        for (let i = 0; i < oldplan.length; i++) {
          selectedRows[i].setDataValue('PRDRAT_CODE', this.ratioarray.filter(x => x.name == this.RATIO)[0].code)
        }
      } else {
        this.RATIONAME = 0
        let selectedRows = this.MaingridApi.getSelectedNodes()
        let oldplan = this.MaingridApi.getSelectedRows()
        for (let i = 0; i < oldplan.length; i++) {
          selectedRows[i].setDataValue('PRDRAT_CODE', 0)
        }
      }
      if (this.RATIO != 0) {
        this.findRap()
      }
    }
  }

  async SAVE() {
    this.DISABLELOTSRNO = false;
    this.validationrap = true
    for (let i = 0; i < this.PLANGRIDARR.length; i++) {
      if (this.PLANGRIDARR[i].CARAT > this.ROUCARAT) {
        this.toastr.warning("Pol Carat is higher than rough carat")
        return;
      }
    }
    if (this.PLANGRIDARR.filter(x => x.PLNSEL == true).length == 0) {
      this.toastr.warning("All Planno select")
      return;
    }
    if (!this.L_CODE) {
      this.toastr.warning("Lot is required")
      return
    } else if (!this.SRNO) {
      this.toastr.warning("Srno is required")
      return
    }


    let GridRowData = []
    let RapSaveArr = []
    this.MaingridApi.forEachNode(function (rowNode, index) {
      if (rowNode.data.PLANNNO != 0 && rowNode.data.PTAG != '' && rowNode.data.PRDCARAT != 0) {
        GridRowData.push(rowNode.data);
      }
    });
    for (let i = 0; i < GridRowData.length; i++) {

      if (!GridRowData[i].PTAG || !GridRowData[i].PRDS_CODE || !GridRowData[i].PRDC_CODE ||
        !GridRowData[i].PRDQ_CODE || !GridRowData[i].PRDCUT_CODE ||
        !GridRowData[i].PRDPOL_CODE || !GridRowData[i].PRDSYM_CODE ||
        !GridRowData[i].PRDFL_CODE || !GridRowData[i].PRDCARAT) {
        this.toastr.error('SomeData is Missing')
        this.validationrap = false
        return
      }


      await this.RapCalcServ.RapCalcSaveValidation(
        {
          L_CODE: this.L_CODE,
          SRNO: this.SRNO,
          TAG: this.TAG,
          EMP_CODE: this.EMP_CODE,
          PLANNO: GridRowData[i].PLANNO,
        }).then((RAPTYP) => {
          try {
            if (RAPTYP.success == 1) {
              if (RAPTYP.data != 'TRUE') {
                this.toastr.warning(RAPTYP.data)
                this.validationrap = false
                return
              }
              else {
                let SaveObj = {
                  L_CODE: this.L_CODE,
                  SRNO: this.SRNO,
                  TAG: this.TAG,
                  PRDTYPE: GridRowData[i].PLNSEL == true ? 'O' : 'OP',
                  PLANNO: GridRowData[i].PLANNO,
                  EMP_CODE: this.EMP_CODE,
                  PTAG: GridRowData[i].PTAG,
                  I_CARAT: this.ROUCARAT,
                  PRDS_CODE: GridRowData[i].PRDS_CODE,
                  PRDQ_CODE: GridRowData[i].PRDQ_CODE,
                  PRDC_CODE: GridRowData[i].PRDC_CODE,
                  PRDCARAT: GridRowData[i].PRDCARAT,
                  PRDMC_CODE: GridRowData[i].PRDMC_CODE,
                  PRDCUT_CODE: GridRowData[i].PRDCUT_CODE,
                  PRDPOL_CODE: GridRowData[i].PRDPOL_CODE,
                  PRDSYM_CODE: GridRowData[i].PRDSYM_CODE,
                  PRDFL_CODE: GridRowData[i].PRDFL_CODE,
                  PRDMFL_CODE: GridRowData[i].PRDMFL_CODE,
                  PRDIN_CODE: GridRowData[i].PRDIN_CODE,
                  PRDSH_CODE: GridRowData[i].PRDSH_CODE,
                  PRDTABLE: GridRowData[i].PRDTABLE,
                  PRDTABLE_BLACK: GridRowData[i].PRDTABLE_BLACK,
                  PRDTABLE_OPEN: GridRowData[i].PRDTABLE_OPEN,
                  PRDSIDE: GridRowData[i].PRDSIDE,
                  PRDSIDE_BLACK: GridRowData[i].PRDSIDE_BLACK,
                  PRDSIDE_OPEN: GridRowData[i].PRDSIDE_OPEN,
                  PRDCROWN_OPEN: GridRowData[i].PRDCROWN_OPEN,
                  PRDGIRDLE_OPEN: GridRowData[i].PRDGIRDLE_OPEN,
                  PRDPAV_OPEN: GridRowData[i].PRDPAV_OPEN,
                  PRDCULET: GridRowData[i].PRDCULET,
                  PRDEXTFACET: GridRowData[i].PRDEXTFACET,
                  PRDEYECLEAN: GridRowData[i].PRDEYECLEAN,
                  PRDGRAINING: GridRowData[i].PRDGRAINING,
                  PRDLUSTER: GridRowData[i].PRDLUSTER,
                  PRDMILKY: GridRowData[i].PRDMILKY,
                  PRDNATURAL: GridRowData[i].PRDNATURAL,
                  PRDREDSPOT: GridRowData[i].PRDREDSPOT,
                  PRDDIA_CODE: GridRowData[i].PRDDIA_CODE,
                  PRDRAT_CODE: GridRowData[i].PRDRAT_CODE,
                  PRDDEPTH_CODE: GridRowData[i].PRDDEPTH_CODE,
                  PRDTAB_CODE: GridRowData[i].PRDTAB_CODE,
                  RATE: GridRowData[i].RATE,
                  CPRATE: (GridRowData[i].CPAMT / GridRowData[i].PRDCARAT),
                  CMRATE: (GridRowData[i].CMAMT / GridRowData[i].PRDCARAT),
                  QPRATE: (GridRowData[i].QPAMT / GridRowData[i].PRDCARAT),
                  QMRATE: (GridRowData[i].QMAMT / GridRowData[i].PRDCARAT),
                  PLNSEL: GridRowData[i].PLNSEL,
                  FPLNSEL: GridRowData[i].FPLNSEL,
                  IUSER: this.decodedTkn.UserId,
                  ICOMP: this.decodedTkn.UserId,
                  TYP: GridRowData[i].TYP,
                  ISSEL: GridRowData[i].TYP == 'S' ? true : false,
                  V_CODE: this.V_CODE ? this.V_CODE : 0,
                  RAPTYPE: GridRowData[i].RAPTYPE
                }
                RapSaveArr.push(SaveObj)
              }
            }
            else {
              this.toastr.warning(RAPTYP.data)
              this.validationrap = false
              return
            }
          }
          catch (error) { this.toastr.error(error) }
        })
    }
    if (RapSaveArr.length != 0 && this.validationrap == true) {
      this.RapCalcServ.RapSave(RapSaveArr).subscribe((SaveRes) => {
        this.spinner.hide()
        try {
          if (SaveRes.success == true) {
            this.toastr.success('Prediction Save')
            this.CLEAR()
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
    }

  }

  async CLEAR() {
    this.DISABLELOTSRNO = false;
    this.MaingridApi.setRowData();
    this.PricegridApi.setRowData();
    this.gridApi.setRowData();
    await this.MainLoadGridData()
    this.QPAMTCOL = ''
    this.QMAMTCOL = ''
    this.CPAMTCOL = ''
    this.CMAMTCOL = ''
    this.L_CODE = ''
    this.SRNO = 0
    this.EMP_CODE = ''
    this.ROUCARAT = 0
    this.POLCARAT = 0
    this.TOTAMT = 0
    this.PERCARAT = 0
    this.NETPER = 0
    this.DEPTH = ''
    this.DEPTHNAME = ''
    this.depthCtrl.setValue('')
    this.RATIO = ''
    this.RATIONAME = ''
    this.ratioCtrl.setValue('')
    this.TABLE = ''
    this.TABLENAME = ''
    this.tableCtrl.setValue('')
    this.DIAMETER = ''
    this.DIAMETERNAME = ''
    this.diameterCtrl.setValue('')
    this.findRap();
    this.MaingridApi.redrawRows({});
    this.MaingridApi.redrawRows();
    this.validationrap = true
  }

  BREAKINGENTRY() {
    const PRF = this.dialog.open(BrkEntComponent, { panelClass: "brk-ent-dialog", autoFocus: false, minWidth: '90vw', width: '100%', data: { L_CODE: this.L_CODE, SRNO: this.SRNO, TAG: this.TAG } })
    $("#Close").click();
    PRF.afterClosed().subscribe(result => {

    });
  }

  CHECKPER(e: any): boolean {
    if (!this.TAG) {
      return false
    }
    if (!this.SRNO) {
      return false
    }
    if (this.VIEWPERARR.filter(x => x == e).length == 0) {
      return false
    } else {
      return true
    }
  }

  async FPrint() {
    this.RapCalcServ.RapPrint({
      L_CODE: this.L_CODE,
      SRNO: this.SRNO,
      TAG: this.TAG,
      EMP_CODE: this.EMP_CODE
    }).then((SaveRes) => {
      this.spinner.hide()
      try {
        if (SaveRes.success == true) {
          var mapForm = document.createElement("form");
          mapForm.target = "_blank";
          mapForm.method = "POST";

          mapForm.action = 'http://' + window.location.hostname + ':3000/api/' + 'Report/ReportPrint';

          let obj = {
            Data: JSON.stringify(SaveRes.data),
            mrtname: "RapPrint",

          }
          Object.keys(obj).forEach(function (param) {
            if (obj[param]) {
              var mapInput = document.createElement("input");
              mapInput.type = "hidden";
              mapInput.name = param;
              mapInput.setAttribute("value", obj[param]);
              mapForm.appendChild(mapInput);
            }
          });
          document.body.appendChild(mapForm);
          mapForm.submit();
          document.body.removeChild(mapForm);

        } else {
          this.toastr.warning(SaveRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  FOCUSNEXT() {
    this.RAPCALCSRNO.nativeElement.focus()
  }

  async PPrint() {
    this.RapCalcServ.RapPrintOP({
      L_CODE: this.L_CODE,
      SRNO: this.SRNO,
      TAG: this.TAG,
      EMP_CODE: this.EMP_CODE
    }).then((SaveRes) => {

      this.spinner.hide()
      try {
        if (SaveRes.success == true) {
          var mapForm = document.createElement("form");
          mapForm.target = "_blank";
          mapForm.method = "POST";

          mapForm.action = 'http://' + window.location.hostname + ':3000/api/' + 'Report/ReportPrint';

          let obj = {
            Data: JSON.stringify(SaveRes.data),
            mrtname: "RapPrintOP",

          }
          Object.keys(obj).forEach(function (param) {
            if (obj[param]) {
              var mapInput = document.createElement("input");
              mapInput.type = "hidden";
              mapInput.name = param;
              mapInput.setAttribute("value", obj[param]);
              mapForm.appendChild(mapInput);
            }
          });
          document.body.appendChild(mapForm);
          mapForm.submit();
          document.body.removeChild(mapForm);

        } else {
          this.toastr.warning(SaveRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

}
