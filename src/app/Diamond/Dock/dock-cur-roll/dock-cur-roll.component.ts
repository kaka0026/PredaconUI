import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import PerfectScrollbar from 'perfect-scrollbar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DockService } from 'src/app/Service/Common/dock.service';
import { EncrDecrService } from 'src/app/Service/Common/encr-decr.service';
import { LotMastService } from 'src/app/Service/Master/lot-mast.service';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';
import { DockViewComponent } from '../dock-view/dock-view.component';
declare let $: any;

export interface Emp {
  code: string;
  name: string;
}

@Component({
  selector: 'app-dock-cur-roll',
  templateUrl: './dock-cur-roll.component.html',
  styleUrls: ['./dock-cur-roll.component.css']
})
export class DockCurRollComponent implements OnInit {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  decodedMast = [];

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  grpCtrl: FormControl;
  filteredGrps: Observable<any[]>;
  GrpArr: Emp[] = [];

  GridHeader = []

  GRP: any = ''
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
    this.grpCtrl = new FormControl();
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'DockCurRoll' }).subscribe((VPRes) => {
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
          this.toastr.warning(VPRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  ngOnInit(): void {
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
  filterGrps(code: string) {
    return this.GrpArr.filter(grp =>
      grp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  async Refresh() {
    await this.DockServ.DockCurRoll({
      GRP: this.GRP,
      PNT: 1,
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

  async onCellDoubleClicked(params) {
    await this.DockServ.DockCurRollDet({
      PRC: params.data.PRC,
      EMP_CODE: params.data.EMP_CODE
    }).then((Res) => {
      try {
        if (Res.success == 1) {
          const PRF = this.dialog.open(DockViewComponent, { panelClass: "brk-ent-dialog", autoFocus: false, minWidth: 'auto', width: '100%', data: { data: Res.data, VIEWPARA: 'DockCurRollDet' } })
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
