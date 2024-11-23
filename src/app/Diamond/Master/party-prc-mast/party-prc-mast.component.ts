import { Component, ElementRef, OnInit } from '@angular/core';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";
import PerfectScrollbar from "perfect-scrollbar";

import { PartyPrcMastService } from 'src/app/Service/Master/party-prc-mast.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';

@Component({
  selector: 'app-party-prc-mast',
  templateUrl: './party-prc-mast.component.html',
  styleUrls: ['./party-prc-mast.component.css']
})

export class PartyPrcMastComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  P_CODE: any = ''
  DEPT_CODE: any = ''
  PRC_CODE: any = ''
  S_CODE: any = ''

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
    private PartyPrcMastServ: PartyPrcMastService,
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
        headerName: 'P Code',
        field: 'P_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
      },
      {
        headerName: 'Dept Code',
        field: 'DEPT_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Prc Code',
        field: 'PRC_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'S Code',
        field: 'S_CODE',
        cellStyle: { 'text-align': 'center' },
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
    this.P_CODE = ''
    this.DEPT_CODE = ''
    this.PRC_CODE = ''
    this.S_CODE = ''
  }

  Save() {

    let SaveObj = {
      P_CODE: this.P_CODE ? this.P_CODE : this.P_CODE,
      DEPT_CODE: this.DEPT_CODE ? this.DEPT_CODE : this.DEPT_CODE,
      PRC_CODE: this.PRC_CODE ? this.PRC_CODE : this.PRC_CODE,
      S_CODE: this.S_CODE ? this.S_CODE : this.S_CODE,
    }
    this.spinner.show()
    this.PartyPrcMastServ.PartyPrcMastSave(SaveObj).subscribe((SaveRes) => {
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
    this.PartyPrcMastServ.PartyPrcMastFill({}).subscribe((FillRes) => {

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
          title: "Are you sure you want to delete shape code " + eve.data.C_CODE + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.PartyPrcMastServ.PartyPrcMastDelete({ P_CODE: eve.data.P_CODE, DEPT_CODE: eve.data.DEPT_CODE, }).subscribe((ColDelRes) => {
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
        this.P_CODE = eve.data.P_CODE ? eve.data.P_CODE : ''
        this.DEPT_CODE = eve.data.DEPT_CODE ? eve.data.DEPT_CODE : ''
        this.PRC_CODE = eve.data.PRC_CODE ? eve.data.PRC_CODE : ''
        this.S_CODE = eve.data.S_CODE ? eve.data.S_CODE : 0
      }

    }
  }

}
