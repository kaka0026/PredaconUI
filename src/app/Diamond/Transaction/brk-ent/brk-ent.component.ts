import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DatePipe, JsonPipe } from "@angular/common";
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { isEmpty, map, startWith } from 'rxjs/operators';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

import { LotMastService } from 'src/app/Service/Master/lot-mast.service';
import { PrcInwService } from 'src/app/Service/Transaction/prc-inw.service';
import { InnPrcInwService } from 'src/app/Service/Transaction/inn-prc-inw.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { BrkEntService } from 'src/app/Service/Transaction/brk-ent.service';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';
import { EncrDecrService } from 'src/app/Service/Common/encr-decr.service';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { RapCalcService } from 'src/app/Service/Rap/rap-calc.service';
import { RapMastService } from 'src/app/Service/Rap/rap-mast.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as $ from "jquery";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AgGridAutoCompleteComponent } from '../../_helpers/ag-grid-auto-complete.component';

export interface LOTInt {
  CODE: string
  NAME: string
  PNT: string
  CARAT: string
}

@Component({
  selector: 'app-brk-ent',
  templateUrl: './brk-ent.component.html',
  styleUrls: ['./brk-ent.component.css']
})
export class BrkEntComponent implements OnInit {

  @ViewChild("grid1") myGrid1: jqxGridComponent;
  @ViewChild("grid2") myGrid2: jqxGridComponent;

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  decodedMast = JSON.parse(this.EncrDecrServ.get(localStorage.getItem("unfam1")));

  public columnDefs1;
  public gridApi1;
  public gridColumnApi1;
  public defaultColDef1;
  public frameworkComponents1;

  public columnDefs2;
  public gridApi2;
  public gridColumnApi2;
  public defaultColDef2;
  public frameworkComponents2;

  L_CODE: any = ''
  L_NAME: any = ''
  L_CARAT: any = ''
  PNT: any = this.decodedTkn.PNT
  TAG: any = ''
  BTAG: any = ''
  LDETID: any = ''
  LDETNO: any = ''
  MARKEREMPNAME: any = ''
  MARKEREMPCODE: any = ''
  GRP: any = ''
  PARTYNAME: any = ''
  PARTYCODE: any = ''
  MANAGERNAME: any = ''
  MANAGERCODE: any = ''
  EMPNAME: any = ''
  EMPCODE: any = ''
  PDATE: any = ''
  PTIME: any = ''
  REMARKCODE: any = ''
  REMARKNAME: any = ''
  PASSWORD: any = ''
  DEPT_CODE: any = ''
  PDEPTCODE: any = ''
  RAPTYPE: any = '';

  disabled: boolean = true
  enabled: boolean = false
  ISNEW: boolean = true
  NEWPLAN: boolean = false
  CHECKBOCVISIBLE: boolean = false
  BTAGVISIBLE: boolean = false

  NO: any = ''
  SRNO: any = ''
  DIFFDOL: any = ''
  DIFFCARAT: any = ''
  ROUGH: any = ''

  LOTCtrl: FormControl;
  filteredLOTs: Observable<any[]>;
  LOTs: LOTInt[] = [];

  PRArr = []

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  hide = true
  PASS: any = ''
  TPROC_CODE: any = ''
  PER = []

  EMPARR = []
  PARTYARR = []
  ManagerArr = []
  opratorArr = []
  RamarkArr = []
  DETIDArr = []
  DETNOArr = []
  ViewParaArr = []
  RAPTArray = []
  DATAL_CODE = ''
  DATASRNO = 0
  DATATAG = ''

  BTagArray = []
  ShapeArray = []
  ColorArray = []
  QualityArray = []
  CutArray = []
  FloArray = []
  IncArray = []
  ShdArray = []
  TblArray = []
  TBArray = []
  TOArray = []
  SideArray = []
  SBArray = []
  SOArray = []
  COArray = []
  GOArray = []
  POArray = []
  RTypArray = []
  CuletArray = []
  ExtFctArray = []
  EyeCleanArray = []
  GrainingArray = []
  LusterArray = []
  MilkyArray = []
  NaturalArray = []
  RSArray = []

