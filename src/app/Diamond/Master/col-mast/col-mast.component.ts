import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";
import PerfectScrollbar from "perfect-scrollbar";

import { ColMastService } from '../../../Service/Master/col-mast.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';

@Component({
  selector: 'app-col-mast',
  templateUrl: './col-mast.component.html',
  styleUrls: ['./col-mast.component.css']
})
export class ColMastComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  C_CODE: any = ''
  C_NAME: any = ''
  S_IMPORTNAME: any = ''
  C_ORD: any = ''

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
    private ColMastServ: ColMastService,
    private _FrmOpePer: FrmOpePer,
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
            if (op.ALLOWUPD) {
              a = a + '<i class="icon-edit grid-icon" data-action-type="EditData" style="cursor: pointer;margin-right: 5px;" ></i>   ';
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
        field: 'C_CODE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
      },
      {
        headerName: 'Name',
        field: 'C_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Import Name',
        field: 'S_IMPORTNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Order',
        field: 'C_ORD',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
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

  CHANGEPASSWORD() {
    let RowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      RowData.push(rowNode.data);
    });
    this.gridApi.setRowData(RowData);
  }

  Clear() {
    this.C_CODE = ''
    this.C_NAME = ''
    this.S_IMPORTNAME = ''
    this.C_ORD = ''
  }

  Save() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
    if (!this.C_CODE) {
      this.toastr.warning('Enter Code')
      return
    }
    if (this.C_NAME.trim() == '') {
      this.toastr.warning('Enter Name')
      return
    }
    if (!this.C_ORD) {
      this.toastr.warning('Enter Order')
      return
    }
    if (this.PASS != this.PASSWORD) {
      this.toastr.warning('Incorrect Password')
      return
    }

    let SaveObj = {
      C_CODE: this.C_CODE ? this.C_CODE : 0,
      C_NAME: this.C_NAME.trim(),
      S_IMPORTNAME: this.S_IMPORTNAME ? this.S_IMPORTNAME.trim() : this.C_NAME.trim(),
      C_ORD: this.C_ORD ? this.C_ORD : this.C_CODE
    }
    this.spinner.show()
    this.ColMastServ.ColMastSave(SaveObj).subscribe((SaveRes) => {
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
    this.ColMastServ.ColMastFill({}).subscribe((FillRes) => {


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
          if (agBodyViewport) {
            const ps = new PerfectScrollbar(agBodyViewport);
            const container = document.querySelector('.ag-body-viewport');
            container.scrollTop = 500;
            ps.update();
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
          title: "Are you sure you want to delete shape code " + eve.data.C_CODE + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.ColMastServ.ColMastDelete({ C_CODE: eve.data.C_CODE }).subscribe((ColDelRes) => {
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
        this.C_CODE = eve.data.C_CODE ? eve.data.C_CODE : ''
        this.C_NAME = eve.data.C_NAME ? eve.data.C_NAME : ''
        this.S_IMPORTNAME = eve.data.S_IMPORTNAME ? eve.data.S_IMPORTNAME : ''
        this.C_ORD = eve.data.C_ORD ? eve.data.C_ORD : 0
      }

    }
  }

}


