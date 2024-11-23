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
import { BrkEntService } from 'src/app/Service/Transaction/brk-ent.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
export interface Emp {
  code: string;
  name: string;
}
export interface LOTInt {
  CODE: string;
  NAME: string;
  PNT: string;
  CARAT: string;
}

@Component({
  selector: 'app-dock-production',
  templateUrl: './dock-production.component.html',
  styleUrls: ['./dock-production.component.css']
})
export class DockProductionComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  decodedMast = []

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  L_CODE: any = ''
  EMP_CODE: any = ''
  GRP: any = ''
  disable: boolean = true
  LOTs: LOTInt[] = [];
  GridHeader = [] = []

  grpCtrl: FormControl;
  filteredGrps: Observable<any[]>;
  GrpArr: Emp[] = [];

  empCtrl: FormControl;
  filteredEmps: Observable<any[]>;
  EmpArr: Emp[] = [];

  constructor(
    private EncrDecrServ: EncrDecrService,
    private datePipe: DatePipe,
    private elementRef: ElementRef,
    public dialog: MatDialog,
    private LotMastServ: LotMastService,
    private DockServ: DockService,
    private toastr: ToastrService,
    private ViewParaMastServ: ViewParaMastService,
    private BrkEntServ: BrkEntService
  ) {
    this.grpCtrl = new FormControl();
    this.empCtrl = new FormControl();

    if (this.decodedTkn.PROC_CODE == 1) {
      this.disable = true
    } else {
      this.disable = false
    }
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'DockProduction' }).subscribe((VPRes) => {
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
    this.BrkEntServ.BrkEntCmbFill({
      TYPE: 'MARKER'
    }).then((Res) => {
      try {
        if (Res.success == true) {
          this.EmpArr = Res.data.map((item) => {
            return { code: item.EMP_CODE, name: item.EMP_NAME }
          })

          this.EMP_CODE = this.decodedTkn.UserId
          this.filteredEmps = this.empCtrl.valueChanges
            .pipe(
              startWith(''),
              map(emp => emp ? this.filterEmps(emp) : this.EmpArr)
            );
        } else {

        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    this.decodedMast = JSON.parse(this.EncrDecrServ.get(localStorage.getItem("unfam1")));
    this.GrpArr = this.decodedMast[41].map(item => {
      return { code: item.GRP, name: item.EMP_NAME };
    });
    this.filteredGrps = this.grpCtrl.valueChanges
      .pipe(
        startWith(''),
        map(grp => grp ? this.filterGrps(grp) : this.GrpArr)
      );
  }
  filterEmps(code: string) {
    return this.EmpArr.filter(emp =>
      emp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
  filterGrps(code: string) {
    return this.GrpArr.filter(grp =>
      grp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
  OpenLotPopup() {
    const PRF = this.dialog.open(ListboxComponent, { width: '80%', data: { arr: this.LOTs, CODE: this.L_CODE, TYPE: 'TALLYVIEW' } })
    $("#Close").click();
    PRF.afterClosed().subscribe(result => {
      this.L_CODE = result
    });
  }

  async Refresh() {
    await this.DockServ.DockProduction({
      EMP_CODE: this.EMP_CODE,
      L_CODE: this.L_CODE,
      GRP: this.GRP
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
