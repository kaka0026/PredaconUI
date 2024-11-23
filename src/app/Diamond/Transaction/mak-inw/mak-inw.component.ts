import { Component, OnInit, ElementRef } from '@angular/core';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from "@angular/common";
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { JwtHelperService } from '@auth0/angular-jwt';
import PerfectScrollbar from 'perfect-scrollbar';

import { MakInwService } from 'src/app/Service/Transaction/mak-inw.service';


@Component({
  selector: 'app-mak-inw',
  templateUrl: './mak-inw.component.html',
  styleUrls: ['./mak-inw.component.css']
})
export class MakInwComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  PNT: any = this.decodedTkn.PNT
  M_DATE: any = new Date()
  MNO: any = 0

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
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private _FrmOpePer: FrmOpePer,
    private MakInwServ: MakInwService,
    private elementRef: ElementRef
  ) {
    this.columnDefs = [
      {
        headerName: 'Lot',
        field: 'L_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
      },
      {
        headerName: 'SrNo',
        field: 'SRNO',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Tag',
        field: 'TAG',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'DetID',
        field: 'DETID',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Emp Code',
        field: 'EMP_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
      },
      {
        headerName: 'Grp',
        field: 'GRP',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
      },
      {
        headerName: 'Pcs',
        field: 'R_PCS',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
      },
      {
        headerName: 'Carat',
        field: 'R_CARAT',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
      },
      {
        headerName: 'Exp. Carat',
        field: 'MAKCARAT',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
      },
      {
        headerName: 'Shape',
        field: 'MAKS_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
      },
      {
        headerName: 'Quality',
        field: 'Q_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
      },
      {
        headerName: 'Color',
        field: 'C_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
      },
      {
        headerName: 'Carat',
        field: 'MAKCARAT',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
      },
      {
        headerName: 'M No',
        field: 'MNO',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
      },
    ]

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
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.LoadGridData()
  }

  LoadGridData(eve) {
    if (eve.charCode == 13 || eve.charCode == 9) {
      if (this.PNT == '') {
        this.toastr.warning("Enter Pnt.")
        return
      }
      if (this.M_DATE == '') {
        this.toastr.warning("Enter Date.")
        return
      }
      if (this.MNO == '') {
        this.toastr.warning("Enter Slip No.")
        return
      }
      this.spinner.show()
      let Obj = {
        M_DATE: this.M_DATE ? this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd') : '',
        MNO: this.MNO ? this.MNO : 0,
        PNT: this.PNT ? this.PNT : 0
      }
      this.MakInwServ.MakInwDisp(Obj).subscribe((FillRes) => {
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
            this.toastr.error(JSON.stringify(FillRes.data))
          }
        } catch (error) {
          this.spinner.hide()
          this.toastr.error(error)
        }
      })
    }
  }



  CHANGEPASSWORD() {
    let RowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      RowData.push(rowNode.data);
    });
    this.gridApi.setRowData(RowData);
  }

  SETFLOAT(e: any, flonum: any) {
    return parseFloat(this[e]).toFixed(flonum)
  }

  Save() {
    if (this.PNT == '') {
      this.toastr.warning("Enter Pnt.")
      return
    }
    if (this.M_DATE == '') {
      this.toastr.warning("Enter Date.")
      return
    }
    if (this.MNO == '') {
      this.toastr.warning("Enter Slip No.")
      return
    }
    this.spinner.show()
    let Obj = {
      M_DATE: this.M_DATE ? this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd') : '',
      MNO: this.MNO ? this.MNO : 0,
      PNT: this.PNT ? this.PNT : 0
    }
    this.MakInwServ.MakInwChk(Obj).subscribe((FillRes) => {
      try {
        if (FillRes.success == true) {
          this.spinner.hide()
          if (FillRes.data == 'TRUE') {
            let Obj = {
              M_DATE: this.M_DATE ? this.datepipe.transform(this.M_DATE, 'yyyy-MM-dd') : '',
              MNO: this.MNO ? this.MNO : 0,
              PNT: this.PNT ? this.PNT : 0,
              INUSER: this.decodedTkn.UserId,
              INCOMP: this.decodedTkn.UserId
            }
            this.MakInwServ.MakInwdSave(Obj).subscribe((FillRes) => {
              try {
                if (FillRes.success == true) {
                  this.spinner.hide()
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
