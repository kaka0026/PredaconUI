import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { ShpMastService } from '../../../Service/Master/shp-mast.service';
import { SizeMastService } from '../../../Service/Master/size-mast.service';
import { RapOrgService } from '../../../Service/Rap/rap-org.service';
import { EncrDecrService } from '../../../Service/Common/encr-decr.service'

export interface Shp {
  name: string;
  code: string;
}

export interface Size {
  code: string;
  fsize: any;
  tsize: any;
}

@Component({
  selector: 'app-rap-org',
  templateUrl: './rap-org.component.html',
  styleUrls: ['./rap-org.component.css']
})
export class RapOrgComponent implements OnInit {

  decodedMast = JSON.parse(this.EncrDecrServ.get(localStorage.getItem("unfam1")));

  @ViewChild('Import') Import: any;

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  shpCtrl: FormControl;
  filteredshps: Observable<any[]>;
  S_CODE: any = '';
  shps: Shp[] = [];
  S_NAME: any = '';

  szCtrl: FormControl;
  filteredsz: Observable<any[]>;
  SZ_CODE: any = '';
  szs: Size[] = [];
  szName: any = '';

  F_SIZE: any = '';
  T_SIZE: any = '';

  ExcelField = [];
  FileInward = [];

  USERID: any = ''
  PASSWORD: any = ''

