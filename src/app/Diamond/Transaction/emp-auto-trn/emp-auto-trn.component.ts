import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EmpAutoTrnService } from 'src/app/Service/Transaction/emp-auto-trn.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { PktEntService } from 'src/app/Service/Transaction/pkt-ent.service';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';
import * as $ from "jquery";
import { CommonService } from 'src/app/Service/Common/common.service';
import PerfectScrollbar from 'perfect-scrollbar';

export interface LOTInt {
  CODE: string;
  NAME: string;
  PNT: string;
  CARAT: string;
}

@Component({
  selector: 'app-emp-auto-trn',
  templateUrl: './emp-auto-trn.component.html',
  styleUrls: ['./emp-auto-trn.component.css']
})
export class EmpAutoTrnComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  @ViewChild("empautolcode", { static: true }) EMPAUTOLCODE: any;

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  PNT: any = this.decodedTkn.PNT
  M_DATE: any = new Date()
  INO: any = ''
  SRNO: any = ''
  TAG: any = ''
  L_CODE: any = ''

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private EmpAutoTrnServ: EmpAutoTrnService,
    private _FrmOpePer: FrmOpePer,
    private PktEntServ: PktEntService,
    private ViewParaMastServ: ViewParaMastService,
    private CommonServ: CommonService,
    private elementRef: ElementRef
  ) {
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'FrmAutoTrf' }).subscribe((VPRes) => {
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
              temp[i].cellRenderer = this.ITimeConv.bind(this)
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

    this.EmpAutoTrnServ.AutoTrfLoad({ E_DATE: Date() }).subscribe((FillRes) => {
      try {
        if (FillRes.success == true) {
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData()
  }

  LoadGridData() {
    let Obj = {
      INO: this.INO,
      I_DATE: this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd'),
      TPROC_CODE: 'CC',
      PNT: this.PNT,
    }

    this.EmpAutoTrnServ.AutoTrfFill(Obj).subscribe((FillRes) => {
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
  async GetMaxPrnNo() {
    let MaxNo = ''
    let PrnNoObj = {
      DEPT_CODE: 'POI',
      PRC_CODE: 'CC',
      I_DATE: this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd'),
      ETYPE: 'AR',
      PNT: 0
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
      PRC_CODE: 'CC',
      I_DATE: this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd'),
      ETYPE: 'AR',
      INO: this.INO,
      PNT: 0
    }
    this.PktEntServ.PrnIssSave(PrnSaveObj).subscribe(async (Res) => {
      try {
        if (Res.success == true) {
          this.toastr.success("....Save successfull....")
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
    if (!this.INO) {
      this.INO = await this.GetMaxPrnNo()
    }
    if (!this.L_CODE) {
      this.toastr.warning("Lot Required")
      return
    }
    if (!this.SRNO) {
      this.toastr.warning("srno Required")
      return
    }
    if (!this.TAG) {
      this.toastr.warning("Tag Required")
      return
    }
    if (!this.M_DATE) {
      this.toastr.warning("Date Required")
      return
    }

    let ChkObj = {
      L_CODE: this.L_CODE,
      SRNO: this.SRNO,
      TAG: this.TAG,
      PNT: this.PNT,
    }
    this.EmpAutoTrnServ.AutoTrfSaveChk(ChkObj).then((ChkRes) => {
      try {
        if (ChkRes.data[''] == "TRUE") {
          let SaveObj = {
            L_CODE: this.L_CODE,
            SRNO: this.SRNO,
            TAG: this.TAG,
            PNT: this.PNT,
            I_DATE: this.M_DATE ? this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd') : '',
            RNO: this.INO,
            ICOMP: this.decodedTkn.UserId,
            IUSER: this.decodedTkn.UserId
          }

          this.spinner.show()
          this.EmpAutoTrnServ.AutoTrfSave(SaveObj).subscribe(async (Res) => {
            try {
              if (Res.success == true) {
                this.spinner.hide()
                this.EMPAUTOLCODE.nativeElement.focus()
                await this.PrnIssSave()
                this.toastr.success("....Save successfull....")
                const newItems = [
                  {
                    L_CODE: Res.data[0].L_CODE,
                    SRNO: Res.data[0].SRNO,
                    TAG: Res.data[0].TAG,
                    EMP_CODE: Res.data[0].EMP_CODE,
                    GRP: Res.data[0].GRP,
                    I_DATE: Res.data[0].I_DATE,
                    I_PCS: Res.data[0].I_PCS,
                    I_CARAT: Res.data[0].I_CARAT,
                    I_TIME: Res.data[0].I_TIME
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
              } else {
                this.spinner.hide()
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: JSON.stringify(Res.data),
                })
              }
            } catch (error) {
              this.spinner.hide()
              this.toastr.error(error)
            }
          })
        } else {
          this.toastr.warning(ChkRes.data[''])
        }
      }
      catch (error) {
        this.toastr.warning(error)
      }
    })
  }

  BARCODE() {
    this.CommonServ.BarCode({
      INO: this.INO,
      IUSER: this.decodedTkn.UserId,
      I_DATE: this.M_DATE ? this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd') : '',
      TYPE: 'TRF'
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
    this.EmpAutoTrnServ.AutoTrfPrint({
      RNO: this.INO,
      PNT: this.PNT,
      R_DATE: this.M_DATE ? this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd') : ''
    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          if (Res.data.length != 0) {
            let TOTALWEG = 0
            let text = 'Employee AutoTransfer Entry\n'
            text = text + 'Pointer : E' + this.PNT + 'F\n'
            text = text + '(' + this.datepipe.transform(Date(), 'dd/MM-hh:mm a') + ')\n'
            text = text + 'Slip No : E' + this.INO + 'F\n'
            text = text + 'Process : ECross CheckF\n'
            text = text + '========================================\n'
            text = text + 'LotNo SrNo Tag Emp  Grp  Pcs   Carat\n'
            text = text + '========================================\n'
            for (var i = 0; i < Res.data.length; i++) {
              text = text + Res.data[i].L_CODE + this.GETSPACE(9, Res.data[i].L_CODE.toString().length)
              text = text + Res.data[i].SRNO + this.GETSPACE(2, Res.data[i].SRNO.toString().length)
              text = text + Res.data[i].TAG + this.GETSPACE(4, Res.data[i].TAG.toString().length)
              text = text + Res.data[i].EMP_CODE + this.GETSPACE(5, Res.data[i].EMP_CODE.toString().length)
              text = text + Res.data[i].GRP + this.GETSPACE(6, Res.data[i].GRP.toString().length)
              text = text + Res.data[i].I_PCS + this.GETSPACE(5, Res.data[i].I_PCS.toString().length)
              text = text + Res.data[i].I_CARAT + this.GETSPACE(5, Res.data[i].I_CARAT.toString().length) + '\n';
              TOTALWEG = TOTALWEG + Res.data[i].I_CARAT
            }
            text = text + '========================================\n'

            text = text + 'ETotal :   E' + Res.data.length + this.GETSPACE(19, Res.data.length.toString().length) + 'E' + TOTALWEG + ' F\n'
            text = text + '========================================\n'
            text = text + 'User :' + this.decodedTkn.UserId + '\n\n'
            text = text + 'Signature: _____________\n'
            this.download("PRNPPRIDER.txt", text);
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
}
