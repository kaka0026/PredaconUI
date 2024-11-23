import { Component, ElementRef, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { ViewParaMastService } from '../../../Service/Master/view-para-mast.service';
import { FrmMastService } from '../../../Service/ConfigMast/frm-mast.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import PerfectScrollbar from 'perfect-scrollbar';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-view-para-mast',
  templateUrl: './view-para-mast.component.html',
  styleUrls: ['./view-para-mast.component.css']
})
export class ViewParaMastComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  frmCtrl: FormControl;
  filteredFrms: Observable<any[]>;

  FORMNAME: any = ''
  FIELDNAME: any = ''
  DISPNAME: any = ''
  COLWIDTH: any = ''
  HEADERALIGN: any = ''
  HEADERCOLOR: any = ''
  HEADERFONTSIZE: any = ''
  CELLALIGN: any = ''
  CELLCOLOR: any = ''
  CELLFONTSIZE: any = ''
  BACKCOLOR: any = ''
  FONTNAME: any = ''
  ISBOLD: boolean
  ISRESIZE: boolean
  ORD: any = ''
  FORMAT: any = ''
  COLUMNSTYLE: any = ''
  GROUPKEY: any = ''
  CUSTSUMMARY: any = ''
  MAXLEN: any = ''
  DISP: boolean
  LOCK: boolean
  ISMERGE: boolean

  FrmNameArr = []

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []
  hide = true
  PASSWORD: any = ''

  constructor(
    private ViewParaMastServ: ViewParaMastService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private FrmMastServ: FrmMastService,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef
  ) {
    this.frmCtrl = new FormControl();
    let op = this
    this.columnDefs = [
      {
        headerName: 'Action',
        cellStyle: { 'text-align': 'center' },
        cellRenderer: function (params) {
          let a = '<span class="det_val">';
          if (op.PASS == op.PASSWORD) {
            if (op.ALLOWUPD) {
              a = a + '<i class="icon-edit grid-icon" data-action-type="EditData" style="cursor: pointer;margin-right: 5px;" ></i>';
            }
            if (op.ALLOWDEL) {
              a = a + '<i class="icon-delete grid-icon" data-action-type="DeleteData" style="cursor: pointer;margin-left: 5px;"></i>';
            }
          }
          a = a + '</span>';
          return a;
        },
        headerClass: "text-center"
      },
      {
        headerName: 'FORMNAME',
        field: 'FORMNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 180
      },
      {
        headerName: 'FIELDNAME',
        field: 'FIELDNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 110,
      },
      {
        headerName: 'DISPNAME',
        field: 'DISPNAME',
        width: 100,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'COLWIDTH',
        field: 'COLWIDTH',
        width: 80,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'MAXLEN',
        field: 'MAXLEN',
        width: 70,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'HEADERALIGN',
        field: 'HEADERALIGN',
        width: 100,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },

      {
        headerName: 'CELLALIGN',
        field: 'CELLALIGN',
        width: 80,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'ORD',
        field: 'ORD',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'FORMAT',
        field: 'FORMAT',
        width: 120,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'ISBOLD',
        field: 'ISBOLD',
        width: 70,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.ISBOLD == true) {
            return '<input type="checkbox" disabled checked data-action-type="Active">';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },

      {
        headerName: 'ISRESIZE',
        field: 'ISRESIZE',
        width: 70,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.ISRESIZE == true) {
            return '<input type="checkbox" disabled checked data-action-type="Active">';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        headerName: 'DISP',
        field: 'DISP',
        width: 70,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.DISP == true) {
            return '<input type="checkbox" disabled checked data-action-type="Active">';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        headerName: 'LOCK',
        field: 'LOCK',
        width: 70,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.LOCK == true) {
            return '<input type="checkbox" disabled checked data-action-type="Active">';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },

      {
        headerName: 'ISMERGE',
        field: 'ISMERGE',
        width: 70,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.ISMERGE == true) {
            return '<input type="checkbox" disabled checked data-action-type="Active">';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },

      {
        headerName: 'COLUMNSTYLE',
        field: 'COLUMNSTYLE',
        width: 70,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'BACKCOLOR',
        field: 'BACKCOLOR',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },

      {
        headerName: 'HEADERFONTSIZE',
        field: 'HEADERFONTSIZE',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'CELLCOLOR',
        field: 'CELLCOLOR',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'CELLFONTSIZE',
        field: 'CELLFONTSIZE',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'FONTNAME',
        field: 'FONTNAME',
        width: 50,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'HEADERCOLOR',
        field: 'HEADERCOLOR',
        cellStyle: { 'text-align': 'center' },
        width: 50,
        headerClass: "text-center"
      },
      {
        headerName: 'GROUPKEY',
        field: 'GROUPKEY',
        width: 70,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'CUSTSUMMARY',
        field: 'CUSTSUMMARY',
        width: 70,
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
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

    this.ViewParaMastServ.ViewParaComboFill({}).subscribe((FRes) => {
      try {
        if (FRes.success == true) {
          this.FrmNameArr = FRes.data.map((item) => {
            return item.FORMNAME
          })
          this.filteredFrms = this.frmCtrl.valueChanges
            .pipe(
              startWith(''),
              map(grp => grp ? this.filterFrms(grp) : this.FrmNameArr)
            );
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(FRes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

  }
  filterFrms(code: string) {
    return this.FrmNameArr.filter(grp =>
      grp.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setRowData(null);
    // this.LoadGridData()
  }

  CHANGEPASSWORD() {
    let RowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      RowData.push(rowNode.data);
    });
    this.gridApi.setRowData(RowData);
  }

  LoadGridData() {
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: this.FORMNAME }).subscribe((FillRes) => {
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
          // this.gridApi.sizeColumnsToFit();
        } else {
          this.spinner.hide();
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

  Save() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
    if (this.PASS != this.PASSWORD) {
      this.toastr.warning("Password Not Match")
      return
    }
    if (this.FIELDNAME.trim() == '') {
      this.toastr.warning("Enter Filed Name")
      return
    }
    if (this.DISPNAME.trim() == '') {
      this.toastr.warning("Enter Display Name")
      return
    }
    let SaveObj = {
      FORMNAME: this.FORMNAME ? this.FORMNAME : '',
      DISPNAME: this.DISPNAME ? this.DISPNAME : this.DISPNAME,
      FIELDNAME: this.FIELDNAME ? this.FIELDNAME : this.FIELDNAME,
      COLWIDTH: this.COLWIDTH ? this.COLWIDTH : '',
      HEADERALIGN: this.HEADERALIGN ? this.HEADERALIGN : '',
      HEADERCOLOR: this.HEADERCOLOR ? this.HEADERCOLOR : '',
      HEADERFONTSIZE: this.HEADERFONTSIZE ? this.HEADERFONTSIZE : '',
      CELLALIGN: this.CELLALIGN ? this.CELLALIGN : '',
      CELLCOLOR: this.CELLCOLOR ? this.CELLCOLOR : '',
      CELLFONTSIZE: this.CELLFONTSIZE ? this.CELLFONTSIZE : '',
      BACKCOLOR: this.BACKCOLOR ? this.BACKCOLOR : '',
      FONTNAME: this.FONTNAME ? this.FONTNAME : '',
      ISBOLD: this.ISBOLD ? this.ISBOLD : false,
      ISRESIZE: this.ISRESIZE ? this.ISRESIZE : false,
      ORD: this.ORD ? this.ORD : '',
      FORMAT: this.FORMAT ? this.FORMAT : '',
      COLUMNSTYLE: this.COLUMNSTYLE ? this.COLUMNSTYLE : '',
      GROUPKEY: this.GROUPKEY ? this.GROUPKEY : '',
      CUSTSUMMARY: this.CUSTSUMMARY ? this.CUSTSUMMARY : '',
      MAXLEN: this.MAXLEN ? this.MAXLEN : '',
      DISP: this.DISP ? this.DISP : false,
      LOCK: this.LOCK ? this.LOCK : false,
      ISMERGE: this.ISMERGE ? this.ISMERGE : false
    }
    this.spinner.show()
    this.ViewParaMastServ.ViewParaSave(SaveObj).subscribe((SaveRes) => {
      try {
        if (SaveRes.success == true) {
          this.spinner.hide();
          this.toastr.success("saved successfully");
          this.LoadGridData()
          this.Clear()
        } else {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(SaveRes.data),
          })
        }
      } catch (err) {
        this.spinner.hide()
        this.toastr.error(err)
      }
    })
  }

  Clear() {

    this.FORMNAME = ''
    this.FIELDNAME = ''
    this.DISPNAME = ''
    this.COLWIDTH = ''
    this.HEADERALIGN = ''
    this.HEADERCOLOR = ''
    this.HEADERFONTSIZE = ''
    this.CELLALIGN = ''
    this.CELLCOLOR = ''
    this.CELLFONTSIZE = ''
    this.BACKCOLOR = ''
    this.FONTNAME = ''
    this.ISBOLD = false
    this.ISRESIZE = false
    this.ORD = ''
    this.FORMAT = ''
    this.COLUMNSTYLE = ''
    this.GROUPKEY = ''
    this.CUSTSUMMARY = ''
    this.MAXLEN = ''
    this.DISP = false
    this.LOCK = false
    this.ISMERGE = false
  }

  onGridRowClicked(eve: any) {
    if (eve.event.target !== undefined) {
      let actionType = eve.event.target.getAttribute("data-action-type");

      if (actionType == 'DeleteData') {
        if (this.PASS != this.PASSWORD) {
          this.toastr.warning("Password Not Match")
          return
        }
        if (!this.ALLOWDEL) {
          this.toastr.warning("Delete Permission was not set!!", "Constact Administrator!!!!!")
          return
        }
        Swal.fire({
          title: "Are you sure you want to delete " + eve.data.FORMNAME + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.ViewParaMastServ.ViewParaDelete({ FORMNAME: eve.data.FORMNAME, FIELDNAME: eve.data.FIELDNAME }).subscribe((DelRes) => {
              try {
                if (DelRes.success == true) {
                  this.spinner.hide()
                  this.toastr.success('Delete successfully.')
                  this.LoadGridData()
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
        if (this.PASS != this.PASSWORD) {
          this.toastr.warning("Password Not Match")
          return
        }
        if (!this.ALLOWUPD) {
          this.toastr.warning("Update Permission was not set!!", "Constact Administrator!!!!!")
          return
        }
        this.FORMNAME = eve.data.FORMNAME ? eve.data.FORMNAME : '',
          this.DISPNAME = eve.data.DISPNAME ? eve.data.DISPNAME : '',
          this.FIELDNAME = eve.data.FIELDNAME ? eve.data.FIELDNAME : '',
          this.COLWIDTH = eve.data.COLWIDTH ? eve.data.COLWIDTH : 0,
          this.HEADERALIGN = eve.data.HEADERALIGN ? eve.data.HEADERALIGN : '',
          this.HEADERCOLOR = eve.data.HEADERCOLOR ? eve.data.HEADERCOLOR : '',
          this.HEADERFONTSIZE = eve.data.HEADERFONTSIZE ? eve.data.HEADERFONTSIZE : 0,
          this.CELLALIGN = eve.data.CELLALIGN ? eve.data.CELLALIGN : '',
          this.CELLCOLOR = eve.data.CELLCOLOR ? eve.data.CELLCOLOR : '',
          this.CELLFONTSIZE = eve.data.CELLFONTSIZE ? eve.data.CELLFONTSIZE : 0,
          this.BACKCOLOR = eve.data.BACKCOLOR ? eve.data.BACKCOLOR : '',
          this.FONTNAME = eve.data.FONTNAME ? eve.data.FONTNAME : '',
          this.ISBOLD = eve.data.ISBOLD ? eve.data.ISBOLD : false,
          this.ISRESIZE = eve.data.ISRESIZE ? eve.data.ISRESIZE : false,
          this.ORD = eve.data.ORD ? eve.data.ORD : 0,
          this.FORMAT = eve.data.FORMAT ? eve.data.FORMAT : '',
          this.COLUMNSTYLE = eve.data.COLUMNSTYLE ? eve.data.COLUMNSTYLE : '',
          this.GROUPKEY = eve.data.GROUPKEY ? eve.data.GROUPKEY : '',
          this.CUSTSUMMARY = eve.data.CUSTSUMMARY ? eve.data.CUSTSUMMARY : '',
          this.MAXLEN = eve.data.MAXLEN ? eve.data.MAXLEN : 0,
          this.DISP = eve.data.DISP ? eve.data.DISP : false,
          this.LOCK = eve.data.LOCK ? eve.data.LOCK : false,
          this.ISMERGE = eve.data.ISMERGE ? eve.data.ISMERGE : false
      }
    }
  }
  CODECHANGE() {
    let GridRowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      GridRowData.push(rowNode.data);
    });
    if (GridRowData.filter(x => x.FIELDNAME == this.FIELDNAME).length > 0) {
      if (this.ALLOWUPD == false) {
        this.toastr.warning("Update Permission was not set!!", "Constact Administrator!!!!!")
        this.FIELDNAME = ''
        this.DISPNAME = ''
        this.COLWIDTH = ''
        this.HEADERALIGN = ''
        this.HEADERCOLOR = ''
        this.HEADERFONTSIZE = ''
        this.CELLALIGN = ''
        this.CELLCOLOR = ''
        this.CELLFONTSIZE = ''
        this.BACKCOLOR = ''
        this.FONTNAME = ''
        this.ISBOLD = false
        this.ISRESIZE = false
        this.ORD = ''
        this.FORMAT = ''
        this.COLUMNSTYLE = ''
        this.GROUPKEY = ''
        this.CUSTSUMMARY = ''
        this.MAXLEN = ''
        this.DISP = false
        this.LOCK = false
        this.ISMERGE = false
      }
    }
  }
}
