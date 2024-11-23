import { Component, ElementRef, OnInit } from '@angular/core';
import { DatePipe, JsonPipe } from "@angular/common";

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

import { PrcInwService } from 'src/app/Service/Transaction/prc-inw.service';
import { InnPrcInwService } from 'src/app/Service/Transaction/inn-prc-inw.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-inn-prc',
  templateUrl: './inn-prc.component.html',
  styleUrls: ['./inn-prc.component.css']
})
export class InnPrcComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  TPROC_CODE: any = ''
  RUSER: any = ''
  PNT: any = this.decodedTkn.PNT
  DATE: any = new Date()
  INO: any = ''
  selectedTime: any = ''
  times = []
  PRArr = []

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public pinnedBottomRowData;
  public frameworkComponents;

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []

  constructor(
    private PrcInwServ: PrcInwService,
    private InnPrcInwServ: InnPrcInwService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef
  ) {
    this.times = [
      {
        name: 'day',
        id: 'D'
      },
      {
        name: 'night',
        id: 'N'
      },
    ];
    if (this.times) {
      this.dayNight(this.times[0]);
    }
    let time
    this.dayNight(time)
    this.columnDefs = [
      {
        headerName: 'LotNo',
        field: 'L_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
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
        headerName: 'EMP',
        field: 'EMP_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Date',
        field: 'I_DATE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.IDateConv.bind(this)
      },
      {
        headerName: 'Time',
        field: 'I_TIME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.ITimeConv.bind(this)
      },
      {
        headerName: 'Pcs',
        field: 'I_PCS',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Carat',
        field: 'I_CARAT',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (!params.value) { params.value = 0; }
          return (params.value).toFixed(3);
        },
      }
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

    this.PrcInwServ.InwPrcMastFill({ DEPT_CODE: 'POI', TYPE: 'INNER', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.PRArr = PCRes.data.map((item) => {
            return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME }
          })
          if (this.PRArr.length != 0 && this.PRArr[0].PRC_CODE) {
            this.TPROC_CODE = this.PRArr[0].PRC_CODE
          }
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
    this.LoadGridData()
  }
  LoadGridData() {
    this.spinner.show()
    let Obj = {
      DEPT_CODE: this.TPROC_CODE,
      PNT: this.PNT,
      IDate: this.DATE ? this.datepipe.transform(this.DATE, 'yyyy-MM-dd') : '',
      Ino: this.INO
    }
    this.InnPrcInwServ.InnInwFill(Obj).subscribe((FillRes) => {

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
  async Save() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }

    let Chk;
    let Obj = {
      DEPT_CODE: this.TPROC_CODE,
      PNT: this.PNT,
      I_DATE: this.DATE ? this.datepipe.transform(this.DATE, 'yyyy-MM-dd') : '',
      INO: this.INO
    }
    this.InnPrcInwServ.ChkInnInwSave(Obj).then((Res) => {
      try {
        if (Res.success == true) {
          Chk = Res.data;
          let rowData = [];
          let InnSaveArr = []
          this.gridApi.forEachNode(node => rowData.push(node.data));
          if (Chk == 'TRUE') {


            for (let i = 0; i < rowData.length; i++) {
              let SaveObj = {
                DEPT_CODE: this.TPROC_CODE,
                L_CODE: rowData[i].L_CODE,
                SRNO: rowData[i].SRNO,
                TAG: rowData[i].TAG,
                DETID: rowData[i].DETID,
                I_DATE: rowData[i].I_DATE,
                I_TIME: rowData[i].I_TIME,
                IUSER: this.decodedTkn.UserId,
                ICOMP: this.decodedTkn.UserId,
                INO: this.INO,
                I_PCS: rowData[i].I_PCS,
                I_CARAT: rowData[i].I_CARAT,
                SHIFT: this.selectedTime
              }
              InnSaveArr.push(SaveObj)
            }

            this.InnPrcInwServ.InnInwSave(InnSaveArr).subscribe(Result => {
              try {
                if (Result.success == 1) {
                  this.Clear()
                  this.toastr.clear();
                  this.toastr.success("Saved SuccessFully");
                  this.gridApi.setRowData([]);
                  this.spinner.hide();
                } else {
                  this.Clear()
                  this.gridApi.setRowData([]);
                  this.spinner.hide();
                  this.toastr.clear();
                  this.toastr.error(Result.data);
                }
              } catch (err) {
                this.Clear()
                this.gridApi.setRowData([]);
                this.spinner.hide();
                this.toastr.error(err);
              }
            });
          } else {
            this.Clear()
            this.gridApi.setRowData([]);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: Res.data,
            })
          }
        } else {
          this.Clear()
          this.gridApi.setRowData([]);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(Res.data),
          })
        }
      } catch (error) {
        this.Clear()
        this.gridApi.setRowData([]);
        this.toastr.error(error)
      }
    })
    return Chk
  }
  Clear() {
    this.PNT = ''
    this.INO = ''
    this.DATE = new Date()
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
  dayNight(time) {
    let C_TIME = this.datepipe.transform(new Date(), 'HH:mm')
    if (C_TIME <= "20:00") {
      this.selectedTime = this.times[0].id;
    } else {
      this.selectedTime = this.times[1].id;
    }
  }
  FooterCal(e: any) {
    var result = [];
    result.push({
      L_CODE: e,
      SRNO: '',
      TAG: '',
      EMP_CODE: '',
      I_DATE: '',
      I_TIME: '',
      I_PCS: '',
      I_CARAT: ''
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
  SETFLOAT(e: any, flonum: any) {
    return parseFloat(this[e]).toFixed(flonum)
  }
}