  constructor(
    private PrcInwServ: PrcInwService,
    private BrkEntServ: BrkEntService,
    private LotMastServ: LotMastService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private _FrmOpePer: FrmOpePer,
    private ViewParaMastServ: ViewParaMastService,
    private EncrDecrServ: EncrDecrService,
    private RapCalcServ: RapCalcService,
    private RapMastServ: RapMastService,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // private _mdr: MatDialogRef<BrkEntComponent>,
  ) {
    // this.DATAL_CODE = data.L_CODE
    // this.DATASRNO = data.SRNO
    // this.DATATAG = data.TAG

    this.columnDefs1 = [
      {
        headerName: 'Action',
        cellStyle: { 'text-align': 'center' },
        cellRenderer: function (params) {
          let a = '<span class="det_val">';
          a = a + '<i class="icon-delete grid-icon" data-action-type="SaveData" style="cursor: pointer;margin-right: 5px;" ></i>   ';
          a = a + '</span>';
          return a;
        },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'BTag',
        field: 'BTAG',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Shape',
        field: 'BRKSH_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Quality Code',
        field: 'BRKQ_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Quality Name',
        field: 'Q_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Color Code',
        field: 'BRKC_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Color Name',
        field: 'C_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Carat',
        field: 'BRKCARAT',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Cut Code',
        field: 'BRKCUT_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Cut Name',
        field: 'CUT_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Pol Code',
        field: 'BRKPOL_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Pol Name',
        field: 'POL_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Sym Code',
        field: 'BRKSYM_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Sym Name',
        field: 'SYM_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Flo Code',
        field: 'BRKFL_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Flo Name',
        field: 'FL_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Inc Code',
        field: 'BRKIN_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Inc Name',
        field: 'IN_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Shade Code',
        field: 'BRKSH_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Shade Name',
        field: 'SH_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Amount',
        field: 'AMOUNT',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Table',
        field: 'BRKTABLE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Table Name',
        field: 'BRKTABLENAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Table Black',
        field: 'BRKTABLE_BLACK',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Table Black Name',
        field: 'BRKTABLE_BLACKNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Table Open',
        field: 'BRKTABLE_OPEN',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Table Open Name',
        field: 'BRKTABLE_OPENNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Side',
        field: 'BRKSIDE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Side Name',
        field: 'BRKSIDENAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Side Black',
        field: 'BRKSIDE_BLACK',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Side Black Name',
        field: 'BRKSIDE_BLACKNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Side Open',
        field: 'BRKSIDE_OPEN',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Side Open Name',
        field: 'BRKSIDE_OPENNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Crown Open',
        field: 'BRKCROWN_OPEN',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Crown Open Name',
        field: 'BRKCROWN_OPENNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Griddle Open',
        field: 'BRKGIRDLE_OPEN',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Griddle Open Name',
        field: 'BRKGIRDLE_OPENNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Pav Open',
        field: 'BRKPAV_OPEN',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Pav Open Name',
        field: 'BRKPAV_OPENNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Brk Type',
        field: 'RAPTYPE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Extra Facet',
        field: 'BRKEXTFACET',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Extra Facet Name',
        field: 'BRKEXTFACETNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Eye Clean',
        field: 'BRKEYECLEAN',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Eye Clean Name',
        field: 'BRKEYECLEANNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Graining',
        field: 'BRKGRAINING',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Graining Name',
        field: 'BRKGRAININGNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Luster',
        field: 'BRKLUSTER',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Luster Name',
        field: 'BRKLUSTERNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Milky',
        field: 'BRKMILKY',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Milky Name',
        field: 'BRKMILKYNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Natural',
        field: 'BRKNATURAL',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Natural Name',
        field: 'BRKNATURALNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Redspot',
        field: 'BRKREDSPOT',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Redspot Name',
        field: 'BRKREDSPOTNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Diameter',
        field: 'BRKDIA_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Ratio',
        field: 'BRKRAT_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Depth',
        field: 'BRKDEPTH_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Table',
        field: 'BRKTAB_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Rate',
        field: 'RATE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'Type',
        field: 'TYP',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        width: 50
      },
    ]

    this.defaultColDef1 = {
      resizable: false,
      sortable: true,
    }

    this.frameworkComponents1 = {
      autoComplete: AgGridAutoCompleteComponent,
    };

    this.columnDefs2 = [
      {
        headerName: 'Action',
        cellStyle: { 'text-align': 'center' },
        cellRenderer: function (params) {
          let a = '<span class="det_val">';
          a = a + '<i class="icon-new grid-icon" data-action-type="SaveData" style="cursor: pointer;margin-right: 5px;" ></i>   ';
          a = a + '</span>';
          return a;
        },
        headerClass: "text-center",
        width: 50
      },
      {
        headerName: 'BTag',
        field: 'bTag',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Tag', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Shape Code',
        field: 'shapeCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Quality Code',
        field: 'qualityCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Quality Name',
        field: 'qualityName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'Color Code',
        field: 'colorCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Color Name',
        field: 'colorName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'Carat',
        field: 'carat',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        width: 50,
        editable: true,
      },
      {
        headerName: 'Cut Code',
        field: 'cutCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Cut Name',
        field: 'cutName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'Pol Code',
        field: 'polCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Pol Name',
        field: 'polName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'Sym Code',
        field: 'symCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Sym Name',
        field: 'symName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'Flo Code',
        field: 'floCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Flo Name',
        field: 'floName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'Inc Code',
        field: 'incCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Inc Name',
        field: 'incName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'Shade Code',
        field: 'shdCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Shade Name',
        field: 'shdName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'Amount',
        field: 'Amount',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        width: 50,
        editable: true,
      },
      {
        headerName: 'Table Code',
        field: 'tblCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Table Name',
        field: 'tblName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'TB Code',
        field: 'tblckCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'TB Name',
        field: 'tblckName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'TO Code',
        field: 'topnCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'TO Name',
        field: 'topnName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'Side Code',
        field: 'sideCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Side Name',
        field: 'sideName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'SB Code',
        field: 'sblckCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'SB Name',
        field: 'sblckName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'SO Code',
        field: 'sopnCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'SO Name',
        field: 'sopnName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'CO Code',
        field: 'copnCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'CO Name',
        field: 'copnName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'GO Code',
        field: 'gopnCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'GO Name',
        field: 'gopnName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'PO Code',
        field: 'popnCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'PO Name',
        field: 'popnName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'RAPTYPE',
        field: 'raptype',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Culet Code',
        field: 'culetCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Culet Name',
        field: 'culetName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'ExtFct Code',
        field: 'efCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'ExtFct Name',
        field: 'efName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'EyeClean Code',
        field: 'ecCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'EyeClean Name',
        field: 'ecName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'Graining Code',
        field: 'grnCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Graining Name',
        field: 'grnName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'Luster Code',
        field: 'lusterCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Luster Name',
        field: 'lusterName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'Milky Code',
        field: 'mlkCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Milky Name',
        field: 'mlkName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'Natural Code',
        field: 'natCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'Natural Name',
        field: 'natName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'RedSpot Code',
        field: 'rsCode',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: true,
        cellEditor: 'autoComplete',
        cellEditorParams: {
          'propertyRendered': 'code',
          'returnObject': true,
          'rowData': [],
          'columnDefs': [
            { headerName: 'Code', field: 'code', width: 50 },
          ]
        },
        valueFormatter: (params: any) => {
          if (params.value) return params.value.code;
          return "";
        },
      },
      {
        headerName: 'RedSpot Name',
        field: 'rsName',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: false,
        valueFormatter: (params: any) => {
          if (params.value) return params.value.name;
          return "";
        },
      },
      {
        headerName: 'Diameter',
        field: 'diameter',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50,
        editable: true,
      },
      {
        headerName: 'Ratio',
        field: 'ratio',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50,
        editable: true,
      },
      {
        headerName: 'Depth',
        field: 'depth',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50,
        editable: true,
      },
      {
        headerName: 'Table',
        field: 'table',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50,
        editable: true,
      },
      {
        headerName: 'Rate',
        field: 'rate',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50,
        editable: true,
      },
      {
        headerName: 'Type',
        field: 'type',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 50,
        editable: true,
      },
    ]

    this.defaultColDef2 = {
      resizable: false,
      sortable: true,
    }

    this.frameworkComponents2 = {
      autoComplete: AgGridAutoCompleteComponent,
    };

    this.LOTCtrl = new FormControl();

    this.RapMastServ.RapTypeFill({ TYPE: "RAP", TABNAME: "" }).subscribe(rapres => {
      try {
        if (rapres.success == true) {
          this.RAPTArray = rapres.data.map(item => {
            return { code: item.RAPTYPE, name: item.RAPNAME };
          });
          this.RAPTYPE = rapres.data[0].RAPTYPE
        } else {
          this.spinner.hide();
          this.toastr.warning('Something gone wrong while get shape.');
        }
      } catch (error) {
        this.spinner.hide();
        this.toastr.error(error);
      }
    });

  }

