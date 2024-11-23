import { Component, ElementRef, OnInit } from '@angular/core';
import { RmkMastService } from 'src/app/Service/Master/rmk-mast.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-rmk-mast',
  templateUrl: './rmk-mast.component.html',
  styleUrls: ['./rmk-mast.component.css']
})
export class RmkMastComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  R_CODE: any = ''
  R_NAME: any = ''

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []
  hide = true
  PASSWORD: any = ''

  constructor
    (
      private _FrmOpePer: FrmOpePer,
      private toastr: ToastrService,
      private spinner: NgxSpinnerService,
      private RmkMastServ: RmkMastService,
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
        headerName: 'R_CODE',
        field: 'R_CODE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'R_NAME',
        field: 'R_NAME',
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
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData()
  }

  LoadGridData() {
    this.spinner.show()
    this.RmkMastServ.RmkMastFill({}).subscribe((FillRes) => {
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

  CHANGEPASSWORD() {
    let RowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      RowData.push(rowNode.data);
    });
    this.gridApi.setRowData(RowData);
  }

  Clear() {
    this.R_CODE = ''
    this.R_NAME = ''
  }

  Save() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
    if (this.R_CODE.trim() == '') {
      this.toastr.warning('Enter Code')
      return
    }
    if (this.R_NAME.trim() == '') {
      this.toastr.warning('Enter Name')
      return
    }

    let SaveObj = {
      R_CODE: this.R_CODE ? this.R_CODE : '',
      R_NAME: this.R_NAME ? this.R_NAME : '',
    }

    this.spinner.show()
    this.RmkMastServ.RmkMastSave(SaveObj).subscribe((SaveRes) => {
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
            let DelObj = {
              R_CODE: this.R_CODE ? this.R_CODE : ''
            }
            this.RmkMastServ.RmkMastDelete(DelObj).subscribe((ColDelRes) => {
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
        this.R_CODE = eve.data.R_CODE ? eve.data.R_CODE : ''
        this.R_NAME = eve.data.R_NAME ? eve.data.R_NAME : ''
      }

    }
  }

}
