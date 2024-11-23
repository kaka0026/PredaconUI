import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LotMastService } from 'src/app/Service/Master/lot-mast.service';
import { ListboxComponent } from '../../Common/listbox/listbox.component';
declare let $: any;
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EncrDecrService } from 'src/app/Service/Common/encr-decr.service';
import { DockService } from 'src/app/Service/Common/dock.service';
import PerfectScrollbar from 'perfect-scrollbar';
import { DatePipe } from '@angular/common';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';
import { DockViewComponent } from '../dock-view/dock-view.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  selector: 'app-dock-prc-pending',
  templateUrl: './dock-prc-pending.component.html',
  styleUrls: ['./dock-prc-pending.component.css']
})

export class DockPrcPendingComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  decodedMast = []

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  L_CODE: any = ''
  TPROC_CODE: any = ''
  GRP: any = ''
  LOTs: LOTInt[] = [];
  GridHeader = [] = []

  GrpCtrl: FormControl;
  filteredGrps: Observable<any[]>;
  GrpArr: Emp[] = [];

  DeptCtrl: FormControl;
  filteredDepts: Observable<any[]>;
  DeptArr: Emp[] = [];

  constructor(
    private EncrDecrServ: EncrDecrService,
    private datePipe: DatePipe,
    private elementRef: ElementRef,
    public dialog: MatDialog,
    private LotMastServ: LotMastService,
    private DockServ: DockService,
    private toastr: ToastrService,
    private ViewParaMastServ: ViewParaMastService
  ) {
    this.GrpCtrl = new FormControl();
    this.DeptCtrl = new FormControl();

    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'DockPrcPen' }).subscribe((VPRes) => {
      try {
        if (VPRes.success == 1) {
          this.GridHeader = VPRes.data.map((item) => { return item.FIELDNAME })

          let temp = []

          for (let i = 0; i < VPRes.data.length; i++) {
            temp.push({
              headerName: VPRes.data[i].DISPNAME,
              headerClass: VPRes.data[i].HEADERALIGN,
              field: VPRes.data[i].FIELDNAME,
              width: VPRes.data[i].COLWIDTH,
              cellStyle: { 'text-align': VPRes.data[i].CELLALIGN },
              resizable: VPRes.data[i].ISRESIZE,
              hide: VPRes.data[i].DISP == false ? true : false,
            })
            if (VPRes.data[i].FORMAT == 'NumberFormat') {
              temp[i].valueFormatter = this.NumberFormat
            } else if (VPRes.data[i].FORMAT == '') {
              temp[i].valueFormatter = this.StringFormat
            } else if (VPRes.data[i].FORMAT == 'DateFormat') {
              temp[i].cellRenderer = this.DateFormat.bind(this)
              delete temp[i].valueFormatter
            } else if (VPRes.data[i].FORMAT == 'TimeFormat') {
              temp[i].cellRenderer = this.TimeFormat.bind(this)
              delete temp[i].valueFormatter
            } else {
              temp[i].valueFormatter = this.StringFormat
            }
          }

          this.columnDefs = temp
          temp = []

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
  }

  ngOnInit(): void {
    this.LotMastServ.LotMastFill({}).subscribe((LFRes) => {
      try {
        if (LFRes.success == true) {
          this.LOTs = LFRes.data.map((item) => {
            return { CODE: item.L_CODE, NAME: item.L_NAME.toString(), PNT: item.PNT, CARAT: item.L_CARAT }
          })
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
    this.decodedMast = JSON.parse(this.EncrDecrServ.get(localStorage.getItem("unfam1")));
    this.DeptArr = this.decodedMast[10].map(item => {
      return { code: item.DEPT_CODE, name: item.DEPT_NAME };
    });
    this.filteredDepts = this.DeptCtrl.valueChanges
      .pipe(
        startWith(''),
        map(dept => dept ? this.filterDepts(dept) : this.DeptArr)
      );
    this.GrpArr = this.decodedMast[41].map(item => {
      return { code: item.GRP, name: item.EMP_NAME };
    });
    this.filteredGrps = this.GrpCtrl.valueChanges
      .pipe(
        startWith(''),
        map(grp => grp ? this.filterGrps(grp) : this.GrpArr)
      );
  }

  filterGrps(code: string) {
    return this.GrpArr.filter(grp =>
      grp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }

  filterDepts(code: string) {
    return this.DeptArr.filter(dept =>
      dept.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }

  OpenLotPopup() {
    const PRF = this.dialog.open(ListboxComponent, { width: '80%', data: { arr: this.LOTs, CODE: this.L_CODE, TYPE: 'TALLYVIEW' } })
    $("#Close").click();
    PRF.afterClosed().subscribe(result => {
      this.L_CODE = result
    });
  }

  async Refresh() {
    await this.DockServ.DockPrcPen({
      DEPT_CODE: this.TPROC_CODE,
      L_CODE: this.L_CODE,
      GRP: this.GRP,
      PNT: this.decodedTkn.PNT,
      EMP_CODE: ''
    }).then((Res) => {
      try {
        if (Res.success == 1) {
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
        } else {
          this.toastr.error(Res.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  async onCellDoubleClicked(params) {
    await this.DockServ.DockPrcPenDet({
      DEPT_CODE: this.TPROC_CODE,
      L_CODE: this.L_CODE,
      GRP: this.GRP,
      PNT: 1,
      EMP_CODE: ''
    }).then((Res) => {
      try {
        if (Res.success == 1) {
          let a = Res.data.filter(option => option.PRC == params.data.PRC);
          const PRF = this.dialog.open(DockViewComponent, { panelClass: "brk-ent-dialog", autoFocus: false, minWidth: 'auto', width: '100%', data: { data: a, VIEWPARA: 'DockPrcPenDet' } })
          $("#Close").click();
          PRF.afterClosed().subscribe(result => {

          });
        } else {
          this.toastr.error(Res.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

  }

  NumberFormat(params) {
    if (params.value != 'NaN' && params.value != null) {
      return parseFloat(params.value).toFixed(2);
    } else {
      return '0.00'
    }
  }

  StringFormat(params) {
    if (params.value != 'NaN' && params.value != null) {
      return params.value
    } else {
      return ''
    }
  }

  DateFormat(params) {
    if (params.value) {
      return this.datePipe.transform(params.value, 'dd-MM-yyyy')
    } else {
      return ''
    }
  }

  TimeFormat(params) {
    if (params.value) {
      return this.datePipe.transform(params.value, 'hh:mm a', 'UTC+0')
    } else {
      return ''
    }
  }
}
