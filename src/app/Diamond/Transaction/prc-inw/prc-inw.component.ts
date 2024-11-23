import { Component, ElementRef, OnInit } from '@angular/core';
import { DatePipe, JsonPipe } from "@angular/common";

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";
import * as $ from 'jquery';

import { PrcInwService } from '../../../Service/Transaction/prc-inw.service';
import { PktEntService } from 'src/app/Service/Transaction/pkt-ent.service';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonService } from 'src/app/Service/Common/common.service';
import PerfectScrollbar from 'perfect-scrollbar';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Emp {
  code: string;
  name: string;
}

@Component({
  selector: 'app-prc-inw',
  templateUrl: './prc-inw.component.html',
  styleUrls: ['./prc-inw.component.css']
})

export class PrcInwComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public pinnedBottomRowData;
  public frameworkComponents;

  show: boolean = false;
  L_CODE: any = ''
  SRNO: any = '0'
  TAG: any = ''
  PRC_TYP: any = ''
  I_DATE: any = new Date()
  I_TIME: any = this.datepipe.transform(new Date(), 'HH:mm')
  INO: any = '0'
  TPROC_CODE: any = ''
  DEPT_CODE: any = ''
  EMP_CODE: any = ''
  GRP: any = ''
  PEMP_CODE: any = ''
  LPnt: any = this.decodedTkn.PNT
  StkFlg: boolean = false
  IS_FAN: boolean = false
  IS_BRK: boolean = false
  Urgent: any = 'A'
  RUSER: any = ''
  RCOMP: any = ''
  r_grp: boolean = false;

  empCtrl: FormControl;
  filteredEmps: Observable<any[]>;
  EMPCODEArr: Emp[] = [];

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  EMPDISABLE: boolean = false
  PASS: any = ''
  PER = []

  PRArr = []
  SPRArr = []

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private PrcInwServ: PrcInwService,
    private PktEntServ: PktEntService,
    private ViewParaMastServ: ViewParaMastService,
    private _FrmOpePer: FrmOpePer,
    private CommonServ: CommonService,
    private elementRef: ElementRef
  ) {
    this.empCtrl = new FormControl();

    this.PrcInwServ.AutoTrfLoad({ E_DATE: this.I_DATE }).then((Res) => {
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

    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'FrmprocessInward' }).subscribe((VPRes) => {
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

    this.PrcInwServ.InwPrcMastFill({ DEPT_CODE: 'POI', TYPE: 'INWD', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.PRArr = PCRes.data.map((item) => {
            return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME }
          })
          this.TPROC_CODE = this.PRArr[0].PRC_CODE
          this.CheckEmp()
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
    this.LoadGridData(13)
  }

  FillSubPrc() {
    this.spinner.show()
    this.PRC_TYP = ''
    this.INO = 0
    this.StkFlg = false
    this.IS_FAN = false
    this.LoadGridData(13)
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

  filterEmps(code: string) {
    return this.EMPCODEArr.filter(grp =>
      grp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
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
    this.EMP_CODE = '';
  }

  async PrcInwSaveCheck(n1: any, mc: any) {
    let Chk;
    let PrcChkObj = {
      LOT: this.L_CODE ? this.L_CODE : '',
      SRNO: this.SRNO ? this.SRNO : '',
      TAG: this.TAG.trim(),
      TPROC_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
      PRC_TYP: this.PRC_TYP ? this.PRC_TYP : '',
      IDATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
      EMP_CODE: this.TPROC_CODE == 'N1' ? n1 : this.EMP_CODE,
      LPnt: this.LPnt ? this.LPnt : 0,
      Urgent: this.Urgent,
      StkFlg: this.StkFlg,
      IS_FAN: this.IS_FAN,
      IS_BRK: this.IS_BRK,
      PEMP_CODE: this.TPROC_CODE == 'N1' ? n1 : (this.TPROC_CODE == 'MC' ? mc : this.EMP_CODE),
      FRM_NAME: 'PrcInwComponent',
      INO: this.INO ? this.INO : 0
    }

    await this.PrcInwServ.PrcInwSaveCheck(PrcChkObj).then((CRes) => {

      try {
        if (CRes.success == true) {
          Chk = CRes.data['']
        } else {
          this.toastr.error(CRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    return Chk
  }

  async GetMaxPrnNo(): Promise<number> {
    let MaxNo = 0
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
          MaxNo = 0
        }
      } catch (error) {
        this.toastr.warning(error)
        MaxNo = 0
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
      INO: this.INO,
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

  async getN1Emp() {
    let emp
    let PrnSaveObj = {
      L_CODE: this.L_CODE,
      SRNO: this.SRNO,
      TAG: this.TAG.trim(),
      E_DATE: this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd')
    }
    await this.PrcInwServ.GetN1Chk(PrnSaveObj).then((Res) => {
      try {
        if (Res.success == true) {
          emp = Res.data[0].EMP_CODE ? Res.data[0].EMP_CODE : ''
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
    return emp
  }

  async getMCEmp() {
    let emp
    let PrnSaveObj = {
      L_CODE: this.L_CODE,
      SRNO: this.SRNO,
      TAG: this.TAG.trim(),
      PARAM: this.Urgent
    }
    await this.PrcInwServ.GetMCChk(PrnSaveObj).then((Res) => {
      try {

        if (Res.success == true) {
          emp = Res.data[0].EMP_CODE ? Res.data[0].EMP_CODE : ''
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
    return emp
  }

  async Save() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }

    let n1emp = ''
    let mcemp = ''
    if (this.TPROC_CODE == 'N1') {
      n1emp = await this.getN1Emp()
    }
    if (this.TPROC_CODE == 'MC') {
      mcemp = await this.getMCEmp()
    }
    if (!n1emp) {
      n1emp = ''
    }
    if (!mcemp) {
      mcemp = ''
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
    } else if (!this.I_DATE) {
      this.toastr.warning("Date Is required")
      return
    } else if (!this.INO) {
      this.INO = await this.GetMaxPrnNo()
      this.gridApi.setRowData([]);
    }
    if (this.show == true) {
      if (!this.EMP_CODE) {
        this.toastr.warning("EMP_CODE Is required")
        return
      }
    } else {
      this.EMP_CODE = ''
    }
    let PrcInwSaveCheck = await this.PrcInwSaveCheck(n1emp, mcemp)

    if (PrcInwSaveCheck == "TRUE") {
      let SaveObj = {
        L_CODE: this.L_CODE ? this.L_CODE : '',
        SRNO: this.SRNO ? this.SRNO : '',
        TAG: this.TAG.trim() ? this.TAG.trim() : '',
        PRC_TYP: this.PRC_TYP ? this.PRC_TYP : '',
        I_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
        I_TIME: this.I_TIME ? this.I_TIME : '',
        INO: this.INO ? this.INO : 0,
        TPROC_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
        DEPT_CODE: this.DEPT_CODE ? this.DEPT_CODE : '',
        EMP_CODE: this.TPROC_CODE == 'N1' ? n1emp : this.EMP_CODE,
        GRP: this.GRP ? this.GRP : '',
        PEMP_CODE: this.TPROC_CODE == 'N1' ? n1emp : (this.TPROC_CODE == 'MC' ? mcemp : this.EMP_CODE)
      }
      this.spinner.show()
      await this.PrcInwServ.PrcInwSave(SaveObj).then(async (SRes) => {
        try {

          if (SRes.success == true) {
            this.spinner.hide()
            $('#lcode').focus()
            await this.PrnIssSave()
            // this.toastr.success("....Save successfull....")

            const newItems = [
              {
                DETID: SRes.data[0].DETID,
                EMP_CODE: SRes.data[0].EMP_CODE,
                I_CARAT: SRes.data[0].I_CARAT,
                I_PCS: 1,
                L_CODE: this.L_CODE,
                I_DATE: this.I_DATE,
                PEMP_CODE: this.TPROC_CODE == 'N1' ? n1emp : (this.TPROC_CODE == 'MC' ? mcemp : this.EMP_CODE),
                PRC_TYP: this.PRC_TYP,
                SRNO: this.SRNO,
                TAG: this.TAG.trim(),
                TPROC_CODE: this.TPROC_CODE,
                I_TIME: SRes.data[0].I_TIME
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
            this.Clear()
            this.pinnedBottomRowData = this.FooterCal(GridRowData.length + 1);
          } else {
            this.spinner.hide()
            // Swal.fire({
            //   icon: 'error',
            //   title: 'Oops...',
            //   text: JSON.stringify(SRes.data),
            // })
            $('#lcode').focus()
            this.toastr.warning(JSON.stringify(SRes.data))
            this.Clear()
          }
        } catch (error) {
          $('#lcode').focus()
          this.Clear()
          this.spinner.hide()
        }
      })
    } else {
      this.spinner.hide()
      $('#lcode').focus()
      this.Clear()
      this.toastr.warning(PrcInwSaveCheck)

    }
  }

  Clear() {
    this.L_CODE = ''
    this.SRNO = 0
    this.TAG = ''
  }

  LoadGridData(eve: any) {
    if (eve == 13 || eve == 9) {
      this.spinner.show()
      let Obj = {
        INO: this.INO ? this.INO : '',
        I_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
        TPROC_CODE: this.TPROC_CODE,
        PRC_TYP: this.PRC_TYP,
        PNT: this.LPnt ? this.LPnt : ''
      }
      this.PrcInwServ.FrmPrcInwFill(Obj).subscribe((FillRes) => {

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
    let chk;
    if (eve.event.target !== undefined) {
      let actionType = eve.event.target.getAttribute("data-action-type");

      if (actionType == 'DeleteData') {
        Swal.fire({
          title: "Are you sure you want to delete packet code" + eve.data.L_CODE + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            let DelObj = {
              L_CODE: eve.data.L_CODE,
              SRNO: eve.data.SRNO,
              TAG: eve.data.TAG,
              DETID: eve.data.DETID,
              TPROC_CODE: eve.data.TPROC_CODE,
              FRM_NAME: 'PrcInwComponent',
            }
            this.PrcInwServ.FrmPrcInwDelete(DelObj).then((DelRes) => {
              try {
                if (DelRes.success == true) {
                  let DelObj = {
                    L_CODE: eve.data.L_CODE,
                    SRNO: eve.data.SRNO,
                    TAG: eve.data.TAG,
                    DETID: eve.data.DETID,
                    TPROC_CODE: eve.data.TPROC_CODE,
                    RUSER: eve.data.RUSER,
                    RCOMP: eve.data.RCOMP,
                  }

                  this.PrcInwServ.PrcInwDelete(DelObj).subscribe((DelRes) => {
                    try {
                      if (DelRes.success == true) {

                        this.spinner.hide()
                        this.toastr.success('Delete successfully.')
                        this.LoadGridData(13)
                      } else {
                        this.spinner.hide()
                        this.toastr.warning('Something went to wrong while delete code.')
                      }
                    } catch (err) {
                      this.spinner.hide()
                      this.toastr.error(err)
                    }
                  })
                } else {
                  this.spinner.hide()
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: JSON.stringify(DelRes.data),
                  })
                }
              } catch (err) {
                this.spinner.hide()
                this.toastr.error(err)
              }
            })
          } else {
            return
          }
        })
      } else if (actionType == 'EditData') {
        this.L_CODE = eve.data.L_CODE ? eve.data.L_CODE : ''
        this.SRNO = eve.data.SRNO ? eve.data.SRNO : 0
        this.TAG = eve.data.TAG ? eve.data.TAG : ''
        this.I_DATE = eve.data.I_DATE ? this.datepipe.transform(eve.data.I_DATE, 'yyyy-MM-dd') : ''
        this.INO = eve.data.INO ? eve.data.INO : 0
        this.EMP_CODE = eve.data.EMP_CODE ? eve.data.EMP_CODE : ''
        this.PEMP_CODE = eve.data.EMP_CODE ? eve.data.EMP_CODE : ''
        this.LPnt = eve.data.LPnt ? eve.data.LPnt : 0
      }

    }
  }

  IDateConv(params) {
    if (params.value) {
      return this.datepipe.transform(params.value, 'dd/MM/yyyy', 'UTC+0')
    } else {
      return ''

    }
  }

  LOADGRID(eve: any) {
    this.LoadGridData(eve.keyCode)
  }

  TimeFormat(params) {
    if (params.value) {
      return this.datepipe.transform(params.value, 'HH:mm a', 'UTC+0')
    } else {
      return ''
    }
  }

  FooterCal(e: any) {
    var result = [];
    result.push({
      DETID: '',
      EMP_CODE: '',
      I_CARAT: '',
      I_PCS: '',
      L_CODE: e,
      I_DATE: '',
      PEMP_CODE: '',
      PRC_TYP: '',
      SRNO: '',
      TAG: '',
      TPROC_CODE: '',
      I_TIME: ''
    })
    return result
  }

  URGENTCHANGE() {
    this.INO = 0
  }

  BARCODE() {
    this.CommonServ.BarCode({
      INO: this.INO,
      TPROC_CODE: this.TPROC_CODE,
      LPnt: this.LPnt ? this.LPnt : '',
      IUSER: this.decodedTkn.UserId,
      I_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
      TYPE: 'INW'
    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          let text = ''
          for (var i = 0; i < Res.data.length; i++) {
            text = text + Res.data[i].BCODE + '\n';
          }
          if (Res.data.length != 0) {
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

  PRINT() {
    this.PrcInwServ.PrcPrint({
      INO: this.INO,
      TPROC_CODE: this.TPROC_CODE,
      LPnt: this.LPnt ? this.LPnt : '',
      DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : ''
    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          if (Res.data.length != 0) {
            let process = 'E' + this.PRArr.filter(x => x.PRC_CODE == this.TPROC_CODE)[0].PRC_NAME + 'F '
            let cat = ""
            if (this.Urgent == 'A') {
              cat = "All"
            } else if (this.Urgent == 'G') {
              cat = "GIA Rolling"
            } else if (this.Urgent == 'U') {
              cat = "Urgent Rolling"
            }
            if (this.SPRArr.length != 0) {
              process = process + '(E' + this.SPRArr.filter(x => x.PRC_CODE == this.PRC_TYP)[0].PRC_NAME + 'F)'
            }
            let TOTALPCS = 0
            let TOTALWEG = 0
            let LCODESPACE = ''
            let TOTALSPACE = ''
            let text = 'Employee Inward Entry\n'
            text = text + 'Pointer : E' + this.LPnt + 'F\n'
            text = text + '(' + this.datepipe.transform(Date(), 'dd/MM-hh:mm a') + ')\n'
            text = text + 'Inward No : E' + this.INO + 'F\n'
            text = text + 'Categories :E' + cat + 'F\n'
            text = text + 'Process : ' + process + '\n'
            if (Res.data[0].PEMP_NAME != null) {
              text = text + 'Party :E' + Res.data[0].PEMP_NAME + 'F\n'
            }
            text = text + '======================\n'
            text = text + 'Lot No   Pcs   Carat\n'
            text = text + '======================\n'
            for (var i = 0; i < Res.data.length; i++) {
              let LCODESPACE = ''
              let IPCSSPACE = ''
              for (let l = 0; l < 10 - Res.data[i].LCODE.length; l++) {
                LCODESPACE = LCODESPACE + ' '
              }
              for (let l = 0; l < 5 - Res.data[i].IPCS.toString().length; l++) {
                IPCSSPACE = IPCSSPACE + ' '
              }
              text = text + Res.data[i].LCODE + LCODESPACE + Res.data[i].IPCS + IPCSSPACE + Res.data[i].ICRT + '\n';
              TOTALPCS = TOTALPCS + Res.data[i].IPCS
              TOTALWEG = TOTALWEG + Res.data[i].ICRT
            }
            text = text + '======================\n'

            for (let l = 0; l < 5 - (TOTALPCS.toString()).length; l++) {
              TOTALSPACE = TOTALSPACE + ' '
            }

            text = text + 'ETotal :   E' + TOTALPCS + TOTALSPACE + 'E' + TOTALWEG + 'F\n'
            text = text + '======================\n'
            text = text + 'User :' + this.decodedTkn.UserId + '\n\n'
            text = text + 'Signature: _____________\n'
            this.download("PRNPRCINW.txt", text);
          } else {
            this.toastr.warning('No data')
          }
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  EmpDiasbledValue() {
    if (this.EMP_CODE == '') {
      this.EMPDISABLE = false
    } else {
      this.EMPDISABLE = true;
    }
  }

}
