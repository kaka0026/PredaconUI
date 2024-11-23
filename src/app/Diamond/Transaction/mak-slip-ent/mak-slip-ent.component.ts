import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MakSlipEntService } from 'src/app/Service/Transaction/mak-slip-ent.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { PktEntService } from 'src/app/Service/Transaction/pkt-ent.service';
import * as $ from "jquery";
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';

@Component({
  selector: 'app-mak-slip-ent',
  templateUrl: './mak-slip-ent.component.html',
  styleUrls: ['./mak-slip-ent.component.css']
})

export class MakSlipEntComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

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
    private MakSlipEntServ: MakSlipEntService,
    private _FrmOpePer: FrmOpePer,
    private PktEntServ: PktEntService,
    private ViewParaMastServ: ViewParaMastService,
    private elementRef: ElementRef
  ) {
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'FrmmakInoEnt' }).subscribe((VPRes) => {
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
            if (VPRes.data[i].FORMAT == 'DateFormat') {
              temp[i].cellRenderer = this.IDateConv.bind(this)
              delete temp[i].valueFormatter
            } else if (VPRes.data[i].FORMAT == 'TimeFormat') {
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
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData()
  }

  LoadGridData() {
    let SaveObj = {
      PNT: this.PNT,
      M_DATE: this.M_DATE ? this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd') : '',
      MNO: this.INO
    }

    this.spinner.show()
    this.MakSlipEntServ.MakInoEntFill(SaveObj).subscribe(async (Res) => {
      try {
        if (Res.success == true) {
          this.gridApi.setRowData(Res.data)
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
  }

  async GetMaxPrnNo() {
    let MaxNo = ''
    let PrnNoObj = {
      DEPT_CODE: 'POI',
      PRC_CODE: 'MAK',
      I_DATE: this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd'),
      ETYPE: 'I',
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
      PRC_CODE: 'MAK',
      I_DATE: this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd'),
      ETYPE: 'I',
      INO: this.INO,
      PNT: 0
    }
    this.PktEntServ.PrnIssSave(PrnSaveObj).subscribe(async (Res) => {
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
    if (!this.TAG.trim()) {
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
      TAG: this.TAG.trim(),
      PNT: this.PNT ? this.PNT : 0
    }
    this.spinner.show()
    this.MakSlipEntServ.MakSlipInoEnt(ChkObj).then((ChkRes) => {
      try {
        if (ChkRes.data[''] == "TRUE") {
          let SaveObj = {
            L_CODE: this.L_CODE,
            SRNO: this.SRNO,
            TAG: this.TAG.trim(),
            PNT: this.PNT,
            M_DATE: this.M_DATE ? this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd') : '',
            MCOMP: this.decodedTkn.UserId,
            MUSER: this.decodedTkn.UserId,
            MNO: this.INO
          }

          this.spinner.show()
          this.MakSlipEntServ.MakSlipInoEntSave(SaveObj).subscribe(async (Res) => {
            try {
              if (Res.success == true) {
                this.spinner.hide()
                this.spinner.hide()
                $('#lcode').focus()
                await this.PrnIssSave()
                this.toastr.success("....Save successfull....")
                const newItems = [
                  {
                    L_CODE: Res.data[0].L_CODE,
                    SRNO: Res.data[0].SRNO,
                    TAG: Res.data[0].TAG,
                    PNT: Res.data[0].PNT,
                    MNO: Res.data[0].MNO,
                    M_DATE: Res.data[0].M_DATE,
                    M_TIME: Res.data[0].M_TIME
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
    this.MakSlipEntServ.MakInoEntPrint({
      PNT: this.PNT,
      M_DATE: this.M_DATE ? this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd') : '',
      INO: this.INO
    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          if (Res.data.length != 0) {
            let TOTALPCS = 0
            let TOTALWEG = 0
            let text = 'Makeble Jangad\n'
            text = text + 'Pointer : E' + this.PNT + 'F\n'
            text = text + '(' + this.datepipe.transform(Date(), 'dd/MM-hh:mm a') + ')\n'
            text = text + 'Inward No : E' + this.INO + 'F\n'
            text = text + '======================\n'
            text = text + 'LotNo     Pcs    Carat\n'
            text = text + '======================\n'
            for (var i = 0; i < Res.data.length; i++) {
              text = text + Res.data[i].L_CODE + this.GETSPACE(10, Res.data[i].L_CODE.toString().length) + this.GETSPACE(3, Res.data[i].RPcs.toString().length) + Res.data[i].RPcs + '    ' + Res.data[i].RCrt + this.GETSPACE(6, Res.data[i].RCrt.toString().length) + '\n';
              TOTALPCS = TOTALPCS + Res.data[i].RPcs
              TOTALWEG = TOTALWEG + Res.data[i].RCrt
            }
            text = text + '======================\n'
            text = text + 'ETotal :   E' + this.GETSPACE(3, TOTALPCS.toString().length) + TOTALPCS + ' E' + this.GETSPACE(8, TOTALWEG.toString().length) + TOTALWEG + ' F\n'
            text = text + '======================\n'
            text = text + 'User :' + this.decodedTkn.UserId + '\n\n'
            text = text + 'Signature: _____________\n'
            this.download("PRNMAKENT.txt", text);
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
