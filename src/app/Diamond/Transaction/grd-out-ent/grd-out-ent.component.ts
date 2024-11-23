import { Component, OnInit, ElementRef } from '@angular/core';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from "@angular/common";
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { JwtHelperService } from '@auth0/angular-jwt';
import PerfectScrollbar from 'perfect-scrollbar';
import { Observable } from 'rxjs';
import { EncrDecrService } from 'src/app/Service/Common/encr-decr.service';
import { FormControl } from '@angular/forms';
import { GrdOutEntService } from 'src/app/Service/Transaction/grd-out-ent.service';
import { map, startWith } from 'rxjs/operators';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';
import * as $ from 'jquery';

export interface Lab {
  code: string;
  name: string;
}

@Component({
  selector: 'app-grd-out-ent',
  templateUrl: './grd-out-ent.component.html',
  styleUrls: ['./grd-out-ent.component.css']
})

export class GrdOutEntComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  decodedMast = JSON.parse(this.EncrDecrServ.get(localStorage.getItem("unfam1")));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  labCtrl: FormControl;
  filteredLabs: Observable<any[]>;
  labs: Lab[] = [];

  GIA: any = "G";
  LB_CODE: any = "";
  LB_NAME: any = "";
  OU_DATE: any = new Date()
  SLIPNO: any = 0;
  LOTNO: any = "";
  SRNO: any = "";
  TAG: any = "";
  OU_NO: any = "";

  GridHeader = []

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  EMPDISABLE: boolean = false
  PASS: any = ''
  PER = []
  hide = true
  PASSWORD: any = ''

  constructor(
    private toastr: ToastrService,
    private EncrDecrServ: EncrDecrService,
    private ViewParaMastServ: ViewParaMastService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef,
    private GrdOutEntServ: GrdOutEntService,
  ) {
    this.labCtrl = new FormControl();
  }

  async ngOnInit() {
    this.PER = await this._FrmOpePer.UserFrmOpePer(this.constructor.name)
    this.ALLOWDEL = this.PER[0].DEL
    this.ALLOWINS = this.PER[0].INS
    this.ALLOWUPD = this.PER[0].UPD
    this.PASS = this.PER[0].PASS

    this.labs = this.decodedMast[43].map(item => {
      return { code: item.LB_CODE, name: item.LB_NAME };
    });
    this.filterarr('filteredLabs', 'labCtrl', 'labs');

    this.FillViewPara()
  }

  FillViewPara() {
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'GrdOutEntDisp' }).subscribe((VPRes) => {
      try {
        if (VPRes.success == 1) {
          this.GridHeader = VPRes.data.map((item) => { return item.FIELDNAME })

          let temp = []
          let op = this;
          temp.push({
            headerName: 'Action',
            cellStyle: { 'text-align': 'center' },
            cellRenderer: function (params) {
              let a = '<span class="det_val">';
              if (op.PASS == op.PASSWORD) {
                if (op.ALLOWUPD) {
                  a = a + '<i class="icon-save grid-icon" data-action-type="SaveData" style="cursor: pointer;margin-right: 5px;" ></i>';
                }
                if (op.ALLOWDEL) {
                  a = a + '<i class="icon-delete grid-icon" data-action-type="DeleteData" style="cursor: pointer;margin-left: 5px;"></i>';
                }
              }
              a = a + '</span>';
              return a;
            },
            headerClass: "text-center",
            editable: false,
            width: 60
          })
          for (let i = 0; i < VPRes.data.length; i++) {
            temp.push({
              headerName: VPRes.data[i].DISPNAME,
              headerClass: VPRes.data[i].HEADERALIGN,
              field: VPRes.data[i].FIELDNAME,
              width: VPRes.data[i].COLWIDTH,
              cellStyle: { 'text-align': VPRes.data[i].CELLALIGN },
              resizable: VPRes.data[i].ISRESIZE,
              // valueFormatter : VPRes.data[i].FORMAT == 'NumberFormat' ? this.NumberFormat : this.StringFormat,
              hide: VPRes.data[i].DISP == false ? true : false,
              // editable: function (params) {
              //   return op.EDITABLEGRID;
              // },
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
          // let SelectionCol = {
          //   width: 28,
          //   field: 'CHK',
          //   headerCheckboxSelection: true,
          //   checkboxSelection: true,
          //   resizable: false,
          //   sortable: false,
          // }
          // this.columnDefs.unshift(SelectionCol)
        } else {

          this.toastr.error(JSON.stringify(VPRes.data))

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

  async GetMaxPrnNo() {
    let MaxNo = ''
    let PrnNoObj = {
      DEPT_CODE: 'GRD',
      PRC_CODE: 'OUT',
      I_DATE: this.datepipe.transform(this.OU_DATE, 'yyyy-MM-dd'),
      ETYPE: 'R',
      PNT: 0,
    }

    await this.GrdOutEntServ.PrnIssMaxNo(PrnNoObj).then((Res) => {
      try {
        if (Res.success == true) {
          MaxNo = Res.data[0].INO
        } else {
          this.toastr.error(Res.data)
          MaxNo = ''
        }
      } catch (error) {
        this.toastr.warning(error)
        MaxNo = ''
      }
    })
    if (this.OU_NO == '') {
      this.OU_NO = MaxNo
    }
    return MaxNo
  }

  async LoadGridData() {
    this.spinner.show()
    let FillObj = {
      // OU_NO: await this.GetMaxPrnNo(),
      OU_NO: this.SLIPNO ? this.SLIPNO : 0,
      OU_DATE: this.OU_DATE ? this.datepipe.transform(this.OU_DATE, 'yyyy-MM-dd') : '',
    }
    this.GrdOutEntServ.GrdOutEntDisp(FillObj).subscribe((FillRes) => {
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
          this.toastr.error(JSON.stringify(FillRes.data))
        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })
  }

  async Save(eve) {
    if (eve.charCode == 13 || eve.charCode == 9) {
      if (this.SLIPNO == 0 && this.SLIPNO == '') {
        this.SLIPNO = await this.GetMaxPrnNo();
        let PrnObj = {
          DEPT_CODE: 'GRD',
          PRC_CODE: 'OUT',
          I_DATE: this.datepipe.transform(this.OU_DATE, 'yyyy-MM-dd'),
          ETYPE: 'R',
          PNT: 0,
          INO: this.SLIPNO
        }
        this.GrdOutEntServ.PrnIssSave(PrnObj).subscribe((PrnRes) => {
          try {
            if (PrnRes.success == true) {
              this.spinner.hide()
              // this.toastr.success('Save successfully.')
            } else {
              this.spinner.hide()
              this.toastr.warning(JSON.stringify(PrnRes.data))
            }
          } catch (err) {
            this.spinner.hide()
            this.toastr.error(err)
          }
        });
      }
      this.spinner.show()
      let Obj = {
        L_CODE: this.LOTNO ? this.LOTNO : 0,
        SRNO: this.SRNO ? this.SRNO : 0,
        TAG: this.TAG ? this.TAG : '',
        LAB: this.LB_CODE ? this.LB_CODE : 0,
      }
      this.GrdOutEntServ.GrdOutEntChk(Obj).subscribe((FillRes) => {
        try {
          if (FillRes.success == true) {
            this.spinner.hide()
            if (FillRes.data == 'TRUE') {
              let Obj = {
                L_CODE: this.LOTNO ? this.LOTNO : 0,
                SRNO: this.SRNO ? this.SRNO : 0,
                TAG: this.TAG ? this.TAG : '',
                OU_NO: this.OU_NO ? this.OU_NO : 0,
                LAB: this.LB_CODE ? this.LB_CODE : '',
                OU_DATE: this.OU_DATE ? this.datepipe.transform(this.OU_DATE, 'yyyy-MM-dd') : '',
                OU_USER: this.decodedTkn.UserId,
                OU_COMP: this.decodedTkn.UserId
              }
              this.GrdOutEntServ.GrdOutEntSave(Obj).subscribe((FillRes) => {
                try {
                  if (FillRes.success == true) {
                    this.spinner.hide();
                    this.LoadGridData();
                    this.Clear();
                    this.toastr.success("Saved Succesfully.")
                  } else {
                    this.spinner.hide()
                    this.toastr.error(JSON.stringify(FillRes.data))
                  }
                } catch (error) {
                  this.spinner.hide()
                  this.toastr.error(error)
                }
              })
            } else {
              this.toastr.warning(JSON.stringify(FillRes.data))
            }
          } else {
            this.spinner.hide()

            this.toastr.error(JSON.stringify(FillRes.data))
          }
        } catch (error) {
          this.spinner.hide()
          this.toastr.error(error)
        }
      })
    }
  }

  Clear() {
    this.LOTNO = ''
    this.SRNO = ''
    this.TAG = ''
    $('#LOTNO').focus();
  }

  PRINT() {
    let PrnObj = {
      OU_NO: this.SLIPNO ? this.SLIPNO : 0,
      OU_DATE: this.OU_DATE ? this.datepipe.transform(this.OU_DATE, 'yyyy-MM-dd') : '',
    }
    this.GrdOutEntServ.GrdOutEntPrint({

    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          if (Res.data.length != 0) {
            let TOTALWEG = 0
            let TOTALPCS = 0
            let text = 'Grading Out \n'
            text = text + '(' + this.OU_DATE.datepipe.transform(Date(), 'dd/MM-hh:mm a') + ')\n'
            text = text + 'Slip No : ' + this.SLIPNO + 'F\n'
            // text = text + 'Process : E' + this.ISSINWDArr.filter(x => x.PRC_CODE == this.PRC_TYP)[0].PRC_NAME + 'F\n'
            text = text + '=================================\n'
            text = text + 'LotNo   Party  Pcs  Carat\n'
            text = text + '=================================\n'
            for (var i = 0; i < Res.data.length; i++) {
              // let srno = Res.data[i].SRNO + '-' + Res.data[i].TAG
              text = text + Res.data[i].L_Code + this.GETSPACE(8, Res.data[i].L_Code.toString().length);
              text = text + Res.data[i].P_CODE + this.GETSPACE(7, Res.data[i].P_CODE.toString().length);
              text = text + Res.data[i].RPcs + this.GETSPACE(5, Res.data[i].RPcs.toString().length);
              // text = text + Res.data[i].RPcs + this.GETSPACE(4, Res.data[i].RPcs.toString().length)
              text = text + Res.data[i].RCrt + '\n';
              // text = text + srno + this.GETSPACE(6, srno.toString().length)
              // text = text + 'E' + Res.data[i].EMP_CODE + 'F' + this.GETSPACE(6, Res.data[i].EMP_CODE.toString().length)
              // text = text + Res.data[i].I_PCS + this.GETSPACE(5, Res.data[i].I_PCS.toString().length)
              // text = text + Res.data[i].I_CARAT + this.GETSPACE(5, Res.data[i].I_CARAT.toString().length) + '\n';
              TOTALWEG = TOTALWEG + Res.data[i].RCrt
              TOTALPCS = TOTALPCS + Res.data[i].RPcs
            }
            text = text + '=================================\n'
            text = text + 'Total :        ' + TOTALPCS + this.GETSPACE(5, TOTALPCS.toString().length) + TOTALWEG + '\n'
            text = text + '=================================\n'
            // text = text + 'User :' + this.decodedTkn.UserId + '\n\n'
            // text = text + 'Signature: _____________\n'
            this.download("PRNGRDPOUTENT.txt", text);
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

  download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  EXPORT() {
    this.GrdOutEntServ.GrdOutEntExport({
      OU_NO: this.SLIPNO ? this.SLIPNO : 0,
      OU_DATE: this.OU_DATE ? this.datepipe.transform(this.OU_DATE, 'yyyy-MM-dd') : '',
    }).subscribe(ExpRes => {
      try {
        if (ExpRes.success == true) {
          this.downloadFile(ExpRes.data, "GRDOUTENT");
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

  downloadFile(data, filename = 'data') {
    let header = ['SrNo', 'StoneID', 'Sh', 'Carat', 'Qlty', 'Col', 'Cut', 'Pol', 'Sym', 'Flor', 'Cost%', 'TInc', 'SInc', 'TBlk', 'SBlk', 'TOpn', 'SOpn', 'EFct', 'Shd', 'Natural', 'Cult', 'H&A', 'Lust', 'EyeC', 'DiaMeter', 'TotDepth', 'Length', 'Width', 'Depth', 'Comment', 'Table', 'Girdle', 'StoneID2', 'Price', 'GExp', 'O.Price']
    let csvData = this.ConvertToCSV(data, header);
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
    let row = '';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in headerList) {
        let head = headerList[index];

        line += array[i][head] + ',';
      }
      str += line + '\r\n';
    }
    return str;
  }

  getLABName() {
    if (this.LB_CODE) {
      if (this.labs.filter(option => option.code == this.LB_CODE).length != 0) {
        this.LB_NAME = this.labs.filter(option => option.code == this.LB_CODE)[0].name
      } else {
        this.LB_NAME = ''
      }
    } else {
      this.LB_NAME = ''
    }
  }

  CHANGEPASSWORD() {
    let RowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      RowData.push(rowNode.data);
    });
    this.gridApi.setRowData(RowData);
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
      return this.datepipe.transform(params.value, 'dd-MM-yyyy')
    } else {
      return ''
    }
  }

  TimeFormat(params) {
    if (params.value) {
      return this.datepipe.transform(params.value, 'hh:mm a', 'UTC+0')
    } else {
      return ''
    }
  }

}
