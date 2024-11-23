import { Component, ElementRef, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import Swal from 'sweetalert2';
import { VersionMastService } from '../../../Service/Master/version-mast.service'
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { DatePipe } from '@angular/common';
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-version-mast',
  templateUrl: './version-mast.component.html',
  styleUrls: ['./version-mast.component.css']
})
export class VersionMastComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []
  hide = true
  PASSWORD: any = ''

  constructor(
    private VersionMastServ: VersionMastService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _FrmOpePer: FrmOpePer,
    private datePipe: DatePipe,
    private elementRef: ElementRef,
  ) {
    let op = this
    this.columnDefs = [
      {
        headerName: 'Action',
        cellStyle: { 'text-align': 'center' },
        cellRenderer: function (params) {
          let a = '<span class="det_val">';
          if (op.PASS == op.PASSWORD) {
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
        headerName: 'Code',
        field: 'V_CODE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",

      },
      {
        headerName: 'Date',
        field: 'V_DATE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.DateFormat.bind(this)
      },
      {
        headerName: 'Time',
        field: 'V_TIME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.TimeFormat.bind(this)
      },
      {
        headerName: 'Code',
        field: 'VFLG',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",

        cellRenderer: function (params) {
          if (params.data.VFLG == true) {
            return '<input type="checkbox" disabled checked data-action-type="Active">';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
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
  DateFormat(params) {
    if (params.value) {
      return this.datePipe.transform(params.value, 'dd-MM-yyyy')
    } else {
      return ''
    }
  }

  CHANGEPASSWORD() {
    let RowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      RowData.push(rowNode.data);
    });
    this.gridApi.setRowData(RowData);
  }

  TimeFormat(params) {
    if (params.value) {
      return this.datePipe.transform(params.value, 'hh:mm a', 'UTC+0')
    } else {
      return ''
    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData()
  }

  LoadGridData() {
    this.VersionMastServ.VersionMastFill({}).subscribe((FillRes) => {
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
    this.spinner.show();
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      this.spinner.hide();
      return
    }
    if (this.PASS != this.PASSWORD) {
      this.spinner.hide();
      this.toastr.warning("Password Not Match")
      return
    }
    this.VersionMastServ.VersionMastSave({}).subscribe((SaveRes) => {
      try {
        if (SaveRes.success == true) {
          this.spinner.hide();
          this.toastr.success("saved successfully");
          this.LoadGridData()
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
          title: "Are you sure you want to delete " + eve.data.V_CODE + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.VersionMastServ.VersionMastDelete({ V_CODE: eve.data.V_CODE }).subscribe((DelRes) => {
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
      }
    }
  }
}
