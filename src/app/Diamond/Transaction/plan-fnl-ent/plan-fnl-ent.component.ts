import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { PktEntService } from 'src/app/Service/Transaction/pkt-ent.service';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';
import { PlanFnlEntService } from '../../../Service/Transaction/plan-fnl-ent.service';
import { MatInput } from '@angular/material/input';
import { CommonService } from 'src/app/Service/Common/common.service';
import PerfectScrollbar from 'perfect-scrollbar';
import { reduceEachLeadingCommentRange } from 'typescript';

export interface LOTInt {
  CODE: string;
  NAME: string;
  PNT: string;
  CARAT: string;
}

@Component({
  selector: 'app-plan-fnl-ent',
  templateUrl: './plan-fnl-ent.component.html',
  styleUrls: ['./plan-fnl-ent.component.css']
})
export class PlanFnlEntComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  @ViewChild("lcode", { static: true }) LCODE: any;

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  PNT: any = this.decodedTkn.PNT
  M_DATE: any = new Date()
  RNO: any = ''
  SRNO: any = ''
  TAG: any = ''
  L_CODE: any = ''

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  REV: boolean = false

  PASS: any = ''
  PER = []

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private PlanFnlEntServ: PlanFnlEntService,
    private _FrmOpePer: FrmOpePer,
    private PktEntServ: PktEntService,
    private ViewParaMastServ: ViewParaMastService,
    private CommonServ: CommonService,
    private elementRef: ElementRef
  ) {

    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'FrmPlnFnlEnt' }).subscribe((VPRes) => {
      try {
        if (VPRes.success == 1) {
          let temp = []

          for (let i = 0; i < VPRes.data.length; i++) {
            if (VPRes.data[i].FIELDNAME == "I_DATE") {
              temp.push({
                headerName: VPRes.data[i].DISPNAME,
                headerClass: VPRes.data[i].HEADERALIGN,
                field: VPRes.data[i].FIELDNAME,
                width: VPRes.data[i].COLWIDTH,
                cellStyle: { 'text-align': VPRes.data[i].CELLALIGN },
                resizable: VPRes.data[i].ISRESIZE,
                hide: VPRes.data[i].DISP == false ? true : false,
                cellRenderer: this.IDateConv.bind(this)
              })
            } else {
              temp.push({
                headerName: VPRes.data[i].DISPNAME,
                headerClass: VPRes.data[i].HEADERALIGN,
                field: VPRes.data[i].FIELDNAME,
                width: VPRes.data[i].COLWIDTH,
                cellStyle: { 'text-align': VPRes.data[i].CELLALIGN },
                resizable: VPRes.data[i].ISRESIZE,
                hide: VPRes.data[i].DISP == false ? true : false
              })
            }
            if (VPRes.data[i].FORMAT == 'TimeFormat') {
              temp[i].cellRenderer = this.TimeFormat.bind(this)
              delete temp[i].valueFormatter
            }
          }
          this.columnDefs = temp
        } else {
          this.toastr.warning(VPRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    this.defaultColDef = {
      resizable: true,
      sortable: true
    }
  }
  TimeFormat(params) {
    if (params.value) {
      return this.datepipe.transform(params.value, 'HH:mm a', 'UTC+0')
    } else {
      return ''
    }
  }

  ITimeConv(params) {

    if (params.value) {
      return this.datepipe.transform(params.value, 'hh:mm a', 'UTC+0')
    } else {
      return ''
    }
  }
  IDateConv(params) {
    if (params.value) {
      return this.datepipe.transform(params.value, 'dd/MM/yyyy', 'UTC+0')
    } else {
      return ''
    }
  }

  async ngOnInit() {
    this.PER = await this._FrmOpePer.UserFrmOpePer(this.constructor.name)
    this.ALLOWDEL = this.PER[0].DEL
    this.ALLOWINS = this.PER[0].INS
    this.ALLOWUPD = this.PER[0].UPD
    this.PASS = this.PER[0].PASS

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData()
  }

  LoadGridData() {
    this.PlanFnlEntServ.PlnFnlFill({
      PNT: this.PNT,
      I_DATE: this.M_DATE,
      INO: this.RNO
    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          this.gridApi.setRowData(Res.data);
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
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }
  async GetMaxPrnNo() {
    let MaxNo = ''
    let PrnNoObj = {
      DEPT_CODE: 'POI',
      PRC_CODE: 'PLN',
      I_DATE: this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd'),
      ETYPE: 'R',
      PNT: 0
    }
    await this.PktEntServ.PrnIssMaxNo(PrnNoObj).then((Res) => {
      try {
        if (Res.success == true) {
          MaxNo = Res.data[0].INO
        } else {
          this.toastr.warning(Res.data)
          MaxNo = ''
        }
      } catch (error) {
        this.toastr.warning(error)
        MaxNo = ''
      }
    })
    return MaxNo
  }
  PrnIssSave() {
    let PrnSaveObj = {
      DEPT_CODE: 'POI',
      PRC_CODE: 'PLN',
      I_DATE: this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd'),
      ETYPE: 'R',
      INO: this.RNO,
      PNT: 0
    }
    this.PktEntServ.PrnIssSave(PrnSaveObj).subscribe((Res) => {
      try {
        if (Res.success == true) {
        } else {
          this.toastr.warning(Res.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }



  async Save() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
    if (!this.L_CODE) {
      this.toastr.warning("Lot Required")
      return
    } else if (!this.SRNO) {
      this.toastr.warning("SrNo Required")
      return
    } else if (!this.TAG.trim()) {
      this.toastr.warning("Tag Required")
      return
    } else if (!this.M_DATE) {
      this.toastr.warning("Date Required")
      return
    } else if (!this.PNT) {
      this.toastr.warning("Pnt Required")
      return
    }
    if (!this.RNO) {
      this.RNO = await this.GetMaxPrnNo()
    }

    await this.PlanFnlEntServ.PlnFnlChk({
      L_CODE: this.L_CODE,
      SRNO: this.SRNO,
      TAG: this.TAG.trim(),
      ISREV: this.REV
    }).then(async (Res) => {
      try {
        if (Res.success == true) {
          if (Res.data == 'TRUE') {
            await this.PlanFnlEntServ.PlnFnlEnt({
              L_CODE: this.L_CODE,
              SRNO: this.SRNO,
              TAG: this.TAG.trim(),
              ISREV: this.REV,
              INO: this.RNO
            }).then((Res) => {
              try {
                if (Res.success == true) {
                  this.toastr.success("Saved Success fully")

                  const newItems = [
                    {
                      L_CODE: Res.data[0].L_CODE,
                      SRNO: Res.data[0].SRNO,
                      TAG: Res.data[0].TAG,
                      EMP_CODE: Res.data[0].EMP_CODE,
                      GRP: Res.data[0].GRP,
                      GRD: Res.data[0].GRD,
                      I_DATE: Res.data[0].I_DATE,
                      I_TIME: Res.data[0].I_TIME,
                      INO: Res.data[0].INO
                    }
                  ];
                  let GridRowData = []
                  this.gridApi.forEachNode(function (rowNode, index) {
                    GridRowData.push(rowNode.data);
                  });
                  const res = this.gridApi.applyTransaction({
                    add: newItems,
                    addIndex: GridRowData.length + 1,
                  });
                  this.L_CODE = ''
                  this.SRNO = 0
                  this.TAG = ''
                  this.LCODE.nativeElement.focus()
                }
              } catch (error) {
                this.toastr.error(error)
              }
            })
          } else {
            this.toastr.warning(Res.data)
          }
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  BARCODE() {
    this.CommonServ.BarCode({
      INO: this.RNO,
      I_DATE: this.M_DATE ? this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd') : '',
      TYPE: 'PLN'
    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          let text = ''
          for (var i = 0; i < Res.data.length; i++) {
            text = text + Res.data[i].BCODE + '\n';
          }
          if (Res.data != 'Not Found') {
            this.download("BARCODE.txt", text);
          } else {
            this.toastr.warning('No data')
          }

        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
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
  SETFLOAT(e: any, flonum: any) {
    return parseFloat(this[e]).toFixed(flonum);
  }
}
