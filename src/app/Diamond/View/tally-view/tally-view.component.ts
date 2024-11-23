import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LotMastService } from 'src/app/Service/Master/lot-mast.service';
import { ViewService } from 'src/app/Service/View/view.service';
import Swal from 'sweetalert2';
import { ListboxComponent } from '../../Common/listbox/listbox.component';
import { TallyViewService } from '../../../Service/View/tally-view.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PrcInwService } from 'src/app/Service/Transaction/prc-inw.service';
import { InnPrcIssService } from 'src/app/Service/Transaction/inn-prc-iss.service';
import PerfectScrollbar from 'perfect-scrollbar';
declare let $: any;

export interface LOTInt {
  CODE: string;
  NAME: string;
  PNT: string;
  CARAT: string;
}

export interface Emp {
  code: string;
  name: string;
}

@Component({
  selector: 'app-tally-view',
  templateUrl: './tally-view.component.html',
  styleUrls: ['./tally-view.component.css']
})
export class TallyViewComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  @ViewChild("tallylot", { static: true }) TALLYLOT: any;

  public columnDefsF;
  public gridApiF;
  public gridColumnApiF;
  public defaultColDefF;
  public rowSelectionF;
  public pinnedBottomRowDataF;
  public frameworkComponentsF;

  public columnDefsS;
  public gridApiS;
  public gridColumnApiS;
  public defaultColDefS;
  public rowSelectionS;
  public pinnedBottomRowDataS;
  public frameworkComponentsS;

  LOTCtrl: FormControl;
  filteredLOTs: Observable<any[]>;
  LOTs: LOTInt[] = [];

  mCtrl: FormControl;
  filteredMs: Observable<any[]>;
  MANAGERArr: Emp[] = [];

  empCtrl: FormControl;
  filteredEmps: Observable<any[]>;
  EMPCODEArr: Emp[] = [];

  prcCtrl: FormControl;
  filteredPrcs: Observable<any[]>;
  PrcTypeArr: Emp[] = [];

  PRC_TYP: any = ''
  L_CODE: any = ''
  L_NAME: any = ''
  L_CARAT: any = ''
  PNT: any = ''
  SRNO: any = ''
  FSRNO: any = ''
  TSRNO: any = ''
  TAG: any = ''
  TAG1: any = ''
  EMP_CODE: any = ''
  EMPNAME: any = ''
  M_CODE: any = ''
  M_NAME: any = ''
  PARTY: any = ''
  L_CODE1: any = ''
  TPROC_CODE: any = 'P'

  PRArr = []

  constructor(
    private LotMastServ: LotMastService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private ViewServ: ViewService,
    private datepipe: DatePipe,
    public dialog: MatDialog,
    private TallyViewServ: TallyViewService,
    private PrcInwServ: PrcInwService,
    private InnPrcIssServ: InnPrcIssService,
    private elementRef: ElementRef,
  ) {
    this.prcCtrl = new FormControl();
    this.empCtrl = new FormControl();
    this.mCtrl = new FormControl();

    this.columnDefsF = [
      {
        headerName: 'LotNo',
        field: 'L_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        pinned: 'left',
      },
      {
        headerName: 'SrNo',
        field: 'SRNO',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
      },
      {
        headerName: 'Tag',
        field: 'TAG',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'DID',
        field: 'DETID',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
      },
      {
        headerName: 'DetNo',
        field: 'DETNO',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Prc',
        field: 'PRC_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Man',
        field: 'M_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Emp',
        field: 'EMP_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'OEmp',
        field: 'OEMP_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Type',
        field: 'PRC_TYP',
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
        headerName: 'Ino',
        field: 'INO',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      }
    ]

    this.defaultColDefF = {
      resizable: true,
      sortable: true
    }

    this.columnDefsS = [
      {
        headerName: 'LotNo',
        field: 'L_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        pinned: 'left'
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
        headerName: 'DID',
        field: 'DETID',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
      },
      {
        headerName: 'DetNo',
        field: 'DETNO',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Prc',
        field: 'PRC_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Man',
        field: 'M_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Emp',
        field: 'EMP_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'OEmp',
        field: 'OEMP_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Type',
        field: 'PRC_TYP',
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
        field: 'CNF_TIME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.ITimeConv.bind(this)
      },
      {
        headerName: 'Ino',
        field: 'INO',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      }
    ]

    this.defaultColDefS = {
      resizable: true,
      sortable: true
    }
  }

  async ngOnInit(): Promise<void> {
    this.LOTCtrl = new FormControl()
    this.LotMastServ.LotMastFill({}).subscribe((LFRes) => {
      try {
        if (LFRes.success == true) {
          this.LOTs = LFRes.data.map((item) => {
            return { CODE: item.L_CODE, NAME: item.L_NAME.toString(), PNT: item.PNT, CARAT: item.L_CARAT }
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

    await this.FillManager()
    this.PrcInwServ.InwPrcMastFill({ SDEPT_CODE: this.TPROC_CODE, DEPT_CODE: 'POI', TYPE: 'INNPRC', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {

        if (PCRes.success == true) {
          this.PrcTypeArr = PCRes.data.map((item) => {
            return { code: item.PRC_CODE, name: item.PRC_NAME }
          })
          this.filteredPrcs = this.prcCtrl.valueChanges
            .pipe(
              startWith(''),
              map(grp => grp ? this.filterPrcs(grp) : this.PrcTypeArr)
            );
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

  FILLPRC() {
    this.PrcInwServ.InwPrcMastFill({ SDEPT_CODE: this.TPROC_CODE, DEPT_CODE: 'POI', TYPE: 'INNPRC', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {

        if (PCRes.success == true) {
          this.PrcTypeArr = PCRes.data.map((item) => {
            return { code: item.PRC_CODE, name: item.PRC_NAME }
          })
          if (this.PrcTypeArr.length != 0 && this.PrcTypeArr[0].code) {
            this.PRC_TYP = this.PrcTypeArr[0].code
          }
          this.filteredPrcs = this.prcCtrl.valueChanges
            .pipe(
              startWith(''),
              map(grp => grp ? this.filterPrcs(grp) : this.PrcTypeArr)
            );
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

  async FillManager() {

    let FillObj = {
      DEPT_CODE: this.TPROC_CODE,
      PRC_CODE: 'M',
      M_CODE: this.M_CODE ? this.M_CODE : '',
      EMP_CODE: this.EMP_CODE ? this.EMP_CODE : '',
      S_DATE: null,
      S_CODE: '',
      TYPE: 'MAN',
      IUSER: this.decodedTkn.UserId
    }

    await this.InnPrcIssServ.InnPrcISSCmbFill(FillObj).then((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.MANAGERArr = PCRes.data.map((item) => {
            return { code: item.EMP_CODE, name: item.EMP_NAME }
          })
          this.filteredMs = this.mCtrl.valueChanges
            .pipe(
              startWith(''),
              map(grp => grp ? this.filterMs(grp) : this.MANAGERArr)
            );
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

  GETMANEGERNAME() {
    if (this.M_CODE) {
      if (this.MANAGERArr.filter(option => option.code.toLocaleLowerCase().includes(this.M_CODE.toLowerCase())).length != 0) {
        this.M_NAME = this.MANAGERArr.filter(option => option.code.toLocaleLowerCase().includes(this.M_CODE.toLowerCase()))[0].name
      } else {
        this.M_NAME = ''
      }
    } else {
      this.M_NAME = ''
    }
  }

  GETEMPNAME() {
    if (this.EMP_CODE) {
      if (this.EMPCODEArr.filter(option => option.code.toLocaleLowerCase().includes(this.EMP_CODE.toLowerCase())).length != 0) {
        this.EMPNAME = this.EMPCODEArr.filter(option => option.code.toLocaleLowerCase().includes(this.EMP_CODE.toLowerCase()))[0].name
      } else {
        this.EMPNAME = ''
      }
    } else {
      this.EMPNAME = ''
    }
  }

  FillEmployee() {

    let FillObj = {
      DEPT_CODE: this.TPROC_CODE,
      PRC_CODE: 'E',
      M_CODE: this.M_CODE ? this.M_CODE : '',
      EMP_CODE: this.EMP_CODE ? this.EMP_CODE : '',
      S_DATE: null,
      S_CODE: '',
      TYPE: 'EMP',
      IUSER: this.decodedTkn.UserId
    }
    this.InnPrcIssServ.InnPrcISSCmbFill(FillObj).then((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.EMPCODEArr = PCRes.data.map((item) => {
            return { code: item.EMP_CODE, name: item.EMP_NAME }
          })
          this.filteredEmps = this.empCtrl.valueChanges
            .pipe(
              startWith(''),
              map(grp => grp ? this.filterEmps(grp) : this.EMPCODEArr.slice(10))
            );
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

  keypressLOT(eve: any, e: any) {
    if (eve.keyCode == 9) {
      if (e != '') {
        let val = this.LOTs.filter(option => option.NAME.toLocaleLowerCase().includes(e.toLowerCase()));
        if (val.length != 0) {
          if (val[0].NAME != "") {
            this.LOTCtrl.setValue(val[0].CODE)
            this.L_CODE = val[0].CODE
            this.L_NAME = val[0].NAME
            this.L_CARAT = val[0].CARAT
          } else {
            this.LOTCtrl.setValue('')
            this.L_CODE = ''
            this.SRNO = ''
            this.L_NAME = ''
            this.L_CARAT = ''
          }
        } else {
          this.LOTCtrl.setValue('')
          this.L_CODE = ''
          this.SRNO = ''
          this.L_NAME = ''
          this.L_CARAT = ''
        }
      } else {
        this.LOTCtrl.setValue('')
        this.L_CODE = ''
        this.SRNO = ''
        this.L_NAME = ''
        this.L_CARAT = ''
      }

    }
  }

  CheckLotVal(eve: any) {
    if (!eve) {
      this.LOTCtrl.setValue('')
      this.L_CODE = ''
      this.SRNO = ''
      this.L_CARAT = ''
      this.L_NAME = ''
    }
  }

  filterLOTs(code: string) {
    return this.LOTs.filter(option => option.NAME.toLocaleLowerCase().includes(code.toLowerCase()))
  }

  onEnterLOT(evt: any) {
    if (evt.source.selected) {
      this.LOTCtrl.setValue(evt.source.value)
      this.L_NAME = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).NAME : ''
      this.L_CARAT = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).CARAT : ''
    }
  }

  OpenLotPopup(event: any) {
    const PRF = this.dialog.open(ListboxComponent, { width: '80%', data: { arr: this.LOTs, CODE: this.LOTCtrl.value, TYPE: 'TALLYVIEW' } })
    $("#Close").click();
    PRF.afterClosed().subscribe(result => {
      this.LOTCtrl.setValue(result)
      this.L_NAME = ''
      this.L_CARAT = ''
    });
    event.preventDefault();
  }

  onGridReadyF(params) {
    this.gridApiF = params.api;
    this.gridColumnApiF = params.columnApi;
    this.LoadGridDataF()
  }

  onGridReadyS(params) {
    this.gridApiS = params.api;
    this.gridColumnApiS = params.columnApi;
    this.LoadGridDataS()
  }

  LoadGridDataS() {
    let SaveObj = {
      DEPT_CODE: this.TPROC_CODE,
      L_CODE: this.L_CODE1,
      SRNO: this.SRNO ? this.SRNO : 0,
      TAG: this.TAG1.trim(),
      L_CODE1: this.L_CODE,
      SRNO1: this.FSRNO ? this.FSRNO : 0,
      SRNOTO1: this.TSRNO ? this.TSRNO : 0,
      TAG1: this.TAG.trim(),
      PRC_CODE: '',
      M_CODE: this.M_CODE,
      EMP_CODE: this.EMP_CODE,
      ICOMP: this.decodedTkn.UserId,
      IUSER: this.decodedTkn.UserId
    }

    this.spinner.show()
    this.TallyViewServ.InnPrcTallySGrdView(SaveObj).subscribe((FillRes) => {
      try {
        if (FillRes.success == true) {
          this.spinner.hide()
          this.gridApiS.setRowData(FillRes.data);
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
          this.gridApiS.sizeColumnsToFit();
          this.pinnedBottomRowDataS = this.FooterCalS(FillRes.data.length);
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

  async LoadGridDataF() {
    let SaveObj = {
      DEPT_CODE: this.TPROC_CODE,
      L_CODE: this.L_CODE,
      SRNO: this.FSRNO ? this.FSRNO : 0,
      SRNOTO: this.TSRNO ? this.TSRNO : 0,
      TAG: this.TAG.trim(),
      PRC_CODE: '',
      M_CODE: this.M_CODE,
      EMP_CODE: this.EMP_CODE,
      ICOMP: this.decodedTkn.UserId,
      IUSER: this.decodedTkn.UserId
    }

    this.spinner.show()
    this.TallyViewServ.InnPrcTallyFGrdView(SaveObj).subscribe((FillRes) => {
      try {
        if (FillRes.success == true) {
          this.spinner.hide()
          this.gridApiF.setRowData(FillRes.data);
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
          this.gridApiF.sizeColumnsToFit();
          this.pinnedBottomRowDataF = this.FooterCalF(FillRes.data.length);

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

  CLEARALL() {

    let SaveObj = {

      DEPT_CODE: this.TPROC_CODE,
      ICOMP: this.decodedTkn.UserId,
      IUSER: this.decodedTkn.UserId,
      TYPE: 'A',
      PRC_CODE: '',
      M_CODE: this.M_CODE,
      EMP_CODE: this.EMP_CODE
    }
    this.spinner.show()
    this.TallyViewServ.InnerPrcTallyClear(SaveObj).subscribe((FillRes) => {
      try {
        if (FillRes.success == true) {
          this.spinner.hide()
          let SaveObj = {
            DEPT_CODE: this.TPROC_CODE,
            L_CODE: this.L_CODE,
            SRNO: this.FSRNO ? this.FSRNO : 0,
            SRNOTO: this.TSRNO ? this.TSRNO : 0,
            TAG: this.TAG.trim(),
            PRC_CODE: '',
            M_CODE: this.M_CODE,
            EMP_CODE: this.EMP_CODE,
            ICOMP: this.decodedTkn.UserId,
            IUSER: this.decodedTkn.UserId
          }

          this.spinner.show()
          this.TallyViewServ.InnPrcTallyFGrdView(SaveObj).subscribe((FillRes) => {
            try {
              if (FillRes.success == true) {
                this.spinner.hide()
                this.gridApiF.setRowData(FillRes.data);
                this.gridApiF.sizeColumnsToFit();
                this.pinnedBottomRowDataF = this.FooterCalF(FillRes.data.length);
                let SaveObj = {
                  DEPT_CODE: this.TPROC_CODE,
                  L_CODE: this.L_CODE1,
                  SRNO: this.SRNO ? this.SRNO : 0,
                  TAG: this.TAG1.trim(),
                  L_CODE1: this.L_CODE,
                  SRNO1: this.FSRNO ? this.FSRNO : 0,
                  SRNOTO1: this.TSRNO ? this.TSRNO : 0,
                  TAG1: this.TAG.trim(),
                  PRC_CODE: '',
                  M_CODE: this.M_CODE,
                  EMP_CODE: this.EMP_CODE,
                  ICOMP: this.decodedTkn.UserId,
                  IUSER: this.decodedTkn.UserId
                }

                this.spinner.show()
                this.TallyViewServ.InnPrcTallySGrdView(SaveObj).subscribe((FillRes) => {
                  try {
                    if (FillRes.success == true) {
                      this.spinner.hide()
                      this.gridApiS.setRowData(FillRes.data);
                      this.gridApiS.sizeColumnsToFit();
                      this.pinnedBottomRowDataS = this.FooterCalS(FillRes.data.length);

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
          $("#dis").css("display", "block");
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

  CLEAR() {
    let SaveObj = {
      DEPT_CODE: this.TPROC_CODE,
      ICOMP: this.decodedTkn.UserId,
      IUSER: this.decodedTkn.UserId,
      TYPE: 'S',
      PRC_CODE: '',
      M_CODE: this.M_CODE,
      EMP_CODE: this.EMP_CODE,
      IS_CEN: 0
    }
    this.spinner.show()
    this.TallyViewServ.InnerPrcTallyClear(SaveObj).subscribe((FillRes) => {
      try {
        if (FillRes.success == true) {
          let SaveObj = {
            DEPT_CODE: this.TPROC_CODE,
            L_CODE: this.L_CODE,
            SRNO: this.FSRNO ? this.FSRNO : 0,
            SRNOTO: this.TSRNO ? this.TSRNO : 0,
            TAG: this.TAG.trim(),
            PRC_CODE: '',
            M_CODE: this.M_CODE,
            EMP_CODE: this.EMP_CODE,
            ICOMP: this.decodedTkn.UserId,
            IUSER: this.decodedTkn.UserId
          }

          this.spinner.show()
          this.TallyViewServ.InnPrcTallyFGrdView(SaveObj).subscribe((FillRes) => {
            try {
              if (FillRes.success == true) {
                this.spinner.hide()
                this.gridApiF.setRowData(FillRes.data);
                this.gridApiF.sizeColumnsToFit();
                this.pinnedBottomRowDataF = this.FooterCalF(FillRes.data.length);
                let SaveObj = {
                  DEPT_CODE: this.TPROC_CODE,
                  L_CODE: this.L_CODE1,
                  SRNO: this.SRNO ? this.SRNO : 0,
                  TAG: this.TAG1.trim(),
                  L_CODE1: this.L_CODE,
                  SRNO1: this.FSRNO ? this.FSRNO : 0,
                  SRNOTO1: this.TSRNO ? this.TSRNO : 0,
                  TAG1: this.TAG.trim(),
                  PRC_CODE: '',
                  M_CODE: this.M_CODE,
                  EMP_CODE: this.EMP_CODE,
                  ICOMP: this.decodedTkn.UserId,
                  IUSER: this.decodedTkn.UserId
                }

                this.spinner.show()
                this.TallyViewServ.InnPrcTallySGrdView(SaveObj).subscribe((FillRes) => {
                  try {
                    if (FillRes.success == true) {
                      this.spinner.hide()
                      this.gridApiS.setRowData(FillRes.data);
                      this.gridApiS.sizeColumnsToFit();
                      this.pinnedBottomRowDataS = this.FooterCalS(FillRes.data.length);
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

  SHOW() {
    let SaveObj = {
      DEPT_CODE: this.TPROC_CODE,
      ICOMP: this.decodedTkn.UserId,
      IUSER: this.decodedTkn.UserId
    }
    this.spinner.show()
    this.TallyViewServ.InnerPrcTally(SaveObj).subscribe((FillRes) => {
      try {

        if (FillRes.success == true) {
          this.spinner.hide()
          $("#dis").css("display", "none");
          let SaveObj = {
            DEPT_CODE: this.TPROC_CODE,
            L_CODE: this.L_CODE,
            SRNO: this.FSRNO ? this.FSRNO : 0,
            SRNOTO: this.TSRNO ? this.TSRNO : 0,
            TAG: this.TAG.trim(),
            PRC_CODE: '',
            M_CODE: this.M_CODE,
            EMP_CODE: this.EMP_CODE,
            ICOMP: this.decodedTkn.UserId,
            IUSER: this.decodedTkn.UserId
          }

          this.spinner.show()
          this.TallyViewServ.InnPrcTallyFGrdView(SaveObj).subscribe((FillRes) => {
            try {
              if (FillRes.success == true) {
                this.spinner.hide()
                this.gridApiF.setRowData(FillRes.data);
                this.gridApiF.sizeColumnsToFit();
                this.pinnedBottomRowDataF = this.FooterCalF(FillRes.data.length);
                let SaveObj = {
                  DEPT_CODE: this.TPROC_CODE,
                  L_CODE: this.L_CODE1,
                  SRNO: this.SRNO ? this.SRNO : 0,
                  TAG: this.TAG1.trim(),
                  L_CODE1: this.L_CODE,
                  SRNO1: this.FSRNO ? this.FSRNO : 0,
                  SRNOTO1: this.TSRNO ? this.TSRNO : 0,
                  TAG1: this.TAG.trim(),
                  PRC_CODE: '',
                  M_CODE: this.M_CODE,
                  EMP_CODE: this.EMP_CODE,
                  ICOMP: this.decodedTkn.UserId,
                  IUSER: this.decodedTkn.UserId
                }

                this.spinner.show()
                this.TallyViewServ.InnPrcTallySGrdView(SaveObj).subscribe((FillRes) => {
                  try {
                    if (FillRes.success == true) {
                      this.spinner.hide()
                      this.gridApiS.setRowData(FillRes.data);
                      this.gridApiS.sizeColumnsToFit();
                      this.pinnedBottomRowDataS = this.FooterCalS(FillRes.data.length);
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

  SAVE() {
    let SaveObj = {
      L_CODE: this.L_CODE1,
      SRNO: this.SRNO ? this.SRNO : 0,
      TAG: this.TAG.trim(),
      DEPT_CODE: this.TPROC_CODE,
      ICOMP: this.decodedTkn.UserId,
      IUSER: this.decodedTkn.UserId,
      EMP_CODE: this.EMP_CODE,
      M_CODE: this.M_CODE,
      PRC_CODE: ''

    }
    this.spinner.show()
    this.TallyViewServ.InnerPrcChkPcTally(SaveObj).then((FillRes) => {
      try {
        if (FillRes.data == "TRUE") {
          let SaveObj = {
            DEPT_CODE: this.TPROC_CODE,
            L_CODE: this.L_CODE1,
            SRNO: this.SRNO ? this.SRNO : 0,
            TAG: this.TAG1.trim(),
            L_CODE1: this.L_CODE,
            SRNO1: this.FSRNO ? this.FSRNO : 0,
            SRNOTO1: this.TSRNO ? this.TSRNO : 0,
            TAG1: this.TAG.trim(),
            PRC_CODE: '',
            M_CODE: this.M_CODE,
            EMP_CODE: this.EMP_CODE,
            ICOMP: this.decodedTkn.UserId,
            IUSER: this.decodedTkn.UserId
          }

          this.spinner.show()
          this.TallyViewServ.InnPrcTallySGrdView(SaveObj).subscribe((FillRes) => {
            try {
              if (FillRes.success == true) {
                this.spinner.hide()
                this.gridApiS.setRowData(FillRes.data);
                this.gridApiS.sizeColumnsToFit();
                this.pinnedBottomRowDataS = this.FooterCalS(FillRes.data.length);
                let SaveObj = {
                  DEPT_CODE: this.TPROC_CODE,
                  L_CODE: this.L_CODE,
                  SRNO: this.FSRNO ? this.FSRNO : 0,
                  SRNOTO: this.TSRNO ? this.TSRNO : 0,
                  TAG: this.TAG.trim(),
                  PRC_CODE: '',
                  M_CODE: this.M_CODE,
                  EMP_CODE: this.EMP_CODE,
                  ICOMP: this.decodedTkn.UserId,
                  IUSER: this.decodedTkn.UserId
                }

                this.spinner.show()
                this.TallyViewServ.InnPrcTallyFGrdView(SaveObj).subscribe((FillRes) => {
                  try {
                    if (FillRes.success == true) {
                      this.spinner.hide()
                      this.gridApiF.setRowData(FillRes.data);
                      this.gridApiF.sizeColumnsToFit();
                      this.pinnedBottomRowDataF = this.FooterCalF(FillRes.data.length);
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
          this.L_CODE1 = ''
          this.SRNO = 0
          this.TAG1 = ''
          this.TALLYLOT.nativeElement.focus()
        }
      }
      catch {

      }
    })
  }

  REFRESH() {
    let SaveObj = {
      DEPT_CODE: this.TPROC_CODE,
      L_CODE: this.L_CODE1,
      SRNO: this.SRNO ? this.SRNO : 0,
      TAG: this.TAG1.trim(),
      L_CODE1: this.L_CODE,
      SRNO1: this.FSRNO ? this.FSRNO : 0,
      SRNOTO1: this.TSRNO ? this.TSRNO : 0,
      TAG1: this.TAG.trim(),
      PRC_CODE: '',
      M_CODE: this.M_CODE,
      EMP_CODE: this.EMP_CODE,
      ICOMP: this.decodedTkn.UserId,
      IUSER: this.decodedTkn.UserId
    }

    this.spinner.show()
    this.TallyViewServ.InnPrcTallySGrdView(SaveObj).subscribe((FillRes) => {
      try {
        if (FillRes.success == true) {
          this.spinner.hide()
          this.gridApiS.setRowData(FillRes.data);
          this.gridApiS.sizeColumnsToFit();
          this.pinnedBottomRowDataS = this.FooterCalS(FillRes.data.length);
          let SaveObj = {
            DEPT_CODE: this.TPROC_CODE,
            L_CODE: this.L_CODE,
            SRNO: this.FSRNO ? this.FSRNO : 0,
            SRNOTO: this.TSRNO ? this.TSRNO : 0,
            TAG: this.TAG.trim(),
            PRC_CODE: '',
            M_CODE: this.M_CODE,
            EMP_CODE: this.EMP_CODE,
            ICOMP: this.decodedTkn.UserId,
            IUSER: this.decodedTkn.UserId
          }

          this.spinner.show()
          this.TallyViewServ.InnPrcTallyFGrdView(SaveObj).subscribe((FillRes) => {
            try {
              if (FillRes.success == true) {
                this.spinner.hide()
                this.gridApiF.setRowData(FillRes.data);
                this.gridApiF.sizeColumnsToFit();
                this.pinnedBottomRowDataF = this.FooterCalF(FillRes.data.length);
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

  FooterCalF(e: any) {
    var result = [];
    result.push({
      L_CODE: e,
      SRNO: '',
      TAG: '',
      DETID: '',
      DETNO: '',
      PRC_CODE: '',
      M_CODE: '',
      EMP_CODE: '',
      OEMP_CODE: '',
      PRC_TYP: '',
      I_DATE: '',
      INO: ''
    })
    return result
  }

  FooterCalS(e: any) {
    var result = [];
    result.push({
      L_CODE: e,
      SRNO: '',
      TAG: '',
      DETID: '',
      DETNO: '',
      PRC_CODE: '',
      M_CODE: '',
      EMP_CODE: '',
      OEMP_CODE: '',
      PRC_TYP: '',
      I_DATE: '',
      CNF_TIME: '',
      INO: ''
    })
    return result
  }

  SETFLOAT(e: any, flonum: any) {
    return parseFloat(this[e]).toFixed(flonum)
  }
  filterMs(code: string) {
    return this.MANAGERArr.filter(grp =>
      grp.code.toString().indexOf(code) === 0);
  }
  filterEmps(code: string) {
    return this.EMPCODEArr.filter(grp =>
      grp.code.toString().indexOf(code) === 0);
  }
  filterPrcs(code: string) {
    return this.PrcTypeArr.filter(grp =>
      grp.code.toString().indexOf(code) === 0);
  }
}