  constructor(
    private ShpMastServ: ShpMastService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private SizeMastServ: SizeMastService,
    private RapOrgServ: RapOrgService,
    private EncrDecrServ: EncrDecrService
  ) {

    this.columnDefs = [
      {
        headerName: 'COLOR',
        field: 'C_Name',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center'

      },
      {
        headerName: 'FL',
        field: 'Q1',
        cellStClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q1;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q1 = params.newValue;
            return true;
          }
        },
      },
      {
        headerName: 'IF',
        field: 'Q2',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q2;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q2 = params.newValue;
            return true;
          }
        },
      },
      {
        headerName: 'VVS1',
        field: 'Q3',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q3;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q3 = params.newValue;
            return true;
          }
        },
      },
      {
        headerName: 'VVS2',
        field: 'Q4',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q4;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q4 = params.newValue;
            return true;
          }
        },
      },
      {
        headerName: 'VS1',
        field: 'Q5',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q5;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q5 = params.newValue;
            return true;
          }
        },
      },
      {
        headerName: 'VS2',
        field: 'Q6',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q6;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q6 = params.newValue;
            return true;
          }
        },
      },
      {
        headerName: 'SI1',
        field: 'Q7',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q7;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q7 = params.newValue;
            return true;
          }
        },
      },
      {
        headerName: 'SI2',
        field: 'Q8',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q8;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q8 = params.newValue;
            return true;
          }
        },
      },
      {
        headerName: 'SI3',
        field: 'Q9',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q9;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q9 = params.newValue;
            return true;
          }
        },
      },
      {
        headerName: 'I1',
        field: 'Q10',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q10;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q10 = params.newValue;
            return true;
          }
        },

      },
      {
        headerName: 'I2',
        field: 'Q11',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q11;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q11 = params.newValue;
            return true
          }
        },
      },
      {
        headerName: 'I3',
        field: 'Q12',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q12;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q12 = params.newValue;
            return true;
          }
        },
      },
      {
        headerName: 'I4',
        field: 'Q13',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q13;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q13 = params.newValue;
            return true;
          }
        },
      },
      {
        headerName: 'I5',
        field: 'Q14',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q14;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q14 = params.newValue;
            return true;
          }
        },
      },
      {
        headerName: 'I6',
        field: 'Q15',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q15;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q15 = params.newValue;
            return true;
          }
        },
      },
      {
        headerName: 'I7',
        field: 'Q16',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q16;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q16 = params.newValue;
            return true;
          }
        },
      },
      {
        headerName: 'I8',
        field: 'Q17',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
        valueGetter: function (params) {
          return params.data.Q17;
        },
        valueSetter: function (params) {
          if (params.newValue == '') {
            return false
          }
          else {
            params.data.Q17 = params.newValue;
            return true;
          }
        },
      }
    ];

    this.defaultColDef = {
      resizable: true,
      sortable: true,
      suppressAggFuncInHeader: true,
      enableCellChangeFlash: true,
      cellValueChanged: "onCellValueChanged()"
    };

    this.shpCtrl = new FormControl();

    this.szCtrl = new FormControl();

  };

  ngOnInit(): void {
    this.Shapefill();
    this.sizefill();
  }

  onCellValueChanged(params: any) {
  }

  sizefill() {
    this.SizeMastServ.SizeMastFill({ SZ_TYPE: 'RAP' }).subscribe(SzRes => {
      try {
        if (SzRes.success == true) {
          this.szs = SzRes.data.map(item => {
            return { code: item.SZ_CODE, fsize: item.F_SIZE, tsize: item.T_SIZE };
          });
          this.filteredsz = this.szCtrl.valueChanges.pipe(
            startWith(''),
            map(sz => (sz ? this.filtersz(sz) : this.szs.slice()))
          );
        } else {
          this.spinner.hide();
          this.toastr.warning('Something gone wrong while get size');
        }
      } catch (error) {
        this.spinner.hide();
        this.toastr.error(error);
      }
    });
  }

  GetSize() {
    if (this.SZ_CODE) {
      if (this.szs.filter(size => size.code == this.SZ_CODE).length) {
        this.F_SIZE = this.szs.filter(size => size.code == this.SZ_CODE)[0].fsize
        this.T_SIZE = this.szs.filter(size => size.code == this.SZ_CODE)[0].tsize
      } else {
        this.F_SIZE = ''
        this.T_SIZE = ''
      }
    } else {
      this.F_SIZE = ''
      this.T_SIZE = ''
    }
  }

  Shapefill() {
    this.ShpMastServ.ShpMastFill({ Type: 'SHPMAST' }).subscribe(ShpRes => {
      try {
        if (ShpRes.success == true) {

          this.shps = ShpRes.data.map(item => {
            return { code: item.S_CODE, name: item.S_NAME };
          });
          this.filteredshps = this.shpCtrl.valueChanges.pipe(
            startWith(''),
            map(shp => (shp ? this.filtershps(shp) : this.shps.slice()))
          );
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

  GetShapeName() {
    if (this.S_CODE) {
      if (this.shps.filter(shp => shp.code == this.S_CODE).length) {
        this.S_NAME = this.shps.filter(shp => shp.code == this.S_CODE)[0].name
      } else {
        this.S_NAME = ''
      }
    } else {
      this.S_NAME = ''
    }
  }

  LoadGridData() {

    this.spinner.show();
    this.RapOrgServ.RapOrgFill({ SZ_Code: this.szCtrl.value, S_CODE: this.shpCtrl.value }).subscribe(RapRes => {
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData()
  }

  filtershps(code: string) {
    return this.shps.filter(
      shp => shp.code.toLowerCase().indexOf(code.toLowerCase()) === 0
    );
  }

  onEntershp(evt: any) {
    if (evt.source.selected) {
      this.S_NAME = this.shps.find(x => x.code == evt.source.value).name;
      this.LoadGridData();
    }
  }

  SelectShp(e: any) {
    const a = this.shps.filter(option =>
      option.code.toLocaleLowerCase().includes(e.toLowerCase())
    );

    if (a.length == 0) {
      this.shpCtrl.setValue('');
      this.S_CODE = '';
    } else {
      let x = this.shps.some(item => {
        return item.code === e.toUpperCase();
      });

      if (x == true) {
        this.S_NAME = this.shps.find(x => x.code == e.toUpperCase()).name;
        this.S_CODE = e.toUpperCase();
      } else if (x == false) {
        this.S_NAME = '';
        this.S_CODE = '';
      }
    }
  }

  filtersz(code: string) {
    return this.szs.filter(
      sz =>
        sz.code
          .toString()
          .toLowerCase()
          .indexOf(code.toString().toLowerCase()) === 0
    );
  }

  // onEntersz(evt: any) {
  //   if (evt.source.selected) {
  //     this.szName = this.szs.find(
  //       x => x.code.toString() == evt.source.value
  //     ).name;
  //     let a = this.szName;
  //     this.spsize(a);
  //     this.LoadGridData();
  //   }
  // }

  // SelectSz(e: any) {
  //   const a = this.shps.filter(option =>
  //     option.code
  //       .toString()
  //       .toLocaleLowerCase()
  //       .includes(e.toLowerCase())
  //   );

  //   if (a.length == 0) {
  //     this.szCtrl.setValue('');
  //     this.SZ_CODE = '';
  //   } else {
  //     let x = this.shps.some(item => {
  //       return item.code === e.toUpperCase();
  //     });

  //     if (x == true) {
  //       this.szName = this.szs.find(x => x.code == e.toUpperCase()).name;
  //       this.SZ_CODE = e.toUpperCase();
  //     } else if (x == false) {
  //       this.szName = '';
  //       this.SZ_CODE = '';
  //     }
  //   }
  // }

  spsize(name: any) {
    let b = name.split('-');
  }

  uploadCSVData($event: any) {
    let files = $event.srcElement.files;
    let newFileName = files[0].name.toLowerCase();
    if (newFileName == "pear.csv" || newFileName == "round.csv") {
      this.spinner.show()

      let input = $event.target;
      let reader = new FileReader();

      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;

        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray();
        let records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow);

        this.fileReset();
        let newRecords = this.CreateNewJosn(headersRow, records)
        let a = this.groupByArray(newRecords[0], 'shap', 'col', 'fsize', 'tsize')
        if (newRecords[0].length != 0) {
          this.FileInward = newRecords[0]
          this.spinner.hide()
          let finalarr = a.map(item => {
            return {
              shap: newFileName == "round.csv" ? "R" : "PE",
              col: item.COL,
              fsize: item.FSIZE,
              tsize: item.TSIZE,
              IF: item.Data.filter(x => x.qua == "IF")[0].amount,
              VVS1: item.Data.filter(x => x.qua == "VVS1")[0].amount,
              VVS2: item.Data.filter(x => x.qua == "VVS2")[0].amount,
              VS1: item.Data.filter(x => x.qua == "VS1")[0].amount,
              VS2: item.Data.filter(x => x.qua == "VS2")[0].amount,
              SI1: item.Data.filter(x => x.qua == "SI1")[0].amount,
              SI2: item.Data.filter(x => x.qua == "SI2")[0].amount,
              SI3: item.Data.filter(x => x.qua == "SI3")[0].amount,
              I1: item.Data.filter(x => x.qua == "I1")[0].amount,
              I2: item.Data.filter(x => x.qua == "I2")[0].amount,
              I3: item.Data.filter(x => x.qua == "I3")[0].amount
            };
          });
          for (let i = 0; i < finalarr.length; i++) {
            let SaveObj = {
              C_CODE: this.decodedMast[3].filter(x => x.C_NAME == finalarr[i].col)[0].C_CODE,
              SZ_CODE: this.decodedMast[1].filter(x => x.F_Size == finalarr[i].fsize && x.T_Size == finalarr[i].tsize)[0].SZ_Code,
              S_CODE: finalarr[i].shap,
              Q1: finalarr[i].IF,
              Q2: finalarr[i].IF,
              Q3: finalarr[i].VVS1,
              Q4: finalarr[i].VVS2,
              Q5: finalarr[i].VS1,
              Q6: finalarr[i].VS2,
              Q7: finalarr[i].SI1,
              Q8: finalarr[i].SI2,
              Q9: finalarr[i].SI3,
              Q10: finalarr[i].I1,
              Q11: finalarr[i].I2,
              Q12: finalarr[i].I3,
              Q13: 0,
              Q14: 0,
              Q15: 0,
              Q16: 0,
              Q17: 0,
              F_CARAT: finalarr[i].fsize,
              T_CARAT: finalarr[i].tsize,
            }
            this.RapOrgServ.RapOrgSave(SaveObj).then((SaveRes) => {
              try {

                if (SaveRes.success == true) {
                  this.spinner.hide()
                  this.toastr.success('save')
                  this.LoadGridData()
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
          }
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
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, header: any) {
    let csvArr = [];

    for (let i = 0; i < csvRecordsArray.length; i++) {
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

  getHeaderArray() {
    let headerArray = [];
    headerArray.push("shap");
    headerArray.push("qua");
    headerArray.push("col");
    headerArray.push("fsize");
    headerArray.push("tsize");
    headerArray.push("amount");
    headerArray.push("date");
    return headerArray;
  }

  groupByArray(xs, SHAP, COL, FSIZE, TSIZE) {
    return xs.reduce(function (rv, x) {
      let _SHAP = SHAP instanceof Function ? SHAP(x) : x[SHAP];
      let _COL = COL instanceof Function ? COL(x) : x[COL];
      let _FSIZE = FSIZE instanceof Function ? FSIZE(x) : x[FSIZE];
      let _TSIZE = TSIZE instanceof Function ? TSIZE(x) : x[TSIZE];

      let el = rv.find(r => r && r.SHAP === _SHAP && r.COL === _COL && r.FSIZE === _FSIZE && r.TSIZE === _TSIZE);

      if (el) {
        el.Data.push(x);
      } else {
        rv.push({ SHAP: _SHAP, COL: _COL, TSIZE: _TSIZE, FSIZE: _FSIZE, Data: [x] });
      }

      return rv;
    }, []);
  }

  RAPDOWNLAOD(USERID: any, PASSWORD: any) {
    this.RapOrgServ.RapDownload({ Username: USERID, Password: PASSWORD }).subscribe((SaveRes) => {
      try {
        if (SaveRes.success == true) {
          this.downloadFile(SaveRes.DataRound, 'Round');
          this.downloadFile(SaveRes.DataPear, 'Pear');
        }
        else {
          this.spinner.hide()
          this.toastr.error("!!!!!!!Something Went Wrong!!!!!!!")
        }
      }
      catch (err) {
        this.spinner.hide()
        this.toastr.error(err)
      }
    })
  }

  downloadFile(data, filename = 'data') {
    let blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });
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
}
