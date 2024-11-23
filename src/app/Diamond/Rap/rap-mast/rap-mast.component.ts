import { Component, OnInit, ViewChild } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { ShpMastService } from '../../../Service/Master/shp-mast.service';
import { SizeMastService } from '../../../Service/Master/size-mast.service';
import { RapMastService } from 'src/app/Service/Rap/rap-mast.service';
import { FloMastService } from 'src/app/Service/Master/flo-mast.service';
import { CutMastService } from 'src/app/Service/Master/cut-mast.service';
import { NumberEditableComponent } from './number-editable/number-editable.component';
import { EncrDecrService } from 'src/app/Service/Common/encr-decr.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Emp {
  code: string;
  name: string;
}

export interface Size {
  code: string;
  name: string;
  fsize: string;
  tsize: string;
}

@Component({
  selector: 'app-rap-mast',
  templateUrl: './rap-mast.component.html',
  styleUrls: ['./rap-mast.component.css']
})
export class RapMastComponent implements OnInit {

  decodedMast = JSON.parse(this.EncrDecrServ.get(localStorage.getItem("unfam1")));
  @ViewChild('Import') Import: any;

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public frameworkComponents;

  public columnDefs2;
  public gridApi2;
  public gridColumnApi2;
  public defaultColDef2;
  public frameworkComponents2;

  S_CODE: any = '';
  S_NAME: any = '';
  SZ_CODE: any = '';
  SZ_GROUP: any = '';
  F_SIZE: any = '';
  T_SIZE: any = '';
  CT_CODE: any = '';
  CT_NAME: any = '';
  FL_NAME: any = '';
  FL_CODE: any = '';

  shpCtrl: FormControl;
  filteredShps: Observable<any[]>;
  shapes: Emp[] = [];

  cutCtrl: FormControl;
  filteredCuts: Observable<any[]>;
  cuts: Emp[] = [];

  floCtrl: FormControl;
  filteredFlos: Observable<any[]>;
  flos: Emp[] = [];

  szCtrl: FormControl;
  filteredSzs: Observable<any[]>;
  sizes: Size[] = [];

  RAPTARR = []
  RTARR = []
  RTYPE: any = ''
  RAPTYPE: any = ''
  selected: any = ''

  FLOVISIBLE: boolean = false
  CUTVISIBLE: boolean = false
  LOOSESHOW: boolean = false
  GIASHOW: boolean = false

  F_CARAT: any = '';
  T_CARAT: any = '';

