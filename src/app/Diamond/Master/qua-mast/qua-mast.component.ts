import { Component, ElementRef, OnInit } from '@angular/core';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import PerfectScrollbar from 'perfect-scrollbar';
import Swal from "sweetalert2";

import { QuaMastService } from '../../../Service/Master/qua-mast.service'
import { FrmOpePer } from '../../_helpers/frm-ope-per';

@Component({
  selector: 'app-qua-mast',
  templateUrl: './qua-mast.component.html',
  styleUrls: ['./qua-mast.component.css']
})
export class QuaMastComponent implements OnInit {
  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  Q_CODE: any = ''
  Q_NAME: any = ''
  Q_IMPORTNAME: any = ''
  Q_ORD: any = ''

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []

  hide = true
  PASSWORD: any = ''

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private QuaMastServ: QuaMastService,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef
  ) {
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
        headerName: 'Code',
        field: 'Q_CODE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Name',
        field: 'Q_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Import Name',
        field: 'Q_IMPORTNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Order',
        field: 'Q_ORD',
        cellStyle: { 'text-align': 'right' },
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
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData()
  }

  Clear() {
    this.Q_CODE = ''
    this.Q_NAME = ''
    this.Q_IMPORTNAME = ''
    this.Q_ORD = ''
  }

  Save() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
    if (!this.Q_CODE) {
      this.toastr.warning('Enter Code')
      return
    }
    if (!this.Q_ORD) {
      this.toastr.warning('Enter Order')
      return
    }
    if (this.Q_NAME.trim() == '') {
      this.toastr.warning('Enter Name')
      return
    }

    let SaveObj = {
      Q_CODE: this.Q_CODE,
      Q_NAME: this.Q_NAME.trim(),
      Q_IMPORTNAME: this.Q_IMPORTNAME ? this.Q_IMPORTNAME.trim() : this.Q_NAME.trim(),
      Q_ORD: this.Q_ORD ? this.Q_ORD : this.Q_CODE
    }
    this.spinner.show()
    this.QuaMastServ.QuaMastSave(SaveObj).subscribe((SaveRes) => {
      try {
        if (SaveRes.success == true) {
          this.spinner.hide()
          this.toastr.success('Save successfully.')
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

  LoadGridData() {
    this.spinner.show()
    this.QuaMastServ.QuaMastFill({}).subscribe((FillRes) => {

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
          title: "Are you sure you want to delete shape code " + eve.data.Q_CODE + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.QuaMastServ.QuaMastDelete({ Q_CODE: eve.data.Q_CODE }).subscribe((ColDelRes) => {
              try {
                if (ColDelRes.success == true) {
                  this.spinner.hide()
                  this.toastr.success('Delete successfully.')
                  this.LoadGridData()
                } else {
                  this.spinner.hide()
                  this.toastr.warning('Something went to wrong while delete color code')
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
        this.Q_CODE = eve.data.Q_CODE ? eve.data.Q_CODE : ''
        this.Q_NAME = eve.data.Q_NAME ? eve.data.Q_NAME : ''
        this.Q_IMPORTNAME = eve.data.Q_IMPORTNAME ? eve.data.Q_IMPORTNAME : ''
        this.Q_ORD = eve.data.Q_ORD ? eve.data.Q_ORD : 0
      }

    }
  }

  CHANGEPASSWORD() {
    let RowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      RowData.push(rowNode.data);
    });
    this.gridApi.setRowData(RowData);
  }

}
