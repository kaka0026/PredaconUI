import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

import { UserCatService } from '../../../Service/ConfigMast/user-cat.service'

@Component({
  selector: 'app-user-cat',
  templateUrl: './user-cat.component.html',
  styleUrls: ['./user-cat.component.css']
})
export class UserCatComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  U_CAT: any = ''
  U_CATNAME: any = ''

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private UserCatServ: UserCatService,
  ) {
    this.columnDefs = [
      {
        headerName: 'Action',
        cellStyle: { 'text-align': 'center' },
        cellRenderer: function (params) {
          return '<span class="det_val"><i class="icon-edit grid-icon" data-action-type="EditData" style="cursor: pointer;margin-right: 5px;" ></i>  <i class="icon-delete grid-icon" data-action-type="DeleteData" style="cursor: pointer;margin-left: 5px;"></i> </span>  ';
        },
        headerClass: "text-center"
      },
      {
        headerName: 'Code',
        field: 'U_CAT',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Name',
        field: 'U_CATNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
    ]

    this.defaultColDef = {
      resizable: true,
      sortable: true
    }
  }

  ngOnInit(): void {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData()
  }

  Clear() {
    this.U_CAT = ''
    this.U_CATNAME = ''
  }

  Save() {


    if (this.U_CAT.trim() == '') {
      this.toastr.warning('Enter Code')
      return
    }
    if (this.U_CATNAME.trim() == '') {
      this.toastr.warning('Enter Name')
      return
    }

    let SaveObj = {
      U_CAT: this.U_CAT.trim(),
      U_CATNAME: this.U_CATNAME.trim(),
    }
    this.spinner.show()
    this.UserCatServ.UserCatMastSave(SaveObj).subscribe((SaveRes) => {
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
    this.UserCatServ.UserCatMastFill({}).subscribe((FillRes) => {

      try {
        if (FillRes.success == true) {
          this.spinner.hide()
          this.gridApi.setRowData(FillRes.data);
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
          title: "Are you sure you want to delete user category code " + eve.data.U_CAT + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.UserCatServ.UserCatMastDelete({ U_CAT: eve.data.U_CAT }).subscribe((DelRes) => {
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
        this.U_CAT = eve.data.U_CAT ? eve.data.U_CAT : ''
        this.U_CATNAME = eve.data.U_CATNAME ? eve.data.U_CATNAME : ''
      }

    }
  }

}
