import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import { ReportService } from 'src/app/Service/Report/report.service';
import { EncrDecrService } from 'src/app/Service/Common/encr-decr.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { FrmOpePer } from '../../_helpers/frm-ope-per';

import { ReportListBoxComponent } from '../../Common/report-list-box/report-list-box.component';
import { $ } from 'protractor';
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})

export class ReportComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));
  ReportTab = localStorage.getItem("Report Tab");

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []
  hide = true
  PASSWORD: any = ''

  SP_NAME: any = ''
  RPT_NAME: any = ''
  SPRPT: boolean = false;
  SHOW_PRMS: boolean = false;
  SHOW_RPT_LIST: boolean = false;

  // FormColumns: { key: string, value: string }[];
  FormColumns;

  RptList: any = ''
  Report_arr = [];

  Group_arr = []
  DATASET = []

  All_Dataset_Arr = []

  SearchMenu: any = ''

  REPORT_NAME: any = ''

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private ReportServ: ReportService,
    private EncrDecrServ: EncrDecrService,
    private matDialog: MatDialog,
    private _FrmOpePer: FrmOpePer,
    private datePipe: DatePipe,
  ) {
    this.All_Dataset_Arr = JSON.parse(this.EncrDecrServ.get(localStorage.getItem("unfam1")));
  }

  async ngOnInit() {

    this.PER = await this._FrmOpePer.UserFrmOpePer(this.constructor.name)
    this.ALLOWDEL = this.PER[0].DEL
    this.ALLOWINS = this.PER[0].INS
    this.ALLOWUPD = this.PER[0].UPD
    this.PASS = this.PER[0].PASS

    this.FeatchReportData()
  }

  CHANGEPASSWORD() {
    if (this.PASSWORD == this.PASS) {
      this.SPRPT = true
    }
    else {
      this.SPRPT = false
    }
  }

  FormColumn(data: any) {
    return Object.keys(data).map(key => ({ key, value: data[key] }));
  }

  FeatchReportData() {
    this.spinner.show()
    let FillObj = {
      TABLENAME: 'dbo.RepMast',
      CRITERIA: "AND PARENT_ID=0 and DEPT_NAME='POI' AND REP_NAME='" + this.ReportTab + "'",
      FIELDS: '*',
    }
    localStorage.removeItem("Report Tab");
    this.ReportServ.FetchReportData(FillObj).subscribe((FillRes) => {
      try {
        if (FillRes.success == true) {
          this.spinner.show()
          let FillRptObj = {
            DEPT_CODE: FillRes.data[0].DEPT_NAME,
            USER_NAME: this.decodedTkn.UserId,
            PARENT_ID: FillRes.data[0].REP_ID,
          }
          this.ReportServ.FillReportList(FillRptObj).subscribe(FillRptRes => {
            try {
              if (FillRptRes.success == true) {
                if (FillRes.data == '') {
                  this.SHOW_RPT_LIST = false;
                } else {
                  this.SHOW_RPT_LIST = true;
                }
                this.RptList = FillRptRes.data.map((item) => {
                  return {
                    CAT_CODE: item.CAT_CODE,
                    DEPT_NAME: item.DEPT_NAME,
                    DESCR: item.DESCR,
                    ORD: item.ORD,
                    PARENT_ID: item.PARENT_ID,
                    REP_ID: item.REP_ID,
                    REP_NAME: item.REP_NAME,
                    RPT_NAME: item.RPT_NAME,
                    RPT_TYPE: item.RPT_TYPE,
                    SCHEMA_NAME: item.SCHEMA_NAME,
                    SP_NAME: item.SP_NAME,
                    SELECTED: false
                  }
                })
              } else {
                this.spinner.hide()
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: JSON.stringify(FillRes.data),
                })
              }
            } catch (error) {
              this.spinner.hide()
              this.toastr.error(error)
            }
          })
          this.spinner.hide()
        } else {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(FillRes.data),
          })
        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })
  }

  ReportClick(e: any, r: any) {

    this.SP_NAME = e;
    this.RPT_NAME = r;
    this.GetActiveReport();

    this.ReportServ.GetReportParams({ SP_NAME: e }).subscribe((FillRes) => {
      try {
        if (FillRes.success == true) {
          if (FillRes.data == '') {
            this.SHOW_PRMS = false;
          } else {
            this.SHOW_PRMS = true;
          }
          this.spinner.show();
          this.Report_arr = FillRes.data;
          let Obj = {}
          for (let i = 0; i < FillRes.data.length; i++) {
            Obj[FillRes.data[i].NAME] = FillRes.data[i].DEFVAL ? FillRes.data[i].DEFVAL : ''
          }
          let GroupArry = this.FormColumn(Obj);
          for (let i = 0; i < FillRes.data.length; i++) {
            GroupArry[i]['CATE_NAME'] = FillRes.data[i].CATE_NAME ? FillRes.data[i].CATE_NAME : ''
          }

          this.FormColumns = this.groupByArray(GroupArry, 'CATE_NAME')
          // console.log("!@#$%^&",this.FormColumns)
        } else {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(FillRes.data),
          })
        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })
  }

  GetActiveReport() {
    const items = document.querySelectorAll(".RPT");
    for (let i = 0; i < items.length; i++) {
      items[i].setAttribute('aria-expanded', 'false');
    }

    function toggleAccordion() {
      const itemToggle = this.getAttribute('aria-expanded');

      if (itemToggle == 'false') {
        this.setAttribute('aria-expanded', 'true');
      }
    }

    items.forEach(item => item.addEventListener('click', toggleAccordion));
  }

  onSubmit(form: NgForm) {

    let RPObj = form.value
    let SubTitle = []
    let DataTypeArr = []
    for (const [key, value] of Object.entries(RPObj)) {
      if (this.FindFieldDataType(key) == 'varchar') {
        if (value.toString() != '') {
          SubTitle.push(`${this.FindLableName(key)} ${value}`)
        }
        DataTypeArr.push(this.FindFieldDataType(key))
      } else if (this.FindFieldDataType(key) == 'numeric' || this.FindFieldDataType(key) == 'int') {
        if (parseFloat(value.toString()) != 0) {
          SubTitle.push(`${this.FindLableName(key)} ${value}`)
        }
        DataTypeArr.push(this.FindFieldDataType(key))
      } else if (this.FindFieldDataType(key) == 'datetime') {
        if (value.toString() != '' && value.toString() != 'NULL') {
          SubTitle.push(`${this.FindLableName(key)} ${this.datePipe.transform(value, 'MM/dd/yyyy')}`)
          RPObj[key] = this.datePipe.transform(value, 'MM/dd/yyyy')
        }
        DataTypeArr.push(this.FindFieldDataType(key))
      }
    }
    RPObj['RP_NAME'] = this.REPORT_NAME + ' \n ' + SubTitle.toString()

    const propertyNames = Object.keys(RPObj)
    const propertyValues = Object.values(RPObj)

    let SP_PARAMS = []
    for (let i = 0; i < DataTypeArr.length; i++) {
      SP_PARAMS.push({
        FIELD: propertyNames[i],
        DATATYPE: DataTypeArr[i],
        VALUE: propertyValues[i],
      })
    }

    let SP_DETAILS = []
    SP_DETAILS.push({
      RP_NAME: this.REPORT_NAME + ' \n ' + SubTitle.toString(),
      SP_NAME: this.SP_NAME,
      RPT_NAME: this.RPT_NAME
    })

    this.ReportServ.RPTDATA({ SP_PARAMS, SP_DETAILS }).subscribe((FillRes) => {
      this.spinner.hide()
      try {
        if (FillRes.success == true) {
          var mapForm = document.createElement("form");
          mapForm.target = "_blank";
          mapForm.method = "POST";

          mapForm.action = 'http://' + window.location.hostname + ':3000/api/' + 'Report/ReportViewer';

          let obj = {
            Data: JSON.stringify(FillRes.data),
            mrtname: this.RPT_NAME,
          }
          console.log(obj);

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
          this.toastr.warning(FillRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  FindLableName(NAME: any) {
    return this.Report_arr.find((item) => item.NAME == NAME) ? this.Report_arr.find((item) => item.NAME == NAME).DISPLAYNAME : ''
  }

  FindFieldDataType(NAME: any) {
    // console.log(this.Report_arr.find((item) => item.NAME == NAME) ? this.Report_arr.find((item) => item.NAME == NAME).TYPE : '')
    return this.Report_arr.find((item) => item.NAME == NAME) ? this.Report_arr.find((item) => item.NAME == NAME).TYPE : ''
  }

  groupByArray(xs, GROUPKEY) {
    return xs.reduce(function (rv, x) {
      let _GROUPKEY = GROUPKEY instanceof Function ? GROUPKEY(x) : x[GROUPKEY];

      let el = rv.find(r => r && r.GROUPKEY === _GROUPKEY);

      if (el) {
        el.Data.push(x);
      } else {
        rv.push({
          GROUPKEY: _GROUPKEY,
          Data: [x]
        });
      }

      return rv;
    }, []);
  }

  FillDataSet(DS_NAME: any) {
    return (this.All_Dataset_Arr.map((data) => data.filter((item) => item.DATASET == DS_NAME))).filter((obj) => {
      return ![null, undefined, ''].includes(obj)
    }).filter((el) => {
      return typeof el != "object" || Object.keys(el).length > 0;
    })

  }

  FindStnLen(NAME: any) {
    return this.Report_arr.find((item) => item.NAME == NAME) ? this.Report_arr.find((item) => item.NAME == NAME).STRLEN : ''
  }

  FindNormalTextbox(NAME: any) {
    return this.Report_arr.find((item) => item.NAME == NAME && item.DATATABLE == "" && item.LOOKUP_STRING == "") ? true : false
  }

  FindLookUPString(NAME: any) {
    return this.Report_arr.find((item) => item.NAME == NAME) ? (this.Report_arr.find((item) => item.NAME == NAME).LOOKUP_STRING ? true : false) : false
  }

  FindDataSet(NAME: any) {
    return this.Report_arr.find((item) => item.NAME == NAME) ? (this.Report_arr.find((item) => item.NAME == NAME).LOOKUP_STRING ? true : false) : false
  }

  GetLookUPStringData(NAME: any) {
    return this.Report_arr.find((item) => item.NAME == NAME) ? (this.Report_arr.find((item) => item.NAME == NAME).LOOKUP_STRING ? (this.Report_arr.find((item) => item.NAME == NAME).LOOKUP_STRING).split(',') : []) : []
  }

  GetAutoCompleteDataSet(NAME: any) {
    let fieldObj = this.Report_arr.find((item) => item.NAME == NAME)
    let DataTable = this.FillDataSet(fieldObj.DATATABLE)
    return DataTable[0].map((item) => {
      return item[fieldObj.VALUEMEMBER].toString()
    })
  }

  matDialogRefReportListBox: MatDialogRef<ReportListBoxComponent>;
  ReportHelpList(KeyValue: any, GropKey: any, DefSelectVal: any) {
    let ObjForList = {
      DataSet: this.FillDataSet(this.Report_arr.find((item) => item.NAME == KeyValue).DATATABLE),
      ColDef: this.Report_arr.find((item) => item.NAME == KeyValue).COLUMNS,
      ColCaption: this.Report_arr.find((item) => item.NAME == KeyValue).CAPTIONS,
      ValueMemeber: this.Report_arr.find((item) => item.NAME == KeyValue).VALUEMEMBER,
      isMulti: true,
      DefSelectVal: DefSelectVal
    }

    this.matDialogRefReportListBox = this.matDialog.open(ReportListBoxComponent, { data: ObjForList, disableClose: false, width: '80%', height: '80%', maxWidth: '80vw', minWidth: '60vw', panelClass: 'custome-report-list-mat-dialog-container' });
    this.matDialogRefReportListBox.afterClosed().subscribe(res => {
      if (res) {
        if (res.success == 1) {
          for (let i = 0; i < this.FormColumns.length; i++) {
            if (this.FormColumns[i].GROUPKEY == GropKey) {
              for (let j = 0; j < this.FormColumns[i].Data.length; j++) {
                if (this.FormColumns[i].Data[j].key == KeyValue) {
                  this.FormColumns[i].Data[j].value = res.Data
                }
              }
            }
          }
        } else if (res.success == 2) {
          //future use
        } else if (res.success == 3) {
          //future use
        } else {
          this.toastr.warning('Something gone wrong while get party')
        }
      }
    });
  }
}
