import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";
import { TenMastService } from 'src/app/Service/Master/ten-mast.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import PerfectScrollbar from 'perfect-scrollbar';

TenMastService

@Component({
  selector: 'app-ten-mast',
  templateUrl: './ten-mast.component.html',
  styleUrls: ['./ten-mast.component.css']
})
export class TenMastComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  TEN_CODE: any = ''
  TEN_NAME: any = ''

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASSFLAG: boolean = false
  PASS: any = ''
  PER = []
  hide = true
  PASSWORD: any = ''

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private TenMastServ: TenMastService,
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
        field: 'TEN_CODE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Name',
        field: 'TEN_NAME',
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

  CHANGEPASSWORD() {
    let RowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      RowData.push(rowNode.data);
    });
    this.gridApi.setRowData(RowData);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData()
  }

  Clear() {
    this.TEN_CODE = ''
    this.TEN_NAME = ''
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

    if (this.TEN_NAME.trim() == '') {
      this.toastr.warning('Enter Name')
      return
    }
    if (!this.TEN_CODE) {
      this.toastr.warning('Enter Code')
      return
    }
    let SaveObj = {
      TEN_CODE: this.TEN_CODE ? this.TEN_CODE : '',
      TEN_NAME: this.TEN_NAME ? this.TEN_NAME : '',
    }

    this.spinner.show()
    this.TenMastServ.TenMastSave(SaveObj).subscribe((SaveRes) => {
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
    this.TenMastServ.TenMastFill({}).subscribe((FillRes) => {

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
        if (this.PASS != this.PASSWORD) {
          this.toastr.warning("Password Not Match")
          return
        }
        if (!this.ALLOWDEL) {
          this.toastr.warning("Delete Permission was not set!!", "Constact Administrator!!!!!")
          return
        }

        Swal.fire({
          title: "Are you sure you want to delete Tention code " + eve.data.TEN_CODE + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.TenMastServ.TenMastDelete({ TEN_CODE: eve.data.TEN_CODE }).subscribe((DelRes) => {
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
        this.TEN_NAME = eve.data.TEN_NAME ? eve.data.TEN_NAME : ''
        this.TEN_CODE = eve.data.TEN_CODE ? eve.data.TEN_CODE : ''
      }

    }
  }
  CODECHANGE() {
    let GridRowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      GridRowData.push(rowNode.data);
    });
    if (GridRowData.filter(x => x.TEN_CODE == this.TEN_CODE).length > 0) {
      if (this.ALLOWUPD == false) {
        this.toastr.warning("Update Permission was not set!!", "Constact Administrator!!!!!")
        this.TEN_CODE = ''
        this.TEN_NAME = ''
      }
    }
  }
}
