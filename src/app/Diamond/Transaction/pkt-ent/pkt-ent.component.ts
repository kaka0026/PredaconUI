import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";
import { JwtHelperService } from '@auth0/angular-jwt';
import * as $ from 'jquery';

import { PktEntService } from '../../../Service/Transaction/pkt-ent.service';
import { EmpMastService } from '../../../Service/Master/emp-mast.service';
import { ColMastService } from '../../../Service/Master/col-mast.service';
import { FloMastService } from '../../../Service/Master/flo-mast.service';
import { LotMastService } from '../../../Service/Master/lot-mast.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { CommonService } from 'src/app/Service/Common/common.service';
import PerfectScrollbar from 'perfect-scrollbar';

export interface LOTInt {
  CODE: string;
  NAME: string;
  PNT: string;
}

export interface Emp {
  code: string;
  value: string,
  DEPT_CODE: string,
  L_DATE: string,
  PROC_CODE: string,
  GRD: string,
  GRP: string
}

@Component({
  selector: 'app-pkt-ent',
  templateUrl: './pkt-ent.component.html',
  styleUrls: ['./pkt-ent.component.css']
})
export class PktEntComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem('token'));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public pinnedBottomRowData;
  public frameworkComponents;

  empCtrl: FormControl;
  filteredemps: Observable<any[]>;
  EMP_CODE: any = ''
  EMPCODEArr: Emp[] = [];
  empName: any = '';

  L_CODE: any = ''
  SRNO: any = ''
  TAG: any = 'A'
  PNT: any = this.decodedTkn.PNT
  GRP: any = ''
  GRD: any = ''
  MFL_CODE: any = ''
  MC_CODE: any = ''
  I_DATE: any = new Date()
  I_TIME: any = this.datepipe.transform(new Date(), 'HH:mm')
  INO: any = ''
  I_PCS: any = '1'
  I_CARAT: any = ''
  ASSNO: any = ''
  EDOL: any = 0

  LOTCtrl: FormControl;
  filteredLOTs: Observable<any[]>;
  LOTs: LOTInt[] = [];

  mflCtrl: FormControl;
  filteredMFls: Observable<any[]>;
  MFLCODEArr: Emp[] = [];

  mcCtrl: FormControl;
  filteredMCs: Observable<any[]>;
  MCCODEArr: Emp[] = [];

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private PktEntServ: PktEntService,
    private datepipe: DatePipe,
    private EmpMastServ: EmpMastService,
    private ColMastServ: ColMastService,
    private FloMastServ: FloMastService,
    private LotMastServ: LotMastService,
    private _FrmOpePer: FrmOpePer,
    private CommonServ: CommonService,
    private elementRef: ElementRef
  ) {

    this.LOTCtrl = new FormControl();
    this.empCtrl = new FormControl();
    this.mcCtrl = new FormControl();
    this.mflCtrl = new FormControl();
    let op = this
    this.columnDefs = [
      {
        headerName: 'Action',
        cellStyle: { 'text-align': 'center' },
        cellRenderer: function (params) {
          let a = '<span class="det_val">';
          if (op.ALLOWUPD) {
            a = a + '<i class="icon-edit grid-icon" data-action-type="EditData" style="cursor: pointer;margin-right: 5px;" ></i>';
          }
          if (op.ALLOWDEL) {
            a = a + '<i class="icon-delete grid-icon" data-action-type="DeleteData" style="cursor: pointer;margin-left: 5px;"></i>';
          }
          a = a + '</span>';
          return a
        },
        headerClass: "text-center"
      },
      {
        headerName: 'L. Code',
        field: 'L_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Sr. No',
        field: 'SRNO',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Tag',
        field: 'TAG',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'PNT',
        field: 'PNT',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'EMP. Code',
        field: 'EMP_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'GRP',
        field: 'GRP',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'GRD',
        field: 'GRD',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'MFL. Code',
        field: 'MFL_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'MC. Code',
        field: 'MC_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'I. Date',
        field: 'I_DATE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.IDateConv.bind(this)
      },
      {
        headerName: 'I. Time',
        field: 'I_TIME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.ITimeConv.bind(this)
      },
      {
        headerName: 'INO',
        field: 'INO',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'I. Pcs',
        field: 'I_PCS',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'I. Carat',
        field: 'I_CARAT',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'I. User',
        field: 'IUSER',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'I. Comp',
        field: 'ICOMP',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Ass. No',
        field: 'ASSNO',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'EDOL',
        field: 'EDOL',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
    ]

    this.defaultColDef = {
      resizable: true,
      sortable: true
    }
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
  async ngOnInit() {


    this.PER = await this._FrmOpePer.UserFrmOpePer(this.constructor.name)
    this.ALLOWDEL = this.PER[0].DEL
    this.ALLOWINS = this.PER[0].INS
    this.ALLOWUPD = this.PER[0].UPD
    this.PASS = this.PER[0].PASS

    this.EmpMastServ.EmpMastFill({ DEPT_CODE: 'POI', PROC_CODE: 1 }).subscribe((EFRes) => {
      try {
        if (EFRes.success == true) {
          this.EMPCODEArr = EFRes.data.filter(data => { return !data.L_DATE }).map(item => {
            return {
              code: item.EMP_CODE,
              value: item.EMP_NAME,
              DEPT_CODE: item.DEPT_CODE,
              L_DATE: item.L_DATE,
              PROC_CODE: item.PROC_CODE,
              GRD: item.GRD,
              GRP: item.GRP
            }
          });
          this.filteredemps = this.empCtrl.valueChanges.pipe(
            startWith(''),
            map(emp => (emp ? this.filteremps(emp) : this.EMPCODEArr))
          );
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(EFRes.data),
          })
        }
      } catch (err) {
        this.toastr.error(err)
      }
    })

    this.ColMastServ.ColMastFill({}).subscribe((CFRes) => {
      try {
        if (CFRes.success == true) {
          this.MCCODEArr = CFRes.data.map((item) => {
            return { code: item.C_CODE, value: item.C_NAME }
          })
          this.filterarr('filteredMCs', 'mcCtrl', 'MCCODEArr');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(CFRes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    this.FloMastServ.FloMastFill({}).subscribe((FFRes) => {
      try {
        if (FFRes.success == true) {
          this.MFLCODEArr = FFRes.data.map((item) => {
            return { code: item.FL_CODE, value: item.FL_SHORTNAME }
          })
          this.filterarr('filteredMFls', 'mflCtrl', 'MFLCODEArr');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(FFRes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    this.LotMastServ.LotMastFill({}).subscribe((LFRes) => {
      try {
        if (LFRes.success == true) {
          this.LOTs = LFRes.data.map((item) => {
            return { CODE: item.L_CODE, NAME: item.L_NAME.toString(), PNT: item.PNT }
          })
          this.filteredLOTs = this.LOTCtrl.valueChanges.pipe(
            startWith(""),
            map(LOT => (LOT ? this.filterLOTs(LOT) : this.LOTs.slice(0, 10)))
          );
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(LFRes.data),
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

  Clear() {
    this.L_CODE = ''
    this.SRNO = ''
    this.TAG = 'A'
    this.PNT = ''
    this.EMP_CODE = ''
    this.GRP = ''
    this.GRD = ''
    this.MFL_CODE = ''
    this.MC_CODE = ''
    this.I_DATE = new Date()
    this.I_TIME = this.datepipe.transform(new Date(), 'HH:mm')
    this.INO = ''
    this.I_PCS = '1'
    this.I_CARAT = ''
    this.ASSNO = ''
    this.EDOL = ''
  }

  async GetMaxPrnNo() {
    let MaxNo = ''
    let PrnNoObj = {
      DEPT_CODE: 'POI',
      PRC_CODE: 'OR',
      I_DATE: this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd'),
      ETYPE: 'I',
      PNT: this.PNT
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

  async Save() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }

    this.spinner.show()

    if (!this.INO) {
      this.INO = await this.GetMaxPrnNo()
      if (!this.INO) {
        this.spinner.hide()
        this.toastr.warning('Something gone wrong while get I NO...')
        return
      }
    }
    if (!this.I_CARAT) {
      this.spinner.hide()
      this.toastr.warning('Something gone wrong while get I Carat...')
      return
    } else if (!this.ASSNO) {
      this.spinner.hide()
      this.toastr.warning('Something gone wrong while get Assort no...')
      return
    } else if (!this.EDOL) {
      this.spinner.hide()
      this.toastr.warning('Something gone wrong while get Estimation Dollar...')
      return
    } else if (!this.PNT) {
      this.spinner.hide()
      this.toastr.warning('Something gone wrong while get Pointer...')
      return
    } else if (!this.GRP) {
      this.spinner.hide()
      this.toastr.warning('Something gone wrong while get Employee...')
      return
    }

    let SaveObj = {
      L_CODE: this.L_CODE ? this.L_CODE : '',
      SRNO: this.SRNO ? this.SRNO : 0,
      TAG: this.TAG.trim() ? this.TAG.trim() : '',
      PNT: this.PNT ? this.PNT : 0,
      EMP_CODE: this.EMP_CODE ? this.EMP_CODE : '',
      GRP: this.GRP ? this.GRP : '',
      GRD: this.GRD ? this.GRD : '',
      MFL_CODE: this.MFL_CODE ? this.MFL_CODE : 0,
      MC_CODE: this.MC_CODE ? this.MC_CODE : 0,
      I_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
      I_TIME: this.I_TIME ? this.I_TIME : '',
      INO: this.INO ? this.INO : 0,
      I_PCS: this.I_PCS ? this.I_PCS : 0,
      I_CARAT: this.I_CARAT ? this.I_CARAT : 0,
      ASSNO: this.ASSNO ? this.ASSNO : '',
      EDOL: this.EDOL ? this.EDOL : 0,
    }

    await this.PktEntServ.PktEntSave(SaveObj).then((SaveRes) => {
      try {
        if (SaveRes.success == true) {
          this.spinner.hide()
          this.toastr.success('Save successfully.')
          this.spinner.show()
          let Obj = {
            L_CODE: this.L_CODE ? this.L_CODE : '',
            SRNO: 0,
            IUSER: this.decodedTkn.UserId
          }
          this.PktEntServ.PktEntFill(Obj).subscribe((FillRes) => {

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
          this.PrnIssSave()
          this.ClearFromData()
        } else {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(SaveRes.data.originalError.info.message),
          })
        }
      } catch (err) {
        this.spinner.hide()
        this.toastr.error(err)
      }
    })
  }

  PrnIssSave() {
    let PrnSaveObj = {
      DEPT_CODE: 'POI',
      PRC_CODE: 'OR',
      I_DATE: this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd'),
      ETYPE: 'I',
      INO: this.INO,
      PNT: this.PNT
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

  ClearFromData() {
    this.SRNO = parseInt(this.SRNO) + 1
    this.I_CARAT = ''
    $('#icarat').focus()
    this.I_TIME = this.datepipe.transform(new Date(), 'HH:mm')

  }

  LoadGridData() {
    this.spinner.show()
    let Obj = {
      L_CODE: this.L_CODE ? this.L_CODE : '',
      SRNO: this.SRNO,
      IUSER: this.decodedTkn.UserId
    }
    this.PktEntServ.PktEntFill(Obj).subscribe((FillRes) => {

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
  FILLFIELD() {
    let Obj = {
      L_CODE: this.L_CODE ? this.L_CODE : '',
      SRNO: this.SRNO,
      IUSER: this.decodedTkn.UserId == 'admin' ? '' : this.decodedTkn.UserId
    }
    this.PktEntServ.PktEntFill(Obj).subscribe((FillRes) => {

      try {
        if (FillRes.success == true) {
          if (FillRes.data.length != 0) {
            this.spinner.hide()
            this.L_CODE = FillRes.data[0].L_CODE
            this.TAG = FillRes.data[0].TAG
            this.PNT = FillRes.data[0].PNT
            this.EMP_CODE = FillRes.data[0].EMP_CODE
            this.GRP = FillRes.data[0].GRP
            this.GRD = FillRes.data[0].GRD
            this.MFL_CODE = FillRes.data[0].MFL_CODE
            this.MC_CODE = FillRes.data[0].MC_CODE
            this.I_DATE = FillRes.data[0].I_DATE
            this.I_TIME = this.datepipe.transform(FillRes.data[0].I_TIME, 'HH:mm', 'UTC+0')
            this.INO = FillRes.data[0].INO
            this.I_PCS = FillRes.data[0].I_PCS
            this.I_CARAT = FillRes.data[0].I_CARAT
            this.ASSNO = FillRes.data[0].ASSNO
            this.EDOL = FillRes.data[0].EDOL
          }
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
  onGridRowClicked(eve: any) {
    if (eve.event.target !== undefined) {
      let actionType = eve.event.target.getAttribute("data-action-type");

      if (actionType == 'DeleteData') {
        Swal.fire({
          title: "Are you sure you want to delete packet code " + eve.data.L_CODE + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.PktEntServ.PktEntDelete({ L_CODE: eve.data.L_CODE, SRNO: eve.data.SRNO, TAG: eve.data.TAG }).subscribe((DelRes) => {
              try {
                if (DelRes.success == true) {
                  this.spinner.hide()
                  this.toastr.success('Delete successfully.')
                  this.LoadGridData()
                } else {
                  this.spinner.hide()
                  this.toastr.warning('Something went to wrong while delete code')
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
        this.PNT = eve.data.PNT ? eve.data.PNT : 0
        this.EMP_CODE = eve.data.EMP_CODE ? eve.data.EMP_CODE : ''
        this.GRP = eve.data.GRP ? eve.data.GRP : ''
        this.GRD = eve.data.GRD ? eve.data.GRD : ''
        this.MFL_CODE = eve.data.MFL_CODE ? eve.data.MFL_CODE : 0
        this.MC_CODE = eve.data.MC_CODE ? eve.data.MC_CODE : 0
        this.I_DATE = eve.data.I_DATE ? this.datepipe.transform(eve.data.I_DATE, 'yyyy-MM-dd') : ''
        this.I_TIME = eve.data.I_TIME ? this.datepipe.transform(eve.data.I_TIME, 'HH:mm', 'UTC+0') : ''
        this.INO = eve.data.INO ? eve.data.INO : 0
        this.I_PCS = eve.data.I_PCS ? eve.data.I_PCS : 0
        this.I_CARAT = eve.data.I_CARAT ? eve.data.I_CARAT : 0
        this.ASSNO = eve.data.ASSNO ? eve.data.ASSNO : ''
        this.EDOL = eve.data.EDOL ? eve.data.EDOL : 0

      }

    }
  }

  ITimeConv(params) {
    if (params.value) {
      return this.datepipe.transform(params.value, 'HH:mm a', 'UTC+0')
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

  filterLOTs(code: string) {
    return this.LOTs.filter(option => option.NAME.toLocaleLowerCase().includes(code.toLowerCase()))
  }

  onEnterLOT(evt: any) {

    if (evt.source.selected) {
      this.LOTCtrl.setValue(evt.source.value)
      this.L_CODE = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).CODE : ''
      this.PNT = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).PNT : ''
      if (this.L_CODE) {
        this.GetMaxSRNO()
      }

    }
  }

  keypressLOT(eve: any, e: any) {
    if (eve.keyCode == 9 || eve.keyCode == 13) {
      if (e != '') {
        let val = this.LOTs.filter(option => option.NAME.toLocaleLowerCase().includes(e.toLowerCase()));
        if (val.length != 0) {
          if (val[0].NAME != "") {
            this.LOTCtrl.setValue(val[0].CODE)
            this.L_CODE = val[0].CODE
            this.PNT = val[0].PNT
            if (this.L_CODE) {
              this.GetMaxSRNO()
            }
          } else {
            this.LOTCtrl.setValue('')
            this.L_CODE = ''
            this.SRNO = ''
            this.PNT = ''
          }
        } else {
          this.LOTCtrl.setValue('')
          this.L_CODE = ''
          this.SRNO = ''
          this.PNT = ''
        }
      } else {
        this.LOTCtrl.setValue('')
        this.L_CODE = ''
        this.SRNO = ''
        this.PNT = ''
      }

    }
  }

  CheckLotVal(eve: any) {

    if (!eve) {
      this.LOTCtrl.setValue('')
      this.L_CODE = ''
      this.SRNO = ''
      this.PNT = ''
    }
  }

  GetMaxSRNO() {
    this.spinner.show()
    this.PktEntServ.PktEntGetSrNo({ L_CODE: this.L_CODE }).subscribe((MRes) => {
      try {
        if (MRes.success == true) {
          this.spinner.hide()
          this.SRNO = MRes.data[0].SRNO
        } else {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(MRes.data),
          })
        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })
  }

  EmpDetChange(eve: any) {
    let Data = this.EMPCODEArr.find((option) => option.code == eve)
    if (this.EMPCODEArr.filter((option) => option.code == eve).length != 0) {
      this.GRP = Data.GRP
      this.GRD = Data.GRD
    } else {
      this.GRP = ''
      this.GRD = ''
    }
  }

  filteremps(code: string) {
    return this.EMPCODEArr.filter(
      shp => shp.code.toLowerCase().indexOf(code.toLowerCase()) === 0
    );
  }

  FooterCal(e: any) {
    var result = [];
    result.push({
      L_CODE: e,
      SRNO: '',
      TAG: '',
      PNT: '',
      EMP_CODE: '',
      GRP: '',
      GRD: '',
      MFL_CODE: '',
      MC_CODE: '',
      I_DATE: '',
      I_TIME: '',
      INO: '',
      I_PCS: '',
      I_CARAT: '',
      IUSER: '',
      ICOMP: '',
      ASSNO: '',
      EDOL: ''
    })
    return result
  }

  BARCODE() {
    this.CommonServ.BarCode({
      L_CODE: this.L_CODE ? this.L_CODE : '',
      IUSER: this.decodedTkn.UserId,
      TYPE: 'ENT'
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
  SETFLOAT(e: any, flonum: any) {
    return parseFloat(this[e]).toFixed(flonum)
  }
  nextenter(e: any, id: any) {
    if (e.keyCode == 13) {
      $('#' + id).focus()
    }
  }
}