  constructor(
    private ShpMastServ: ShpMastService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private SizeMastServ: SizeMastService,
    private CutMastServ: CutMastService,
    private FloMastServ: FloMastService,
    private RapMastServ: RapMastService,
    private EncrDecrServ: EncrDecrService
  ) {

    this.shpCtrl = new FormControl();
    this.cutCtrl = new FormControl();
    this.floCtrl = new FormControl();
    this.szCtrl = new FormControl();

    this.frameworkComponents = {
      numbereditable: NumberEditableComponent
    };

    this.columnDefs = [
      {
        headerName: 'COLOR',
        field: 'C_Name',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center'
      },
      {
        headerName: 'FL',
        field: 'D1',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        editable: true,
        cellEditor: 'numbereditable',
      },
      {
        headerName: 'FL',
        field: 'Q1',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        cellEditor: 'numbereditable',
        editable: true,
      },
      {
        headerName: 'IF',
        field: 'D2',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        editable: true,
        cellEditor: 'numbereditable',
      },
      {
        headerName: 'IF',
        field: 'Q2',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        editable: true,
        cellEditor: 'numbereditable',
      },
      {
        headerName: 'VVS1',
        field: 'D3',
        editable: true,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        cellEditor: 'numbereditable',
      },
      {
        headerName: 'VVS1',
        field: 'Q3',
        editable: true,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        cellEditor: 'numbereditable',
      },
      {
        headerName: 'VVS2',
        field: 'D4',
        editable: true,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        cellEditor: 'numbereditable',
      },
      {
        headerName: 'VVS2',
        field: 'Q4',
        editable: true,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        cellEditor: 'numbereditable',
      },
      {
        headerName: 'VS1',
        field: 'D5',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'VS1',
        field: 'Q5',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'VS2',
        field: 'D6',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'VS2',
        field: 'Q6',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'SI1',
        field: 'D7',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'SI1',
        field: 'Q7',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'SI2',
        field: 'D8',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'SI2',
        field: 'Q8',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'SI3',
        field: 'D9',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'SI3',
        field: 'Q9',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'I1',
        field: 'D10',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'I1',
        field: 'Q10',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'I2',
        field: 'D11',
        editable: true,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        cellEditor: 'numbereditable',
      },
      {
        headerName: 'I2',
        field: 'Q11',
        editable: true,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        cellEditor: 'numbereditable',
      },
      {
        headerName: 'I3',
        field: 'D12',
        editable: true,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        cellEditor: 'numbereditable',
      },
      {
        headerName: 'I3',
        field: 'Q12',
        editable: true,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        cellEditor: 'numbereditable',
      },
      {
        headerName: 'I4',
        field: 'D13',
        editable: true,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        cellEditor: 'numbereditable',
      },
      {
        headerName: 'I4',
        field: 'Q13',
        editable: true,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        cellEditor: 'numbereditable',
      },
      {
        headerName: 'I5',
        field: 'D14',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'I5',
        field: 'Q14',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center'
      },
      {
        headerName: 'I6',
        field: 'D15',
        editable: true,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        cellEditor: 'numbereditable',
      },
      {
        headerName: 'I6',
        field: 'Q15',
        editable: true,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        cellEditor: 'numbereditable',
      },
      {
        headerName: 'I7',
        field: 'D16',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'I7',
        field: 'Q16',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'I8',
        field: 'D17',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'I8',
        field: 'Q17',
        editable: true,
        cellEditor: 'numbereditable',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      }
    ];
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      suppressAggFuncInHeader: true,
      enableCellChangeFlash: true
    };

