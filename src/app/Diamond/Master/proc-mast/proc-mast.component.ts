import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import PerfectScrollbar from 'perfect-scrollbar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from "sweetalert2";

import { DeptMastService } from '../../../Service/Master/dept-mast.service';
import { ProcMastService } from '../../../Service/Master/proc-mast.service';
import { FrmOpePer } from '../../_helpers/frm-ope-per';

export interface Emp {
  code: string;
  name: string;
}

@Component({
  selector: 'app-proc-mast',
  templateUrl: './proc-mast.component.html',
  styleUrls: ['./proc-mast.component.css']
})
export class ProcMastComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  DEPT_CODE: any = ''
  PROC_CODE: any = ''
  PROC_NAME: any = ''
  hide = true
  PASSWORD: any = ''

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []

  deptCtrl: FormControl;
  filteredDepts: Observable<any[]>;
  DeptArr: Emp[] = [];

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private DeptMastServ: DeptMastService,
    private ProcMastServ: ProcMastService,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef
  ) {
    this.deptCtrl = new FormControl();
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
        field: 'PROC_CODE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Name',
        field: 'PROC_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Dept. Code',
        field: 'DEPT_CODE',
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

    this.DeptMastServ.DeptMastFill({}).subscribe((FRes) => {
      try {
        if (FRes.success == true) {
          this.DeptArr = FRes.data.map((item) => {
            return { code: item.DEPT_CODE, name: item.DEPT_NAME }
          })
          this.filteredDepts = this.deptCtrl.valueChanges
            .pipe(
              startWith(''),
              map(dept => dept ? this.filterDepts(dept) : this.DeptArr)
            );
        }
      } catch (error) {
      }
    })
  }
  filterDepts(code: string) {
    return this.DeptArr.filter(dept =>
      dept.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData()
  }

  Clear() {
    this.DEPT_CODE = ''
    this.PROC_CODE = ''
    this.PROC_NAME = ''
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
    if (!this.DEPT_CODE) {
      this.toastr.warning('Enter Department Code')
      return
    }
    if (!this.PROC_CODE) {
      this.toastr.warning('Enter Process Code')
      return
    }
    if (this.PROC_NAME.trim() == '') {
      this.toastr.warning('Enter Process Name')
      return
    }

    let SaveObj = {
      DEPT_CODE: this.DEPT_CODE,
      PROC_CODE: this.PROC_CODE,
      PROC_NAME: this.PROC_NAME ? this.PROC_NAME : '',
    }
    this.spinner.show()
    this.ProcMastServ.ProcMastSave(SaveObj).subscribe((SaveRes) => {
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
    this.ProcMastServ.ProcMastFill({ DEPT_CODE: this.DEPT_CODE }).subscribe((FillRes) => {

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
          title: "Are you sure you want to delete process code " + eve.data.PROC_CODE + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.ProcMastServ.ProcMastDelete({ DEPT_CODE: eve.data.DEPT_CODE, PROC_CODE: eve.data.PROC_CODE }).subscribe((DelRes) => {
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
        this.DEPT_CODE = eve.data.DEPT_CODE ? eve.data.DEPT_CODE : ''
        this.PROC_CODE = eve.data.PROC_CODE ? eve.data.PROC_CODE : ''
        this.PROC_NAME = eve.data.PROC_NAME ? eve.data.PROC_NAME : ''
      }

    }
  }

}
