import { Component, ElementRef, OnInit } from '@angular/core';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

import { RapLabMastService } from 'src/app/Service/Master/rap-lab-mast.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-rap-lab-mast',
  templateUrl: './rap-lab-mast.component.html',
  styleUrls: ['./rap-lab-mast.component.css']
})
export class RapLabMastComponent implements OnInit {
  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  LAB_TYPE: any = "GIA"
  COL_TYPE: any = 'REG'
  SHP_TYPE: any = 'R'
  CODE: any = ''
  FSIZE: any = ''
  TSIZE: any = ''
  RATE: any = ''

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
    private RapLabMastServ: RapLabMastService,
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
        field: 'CODE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'F. Size',
        field: 'FSIZE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (!params.value) { params.value = 0; }
          return (params.value).toFixed(2);
        },
      },
      {
        headerName: 'T. Size',
        field: 'TSIZE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (!params.value) { params.value = 0; }
          return (params.value).toFixed(2);
        },
      },
      {
        headerName: 'Rate',
        field: 'RATE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (!params.value) { params.value = 0; }
          return (params.value).toFixed(2);
        },
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
    this.CODE = ''
    this.FSIZE = ''
    this.TSIZE = ''
    this.RATE = ''
  }

  CHANGEPASSWORD() {
    let RowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      RowData.push(rowNode.data);
    });
    this.gridApi.setRowData(RowData);
  }

  Save() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
    if (!this.CODE) {
      this.toastr.warning('Enter Code')
      return
    }
    if (this.FSIZE == '') {
      this.toastr.warning('Enter From Size')
      return
    }
    if (this.TSIZE == '') {
      this.toastr.warning('Enter To Size')
      return
    }
    if (this.RATE == '') {
      this.toastr.warning('Enter Rate')
      return
    }

    let SaveObj = {
      LAB_TYPE: this.LAB_TYPE ? this.LAB_TYPE : this.LAB_TYPE,
      COL_TYPE: this.COL_TYPE ? this.COL_TYPE : this.COL_TYPE,
      SHP_TYPE: this.SHP_TYPE ? this.SHP_TYPE : this.SHP_TYPE,
      CODE: this.CODE ? this.CODE : this.CODE,
      FSIZE: this.FSIZE ? this.FSIZE : this.FSIZE,
      TSIZE: this.TSIZE ? this.TSIZE : this.TSIZE,
      RATE: this.RATE ? this.RATE : this.RATE
    }

    this.spinner.show()
    this.RapLabMastServ.RapLabMastSave(SaveObj).subscribe((SaveRes) => {
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

  SaveClear(eve: any) {
    if (eve == 13 || eve == 9) {
      this.Save();
      this.Clear();
    }
  }

  LoadGridData() {
    this.spinner.show()
    let FillObj = {
      LAB_TYPE: this.LAB_TYPE ? this.LAB_TYPE : this.LAB_TYPE,
      COL_TYPE: this.COL_TYPE ? this.COL_TYPE : this.COL_TYPE,
      SHP_TYPE: this.SHP_TYPE ? this.SHP_TYPE : this.SHP_TYPE,
    }
    this.RapLabMastServ.RapLabMastFill(FillObj).subscribe((FillRes) => {
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
            let DelObj = {
              LAB_TYPE: this.LAB_TYPE ? this.LAB_TYPE : this.LAB_TYPE,
              COL_TYPE: this.COL_TYPE ? this.COL_TYPE : this.COL_TYPE,
              SHP_TYPE: this.SHP_TYPE ? this.SHP_TYPE : this.SHP_TYPE,
            }
            this.RapLabMastServ.RapLabMastDelete(DelObj).subscribe((ColDelRes) => {
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
        this.CODE = eve.data.CODE ? eve.data.CODE : ''
        this.FSIZE = eve.data.FSIZE ? eve.data.FSIZE : ''
        this.TSIZE = eve.data.TSIZE ? eve.data.TSIZE : ''
        this.RATE = eve.data.RATE ? eve.data.RATE : 0
      }

    }
  }


}
