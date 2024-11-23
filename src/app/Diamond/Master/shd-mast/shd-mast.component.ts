import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import PerfectScrollbar from 'perfect-scrollbar';
import Swal from "sweetalert2";

import { ShdMastService } from '../../../Service/Master/shd-mast.service'
import { FrmOpePer } from '../../_helpers/frm-ope-per';

@Component({
  selector: 'app-shd-mast',
  templateUrl: './shd-mast.component.html',
  styleUrls: ['./shd-mast.component.css']
})
export class ShdMastComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  SH_CODE: any = '';
  SH_NAME: any = '';
  ORD: any = '';

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
    private shdMastServ: ShdMastService,
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
        field: 'SH_CODE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Name',
        field: 'SH_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Order',
        field: 'ORD',
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
    this.SH_CODE = ''
    this.SH_NAME = ''
    this.ORD = ''
  }


  Save() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
    if (!this.SH_CODE) {
      this.toastr.warning('Enter Code')
      return
    }
    if (this.SH_NAME.trim() == '') {
      this.toastr.warning('Enter Name')
      return
    }
    if (!this.ORD) {
      this.toastr.warning('Enter Order')
      return
    }

    let SaveObj = {
      SH_CODE: this.SH_CODE,
      BS_NAME: this.SH_NAME.trim(),
      BS_ORD: this.ORD ? this.ORD : this.SH_CODE
    }
    this.spinner.show()
    this.shdMastServ.ShdMastSave(SaveObj).subscribe((SaveRes) => {
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
    this.shdMastServ.ShdMastFill({}).subscribe((FillRes) => {

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
          title: "Are you sure you want to delete shade code " + eve.data.BS_CODE + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.shdMastServ.ShdMastDelete({ SH_CODE: eve.data.SH_CODE }).subscribe((DelRes) => {
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
        this.SH_CODE = eve.data.SH_CODE ? eve.data.SH_CODE : ''
        this.SH_NAME = eve.data.SH_NAME ? eve.data.SH_NAME : ''
        this.ORD = eve.data.ORD ? eve.data.ORD : 0
      }

    }
  }

}