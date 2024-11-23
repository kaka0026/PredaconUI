import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

import { UserCatService } from '../../../Service/ConfigMast/user-cat.service'
import { UserMastService } from '../../../Service/ConfigMast/user-mast.service'
import { EncrDecrService } from '../../../Service/Common/encr-decr.service'
import { DeptMastService } from 'src/app/Service/Master/dept-mast.service';
import { ProcMastService } from 'src/app/Service/Master/proc-mast.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Emp {
  code: string;
  name: string;
}

@Component({
  selector: 'app-user-mast',
  templateUrl: './user-mast.component.html',
  styleUrls: ['./user-mast.component.css']
})
export class UserMastComponent implements OnInit {

  USERID: any = ''
  USER_FULLNAME: any = ''
  U_PASS: any = ''
  U_CAT: any = ''
  PNT: any = ''
  DEPT_CODE: any = ''
  PROC_CODE: any = ''

  catCtrl: FormControl;
  filteredCats: Observable<any[]>;

  deptCtrl: FormControl;
  filteredDepts: Observable<any[]>;

  procCtrl: FormControl;
  filteredProcs: Observable<any[]>;

  CatList: Emp[] = []
  DeptArr: Emp[] = []
  ProcArr: Emp[] = []

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private UserCatServ: UserCatService,
    private UserMastServ: UserMastService,
    private ProcMastServ: ProcMastService,
    private DeptMastServ: DeptMastService,
    private EncrDecrServ: EncrDecrService
  ) {
    this.procCtrl = new FormControl();
    this.deptCtrl = new FormControl();
    this.catCtrl = new FormControl();

    this.columnDefs = [
      {
        headerName: 'Action',
        cellStyle: { 'text-align': 'center' },
        cellRenderer: function (params) {
          return '<span class="det_val"><i class="icon-edit grid-icon" data-action-type="EditData" style="cursor: pointer;margin-right: 5px;" ></i>  <i class="icon-delete grid-icon" data-action-type="DeleteData" style="cursor: pointer;margin-left: 5px;"></i> </span>  ';
        },
        headerClass: "text-center",
        width: 82,
      },
      {
        headerName: 'UserId',
        field: 'USERID',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 110,
      },
      {
        headerName: 'Full Name',
        field: 'USER_FULLNAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 176,
      },
      {
        headerName: 'PNT',
        field: 'PNT',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 40,
      },
      {
        headerName: 'Department Code',
        field: 'DEPT_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 122,
      },
      {
        headerName: 'Process Code',
        field: 'PROC_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        width: 82,
      },
    ]

    this.defaultColDef = {
      resizable: true,
      sortable: true,
      filter: true,
      floatingFilter: true,
    }
  }

  ngOnInit(): void {

    this.UserCatServ.UserCatMastFill({}).subscribe((CatRes) => {
      try {
        if (CatRes.success == true) {
          this.CatList = CatRes.data.map((item) => {
            return { code: item.U_CAT, name: item.U_CATNAME }
          })
          this.filteredCats = this.catCtrl.valueChanges
            .pipe(
              startWith(''),
              map(cat => cat ? this.filterCats(cat) : this.CatList.slice(0, 10))
            );
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(CatRes.data),
          })
        }
      } catch (err) {
        this.toastr.error(err)
      }
    })

    this.DeptMastServ.DeptMastFill({}).subscribe((FRes) => {
      try {
        if (FRes.success == true) {
          this.DeptArr = FRes.data.map((item) => {
            return { code: item.DEPT_CODE, name: item.DEPT_NAME }
          })
          this.filteredDepts = this.deptCtrl.valueChanges
            .pipe(
              startWith(''),
              map(dept => dept ? this.filterDepts(dept) : this.DeptArr.slice(0, 10))
            );
        }
      } catch (error) {
      }
    })

  }

  fillPrc() {
    this.ProcMastServ.ProcMastFill({ DEPT_CODE: this.DEPT_CODE }).subscribe((FRes) => {
      try {
        if (FRes.success == true) {
          this.ProcArr = FRes.data.map((item) => {
            return { code: item.PROC_CODE, name: item.PROC_NAME }
          })
          this.filteredProcs = this.procCtrl.valueChanges
            .pipe(
              startWith(''),
              map(proc => proc ? this.filterProcs(proc) : this.ProcArr.slice(0, 10))
            );
        }
      } catch (error) {
      }
    })
  }
  filterCats(code: string) {
    return this.CatList.filter(cat =>
      cat.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
  filterDepts(code: string) {
    return this.DeptArr.filter(dept =>
      dept.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
  filterProcs(code: string) {
    return this.ProcArr.filter(proc =>
      proc.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
  Save() {

    if (this.USERID == '') {
      this.toastr.warning('Enter Id')
      return
    };
    if (this.U_PASS == '') {
      this.toastr.warning('Enter Password')
      return
    };
    if (this.U_CAT == '') {
      this.toastr.warning('Enter Catagory')
      return
    }
    if (this.DEPT_CODE == '') {
      this.toastr.warning('Enter Dept Code')
      return
    }
    if (this.PROC_CODE == '') {
      this.toastr.warning('Enter Proc Code')
      return
    }
    if (this.PNT == '') {
      this.toastr.warning('Enter PNT')
      return
    }

    let SaveObj = {
      USERID: this.USERID.trim(),
      USER_FULLNAME: this.USER_FULLNAME ? this.USER_FULLNAME : '',
      U_PASS: this.U_PASS,
      U_CAT: this.U_CAT ? this.U_CAT : '',
      PNT: this.PNT ? this.PNT : '',
      DEPT_CODE: this.DEPT_CODE ? this.DEPT_CODE : '',
      PROC_CODE: this.PROC_CODE ? this.PROC_CODE : '',

    }
    this.UserMastServ.UserMastSave(SaveObj).subscribe((SaveRes) => {
      try {
        if (SaveRes.success == true) {
          this.spinner.hide()
          this.toastr.success('save successfully')
          this.Clear()
          this.LoadGridData()
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

  Clear() {
    this.USERID = ''
    this.U_PASS = ''
    this.USER_FULLNAME = ''
    this.U_CAT = ''
    this.PNT = ''
    this.DEPT_CODE = ''
    this.PROC_CODE = ''
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData()
  }

  LoadGridData() {
    this.spinner.show()
    this.UserMastServ.UserMastFill({ USERID: '' }).subscribe((FillRes) => {

      try {
        if (FillRes.success == true) {
          this.spinner.hide()
          this.gridApi.setRowData(FillRes.data);
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
          title: "Are you sure you want to delete userID " + eve.data.USERID + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.UserMastServ.UserMastDelete({ USERID: eve.data.USERID }).subscribe((DelRes) => {
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
        this.USERID = eve.data.USERID
        this.U_PASS = this.EncrDecrServ.decryptPassword(eve.data.U_PASS)
        this.USER_FULLNAME = eve.data.USER_FULLNAME
        this.U_CAT = eve.data.U_CAT
        this.PNT = eve.data.PNT
        this.DEPT_CODE = eve.data.DEPT_CODE
        this.PROC_CODE = eve.data.PROC_CODE
      }

    }
  }
}