  async ngOnInit() {
    this.PER = await this._FrmOpePer.UserFrmOpePer(this.constructor.name)
    this.ALLOWDEL = this.PER[0].DEL
    this.ALLOWINS = this.PER[0].INS
    this.ALLOWUPD = this.PER[0].UPD
    this.PASS = this.PER[0].PASS

    await this.BrkEntServ.BrkEntCmbFill({ TYPE: 'MARKER' }).then((Res) => {
      try {
        if (Res.success == true) {
          this.EMPARR = Res.data.map((item) => {
            return { code: item.EMP_CODE, value: item.EMP_NAME, GRP: item.GRP }
          })
        } else {

        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    this.PrcInwServ.InwPrcMastFill({ TYPE: 'BRK', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.PRArr = PCRes.data.map((item) => {
            return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME }
          })
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

    this.LotMastServ.LotMastFill({}).subscribe((LFRes) => {
      try {
        if (LFRes.success == true) {
          this.LOTs = LFRes.data.map((item) => {
            return { CODE: item.L_CODE, NAME: item.L_NAME.toString(), CARAT: item.L_CARAT, PNT: item.PNT }
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

    if (this.DATAL_CODE) {
      this.TPROC_CODE = 'MR'
      this.L_CODE = this.DATAL_CODE
      await this.SETPDET()
      this.SRNO = this.DATASRNO
      this.TAG = this.DATATAG
      await this.FILLCMBDATA()
    }

    //* GRID_2 -  Combo Fillers
    this.FillBTag()
    this.FillShape()
    this.FillQuality()
    this.FillColor()
    this.FillCut()
    this.FillFlo()
    this.FillInc()
    this.FillShd()
    this.FillTbl()
    this.FillTB()
    this.FillTO()
    this.FillSide()
    this.FillSB()
    this.FillSO()
    this.FillCO()
    this.FillGO()
    this.FillPO()
    this.FillRTyp()
    this.FillCulet()
    this.FillExtFct()
    this.FillEyeClean()
    this.FillGraining()
    this.FillLuster()
    this.FillMilky()
    this.FillNatural()
    this.FillEyeRedSpot()
  }
  //* GRID_1-Fucntions
  onGridReady1(params) {
    this.gridApi1 = params.api;
    this.gridColumnApi1 = params.columnApi;
    // this.gridApi1.setRowData([{
    //   'bTag': { 'code': '' },
    //   'shapeCode': { 'code': '' },
    //   'colorCode': { 'code': '' },
    //   'shapeName': { 'name': '' },
    // }])
  }

  cellEditingStopped1(event: any) {
    this.gridApi1.setFocusedCell(event.rowIndex, event.colDef.field);
  }

  onCellValueChanged1(params: any) {
    let selectedRows = []
    this.gridApi1.forEachNode(function (rowNode, index) {
      selectedRows.push(rowNode)
    });

    // let _list = []
    // this.gridApi.forEachNode(function (rowNode, index) {
    //   console.log(rowNode);

    //   _list.push(rowNode.data)
    //   // console.log(rowNode.data);
    // });
  }

  onGridRowClicked1(eve: any) {
    // if (eve.event.target !== undefined) {
    //   let actionType = eve.event.target.getAttribute("data-action-type");

    //   if (actionType == 'DeleteData') {
    //     this.gridApi2.applyTransaction({ remove: [eve.data] })
    //   }

    //   if (actionType == 'SaveData') {
    //     // alert("DATA SAVED!!!!")

    //     let SaveObj = {
    //       C_CODE: eve.data.colorCode.code,
    //       C_NAME: eve.data.colorName,
    //       S_CODE: eve.data.shapeCode.code,
    //       S_NAME: eve.data.shapeName
    //     }
    //     console.log(SaveObj);
    //   }
    // }
  }

  //* GRID_2-Fucntions
  onGridReady2(params) {
    this.gridApi2 = params.api;
    this.gridColumnApi2 = params.columnApi;
    this.gridApi2.setRowData([{
      'bTag': { 'code': '' },
      'shapeCode': { 'code': '' },
      'qualityCode': { 'code': '' },
      'qualityName': '',
      'colorCode': { 'code': '' },
      'colorName': '',
      'carat': '',
      'cutCode': { 'code': '' },
      'cutName': '',
      'polCode': { 'code': '' },
      'polName': '',
      'symCode': { 'code': '' },
      'symName': '',
      'floCode': { 'code': '' },
      'floName': '',
      'incCode': { 'code': '' },
      'incName': '',
      'shdCode': { 'code': '' },
      'shdName': '',
      'ammount': '',
      'tblCode': { 'code': '' },
      'tblName': '',
      'tblckCode': { 'code': '' },
      'tblckName': '',
      'topnCode': { 'code': '' },
      'topnName': '',
      'sideCode': { 'code': '' },
      'sideName': '',
      'sblckCode': { 'code': '' },
      'sblckName': '',
      'sopnCode': { 'code': '' },
      'sopnName': '',
      'copnCode': { 'code': '' },
      'copnName': '',
      'gopnCode': { 'code': '' },
      'gopnName': '',
      'popnCode': { 'code': '' },
      'popnName': '',
      'raptype': '',
      'culetCode': { 'code': '' },
      'culetName': '',
      'efCode': { 'code': '' },
      'efName': '',
      'ecCode': { 'code': '' },
      'ecName': '',
      'grnCode': { 'code': '' },
      'grnName': '',
      'lusterCode': { 'code': '' },
      'lusterName': '',
      'mlkCode': { 'code': '' },
      'mlkName': '',
      'natCode': { 'code': '' },
      'natName': '',
      'rsCode': { 'code': '' },
      'rsName': '',
      'diameter': '',
      'ratio': '',
      'depth': '',
      'table': '',
      'rate': '',
      'type': '',
    }])
  }

  cellEditingStopped2(event: any) {
    this.gridApi2.setFocusedCell(event.rowIndex, event.colDef.field);
  }

  onCellValueChanged2(params: any) {
    console.log(params);

    let selectedRows = []

    this.gridApi2.forEachNode(function (rowNode, index) {
      selectedRows.push(rowNode)
    });

    if (params.colDef.field == 'colorCode') {
      selectedRows[0].setDataValue('colorName', this.decodedMast[3].filter(x => x.C_CODE == params.newValue.code)[0].C_NAME)
      return
    } else if (params.colDef.field == 'qualityCode') {
      selectedRows[0].setDataValue('qualityName', this.decodedMast[4].filter(x => x.Q_CODE == params.newValue.code)[0].Q_NAME)
      return
    } else if (params.colDef.field == 'cutCode') {
      selectedRows[0].setDataValue('cutName', this.decodedMast[5].filter(x => x.CT_CODE == params.newValue.code)[0].CT_NAME)
      return
    } else if (params.colDef.field == 'polCode') {
      selectedRows[0].setDataValue('polName', this.decodedMast[5].filter(x => x.CT_CODE == params.newValue.code)[0].CT_NAME)
      return
    } else if (params.colDef.field == 'symCode') {
      selectedRows[0].setDataValue('symName', this.decodedMast[5].filter(x => x.CT_CODE == params.newValue.code)[0].CT_NAME)
      return
    } else if (params.colDef.field == 'floCode') {
      selectedRows[0].setDataValue('floName', this.decodedMast[6].filter(x => x.FL_CODE == params.newValue.code)[0].FL_NAME)
      return
    } else if (params.colDef.field == 'incCode') {
      selectedRows[0].setDataValue('incName', this.decodedMast[37].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'shdCode') {
      selectedRows[0].setDataValue('shdName', this.decodedMast[19].filter(x => x.SH_CODE == params.newValue.code)[0].SH_NAME)
      return
    } else if (params.colDef.field == 'tblCode') {
      selectedRows[0].setDataValue('tblName', this.decodedMast[33].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'tblckCode') {
      selectedRows[0].setDataValue('tblckName', this.decodedMast[34].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'topnCode') {
      selectedRows[0].setDataValue('topnName', this.decodedMast[35].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'sideCode') {
      selectedRows[0].setDataValue('sideName', this.decodedMast[30].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'sblckCode') {
      selectedRows[0].setDataValue('sblckName', this.decodedMast[31].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'sopnCode') {
      selectedRows[0].setDataValue('sopnName', this.decodedMast[32].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'copnCode') {
      selectedRows[0].setDataValue('copnName', this.decodedMast[20].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'gopnCode') {
      selectedRows[0].setDataValue('gopnName', this.decodedMast[24].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'popnCode') {
      selectedRows[0].setDataValue('popnName', this.decodedMast[29].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'culetCode') {
      selectedRows[0].setDataValue('culetName', this.decodedMast[21].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'efCode') {
      selectedRows[0].setDataValue('efName', this.decodedMast[22].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'ecCode') {
      selectedRows[0].setDataValue('ecName', this.decodedMast[23].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'grnCode') {
      selectedRows[0].setDataValue('grnName', this.decodedMast[25].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'lusterCode') {
      selectedRows[0].setDataValue('lusterName', this.decodedMast[26].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'mlkCode') {
      selectedRows[0].setDataValue('mlkName', this.decodedMast[27].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'natCode') {
      selectedRows[0].setDataValue('natName', this.decodedMast[28].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    } else if (params.colDef.field == 'rsCode') {
      selectedRows[0].setDataValue('rsName', this.decodedMast[38].filter(x => x.I_CODE == params.newValue.code)[0].I_NAME)
      return
    }

    if (!params.data.carat) {
      return
    } else if (!params.data.shapeCode.code) {
      return
    } else if (!params.data.qualityCode.code) {
      return
    } else if (!params.data.colorCode.code) {
      return
    } else if (!params.data.cutCode.code) {
      return
    } else if (!params.data.symCode.code) {
      return
    } else if (!params.data.polCode.code) {
      return
    } else if (!params.data.floCode.code) {
      return
    }

    let RapObj = {
      S_CODE: params.data.shapeCode.code,
      Q_CODE: params.data.qualityCode.code,
      C_CODE: params.data.colorCode.code,
      CARAT: params.data.carat,
      CUT_CODE: params.data.cutCode.code,
      SYM_CODE: params.data.symCode.code,
      POL_CODE: params.data.polCode.code,
      FL_CODE: params.data.floCode.code,
      IN_CODE: params.data.incCode.code,
      SH_CODE: params.data.shdCode.code,
      TABLE: params.data.tblCode.code,
      TABLE_BLACK: params.data.tblckCode.code,
      TABLE_OPEN: params.data.topnCode.code,
      SIDE: params.data.sideCode.code,
      SIDE_BLACK: params.data.sblckCode.code,
      SIDE_OPEN: params.data.sopnCode.code,
      CROWN_OPEN: params.data.copnCode.code,
      GIRDLE_OPEN: params.data.gopnCode.code,
      PAV_OPEN: params.data.popnCode.code,
      RAPTYPE: params.data.raptype.code,
      CULET: params.data.culetCode.code,
      EXTFACET: params.data.efCode.code,
      EYECLAEN: params.data.ecCode.code,
      GRAINING: params.data.grnCode.code,
      LUSTER: params.data.lusterCode.code,
      MILKY: params.data.mlkCode.code,
      NATURAL: params.data.natCode.code,
      REDSPOT: params.data.rsCode.code,
      V_CODE: 0,
      DIA: params.data.diameter,
      DEPTH: params.data.depth,
      RATIO: params.data.ratio,
      TAB: params.data.table,
    }
    this.RapCalcServ.FindRap(RapObj).then((RapRes) => {
      try {
        debugger
        if (RapRes.success == true) {
          params.data.rate = RapRes.data[1][0][''] == null ? 0 : (RapRes.data[1][0]['']).toFixed(0)
          params.data.ammount = RapRes.data[1][0][''] == null ? 0 : (RapRes.data[1][0][''] * params.data.carat).toFixed(0)
          params.data.type = RapRes.data[2][0][''] == null ? '' : RapRes.data[2][0]['']
        } else {
          params.data.rate = 0
          params.data.ammount = 0
          params.data.type = ''
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    let totalamount1 = 0
    let totalamount2 = 0
    let totalcarat1 = 0
    let totalcarat2 = 0
    for (let i = 0; i < this.myGrid1.getrows().length; i++) {
      totalamount1 = totalamount1 + parseFloat(this.myGrid1.getcellvalue(i, 'AMOUNT'))
      totalcarat1 = totalcarat1 + parseFloat(this.myGrid1.getcellvalue(i, 'BRKCARAT'))
    }
    for (let i = 0; i < this.myGrid2.getrows().length; i++) {
      totalamount2 = totalamount2 + parseFloat(this.myGrid2.getcellvalue(i, 'AMOUNT'))
      totalcarat2 = totalcarat2 + parseFloat(this.myGrid2.getcellvalue(i, 'BRKCARAT'))
    }
    if (this.TPROC_CODE == 'HC' || this.TPROC_CODE == 'MC' || this.TPROC_CODE == 'CM') {
      this.DIFFCARAT = Number((totalcarat2 - totalcarat1).toFixed(3))
      this.DIFFDOL = Number((totalamount2 - totalamount1).toFixed(0))
    } else {
      this.DIFFCARAT = Number((totalcarat1 - totalcarat2).toFixed(3))
      this.DIFFDOL = Number((totalamount1 - totalamount2).toFixed(0))
    }
  }

  onGridRowClicked2(eve: any) {
    // if (eve.event.target !== undefined) {
    //   let actionType = eve.event.target.getAttribute("data-action-type");

    //   if (actionType == 'DeleteData') {
    //     this.gridApi2.applyTransaction({ remove: [eve.data] })
    //   }

    //   if (actionType == 'SaveData') {
    //     // alert("DATA SAVED!!!!")

    //     let SaveObj = {
    //       C_CODE: eve.data.colorCode.code,
    //       C_NAME: eve.data.colorName,
    //       S_CODE: eve.data.shapeCode.code,
    //       S_NAME: eve.data.shapeName
    //     }
    //     console.log(SaveObj);
    //   }
    // }
  }

  filterLOTs(code: string) {
    return this.LOTs.filter(option => option.NAME.toLocaleLowerCase().includes(code.toLowerCase()))
  }

  keypressLOT(eve: any, e: any) {
    if (e != '') {
      let val = this.LOTs.filter(option => option.NAME.toLocaleLowerCase().includes(e.toLowerCase()));
      if (val.length != 0) {
        if (val[0].NAME != "") {
          this.LOTCtrl.setValue(val[0].CODE)
          this.L_NAME = val[0].NAME
          this.PNT = val[0].PNT
          this.L_CARAT = val[0].CARAT
        } else {
          this.LOTCtrl.setValue('')
          this.PNT = ''
          this.L_NAME = ''
          this.L_CARAT = ''
        }
      } else {
        this.LOTCtrl.setValue('')
        this.PNT = ''
        this.L_NAME = ''
        this.L_CARAT = ''
      }
    }
  }

  CheckLotVal(eve: any) {
    if (!eve) {
      this.LOTCtrl.setValue('')
      this.PNT = ''
      this.L_NAME = ''
      this.L_CARAT = ''
    }
  }

  onEnterLOT(evt: any) {
    if (evt.source.selected) {
      this.LOTCtrl.setValue(evt.source.value)
      this.L_NAME = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).NAME : ''
      this.PNT = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).PNT : ''
      this.L_CARAT = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).CARAT : ''
    }
  }

  CHANGEPASSWORD() {
    if (this.PASSWORD == this.PASS) {
      this.disabled = false
      this.enabled = true
    } else {
      this.disabled = true
      this.enabled = false
    }
  }

  async FILLCMBDATA() {
    if (this.ISNEW == true) {
      await this.BrkEntServ.BrkEntCmbFill({
        TYPE: 'PARTY',
        PROCESS: this.TPROC_CODE,
        DEPTCODE: this.PDEPTCODE,
        L_CODE: this.L_CODE,
        SRNO: this.SRNO,
        TAG: this.TAG,
      }).then(async (Res) => {
        try {
          if (Res.success == true) {
            this.DETIDArr = Res.data.map((item) => {
              return { code: item.DETID, value: item.I_CARAT }
            })
            this.LDETID = Res.data[Res.data.length - 1].DETID
            await this.FINDDETNO()
            this.MARKEREMPCODE = Res.data[0].EMP_CODE
            this.getmarkername()
            this.PARTYCODE = Res.data[0].PEMP_CODE
            this.getpartyname()
            this.ROUGH = Res.data[Res.data.length - 1].I_CARAT
          } else {

          }
        } catch (error) {
          this.toastr.error(error)
        }
      })
    }
    if (this.TPROC_CODE == 'DMR' || this.TPROC_CODE == 'S' || this.TPROC_CODE == 'G') {
      this.BTAG = this.TAG
      await this.GRIDFILL()
    }
  }

  async GRIDFILL() {
    await this.BrkEntServ.BrkEntCmbFill({ TYPE: 'DETID', L_CODE: this.L_CODE }).then((Res) => {
      try {
        if (Res.success == true) {
          this.NO = Res.data[0].DETID
        } else {
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    await this.BrkEntServ.BrkEntAfterDisp({
      L_CODE: this.L_CODE,
      SRNO: this.SRNO,
      TAG: this.TAG,
      BTAG: this.BTAG,
      PROC_CODE: this.TPROC_CODE,
      ISNEW: this.NEWPLAN,
    }).then((Res) => {
      try {
        if (Res.success == true) {
          // this.gridApi1.setRowData(Res.data)
          let gridData1 = []
          gridData1 = Res.data.map((item) => {
            return {
              DETNO: item.DETNO,
              RAPTYPE: item.RAPTYPE,
              BTAG: item.BTAG,
              BRKS_CODE: item.BRKS_CODE,
              BRKQ_CODE: item.BRKQ_CODE,
              Q_NAME: this.decodedMast[4].filter(x => x.Q_CODE == item.BRKQ_CODE)[0].Q_NAME,
              BRKC_CODE: item.BRKC_CODE,
              C_NAME: this.decodedMast[3].filter(x => x.C_CODE == item.BRKC_CODE)[0].C_NAME,
              BRKCARAT: item.BRKCARAT,
              BRKCUT_CODE: item.BRKCUT_CODE,
              CUT_NAME: this.decodedMast[5].filter(x => x.CT_CODE == item.BRKCUT_CODE)[0].CT_NAME,
              BRKPOL_CODE: item.BRKPOL_CODE,
              POL_NAME: this.decodedMast[5].filter(x => x.CT_CODE == item.BRKPOL_CODE)[0].CT_NAME,
              BRKSYM_CODE: item.BRKSYM_CODE,
              SYM_NAME: this.decodedMast[5].filter(x => x.CT_CODE == item.BRKSYM_CODE)[0].CT_NAME,
              BRKFL_CODE: item.BRKFL_CODE,
              FL_NAME: this.decodedMast[6].filter(x => x.FL_CODE == item.BRKFL_CODE)[0].FL_NAME,
              BRKIN_CODE: item.BRKIN_CODE,
              IN_NAME: this.decodedMast[37].filter(x => x.I_CODE == item.BRKIN_CODE)[0].I_SHORTNAME,
              BRKSH_CODE: item.BRKSH_CODE,
              SH_NAME: this.decodedMast[19].filter(x => x.SH_CODE == item.BRKSH_CODE)[0].SH_NAME,
              BRKTABLE: item.BRKTABLE,
              BRKTABLENAME: this.decodedMast[33].filter(x => x.I_CODE == item.BRKTABLE).length == 0 ? '' : this.decodedMast[33].filter(x => x.I_CODE == item.BRKTABLE)[0].I_NAME,
              BRKTABLE_BLACK: item.BRKTABLE_BLACK,
              BRKTABLE_BLACKNAME: this.decodedMast[34].filter(x => x.I_CODE == item.BRKTABLE_BLACK).length == 0 ? '' : this.decodedMast[34].filter(x => x.I_CODE == item.BRKTABLE_BLACK)[0].I_NAME,
              BRKTABLE_OPEN: item.BRKTABLE_OPEN,
              BRKTABLE_OPENNAME: this.decodedMast[35].filter(x => x.I_CODE == item.BRKTABLE_OPEN).length == 0 ? '' : this.decodedMast[35].filter(x => x.I_CODE == item.BRKTABLE_OPEN)[0].I_NAME,
              BRKSIDE: item.BRKSIDE,
              BRKSIDENAME: this.decodedMast[30].filter(x => x.I_CODE == item.BRKSIDE).length == 0 ? '' : this.decodedMast[30].filter(x => x.I_CODE == item.BRKSIDE)[0].I_NAME,
              BRKSIDE_BLACK: item.BRKSIDE_BLACK,
              BRKSIDE_BLACKNAME: this.decodedMast[31].filter(x => x.I_CODE == item.BRKSIDE_BLACK).length == 0 ? '' : this.decodedMast[31].filter(x => x.I_CODE == item.BRKSIDE_BLACK)[0].I_NAME,
              BRKSIDE_OPEN: item.BRKSIDE_OPEN,
              BRKSIDE_OPENNAME: this.decodedMast[32].filter(x => x.I_CODE == item.BRKSIDE_OPEN).length == 0 ? '' : this.decodedMast[32].filter(x => x.I_CODE == item.BRKSIDE_OPEN)[0].I_NAME,
              BRKCROWN_OPEN: item.BRKCROWN_OPEN,
              BRKCROWN_OPENNAME: this.decodedMast[20].filter(x => x.I_CODE == item.BRKCROWN_OPEN).length == 0 ? '' : this.decodedMast[20].filter(x => x.I_CODE == item.BRKCROWN_OPEN)[0].I_NAME,
              BRKGIRDLE_OPEN: item.BRKGIRDLE_OPEN,
              BRKGIRDLE_OPENNAME: this.decodedMast[24].filter(x => x.I_CODE == item.BRKGIRDLE_OPEN).length == 0 ? '' : this.decodedMast[24].filter(x => x.I_CODE == item.BRKGIRDLE_OPEN)[0].I_NAME,
              BRKPAV_OPEN: item.BRKPAV_OPEN,
              BRKPAV_OPENNAME: this.decodedMast[29].filter(x => x.I_CODE == item.BRKPAV_OPEN).length == 0 ? '' : this.decodedMast[24].filter(x => x.I_CODE == item.BRKPAV_OPEN)[0].I_NAME,
              BRKCULET: item.BRKCULET,
              BRKEXTFACET: item.BRKEXTFACET,
              BRKEXTFACETNAME: this.decodedMast[22].filter(x => x.I_CODE == item.BRKEXTFACET).length == 0 ? '' : this.decodedMast[22].filter(x => x.I_CODE == item.BRKEXTFACET)[0].I_NAME,
              BRKEYECLEAN: item.BRKEYECLEAN,
              BRKEYECLEANNAME: this.decodedMast[23].filter(x => x.I_CODE == item.BRKEYECLEAN).length == 0 ? '' : this.decodedMast[23].filter(x => x.I_CODE == item.BRKEYECLEAN)[0].I_NAME,
              BRKGRAINING: item.BRKGRAINING,
              BRKGRAININGNAME: this.decodedMast[25].filter(x => x.I_CODE == item.BRKGRAINING).length == 0 ? '' : this.decodedMast[25].filter(x => x.I_CODE == item.BRKGRAINING)[0].I_NAME,
              BRKLUSTER: item.BRKLUSTER,
              BRKLUSTERNAME: this.decodedMast[26].filter(x => x.I_CODE == item.BRKLUSTER).length == 0 ? '' : this.decodedMast[26].filter(x => x.I_CODE == item.BRKLUSTER)[0].I_NAME,
              BRKMILKY: item.BRKMILKY,
              BRKMILKYNAME: this.decodedMast[27].filter(x => x.I_CODE == item.BRKMILKY).length == 0 ? '' : this.decodedMast[27].filter(x => x.I_CODE == item.BRKMILKY)[0].I_NAME,
              BRKNATURAL: item.BRKNATURAL,
              BRKNATURALNAME: this.decodedMast[28].filter(x => x.I_CODE == item.BRKNATURAL).length == 0 ? '' : this.decodedMast[28].filter(x => x.I_CODE == item.BRKNATURAL)[0].I_NAME,
              BRKREDSPOT: item.BRKREDSPOT,
              BRKREDSPOTNAME: this.decodedMast[38].filter(x => x.I_CODE == item.BRKREDSPOT).length == 0 ? '' : this.decodedMast[38].filter(x => x.I_CODE == item.BRKREDSPOT)[0].I_NAME,
              BRKDIA_CODE: item.BRKDIA_CODE,
              BRKRAT_CODE: item.BRKRAT_CODE,
              BRKDEPTH_CODE: item.BRKDEPTH_CODE,
              BRKTAB_CODE: item.BRKTAB_CODE,
              RATE: item.RATE,
              AMOUNT: item.AMOUNT,
              TYP: item.TYP,
            }
          })
          this.gridApi1.setRowData(gridData1)
        } else {
        }
      } catch (error) {
        debugger
        this.toastr.error(error)
      }
    })
  }

  async SETPDET() {

    this.CLEAR()
    this.NEWPLAN = false
    if (this.TPROC_CODE == 'L' || this.TPROC_CODE == 'BE' || this.TPROC_CODE == 'OT' || this.TPROC_CODE == 'P' || this.TPROC_CODE == 'CM') {
      this.CHECKBOCVISIBLE = false
    } else {
      this.CHECKBOCVISIBLE = true
    }

    if (this.TPROC_CODE == 'DMR' || this.TPROC_CODE == 'S' || this.TPROC_CODE == 'G') {
      this.BTAGVISIBLE = false
    } else {
      this.BTAGVISIBLE = true
    }

    if (this.TPROC_CODE == 'BE' || this.TPROC_CODE == 'OT') {
      this.PDEPTCODE = 'L'
    } else if (this.TPROC_CODE == 'KR') {
      this.PDEPTCODE = '4P'
    } else if (this.TPROC_CODE == 'MR' || this.TPROC_CODE == 'HC' || this.TPROC_CODE == 'MC' || this.TPROC_CODE == 'DMR' || this.TPROC_CODE == 'CM') {
      this.PDEPTCODE = 'POI'
    } else {
      this.PDEPTCODE = this.TPROC_CODE
    }

    await this.BrkEntServ.BrkEntCmbFill({ TYPE: 'PCMB', DEPTCODE: 'POI', PROCESS: this.TPROC_CODE }).then((Res) => {
      try {
        if (Res.success == true) {
          this.PARTYARR = Res.data.map((item) => {
            return { code: item.EMP_CODE, value: item.EMP_NAME }
          })
        } else {

        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    if (this.TPROC_CODE == 'BE' || this.TPROC_CODE == 'L' || this.TPROC_CODE == 'OT') {
      this.DEPT_CODE = 'SAW'
    } else if (this.TPROC_CODE == 'P') {
      this.DEPT_CODE = 'PEL'
    } else if (this.TPROC_CODE == '4P' || this.TPROC_CODE == 'KR') {
      this.DEPT_CODE = '4P'
    } else if (this.TPROC_CODE == 'RSN') {
      this.DEPT_CODE = 'RSN'
    } else if (this.TPROC_CODE == '16P') {
      this.DEPT_CODE = '16P'
    } else {
      this.DEPT_CODE = 'POI'
    }
    await this.BrkEntServ.BrkEntCmbFill({
      TYPE: 'MACHINE',
      PROCESS: this.TPROC_CODE,
      DEPTCODE: this.DEPT_CODE
    }).then((Res) => {
      try {
        if (Res.success == true) {
          this.ManagerArr = Res.data.map((item) => {
            return { code: item.EMP_CODE, value: item.EMP_NAME }
          })
        } else {

        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    await this.BrkEntServ.BrkEntCmbFill({
      TYPE: 'OPERATOR',
      PROCESS: this.TPROC_CODE,
      DEPTCODE: this.DEPT_CODE
    }).then((Res) => {
      try {
        if (Res.success == true) {
          this.opratorArr = Res.data.map((item) => {
            return { code: item.EMP_CODE, value: item.EMP_NAME }
          })
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
          this.RamarkArr = Res.data.map((item) => {
            return { code: item.R_CODE, value: item.R_NAME }
          })
        } else {

        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  getmarkername() {
    if (this.EMPARR.filter(x => x.code == this.MARKEREMPCODE).length != 0) {
      this.MARKEREMPNAME = this.EMPARR.filter(x => x.code == this.MARKEREMPCODE)[0].value
      this.GRP = this.EMPARR.filter(x => x.code == this.MARKEREMPCODE)[0].GRP
    }
  }

  getpartyname() {
    if (this.PARTYARR.filter(x => x.code == this.PARTYCODE).length != 0) {
      this.PARTYNAME = this.PARTYARR.filter(x => x.code == this.PARTYCODE)[0].value
    }
  }

  getmanagername() {
    if (this.ManagerArr.filter(x => x.code == this.MANAGERCODE).length != 0) {
      this.MANAGERNAME = this.ManagerArr.filter(x => x.code == this.MANAGERCODE)[0].value
    }
  }

  getemployeename() {
    if (this.opratorArr.filter(x => x.code == this.EMPCODE).length != 0) {
      this.EMPNAME = this.opratorArr.filter(x => x.code == this.EMPCODE)[0].value
    }
  }

  getremarkname() {
    if (this.RamarkArr.filter(x => x.code == this.REMARKCODE).length != 0) {
      this.REMARKNAME = this.RamarkArr.filter(x => x.code == this.REMARKCODE)[0].value
    }
  }

  async getdetidname() {
    this.ROUGH = this.DETIDArr.filter(x => x.code == this.LDETID)[0].value
    await this.FINDDETNO()
  }

  async FINDDETNO() {
    await this.BrkEntServ.BrkEntCmbFill({
      TYPE: 'DETNO',
      PROCESS: this.TPROC_CODE,
      DEPTCODE: this.PDEPTCODE,
      L_CODE: this.L_CODE,
      SRNO: this.SRNO,
      TAG: this.TAG,
      DETID: this.LDETID
    }).then((Res) => {
      try {
        if (Res.success == true) {
          this.DETNOArr = Res.data.map((item) => {
            return { code: item.DETNO, value: item.I_CARAT, emp: item.EMP_CODE }
          })
          this.LDETNO = Res.data[Res.data.length - 1].DETNO
          this.getdetnoname()
        } else {
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  async getdetnoname() {
    await this.BrkEntServ.BrkEntCmbFill({
      TYPE: 'AUTO',
      PROCESS: this.TPROC_CODE,
      DEPTCODE: this.PDEPTCODE,
      L_CODE: this.L_CODE,
      SRNO: this.SRNO,
      TAG: this.TAG,
      DETID: this.LDETID,
      DETNO: this.LDETNO
    }).then((Res) => {
      try {
        if (Res.success == true) {
          this.MANAGERCODE = Res.data[0].M_CODE
          this.getmanagername()
          this.EMPCODE = Res.data[0].EMP_CODE
          this.getemployeename()
          this.PTIME = this.datepipe.transform(Res.data[0].R_TIME, 'hh:mm a', 'UTC+0')
          this.PDATE = Res.data[0].R_DATE
        } else {
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  async SAVE() {
    if (!this.L_CODE) {
      this.toastr.warning('Lot required')
      return
    } else if (!this.SRNO) {
      this.toastr.warning('Srno required')
      return
    } else if (!this.LDETID) {
      this.toastr.warning('LDetId required')
      return
    } else if (!this.MANAGERCODE) {
      this.toastr.warning('Manager required')
      return
    } else if (!this.EMPCODE) {
      this.toastr.warning('Employee required')
      return
    } else if (!this.MARKEREMPCODE) {
      this.toastr.warning('Marker Emp required')
      return
    } else if (!this.PDATE) {
      this.toastr.warning('Date required')
      return
    } else if (!this.ROUGH) {
      this.toastr.warning('Rough Carat required')
      return
    } else if (!this.REMARKCODE) {
      this.toastr.warning('Remark required')
      return
    } else if (!this.TAG) {
      this.toastr.warning('Tag required')
      return
    } else if (!this.BTAG) {
      this.toastr.warning('BTag required')
      return
    }
    // let grid1data = this.myGrid1.getrows()
    // let grid2data = this.myGrid2.getrows()

    let grid1data = this.getAllRowsOfGrid1();
    let grid2data = this.getAllRowsOfGrid2();
    let SaveArr = [];

    for (let i = 0; i < grid1data.length; i++) {

      let SaveObj = {
        BRKTYPE: 'B',
        L_CODE: this.L_CODE,
        DETNO: this.NO,
        SRNO: this.SRNO,
        TAG: this.TAG,
        BTAG: grid2data[i].BTAG,
        DETID: this.LDETID,
        PDETNO: this.LDETNO,
        DEPT_CODE: this.DEPT_CODE,
        PRC_CODE: this.TPROC_CODE,
        BRKS_CODE: grid1data[i].BRKS_CODE,
        BRKQ_CODE: grid1data[i].BRKQ_CODE,
        BRKC_CODE: grid1data[i].BRKC_CODE,
        BRKCARAT: grid1data[i].BRKCARAT,
        BRKCUT_CODE: grid1data[i].BRKCUT_CODE,
        BRKPOL_CODE: grid1data[i].BRKPOL_CODE,
        BRKSYM_CODE: grid1data[i].BRKSYM_CODE,
        BRKFL_CODE: grid1data[i].BRKFL_CODE,
        BRKIN_CODE: grid1data[i].BRKIN_CODE,
        BRKSH_CODE: grid1data[i].BRKSH_CODE,
        BRKTABLE: grid1data[i].BRKTABLE,
        BRKTABLE_BLACK: grid1data[i].BRKTABLE_BLACK,
        BRKTABLE_OPEN: grid1data[i].BRKTABLE_OPEN,
        BRKSIDE: grid1data[i].BRKSIDE,
        BRKSIDE_BLACK: grid1data[i].BRKSIDE_BLACK,
        BRKSIDE_OPEN: grid1data[i].BRKSIDE_OPEN,
        BRKCROWN_OPEN: grid1data[i].BRKCROWN_OPEN,
        BRKGIRDLE_OPEN: grid1data[i].BRKGIRDLE_OPEN,
        BRKPAV_OPEN: grid1data[i].BRKPAV_OPEN,
        BRKCULET: grid1data[i].BRKCULET,
        BRKEXTFACET: grid1data[i].BRKEXTFACET,
        BRKEYECLEAN: grid1data[i].BRKEYECLEAN,
        BRKGRAINING: grid1data[i].BRKGRAINING,
        BRKLUSTER: grid1data[i].BRKLUSTER,
        BRKMILKY: grid1data[i].BRKMILKY,
        BRKNATURAL: grid1data[i].BRKNATURAL,
        BRKREDSPOT: grid1data[i].BRKREDSPOT,
        BRKDIA_CODE: grid1data[i].BRKDIA_CODE,
        BRKRAT_CODE: grid1data[i].BRKRAT_CODE,
        BRKDEPTH_CODE: grid1data[i].BRKDEPTH_CODE,
        BRKTAB_CODE: grid1data[i].BRKTAB_CODE,
        RATE: grid1data[i].RATE,
        AMOUNT: grid1data[i].AMOUNT,
        TYP: grid1data[i].TYP
      };
      SaveArr.push(SaveObj);
    }
    for (let i = 0; i < grid2data.length; i++) {
      if (!grid2data[i].BRKQ_CODE) {
        this.toastr.warning('Clarity required')
        return
      } else if (!grid2data[i].BRKC_CODE) {
        this.toastr.warning('Color required')
        return
      } else if (!grid2data[i].BRKS_CODE) {
        this.toastr.warning('Shape required')
        return
      } else if (!grid2data[i].BRKFL_CODE) {
        this.toastr.warning('Floro required')
        return
      } else if (!grid2data[i].BRKCUT_CODE) {
        this.toastr.warning('Cut required')
        return
      } else if (!grid2data[i].BRKPOL_CODE) {
        this.toastr.warning('Pol required')
        return
      } else if (!grid2data[i].BRKSYM_CODE) {
        this.toastr.warning('Sym required')
        return
      }

      let SaveObj = {
        BRKTYPE: 'A',
        L_CODE: this.L_CODE,
        DETNO: this.NO,
        SRNO: this.SRNO,
        TAG: this.TAG,
        BTAG: grid2data[i].BTAG,
        DETID: this.LDETID,
        PDETNO: this.LDETNO,
        DEPT_CODE: this.DEPT_CODE,
        PRC_CODE: this.TPROC_CODE,
        BRKS_CODE: grid2data[i].BRKS_CODE,
        BRKQ_CODE: grid2data[i].BRKQ_CODE,
        BRKC_CODE: grid2data[i].BRKC_CODE,
        BRKCARAT: grid2data[i].BRKCARAT,
        BRKCUT_CODE: grid2data[i].BRKCUT_CODE,
        BRKPOL_CODE: grid2data[i].BRKPOL_CODE,
        BRKSYM_CODE: grid2data[i].BRKSYM_CODE,
        BRKFL_CODE: grid2data[i].BRKFL_CODE,
        BRKIN_CODE: grid2data[i].BRKIN_CODE,
        BRKSH_CODE: grid2data[i].BRKSH_CODE,
        BRKTABLE: grid2data[i].BRKTABLE,
        BRKTABLE_BLACK: grid2data[i].BRKTABLE_BLACK,
        BRKTABLE_OPEN: grid2data[i].BRKTABLE_OPEN,
        BRKSIDE: grid2data[i].BRKSIDE,
        BRKSIDE_BLACK: grid2data[i].BRKSIDE_BLACK,
        BRKSIDE_OPEN: grid2data[i].BRKSIDE_OPEN,
        BRKCROWN_OPEN: grid2data[i].BRKCROWN_OPEN,
        BRKGIRDLE_OPEN: grid2data[i].BRKGIRDLE_OPEN,
        BRKPAV_OPEN: grid2data[i].BRKPAV_OPEN,
        BRKCULET: grid2data[i].BRKCULET,
        BRKEXTFACET: grid2data[i].BRKEXTFACET,
        BRKEYECLEAN: grid2data[i].BRKEYECLEAN,
        BRKGRAINING: grid2data[i].BRKGRAINING,
        BRKLUSTER: grid2data[i].BRKLUSTER,
        BRKMILKY: grid2data[i].BRKMILKY,
        BRKNATURAL: grid2data[i].BRKNATURAL,
        BRKREDSPOT: grid2data[i].BRKREDSPOT,
        BRKDIA_CODE: grid2data[i].BRKDIA_CODE,
        BRKRAT_CODE: grid2data[i].BRKRAT_CODE,
        BRKDEPTH_CODE: grid2data[i].BRKDEPTH_CODE,
        BRKTAB_CODE: grid2data[i].BRKTAB_CODE,
        RATE: grid2data[i].RATE,
        AMOUNT: grid2data[i].AMOUNT,
        TYP: grid2data[i].TYP
      };
      SaveArr.push(SaveObj);
    }


    await this.BrkEntServ.FrmBrkEntSave({
      L_CODE: this.L_CODE,
      DETNO: this.NO,
      SRNO: this.SRNO,
      TAG: this.TAG,
      DETID: this.LDETID,
      PDETNO: this.LDETNO,
      BTAG: this.BTAG,
      DEPT_CODE: this.DEPT_CODE,
      PRC_CODE: this.TPROC_CODE,
      EMP_CODE: this.EMPCODE,
      MEMP_CODE: this.MANAGERCODE,
      PEMP_CODE: this.PARTYCODE,
      CEMP_CODE: this.MARKEREMPCODE,
      CGRP: this.GRP,
      I_CARAT: this.ROUGH,
      R_CODE: this.REMARKCODE,
      AMT_DIF: this.DIFFDOL,
      CRT_DIF: this.DIFFCARAT,
      IUSER: this.decodedTkn.UserId,
      ICOMP: this.decodedTkn.UserId,
      PRC_DATE: this.PDATE ? this.datepipe.transform(this.PDATE, 'yyyy-MM-dd') : '',
      PRC_TIME: this.PTIME
    }).then(async (Res) => {
      try {
        if (Res.success == true) {
          await this.BrkEntServ.FrmBrkEntSaveGrd({ SaveArr }).then((Res) => {
            try {
              if (Res.success == true) {
                this.toastr.success('Successfully Entry done Lot - ' + this.L_CODE + ' NO - ' + this.NO + '')
                // this._mdr.close();
              } else {
              }
            } catch (error) {
              this.toastr.error(error)
            }
          })
        } else {
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  async FILLGRIDDATABYNO() {
    await this.BrkEntServ.BrkEntDisp({
      L_CODE: this.L_CODE,
      DETNO: this.NO
    }).then((Res) => {
      try {
        if (Res.success == true) {

        } else {
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  CLEAR() {
    this.SRNO = 0
    this.TAG = ''
    this.BTAG = ''
    this.LDETID = ''
    this.LDETNO = ''
    this.EMPNAME = ''
    this.EMPCODE = ''
    this.GRP = ''
    this.PARTYCODE = ''
    this.PARTYNAME = ''
    this.MANAGERCODE = ''
    this.MANAGERNAME = ''
    this.MARKEREMPCODE = ''
    this.MARKEREMPNAME = ''
    this.PDATE = ''
    this.PTIME = ''
    this.DIFFDOL = 0
    this.ROUGH = 0
    this.DIFFCARAT = 0
    this.REMARKCODE = ''
    this.REMARKNAME = ''
  }

  NEW() {
    this.L_CODE = ''
    this.L_NAME = ''
    this.L_CARAT = ''
    this.PNT = ''
    this.NO = 0
    this.CLEAR()
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
    // this.PrcInwServ.PrcPrint({
    //   INO: this.INO,
    //   TPROC_CODE: this.TPROC_CODE,
    //   LPnt: this.LPnt ? this.LPnt : '',
    //   DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : ''
    // }).subscribe((Res) => {
    //   try {
    //     if (Res.success == true) {
    //       if (Res.data.length != 0) {
    //         let process = 'E' + this.PRArr.filter(x => x.PRC_CODE == this.TPROC_CODE)[0].PRC_NAME + 'F '
    //         let cat = ""
    //         if (this.Urgent == 'A') {
    //           cat = "All"
    //         } else if (this.Urgent == 'G') {
    //           cat = "GIA Rolling"
    //         } else if (this.Urgent == 'U') {
    //           cat = "Urgent Rolling"
    //         }
    //         if (this.SPRArr.length != 0) {
    //           process = process + '(E' + this.SPRArr.filter(x => x.PRC_CODE == this.PRC_TYP)[0].PRC_NAME + 'F)'
    //         }
    //         let TOTALPCS = 0
    //         let TOTALWEG = 0
    //         let LCODESPACE = ''
    //         let TOTALSPACE = ''
    //         let text = 'Employee Inward Entry\n'
    //         text = text + 'Pointer : E' + this.LPnt + 'F\n'
    //         text = text + '(' + this.datepipe.transform(Date(), 'dd/MM-hh:mm a') + ')\n'
    //         text = text + 'Inward No : E' + this.INO + 'F\n'
    //         text = text + 'Categories :E' + cat + 'F\n'
    //         text = text + 'Process : ' + process + '\n'
    //         if (Res.data[0].PEMP_NAME != null) {
    //           text = text + 'Party :E' + Res.data[0].PEMP_NAME + 'F\n'
    //         }
    //         text = text + '======================\n'
    //         text = text + 'Lot No   Pcs   Carat\n'
    //         text = text + '======================\n'
    //         for (var i = 0; i < Res.data.length; i++) {
    //           let LCODESPACE = ''
    //           let IPCSSPACE = ''
    //           for (let l = 0; l < 10 - Res.data[i].LCODE.length; l++) {
    //             LCODESPACE = LCODESPACE + ' '
    //           }
    //           for (let l = 0; l < 5 - Res.data[i].IPCS.toString().length; l++) {
    //             IPCSSPACE = IPCSSPACE + ' '
    //           }
    //           text = text + Res.data[i].LCODE + LCODESPACE + Res.data[i].IPCS + IPCSSPACE + Res.data[i].ICRT + '\n';
    //           TOTALPCS = TOTALPCS + Res.data[i].IPCS
    //           TOTALWEG = TOTALWEG + Res.data[i].ICRT
    //         }
    //         text = text + '======================\n'

    //         for (let l = 0; l < 5 - (TOTALPCS.toString()).length; l++) {
    //           TOTALSPACE = TOTALSPACE + ' '
    //         }

    //         text = text + 'ETotal :   E' + TOTALPCS + TOTALSPACE + 'E' + TOTALWEG + 'F\n'
    //         text = text + '======================\n'
    //         text = text + 'User :' + this.decodedTkn.UserId + '\n\n'
    //         text = text + 'Signature: _____________\n'
    //         this.download("print.txt", text);
    //       } else {
    //         this.toastr.warning('No data')
    //       }
    //     }
    //   } catch (error) {
    //     this.toastr.error(error)
    //   }
    // })
  }

  FillBTag() {
    this.BTagArray = this.decodedMast[39].map(item => {
      return { code: item.TAG };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'bTag') {
          element.cellEditorParams.rowData = this.BTagArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillShape() {
    this.ShapeArray = this.decodedMast[0].map(item => {
      return { code: item.S_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'shapeCode') {
          element.cellEditorParams.rowData = this.ShapeArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillQuality() {
    this.QualityArray = this.decodedMast[4].map(item => {
      return { code: item.Q_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'qualityCode') {
          element.cellEditorParams.rowData = this.QualityArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillColor() {
    this.ColorArray = this.decodedMast[3].map(item => {
      return { code: item.C_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'colorCode') {
          element.cellEditorParams.rowData = this.ColorArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillCut() {
    this.CutArray = this.decodedMast[5].map(item => {
      return { code: item.CT_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'cutCode') {
          element.cellEditorParams.rowData = this.CutArray
        } else if (element.field == 'polCode') {
          element.cellEditorParams.rowData = this.CutArray
        } else if (element.field == 'symCode') {
          element.cellEditorParams.rowData = this.CutArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillFlo() {
    this.FloArray = this.decodedMast[6].map(item => {
      return { code: item.FL_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'floCode') {
          element.cellEditorParams.rowData = this.FloArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillInc() {
    this.IncArray = this.decodedMast[37].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'incCode') {
          element.cellEditorParams.rowData = this.IncArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillShd() {
    this.ShdArray = this.decodedMast[19].map(item => {
      return { code: item.SH_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'shdCode') {
          element.cellEditorParams.rowData = this.ShdArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillTbl() {
    this.TblArray = this.decodedMast[33].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'tblCode') {
          element.cellEditorParams.rowData = this.TblArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillTB() {
    this.TBArray = this.decodedMast[34].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'tblckCode') {
          element.cellEditorParams.rowData = this.TBArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillTO() {
    this.TOArray = this.decodedMast[35].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'topnCode') {
          element.cellEditorParams.rowData = this.TOArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillSide() {
    this.SideArray = this.decodedMast[30].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'sideCode') {
          element.cellEditorParams.rowData = this.SideArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillSB() {
    this.SBArray = this.decodedMast[31].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'sblckCode') {
          element.cellEditorParams.rowData = this.SBArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillSO() {
    this.SOArray = this.decodedMast[32].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'sopnCode') {
          element.cellEditorParams.rowData = this.SOArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillCO() {
    this.COArray = this.decodedMast[20].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'copnCode') {
          element.cellEditorParams.rowData = this.COArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillGO() {
    this.GOArray = this.decodedMast[24].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'gopnCode') {
          element.cellEditorParams.rowData = this.GOArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillPO() {
    this.POArray = this.decodedMast[29].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'popnCode') {
          element.cellEditorParams.rowData = this.POArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillRTyp() {
    this.RTypArray = (this.decodedMast[15].filter((item) => item.ISACTIVE == true)).map((MapItem) => {
      return { code: MapItem.RAPTYPE };
    })
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'raptype') {
          element.cellEditorParams.rowData = this.RTypArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillCulet() {
    this.CuletArray = this.decodedMast[21].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'culetCode') {
          element.cellEditorParams.rowData = this.CuletArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillExtFct() {
    this.ExtFctArray = this.decodedMast[22].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'efCode') {
          element.cellEditorParams.rowData = this.ExtFctArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillEyeClean() {
    this.EyeCleanArray = this.decodedMast[23].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'ecCode') {
          element.cellEditorParams.rowData = this.EyeCleanArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillGraining() {
    this.GrainingArray = this.decodedMast[25].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'grnCode') {
          element.cellEditorParams.rowData = this.GrainingArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillLuster() {
    this.LusterArray = this.decodedMast[26].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'lusterCode') {
          element.cellEditorParams.rowData = this.LusterArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillMilky() {
    this.MilkyArray = this.decodedMast[27].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'mlkCode') {
          element.cellEditorParams.rowData = this.MilkyArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillNatural() {
    this.NaturalArray = this.decodedMast[28].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'natCode') {
          element.cellEditorParams.rowData = this.NaturalArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  FillEyeRedSpot() {
    this.RSArray = this.decodedMast[38].map(item => {
      return { code: item.I_CODE };
    });
    setTimeout(() => {
      this.columnDefs2.forEach(element => {
        if (element.field == 'rsCode') {
          element.cellEditorParams.rowData = this.RSArray
        }
      });
      this.gridApi2.setColumnDefs(this.columnDefs2)
    }, 1000);
  }

  getAllRowsOfGrid1() {
    let rowData = [];
    this.gridApi1.forEachNode(node => rowData.push(node.data));
    return rowData
  }

  getAllRowsOfGrid2() {
    let rowData = [];
    this.gridApi2.forEachNode(node => rowData.push(node.data));
    return rowData
  }

}