    this.RapMastServ.RapTypeFill({ TYPE: "RAP", TABNAME: "" }).subscribe(rapres => {
      try {
        if (rapres.success == true) {
          this.RAPTARR = rapres.data.map(item => {
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
    this.RapMastServ.RapTypeFill({ TYPE: "RTYPE", TABNAME: "" }).subscribe(RRes => {
      try {
        if (RRes.success == true) {
          this.RTARR = RRes.data.map(item => {
            return { code: item.RTYPE, name: item.RAPNAME, DISP: item.DISP };
          });
          this.radioChange(RRes.data[0].DISP)
          this.RTYPE = RRes.data[0].RTYPE
          this.RapMastServ.RapTypeFill({ TYPE: "DIS", TABNAME: "RAPMAST" }).subscribe(FloRes => {
            try {
              if (FloRes.success == true) {
                if (FloRes.data[0].IS_FLO == false) {
                  this.FL_CODE = 1
                  this.FLOVISIBLE = true
                }
                if (FloRes.data[0].IS_CUT == false) {
                  this.CT_CODE = 1
                  this.CUTVISIBLE = true
                }
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

  ngOnInit(): void {

    this.ShpMastServ.ShpMastFill({ Type: 'SHPMAST' }).subscribe(ShpRes => {
      try {
        if (ShpRes.success == true) {
          this.shapes = ShpRes.data.map(item => {
            return { code: item.S_CODE, name: item.S_NAME };
          });
          this.filterarr('filteredShps', 'shpCtrl', 'shapes');
        } else {
          this.spinner.hide();
          this.toastr.warning('Something gone wrong while get shape');
        }
      } catch (error) {
        this.spinner.hide();
        this.toastr.error(error);
      }
    });

    this.SizeMastServ.SizeMastFill({ SZ_TYPE: 'RAP' }).subscribe(SzRes => {
      try {
        if (SzRes.success == true) {
          this.sizes = SzRes.data.map(item => {
            return { code: item.SZ_CODE, group: item.SZ_GROUP, fsize: item.F_SIZE, tsize: item.T_SIZE };
          });
          this.filterarr('filteredSzs', 'szCtrl', 'sizes');
        } else {
          this.spinner.hide();
          this.toastr.warning('Something gone wrong while get size');
        }
      } catch (error) {
        this.spinner.hide();
        this.toastr.error(error);
      }
    });

    this.CutMastServ.CutMastFill({ Type: 'CUTMAST' }).subscribe(CutRes => {
      try {
        if (CutRes.success == true) {
          this.cuts = CutRes.data.map(item => {
            return { code: item.CT_CODE, name: item.CT_NAME };
          });
          this.filterarr('filteredCuts', 'cutCtrl', 'cuts');
          if (this.CUTVISIBLE == true) {
            this.CT_CODE = 1
            this.CT_NAME = "EX"
          }
        } else {
          this.spinner.hide();
          this.toastr.warning('Something gone wrong while get cut');
        }
      } catch (error) {
        this.spinner.hide();
        this.toastr.error(error);
      }
    });

    this.FloMastServ.FloMastFill({ Type: 'FLOMAST' }).subscribe(CutRes => {
      try {
        if (CutRes.success == true) {
          this.flos = CutRes.data.map(item => {
            return { code: item.FL_CODE, name: item.FL_NAME };
          });
          this.filterarr('filteredFlos', 'floCtrl', 'flos');
          if (this.FLOVISIBLE == true) {
            this.FL_CODE = 1
            this.FL_NAME = "NONE"
          }
        } else {
          this.spinner.hide();
          this.toastr.warning('Something gone wrong while get cut');
        }
      } catch (error) {
        this.spinner.hide();
        this.toastr.error(error);
      }
    });

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData()
  }

  onGridReady2(params) {
    this.gridApi2 = params.api;
    this.gridColumnApi2 = params.columnApi;
  }

  getShapeName() {
    if (this.S_CODE) {
      if (this.shapes.filter(option => option.code.toLocaleLowerCase().includes(this.S_CODE.toLowerCase())).length != 0) {
        this.S_NAME = this.shapes.filter(option => option.code.toLocaleLowerCase().includes(this.S_CODE.toLowerCase()))[0].name
      } else {
        this.S_NAME = ''
      }
    } else {
      this.S_NAME = ''
    }
    this.LoadGridData();
  }

  getSizeName() {
    if (this.SZ_CODE) {
      if (this.sizes.filter(option => option.code == this.SZ_CODE).length != 0) {
        this.F_SIZE = this.sizes.filter(option => option.code == this.SZ_CODE)[0].fsize
        this.T_SIZE = this.sizes.filter(option => option.code == this.SZ_CODE)[0].tsize
      } else {
        this.F_SIZE = ''
        this.T_SIZE = ''
      }
    } else {
      this.F_SIZE = ''
      this.T_SIZE = ''
    }
    this.LoadGridData();
  }

  getFloName() {
    if (this.FL_CODE) {
      if (this.flos.filter(option => option.code == this.FL_CODE).length != 0) {
        this.FL_NAME = this.flos.filter(option => option.code == this.FL_CODE)[0].name
      } else {
        this.FL_NAME = ''
      }
    } else {
      this.FL_NAME = ''
    }
    this.LoadGridData();
  }

  getCutName() {
    if (this.CT_CODE) {
      if (this.cuts.filter(option => option.code == this.CT_CODE).length != 0) {
        this.CT_NAME = this.cuts.filter(option => option.code == this.CT_CODE)[0].name
      } else {
        this.CT_NAME = ''
      }
    } else {
      this.CT_NAME = ''
    }
    this.LoadGridData();
  }

  LoadGridData() {
    this.spinner.show();
    this.RapMastServ.RapMastFill({ RAPTYPE: this.RAPTYPE, RTYPE: this.RTYPE, SZ_CODE: this.SZ_CODE, S_CODE: this.S_CODE, CT_CODE: this.CT_CODE, FL_CODE: this.FL_CODE }).subscribe(RapRes => {
      try {
        if (RapRes.success == true) {

          this.spinner.hide();
          this.gridApi.setRowData(RapRes.data);
          this.gridApi.sizeColumnsToFit();
        } else {
          this.spinner.hide();
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(RapRes.data)
          });
        }
      } catch (error) {
        this.spinner.hide();
        this.toastr.error(error);
      }
    });
  }

  async radioChange(e: any) {
    this.S_CODE = ""
    this.S_NAME = ""
    this.SZ_CODE = ""
    this.F_SIZE = ""
    this.T_SIZE = ""
    if (e == "D") {
      this.gridColumnApi.setColumnsVisible(['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16', 'D17'], true);
      this.gridColumnApi.setColumnsVisible(['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12', 'Q13', 'Q14', 'Q15', 'Q16', 'Q17'], false);
      this.GIASHOW = false;
      this.LOOSESHOW = true;
      this.gridApi.setRowData("");
      this.gridApi.sizeColumnsToFit();
    }
    else {
      this.gridColumnApi.setColumnsVisible(['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16', 'D17'], false);
      this.gridColumnApi.setColumnsVisible(['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12', 'Q13', 'Q14', 'Q15', 'Q16', 'Q17'], true);
      this.GIASHOW = true;
      this.LOOSESHOW = false;
      this.gridApi.setRowData("");
      this.gridApi.sizeColumnsToFit();
    }
  }
  CSVEXPORT(e: any) {
    this.RapMastServ.RapMastExport({ RAPTYPE: this.RAPTYPE, RTYPE: this.RTYPE }).subscribe(rapres => {
      try {
        if (rapres.success == true) {
          this.downloadFile(rapres.data, e, e);
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
  downloadFile(data, filename = 'data', e: any) {
    let hadder = []
    if (e == "LOOSE") {
      hadder = ['C_CODE', 'S_CODE', 'RAPTYPE', 'RTYPE', 'SZ_CODE', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12', 'Q13', 'Q14', 'Q16', 'Q17']
    } else if (e == "GIA") {
      hadder = ['C_CODE', 'S_CODE', 'RAPTYPE', 'RTYPE', 'SZ_CODE', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14', 'D16', 'D17']
    }

    let csvData = this.ConvertToCSV(data, hadder);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];

        line += array[i][head] + ',';
      }
      str += line + '\r\n';
    }
    return str;
  }
  Cellvaluechange(e: any) {
    if (this.S_CODE == "" || this.S_CODE == null) {
      this.toastr.warning("FILL Shape")
      return
    }
    if (this.SZ_CODE == "" || this.SZ_CODE == null) {
      this.toastr.warning("FILL Size")
      return
    }
    if (this.LOOSESHOW == true) {
      if (e.newValue != 0 || e.newValue != null) {
        this.RapMastServ.RapMastRapOrgRate({
          SZ_CODE: this.SZ_CODE,
          S_CODE: this.S_CODE,
          C_CODE: e.data.C_Code,
          Q_CODE: e.column.colId.substring(1)
        }).then(rapres => {
          try {
            if (rapres.success == true) {

              e.data["Q" + e.column.colId.substring(1)] = (rapres.data - ((rapres.data * e.newValue) / 100))
            } else {
              e.data["Q" + e.column.colId.substring(1)] = 0;
            }
          } catch (error) {
            e.data["Q" + e.column.colId.substring(1)] = 0
          }
          this.RapMastServ.RapMastSave({
            RAPTYPE: this.RAPTYPE,
            RTYPE: this.RTYPE,
            SZ_CODE: this.SZ_CODE,
            S_CODE: this.S_CODE,
            C_CODE: e.data.C_Code,
            CUT_CODE: this.CT_CODE,
            FL_CODE: this.FL_CODE,
            Q1: e.data.Q1,
            Q2: e.data.Q2,
            Q3: e.data.Q3,
            Q4: e.data.Q4,
            Q5: e.data.Q5,
            Q6: e.data.Q6,
            Q7: e.data.Q7,
            Q8: e.data.Q8,
            Q9: e.data.Q9,
            Q10: e.data.Q10,
            Q11: e.data.Q11,
            Q12: e.data.Q12,
            Q13: e.data.Q13,
            Q14: e.data.Q14,
            Q15: e.data.Q15,
            Q16: e.data.Q16,
            Q17: e.data.Q17,
            D1: e.data.D1,
            D2: e.data.D2,
            D3: e.data.D3,
            D4: e.data.D4,
            D5: e.data.D5,
            D6: e.data.D6,
            D7: e.data.D7,
            D8: e.data.D8,
            D9: e.data.D9,
            D10: e.data.D10,
            D11: e.data.D11,
            D12: e.data.D12,
            D13: e.data.D13,
            D14: e.data.D14,
            D15: e.data.D15,
            D16: e.data.D16,
            D17: e.data.D17,
            F_CARAT: this.F_SIZE,
            T_CARAT: this.T_SIZE
          }).subscribe(rapres => {
            try {
              if (rapres.success == 1) {

              }
              else {
                this.toastr.error("SOMTHING WRONG")
              }
            }
            catch {
              this.toastr.error("SOMTHING WRONG")
            }
          });
        });
      }
    }
    if (this.GIASHOW == true) {
      if (e.newValue != 0 || e.newValue != null) {
        this.RapMastServ.RapMastRapOrgRate({
          SZ_CODE: this.SZ_CODE,
          S_CODE: this.S_CODE,
          C_CODE: e.data.C_Code,
          Q_CODE: e.column.colId.substring(1)
        }).then(rapres => {
          try {
            if (rapres.success == true) {
              e.data["D" + e.column.colId.substring(1)] = ((rapres.data - e.newValue) / rapres.data) * 100
            } else {
              e.data["D" + e.column.colId.substring(1)] = 0;
            }
          } catch (error) {
            e.data["D" + e.column.colId.substring(1)] = 0
          }
          this.RapMastServ.RapMastSave({
            RAPTYPE: this.RAPTYPE,
            RTYPE: this.RTYPE,
            SZ_CODE: this.SZ_CODE,
            S_CODE: this.S_CODE,
            C_CODE: e.data.C_Code,
            CUT_CODE: this.CT_CODE,
            FL_CODE: this.FL_CODE,
            Q1: e.data.Q1,
            Q2: e.data.Q2,
            Q3: e.data.Q3,
            Q4: e.data.Q4,
            Q5: e.data.Q5,
            Q6: e.data.Q6,
            Q7: e.data.Q7,
            Q8: e.data.Q8,
            Q9: e.data.Q9,
            Q10: e.data.Q10,
            Q11: e.data.Q11,
            Q12: e.data.Q12,
            Q13: e.data.Q13,
            Q14: e.data.Q14,
            Q15: e.data.Q15,
            Q16: e.data.Q16,
            Q17: e.data.Q17,
            D1: e.data.D1,
            D2: e.data.D2,
            D3: e.data.D3,
            D4: e.data.D4,
            D5: e.data.D5,
            D6: e.data.D6,
            D7: e.data.D7,
            D8: e.data.D8,
            D9: e.data.D9,
            D10: e.data.D10,
            D11: e.data.D11,
            D12: e.data.D12,
            D13: e.data.D13,
            D14: e.data.D14,
            D15: e.data.D15,
            D16: e.data.D16,
            D17: e.data.D17,
            F_CARAT: this.F_SIZE,
            T_CARAT: this.T_SIZE
          }).subscribe(rapres => {
            try {
              if (rapres.success == 1) {

              }
              else {
                this.toastr.error("SOMTHING WRONG")
              }
            }
            catch {
              this.toastr.error("SOMTHING WRONG")
            }
          });
        });
      }
    }
  }

  uploadCSVData($event: any) {
    let files = $event.srcElement.files;
    let newFileName = files[0].name.toLowerCase();
    this.spinner.show()

    let input = $event.target;
    let reader = new FileReader();

    reader.readAsText(input.files[0]);

    reader.onload = () => {
      let csvData = reader.result;

      let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

      let headersRow = this.getHeaderArray(csvRecordsArray);
      let records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow);

      this.fileReset();
      let newRecords = this.CreateNewJosn(headersRow, records)
      if (newRecords[0].length != 0) {
        this.spinner.hide()
        let RapSaveArr = []
        for (let i = 0; i < newRecords[0].length; i++) {
          let SaveObj = {
            RAPTYPE: newRecords[0][i].RAPTYPE,
            RTYPE: newRecords[0][i].RTYPE,
            SZ_CODE: newRecords[0][i].SZ_CODE,
            S_CODE: newRecords[0][i].S_CODE,
            C_CODE: newRecords[0][i].C_CODE,
            CUT_CODE: 1,
            FL_CODE: 1,
            Q1: newRecords[0][i].Q1 == undefined ? newRecords[0][i].D1 : newRecords[0][i].Q1,
            Q2: newRecords[0][i].Q2 == undefined ? newRecords[0][i].D2 : newRecords[0][i].Q2,
            Q3: newRecords[0][i].Q3 == undefined ? newRecords[0][i].D3 : newRecords[0][i].Q3,
            Q4: newRecords[0][i].Q4 == undefined ? newRecords[0][i].D4 : newRecords[0][i].Q4,
            Q5: newRecords[0][i].Q5 == undefined ? newRecords[0][i].D5 : newRecords[0][i].Q5,
            Q6: newRecords[0][i].Q6 == undefined ? newRecords[0][i].D6 : newRecords[0][i].Q6,
            Q7: newRecords[0][i].Q7 == undefined ? newRecords[0][i].D7 : newRecords[0][i].Q7,
            Q8: newRecords[0][i].Q8 == undefined ? newRecords[0][i].D8 : newRecords[0][i].Q8,
            Q9: newRecords[0][i].Q9 == undefined ? newRecords[0][i].D9 : newRecords[0][i].Q9,
            Q10: newRecords[0][i].Q10 == undefined ? newRecords[0][i].D10 : newRecords[0][i].Q10,
            Q11: newRecords[0][i].Q11 == undefined ? newRecords[0][i].D11 : newRecords[0][i].Q11,
            Q12: newRecords[0][i].Q12 == undefined ? newRecords[0][i].D12 : newRecords[0][i].Q12,
            Q13: newRecords[0][i].Q13 == undefined ? newRecords[0][i].D13 : newRecords[0][i].Q13,
            Q14: newRecords[0][i].Q14 == undefined ? newRecords[0][i].D14 : newRecords[0][i].Q14,
            Q15: newRecords[0][i].Q15 == undefined ? newRecords[0][i].D15 : newRecords[0][i].Q15,
            Q16: newRecords[0][i].Q16 == undefined ? newRecords[0][i].D16 : newRecords[0][i].Q16,
            Q17: newRecords[0][i].Q17 == undefined ? newRecords[0][i].D17 : newRecords[0][i].Q17
          }
          RapSaveArr.push(SaveObj)
        }
        this.RapMastServ.RapMastImport(RapSaveArr).then((SaveRes) => {
          this.spinner.hide()
          try {
            if (SaveRes.success == true) {
              this.RapMastServ.RapMastImportUpdate({ RAPTYPE: newRecords[0][0].RAPTYPE, RTYPE: newRecords[0][0].RTYPE, UPDTYPE: '' }).then((SaveRes) => {
                try {
                  if (SaveRes.success == true) {
                    this.spinner.hide()

                    this.toastr.success('save')
                  } else {
                    this.spinner.hide()
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: JSON.stringify(SaveRes.data),
                    })
                  }
                }
                catch (err) {
                  this.spinner.hide()
                  this.toastr.error(err)
                }
              })
              this.toastr.success('Rap upload successfully')
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Rap not change with this crite area ' + JSON.stringify(SaveRes.data)
              });
            }
          } catch (error) {
            this.toastr.error(error)
          }
        })
        this.toastr.success("File Saved Successfully")
      } else {
        this.spinner.hide()
        this.toastr.success("Can not read file.")
      }
    };
    reader.onerror = (error) => {
      this.spinner.hide()
      this.toastr.error('error is occured while reading file!')
    };
  }
  CreateNewJosn(header, records) {
    let ValidCol = []
    for (let i = 0; i < header.length; i++) {
      ValidCol.push(header[i])
    }
    return [records, ValidCol]
  }

  fileReset() {
    this.Import.nativeElement.value = "";
  }
  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, header: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let CTA = this.csvToArray(csvRecordsArray[i])
      if (CTA[0].length == header.length) {
        let tempJson = {}
        for (let j = 0; j < header.length; j++) {
          tempJson[header[j]] = CTA[0][j]
        }
        csvArr.push(tempJson)
        tempJson = {}
      }
    }
    return csvArr;
  }
  csvToArray(text) {
    let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
    for (l of text) {
      if ('"' === l) {
        if (s && l === p) row[i] += l;
        s = !s;
      } else if (',' === l && s) l = row[++i] = '';
      else if ('\n' === l && s) {
        if ('\r' === p) row[i] = row[i].slice(0, -1);
        row = ret[++r] = [l = '']; i = 0;
      } else row[i] += l;
      p = l;
    }
    return ret;
  }
}
