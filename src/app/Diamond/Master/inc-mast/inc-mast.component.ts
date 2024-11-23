import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import PerfectScrollbar from 'perfect-scrollbar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from "sweetalert2";

import { IncMastService } from '../../../Service/Master/inc-mast.service'
import { IncTypeMastService } from '../../../Service/Master/inc-type-mast.service'
import { FrmOpePer } from '../../_helpers/frm-ope-per';

export interface Emp {
  code: string;
  name: string;
}

@Component({
  selector: 'app-inc-mast',
  templateUrl: './inc-mast.component.html',
  styleUrls: ['./inc-mast.component.css']
})
export class IncMastComponent implements OnInit {
  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  I_TYPE: any = '';
  I_CODE: any = '';
  I_NAME: any = '';
  I_SHORTNAME: any = '';
  I_IMPORTNAME: any = '';
  I_PER: any = '';
  I_ORD: any = '';
  hide = true
  PASSWORD: any = ''

  typCtrl: FormControl;
  filteredTyps: Observable<any[]>;
  typeList: Emp[] = [];

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private IncMastServ: IncMastService,
    private IncTypeMastServ: IncTypeMastService,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef
  ) {
    this.typCtrl = new FormControl();
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
        headerName: 'Type',
        field: 'I_TYPE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Code',
        field: 'I_CODE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'Name',
        field: 'I_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Short Name',
        field: 'I_SHORTNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Import Name',
        field: 'I_IMPORTNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Per(%)',
        field: 'I_PER',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (!params.value) { params.value = 0; }
          return (params.value).toFixed(2);
        },
      },
      {
        headerName: 'Order',
        field: 'I_ORD',
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

    this.IncTypeMastServ.IncTypeMastFill({ I_TYPE: '' }).subscribe(TypeRes => {
      try {
        if (TypeRes.success == true) {

          this.typeList = TypeRes.data.map(item => {
            return { code: item.I_TYPE };
          });

          this.filteredTyps = this.typCtrl.valueChanges
            .pipe(
              startWith(''),
              map(grp => grp ? this.filterTyps(grp) : this.typeList)
            );
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });

  }
  filterTyps(code: string) {
    return this.typeList.filter(typ =>
      typ.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
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
    // this.LoadGridData()
  }

  Clear() {
    this.I_TYPE = '';
    this.I_CODE = '';
    this.I_NAME = '';
    this.I_SHORTNAME = '';
    this.I_IMPORTNAME = '';
    this.I_PER = '';
    this.I_ORD = '';
  }


  Save() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
    if (this.I_TYPE.trim() == '') {
      this.toastr.warning('Enter Type')
      return
    }
    if (!this.I_CODE) {
      this.toastr.warning('Enter Code')
      return
    }
    if (this.I_SHORTNAME.trim() == '') {
      this.toastr.warning('Enter Shortname')
      return
    }
    if (this.I_NAME.trim() == '') {
      this.toastr.warning('Enter Name')
      return
    }

    this.spinner.show()


    this.IncMastServ.IncMastGetMaxId({ I_TYPE: this.I_TYPE, I_CODE: 0 }).subscribe((GetRes) => {

      try {

        if (GetRes.success == true) {
          this.I_CODE = this.I_CODE ? this.I_CODE : GetRes.data[0].MaxICode

          let SaveObj = {
            I_TYPE: this.I_TYPE,
            I_CODE: this.I_CODE,
            I_NAME: this.I_NAME.trim(),
            I_SHORTNAME: this.I_SHORTNAME ? this.I_SHORTNAME.trim() : '',
            I_IMPORTNAME: this.I_IMPORTNAME ? this.I_IMPORTNAME.trim() : this.I_NAME.trim(),
            I_PER: this.I_PER ? this.I_PER : 0,
            I_ORD: this.I_ORD ? this.I_ORD : 0,
          }
          this.IncMastServ.IncMastSave(SaveObj).subscribe((SaveRes) => {
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

        } else {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(GetRes.data),
          })
        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })
  }

  LoadGridData() {
    this.spinner.show()
    this.IncMastServ.IncMastFill({ I_TYPE: this.I_TYPE }).subscribe((FillRes) => {
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
          title: "Are you sure you want to delete shade code " + eve.data.I_CODE + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"

        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.IncMastServ.IncMastDelete({ I_CODE: eve.data.I_CODE, I_TYPE: eve.data.I_TYPE }).subscribe((DelRes) => {
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
        this.I_TYPE = eve.data.I_TYPE ? eve.data.I_TYPE : ''
        this.I_CODE = eve.data.I_CODE ? eve.data.I_CODE : ''
        this.I_NAME = eve.data.I_NAME ? eve.data.I_NAME : ''
        this.I_SHORTNAME = eve.data.I_SHORTNAME ? eve.data.I_SHORTNAME : ''
        this.I_IMPORTNAME = eve.data.I_IMPORTNAME ? eve.data.I_IMPORTNAME : ''
        this.I_PER = eve.data.I_PER ? eve.data.I_PER : ''
        this.I_ORD = eve.data.I_ORD ? eve.data.I_ORD : 0
      }

    }
  }
}
