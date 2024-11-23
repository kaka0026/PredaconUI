import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe, JsonPipe } from "@angular/common";

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

import { PrcInwService } from '../../../Service/Transaction/prc-inw.service';
import { PrcRecIssueService } from 'src/app/Service/Transaction/prc-rec-issue.service';
import { PktEntService } from 'src/app/Service/Transaction/pkt-ent.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import PerfectScrollbar from 'perfect-scrollbar';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

export interface Emp {
  code: string;
  name: string;
}

@Component({
  selector: 'app-prc-rec-issue',
  templateUrl: './prc-rec-issue.component.html',
  styleUrls: ['./prc-rec-issue.component.css']
})
export class PrcRecIssueComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  @ViewChild("prcrecisslcode", { static: true }) PRCRECISSLCODE: any;

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public pinnedBottomRowData;
  public frameworkComponents;

  TPROC_CODE: any = ''
  TPROC_CODE1: any = ''
  FPROC_CODE: any = ''
  PRC_TYP: any = ''
  LPnt: any = this.decodedTkn.PNT
  EMP_CODE: any = ''
  PEMP_CODE: any = ''
  I_DATE: any = new Date()
  I_TIME: any = this.datepipe.transform(new Date(), 'HH:mm')
  INO_rec: any = ''
  INO_issue: any = ''
  L_CODE: any = ''
  SRNO: any = ''
  TAG: any = ''
  R_DATE: any = ''
  R_TIME: any = ''
  E_CARAT: any = ''
  E_PCS: any = ''
  L_CARAT: any = ''
  S_CARAT: any = ''
  S_PCS: any = ''
  SYN: any = ''
  RUSER: any = ''
  RNO: any = ''
  IUSER: any = ''
  RCOMP: any = ''
  ICOMP: any = ''
  DEPT_CODE: any = ''
  ITYPE: any = ''
  ConCarat: any = ''
  KATI: any = ''
  ISLOSS: any = ''
  SHIF: any = ''
  ISOK: any = ''
  Urgent: any = 'A'
  r_grp: boolean = true;

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []

  IS_BRK: boolean = false
  show: boolean = false
  IS_FAN: boolean = false
  ISCFM: boolean = false

  empCtrl: FormControl;
  filteredEmps: Observable<any[]>;
  EMPCODEArr: Emp[] = [];

  PRArr = []
  PRTNArr = []
  SPRArr = []

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private PrcInwServ: PrcInwService,
    private PrcRecIssueServ: PrcRecIssueService,
    private PktEntServ: PktEntService,
    private ViewParaMastServ: ViewParaMastService,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef
  ) {
    this.empCtrl = new FormControl();
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'FrmPrcRecIssEnt' }).subscribe((VPRes) => {
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

    this.defaultColDef = {
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

    this.PrcInwServ.InwPrcMastFill({ DEPT_CODE: 'POI', TYPE: 'PRTN', IUSER: this.decodedTkn.UserId }).subscribe((PRTNRes) => {
      try {
        if (PRTNRes.success == true) {
          this.PRTNArr = PRTNRes.data.map((item) => {
            return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME }
          })
          this.FPROC_CODE = this.PRTNArr[0].PRC_CODE
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(PRTNRes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    this.PrcInwServ.InwPrcMastFill({ DEPT_CODE: 'POI', TYPE: 'PRTNINWD', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.PRArr = PCRes.data.map((item) => {
            return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME }
          })
          this.TPROC_CODE = this.PRArr[0].PRC_CODE
          this.FillSubPrc();
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
  filterEmps(code: string) {
    return this.EMPCODEArr.filter(grp =>
      grp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
  FillSubPrc() {
    this.spinner.show()
    this.PRC_TYP = ''
    this.PrcInwServ.FrmPrcInwEmpCodeFill({ DEPT_CODE: 'POI', PRC_CODE: this.TPROC_CODE }).subscribe((ERes) => {
      try {
        if (ERes.success == true) {
          this.EMPCODEArr = ERes.data.map((item) => {
            return {
              code: item.EMP_CODE,
              name: item.EMP_NAME,
              GRP: item.GRP,
              PROC_CODE: item.PROC_CODE,
            }
          })
          this.filteredEmps = this.empCtrl.valueChanges
            .pipe(
              startWith(''),
              map(grp => grp ? this.filterEmps(grp) : this.EMPCODEArr)
            );
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(ERes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    this.PrcInwServ.GetSubPrcMastFill({ DEPT_CODE: 'POI', SPRC_CODE: this.TPROC_CODE }).subscribe((SRes) => {
      try {
        if (SRes.success == true) {
          this.spinner.hide()
          this.SPRArr = SRes.data.map((item) => {
            return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME }
          })

          if (this.SPRArr.length != 0 && this.SPRArr[0].PRC_CODE) {
            this.r_grp = true;
            this.PRC_TYP = this.SPRArr[0].PRC_CODE;
          } else {
            this.r_grp = false;
          }
        } else {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(SRes.data),
          })
        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })
  }

  CheckEmp() {
    this.PrcInwServ.CheckEmp({ DEPT_CODE: 'POI', PRC_CODE: this.TPROC_CODE }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          this.show = ! false;
        } else {
          this.show = ! true
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    this.gridApi.setRowData([]);
    this.L_CODE = ''
    this.SRNO = ''
    this.TAG = ''
    this.EMP_CODE = ''
    this.LPnt = this.decodedTkn.PNT
    this.INO_issue = 0
    this.INO_rec = 0
    this.PRC_TYP = ''
    this.ISCFM = false
    this.IS_FAN = false
    this.Urgent = 'A'
  }

  async PrcRecIssueSaveCheck() {

    let Chk;

    let PrcChkObj = {
      LOT: this.L_CODE ? this.L_CODE : '',
      SRNO: this.SRNO ? this.SRNO : '',
      TAG: this.TAG.trim(),
      TPROC_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
      Urgent: this.Urgent,
      FPROC_CODE: this.FPROC_CODE ? this.FPROC_CODE : '',
      LPnt: this.LPnt ? this.LPnt : this.decodedTkn.PNT,
      IS_BRK: this.IS_BRK,
      IS_FAN: this.IS_FAN,
      ISCFM: this.ISCFM,
      PRC_TYP: this.PRC_TYP ? this.PRC_TYP : '',
      FRM_NAME: 'PrcRecIssueComponent',
    }

    await this.PrcRecIssueServ.PrcRecIssueSaveCheck(PrcChkObj).then((CRes) => {
      try {
        if (CRes.success == true) {
          Chk = CRes.data['']
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(CRes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    return Chk
  }
  async GetMaxPrnNoIssue() {
    let MaxNo = ''
    let PrnNoObj = {
      DEPT_CODE: 'POI',
      PRC_CODE: this.TPROC_CODE,
      I_DATE: this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd'),
      ETYPE: 'I',
      PNT: this.LPnt
    }
    await this.PktEntServ.PrnIssMaxNo(PrnNoObj).then((Res) => {
      try {
        if (Res.success == true) {
          MaxNo = Res.data[0].INO
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(Res.data),
          })
          MaxNo = ''
        }
      } catch (error) {
        this.toastr.warning(error)
        MaxNo = ''
      }
    })
    return MaxNo
  }
  async GetMaxPrnNoReceive() {
    let MaxNo = ''
    let PrnNoObj = {
      DEPT_CODE: 'POI',
      PRC_CODE: this.FPROC_CODE,
      I_DATE: this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd'),
      ETYPE: 'R',
      PNT: this.LPnt
    }
    await this.PktEntServ.PrnIssMaxNo(PrnNoObj).then((Res) => {
      try {
        if (Res.success == true) {
          MaxNo = Res.data[0].INO
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(Res.data),
          })
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
      PRC_CODE: this.TPROC_CODE,
      I_DATE: this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd'),
      ETYPE: 'I',
      INO: this.INO_issue,
      PNT: this.LPnt
    }
    this.PktEntServ.PrnIssSave(PrnSaveObj).subscribe((Res) => {
      try {
        if (Res.success == true) {

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(Res.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  PrnRecSave() {
    let PrnSaveObj = {
      DEPT_CODE: 'POI',
      PRC_CODE: this.FPROC_CODE,
      I_DATE: this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd'),
      ETYPE: 'R',
      INO: this.INO_rec,
      PNT: this.LPnt
    }
    this.PktEntServ.PrnIssSave(PrnSaveObj).subscribe((Res) => {
      try {
        if (Res.success == true) {

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(Res.data),
          })
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
    if (!this.INO_issue) {
      this.INO_issue = await this.GetMaxPrnNoIssue()
    }
    if (!this.INO_rec) {
      this.INO_rec = await this.GetMaxPrnNoReceive()
      this.gridApi.setRowData([]);
    }

    if (!this.L_CODE) {
      this.toastr.warning("Lot Is required")
      return
    } else if (!this.SRNO) {
      this.toastr.warning("Srno Is required")
      return
    } else if (!this.TAG.trim()) {
      this.toastr.warning("Tag Is required")
      return
    } else if (!this.LPnt) {
      this.toastr.warning("Pnt Is required")
      return
    } else if (!this.I_DATE) {
      this.toastr.warning("Date Is required")
      return
    } else if (this.show == true) {
      if (!this.EMP_CODE) {
        this.toastr.warning("EMP_CODE Is required")
        return
      }
    } else {
      this.EMP_CODE = ''
    }
    let PrcRecIssueSaveCheck = await this.PrcRecIssueSaveCheck()
    if (PrcRecIssueSaveCheck == 'TRUE') {
      this.spinner.show()
      let CaratObj = {
        L_CODE: this.L_CODE ? this.L_CODE : '',
        SRNO: this.SRNO ? this.SRNO : '',
        TAG: this.TAG.trim() ? this.TAG.trim() : '',
      }
      this.PrcRecIssueServ.PrcRecIssueCarat(CaratObj).subscribe((CRes) => {
        try {

          if (CRes.success == true) {
            this.spinner.hide()
            let SaveObj = {
              L_CODE: this.L_CODE ? this.L_CODE : '',
              SRNO: this.SRNO ? this.SRNO : '',
              TAG: this.TAG.trim() ? this.TAG.trim() : '',
              PNT: this.LPnt ? this.LPnt : '',
              FPROC_CODE: this.FPROC_CODE ? this.FPROC_CODE : '',
              TPROC_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
              R_CARAT: CRes.data[0].R_CARAT,
              R_PCS: CRes.data[0].R_PCS,
              R_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
              R_TIME: this.I_TIME ? this.I_TIME : '',
              E_CARAT: this.E_CARAT ? this.E_CARAT : '',
              E_PCS: this.E_PCS ? this.E_PCS : '',
              L_CARAT: this.L_CARAT ? this.L_CARAT : '',
              S_CARAT: this.S_CARAT ? this.S_CARAT : '',
              S_PCS: this.S_PCS ? this.S_PCS : '',
              SYN: this.SYN ? this.SYN : '',
              RUSER: this.decodedTkn.UserId,
              INO: this.INO_issue ? this.INO_issue : '',
              RNO: this.INO_rec ? this.INO_rec : '',
              IUSER: this.decodedTkn.UserId,
              RCOMP: this.decodedTkn.UserId,
              ICOMP: this.decodedTkn.UserId,
              DEPT_CODE: this.DEPT_CODE ? this.DEPT_CODE : '',
              ITYPE: this.ITYPE ? this.ITYPE : '',
              ConCarat: CRes.data[0].R_CARAT,
              EMP_CODE: this.EMP_CODE ? this.EMP_CODE : '',
              PEMP_CODE: this.EMP_CODE ? this.EMP_CODE : '',
              KATI: this.KATI ? this.KATI : '',
              ISLOSS: this.ISLOSS ? this.ISLOSS : '',
              SHIF: this.SHIF ? this.SHIF : '',
              ISOK: this.ISOK ? this.ISOK : '',
              PRC_TYP: this.PRC_TYP ? this.PRC_TYP : '',
              ISCFM: this.ISCFM == true ? true : false,
            }
            this.PrcRecIssueServ.PrcRecIssueSave(SaveObj).subscribe((SRes) => {
              try {
                if (SRes.success == true) {
                  this.spinner.hide()
                  this.PrnIssSave()
                  this.PrnRecSave()
                  // this.toastr.success("....Save successfull....")
                  const newItems = [
                    {
                      L_CODE: this.L_CODE,
                      SRNO: this.SRNO,
                      DETID: SRes.data[0].DETID,
                      TAG: this.TAG.trim(),
                      EMP_CODE: SRes.data[0].EMP_CODE,
                      I_DATE: this.I_DATE,
                      I_TIME: SRes.data[0].I_TIME,
                      I_CARAT: SRes.data[0].I_CARAT,
                      I_PCS: 1
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
                  this.pinnedBottomRowData = this.FooterCal(GridRowData.length + 1);
                  this.Clear()
                  this.PRCRECISSLCODE.nativeElement.focus()
                } else {
                  this.spinner.hide()
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: JSON.stringify(SRes.data),
                  })
                }
              } catch (error) {
                this.spinner.hide()
              }
            })

          } else {
            this.spinner.hide()
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: JSON.stringify(CRes.data),
            })
          }
        } catch (error) {
          this.spinner.hide()
        }
      })
    } else {
      this.spinner.hide()
      this.toastr.warning(PrcRecIssueSaveCheck)
    }
  }

  Clear() {
    this.L_CODE = ''
    this.SRNO = ''
    this.TAG = ''
  }

  LoadGridData(eve: any, NONAME: any) {
    if (eve == 13 || eve == 9) {
      this.spinner.show()
      let Obj = {
        INO: NONAME == 'INO' ? (this.INO_issue ? this.INO_issue : '') : (this.INO_rec ? this.INO_rec : ''),
        I_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
        TPROC_CODE: NONAME == 'INO' ? this.TPROC_CODE : this.FPROC_CODE,
        PNT: this.LPnt ? this.LPnt : '',
        TYPE: NONAME == 'INO' ? 'I' : 'R',
      }

      this.PrcRecIssueServ.PrcRecIssueFill(Obj).subscribe((FillRes) => {

        try {
          if (FillRes.success == true) {
            this.spinner.hide()
            this.gridApi.setRowData(FillRes.data);
            this.gridApi.sizeColumnsToFit();
            this.pinnedBottomRowData = this.FooterCal(FillRes.data.length);
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
  }

  onGridRowClicked(eve: any) {
    if (eve.event.target !== undefined) {
      let actionType = eve.event.target.getAttribute("data-action-type");

      if (actionType == 'EditData') {
        this.L_CODE = eve.data.L_CODE ? eve.data.L_CODE : ''
        this.SRNO = eve.data.SRNO ? eve.data.SRNO : 0
        this.TAG = eve.data.TAG ? eve.data.TAG : ''
        this.I_DATE = eve.data.I_DATE ? this.datepipe.transform(eve.data.I_DATE, 'yyyy-MM-dd') : ''
        this.INO_rec = eve.data.INO ? eve.data.INO : 0
        this.EMP_CODE = eve.data.EMP_CODE ? eve.data.EMP_CODE : ''
        this.PEMP_CODE = eve.data.EMP_CODE ? eve.data.EMP_CODE : ''
        this.LPnt = eve.data.LPnt ? eve.data.LPnt : this.decodedTkn.PNT
      }

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
      return this.datepipe.transform(params.value, 'HH:mm a', 'UTC+0')
    } else {
      return ''
    }
  }
  LOADGRID(eve: any, NONAME: any) {
    this.LoadGridData(eve.keyCode, NONAME)
  }
  IDateConv(params) {
    if (params.value) {
      return this.datepipe.transform(params.value, 'dd/MM/yyyy', 'UTC+0')
    } else {
      return ''

    }
  }
  FooterCal(e: any) {
    var result = [];
    result.push({
      L_CODE: e,
      SRNO: '',
      DETID: '',
      TAG: '',
      EMP_CODE: '',
      I_DATE: '',
      I_TIME: '',
      I_CARAT: '',
      I_PCS: ''
    })
    return result
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
    this.PrcRecIssueServ.PktRecEntPrint({
      RNO: this.INO_issue,
      TPROC_CODE: this.TPROC_CODE,
      PNT: this.LPnt,
      R_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : ''
    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          let TOTALPCS = 0
          let TOTALWEG = 0
          let cat = ""
          if (this.Urgent == 'A') {
            cat = "All"
          } else if (this.Urgent == 'G') {
            cat = "GIA Rolling"
          } else if (this.Urgent == 'U') {
            cat = "Urgent Rolling"
          }
          if (Res.data.length != 0) {
            let text = 'Packet Receive Entry\n'
            text = text + 'Pointer : E' + this.LPnt + 'F\n'
            text = text + '(' + this.datepipe.transform(Date(), 'dd/MM-hh:mm a') + ')\n'
            text = text + 'Inward No : E' + this.INO_issue + 'F\n'
            text = text + 'Categories :E' + cat + 'F\n'
            text = text + 'Process : E' + Res.data[0].PRC_TYP + 'F\n'
            if (Res.data[0].PEMP_NAME != null) {
              text = text + 'Party :E' + Res.data[0].PEMP_CODE + 'F\n'
            }
            text = text + '=========================\n'
            text = text + 'Lot No   Pcs   Carat\n'
            text = text + '=========================\n'
            for (var i = 0; i < Res.data.length; i++) {
              text = text + Res.data[i].LCode + this.GETSPACE(9, Res.data[i].LCode.toString().length) + Res.data[i].IPcs + this.GETSPACE(8, Res.data[i].IPcs.toString().length) + Res.data[i].ICrt + '\n';
              TOTALPCS = TOTALPCS + Res.data[i].IPcs
              TOTALWEG = TOTALWEG + Res.data[i].ICrt
            }
            text = text + '=========================\n'
            text = text + 'ETotal :  E' + TOTALPCS + this.GETSPACE(8, TOTALPCS.toString().length) + 'E' + TOTALWEG + 'F\n'
            text = text + '=========================\n'
            text = text + 'User :' + this.decodedTkn.UserId + '\n\n'
            text = text + 'Signature: _____________\n'
            this.download("PRNRECISS.txt", text);
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
  SETFLOAT(e: any, flonum: any) {
    return parseFloat(this[e]).toFixed(flonum)
  }
}
