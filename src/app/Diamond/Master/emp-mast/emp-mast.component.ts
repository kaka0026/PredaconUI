import { PrcInwService } from 'src/app/Service/Transaction/prc-inw.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

import { DeptMastService } from '../../../Service/Master/dept-mast.service';
import { ProcMastService } from '../../../Service/Master/proc-mast.service';
import { EmpMastService } from '../../../Service/Master/emp-mast.service';
import { FrmOpePer } from './../../_helpers/frm-ope-per';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ListboxComponent } from '../../Common/listbox/listbox.component';
import { MatDialog } from '@angular/material/dialog';
import PerfectScrollbar from 'perfect-scrollbar';
import { UserMastService } from 'src/app/Service/ConfigMast/user-mast.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
declare let $: any;

export interface Emp {
  code: string;
  name: string;
}

@Component({
  selector: 'app-emp-mast',
  templateUrl: './emp-mast.component.html',
  styleUrls: ['./emp-mast.component.css']
})
export class EmpMastComponent implements OnInit {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  DEPT_CODE: any = ''
  PROC_CODE: any = ''
  PROC_NAME: any = ''
  EMP_CODE: any = ''
  EMP_NAME: any = ''
  GRP: any = ''
  PNT: any = ''
  GRD: any = ''
  CEMP_CODE: any = ''
  OEMP_CODE: any = ''
  M_CODE: any = ''
  SALARY: any = ''
  J_DATE: any = ''
  L_DATE: any = ''
  INNER_PRC: any = ''
  SFLG: any = ''
  ADD1: any = ''
  ADD2: any = ''
  ADD3: any = ''
  hide = true
  PASSWORD: any = ''
  OLD_PROC_CODE: any = ''
  ISUPD = false
  DASH = false
  OPKT: any = ''
  LPKT: any = ''

  deptCtrl: FormControl;
  filteredDepts: Observable<any[]>;
  DeptArr: Emp[] = [];

  procCtrl: FormControl;
  filteredProcs: Observable<any[]>;
  ProcArr: Emp[] = [];

  PRArr = []

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  EDITABLEGRID: boolean = false
  EDITABLEPROC: boolean = false
  PASS: any = ''
  PER = []

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private DeptMastServ: DeptMastService,
    private ProcMastServ: ProcMastService,
    private EmpMastServ: EmpMastService,
    private UserMastServ: UserMastService,
    private datepipe: DatePipe,
    private _FrmOpePer: FrmOpePer,
    private PrcInwServ: PrcInwService,
    public dialog: MatDialog,
    private elementRef: ElementRef
  ) {
    this.procCtrl = new FormControl();
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
              a = a + '<i class="icon-save grid-icon" data-action-type="SaveData" style="cursor: pointer;margin-right: 5px;" ></i>';
            }
            if (op.ALLOWDEL) {
              a = a + '<i class="icon-delete grid-icon" data-action-type="DeleteData" style="cursor: pointer;margin-left: 5px;"></i>';
            }
          }
          a = a + '</span>';
          return a;
        },
        headerClass: "text-center",
        editable: false,
        width: 60
      },
      {
        headerName: 'Dept',
        field: 'DEPT_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        hide: true,
        editable: function (params) {
          return op.EDITABLEPROC;
        },
        width: 60
      },
      {
        headerName: 'Proc',
        field: 'PROC_CODE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        hide: true,
        editable: function (params) {
          return op.EDITABLEPROC;
        },
        width: 45
      },
      {
        headerName: 'Emp',
        field: 'EMP_CODE',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 50
      },
      {
        headerName: 'Emp',
        field: 'EMP_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 130
      },
      {
        headerName: 'GRP',
        field: 'GRP',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 40
      },
      {
        headerName: 'PNT',
        field: 'PNT',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 40
      },
      {
        headerName: 'UserId',
        field: 'USERID',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 50
      },
      {
        headerName: 'GRD',
        field: 'GRD',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 40
      },
      {
        headerName: 'C.Emp',
        field: 'CEMP_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 70
      },
      {
        headerName: 'C.Emp',
        field: 'OEMP_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 70
      },
      {
        headerName: 'Manager',
        field: 'M_CODE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 60
      },
      {
        headerName: 'Salary',
        field: 'SALARY',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 60
      },
      {
        headerName: 'J Date',
        field: 'J_DATE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        // cellRenderer: this.DateFormat.bind(this),
        width: 75
      },
      {
        headerName: 'L Date',
        field: 'L_DATE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.DateFormat.bind(this),
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 75
      },
      {
        headerName: 'INNER PRC',
        field: 'INNER_PRC',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 90
      },
      {
        headerName: 'SFLG',
        field: 'SFLG',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 50
      },
      {
        headerName: 'ADD1',
        field: 'ADD1',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 60
      },
      {
        headerName: 'ADD2',
        field: 'ADD2',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 60
      },
      {
        headerName: 'ADD3',
        field: 'ADD3',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 60
      },
      {
        headerName: 'DASH',
        field: 'ISDASH',
        editable: function (params) {
          return op.EDITABLEGRID;
        },
        width: 28,
        cellRenderer: (params) => {
          if (op.PASS == op.PASSWORD) {
            if (params.data.ISDASH == true) {
              return '<input type="checkbox" data-action-type="IS_DASH" checked >';
            } else {
              return '<input type="checkbox" data-action-type="IS_DASH">';
            }
          } else {
            if (params.data.ISDASH == true) {
              return '<input type="checkbox" data-action-type="IS_DASH" checked disabled>';
            } else {
              return '<input type="checkbox" data-action-type="IS_DASH" disabled>';
            }
          }
        }
      },
      {
        headerName: 'OPKT',
        field: 'OPKT',
        cellStyle: { 'text-align': 'right' },
        headerClass: "text-center"
      },
      {
        headerName: 'LPKT',
        field: 'LPKT',
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
    this.spinner.hide()
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

    this.ProcFill()
  }

  ProcFill() {
    this.ProcMastServ.ProcMastFill({ DEPT_CODE: this.DEPT_CODE }).subscribe((FRes) => {
      try {
        if (FRes.success == true) {
          this.ProcArr = FRes.data.map((item) => {
            return { code: item.PROC_CODE, name: item.PROC_NAME }
          })

          this.filteredProcs = this.procCtrl.valueChanges
            .pipe(
              startWith(''),
              map(proc => proc ? this.filterProcs(proc) : this.ProcArr)
            );
        }
      } catch (error) {
      }
    })
  }

  GetPrcName() {
    if (this.PROC_CODE) {
      if (this.ProcArr.filter(prc => prc.code == this.PROC_CODE).length) {
        this.PROC_NAME = this.ProcArr.filter(prc => prc.code == this.PROC_CODE)[0].name
      } else {
        this.PROC_NAME = ''
      }
    } else {
      this.PROC_NAME = ''
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  Clear(e: any) {
    if (e == '1') {
      this.DEPT_CODE = ''
    }
    this.PROC_CODE = ''
    this.EMP_CODE = ''
    this.EMP_NAME = ''
    this.GRP = ''
    this.PNT = ''
    this.GRD = ''
    this.CEMP_CODE = ''
    this.M_CODE = ''
    this.SALARY = ''
    this.J_DATE = ''
    this.L_DATE = ''
    this.INNER_PRC = ''
    this.SFLG = ''
    if (e == '2') {
      this.gridApi.setRowData([]);
      this.ISUPD = false
    }
    this.OLD_PROC_CODE = ''
    this.OPKT = ''
    this.LPKT = ''
  }

  LoadGridData() {
    let FillObj = {
      DEPT_CODE: this.DEPT_CODE ? this.DEPT_CODE : '',
      PROC_CODE: this.PROC_CODE ? this.PROC_CODE : 0,
    }
    // this.spinner.show()
    this.EmpMastServ.EmpMastFill(FillObj).subscribe((FillRes) => {

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
          // this.gridApi.sizeColumnsToFit();
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
    if (this.PASSWORD == this.PASS) {
      let RowData = []
      this.gridApi.forEachNode(function (rowNode, index) {
        RowData.push(rowNode.data);
      });
      this.EDITABLEGRID = true
      this.gridApi.setRowData(RowData);
      this.CHANGECHECK()
    } else {
      let RowData = []
      this.gridApi.forEachNode(function (rowNode, index) {
        RowData.push(rowNode.data);
      });
      this.EDITABLEGRID = false
      this.gridApi.setRowData(RowData);
      this.CHANGECHECK()
    }

  }
  CHANGECHECK() {
    if (this.ISUPD == true && this.PASSWORD == this.PASS) {
      let RowData = []
      this.gridApi.forEachNode(function (rowNode, index) {
        RowData.push(rowNode.data);
      });
      this.EDITABLEPROC = true
      this.gridApi.setRowData(RowData);
      this.gridColumnApi.setColumnVisible('DEPT_CODE', true)
      this.gridColumnApi.setColumnVisible('PROC_CODE', true)
    } else {
      let RowData = []
      this.gridApi.forEachNode(function (rowNode, index) {
        RowData.push(rowNode.data);
      });
      this.EDITABLEPROC = false
      this.gridApi.setRowData(RowData);
      this.gridColumnApi.setColumnVisible('DEPT_CODE', false)
      this.gridColumnApi.setColumnVisible('PROC_CODE', false)
    }
  }
  onGridRowClicked(eve: any) {
    if (eve.event.target !== undefined) {
      let actionType = eve.event.target.getAttribute("data-action-type");
      if (actionType == 'IS_DASH') {
        let dataObj = eve.data;
        dataObj.ISDASH = !dataObj.ISDASH;
        eve.node.setData(dataObj)
        eve.api.refreshCells({ force: true })
      } else if (actionType == 'DeleteData') {
        Swal.fire({
          title: "Are you sure you want to delete employee code " + eve.data.EMP_CODE + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            // this.spinner.show()
            this.EmpMastServ.EmpMastDelete({ DEPT_CODE: eve.data.DEPT_CODE, PROC_CODE: eve.data.PROC_CODE, EMP_CODE: eve.data.EMP_CODE }).subscribe((DelRes) => {
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
      } else if (actionType == 'SaveData') {
        if (!this.ALLOWINS) {
          this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
          return
        }
        if (!eve.data.DEPT_CODE) {
          this.toastr.warning('Enter Department Code')
          return
        }
        if (!eve.data.PROC_CODE) {
          this.toastr.warning('Enter Process Code')
          return
        }
        if (eve.data.EMP_CODE.trim() == '') {
          this.toastr.warning('Enter Employee Code')
          return
        }
        if (eve.data.EMP_NAME.trim() == '') {
          this.toastr.warning('Enter Employee Name')
          return
        }
        if (!eve.data.PNT) {
          this.toastr.warning('Enter PNT')
          return
        }
        if (eve.data.GRP.trim() == '') {
          this.toastr.warning('Enter GRP')
          return
        }
        if (eve.data.J_DATE == '') {
          this.toastr.warning('Enter Date')
          return
        }

        let SaveObj = {
          DEPT_CODE: eve.data.DEPT_CODE ? eve.data.DEPT_CODE : '',
          PROC_CODE: eve.data.PROC_CODE ? eve.data.PROC_CODE : 0,
          EMP_CODE: eve.data.EMP_CODE ? eve.data.EMP_CODE : '',
          EMP_NAME: eve.data.EMP_NAME ? eve.data.EMP_NAME : '',
          GRP: eve.data.GRP ? eve.data.GRP : '',
          PNT: eve.data.PNT ? eve.data.PNT : 0,
          USERID: eve.data.USERID ? eve.data.USERID : '',
          GRD: eve.data.GRD ? eve.data.GRD : '',
          CEMP_CODE: eve.data.CEMP_CODE ? eve.data.CEMP_CODE : '',
          OEMP_CODE: eve.data.OEMP_CODE ? eve.data.OEMP_CODE : '',
          M_CODE: eve.data.M_CODE ? eve.data.M_CODE : '',
          SALARY: eve.data.SALARY ? eve.data.SALARY : 0,
          J_DATE: eve.data.J_DATE ? this.datepipe.transform(eve.data.J_DATE, 'yyyy-MM-dd') : '',
          L_DATE: eve.data.L_DATE ? this.datepipe.transform(eve.data.L_DATE, 'yyyy-MM-dd') : '',
          INNER_PRC: eve.data.INNER_PRC ? eve.data.INNER_PRC : '',
          SFLG: eve.data.SFLG ? eve.data.SFLG : '',
          ADD1: eve.data.ADD1 ? eve.data.ADD1 : '',
          ADD2: eve.data.ADD2 ? eve.data.ADD2 : '',
          ADD3: eve.data.ADD3 ? eve.data.ADD3 : '',
          ISDASH: eve.data.ISDASH == true ? true : false,
          OLD_PROC_CODE: eve.data.OLD_PROC_CODE ? eve.data.OLD_PROC_CODE : '',
          ISUPD: this.ISUPD == true ? true : false,
          OPKT: eve.data.OPKT ? eve.data.OPKT : 0,
          LPKT: eve.data.LPKT ? eve.data.LPKT : 0,
        }
        // this.spinner.show()
        this.EmpMastServ.EmpMastSave(SaveObj).subscribe((SaveRes) => {
          try {
            if (SaveRes.success == true) {
              this.spinner.hide()
              this.toastr.success('Save successfully.')
              if (eve.data.USERID) {
                let UserSaveObj = {
                  USERID: eve.data.USERID.trim(),
                  USER_FULLNAME: eve.data.EMP_NAME ? eve.data.EMP_NAME : '',
                  U_PASS: eve.data.USERID,
                  U_CAT: 'U',
                  PNT: eve.data.PNT ? eve.data.PNT : '',
                  DEPT_CODE: eve.data.DEPT_CODE ? eve.data.DEPT_CODE : '',
                  PROC_CODE: eve.data.PROC_CODE ? eve.data.PROC_CODE : '',
                }
                this.UserMastServ.UserMastSave(UserSaveObj).subscribe((UserSaveRes) => {
                  try {
                    if (UserSaveRes.success == true) {
                      this.spinner.hide()
                    } else {
                      this.spinner.hide()
                      Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: JSON.stringify(UserSaveRes.data),
                      })
                    }
                  } catch (err) {
                    this.spinner.hide()
                    this.toastr.error(err)
                  }
                })
              }




              this.LoadGridData()
              // this.Clear('1')
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

    }
  }

  DateFormat(params) {
    if (params.value) {

      //25/01/2022
      //01/25/2022
      return this.datepipe.transform(params.value, 'dd-MM-yyyy')
    } else {
      return ''
    }
  }

  OpenLotPopup(event: any) {
    this.PrcInwServ.InwPrcMastFill({ DEPT_CODE: 'POI', TYPE: 'INNER', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.PRArr = PCRes.data.map((item) => {
            return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME }
          })
          const PRF = this.dialog.open(ListboxComponent, { width: '80%', data: { arr: this.PRArr, CODE: this.INNER_PRC, TYPE: 'EMPMAST' } })
          $("#Close").click();
          PRF.afterClosed().subscribe(result => {
            this.INNER_PRC = result
          });

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(PCRes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    event.preventDefault();
  }
  Save() {
    let GridRowData = []
    let RapSaveArr = []
    this.gridApi.forEachNode(function (rowNode, index) {
      if (rowNode.data.PLANNNO != 0 && rowNode.data.PTAG != '' && rowNode.data.PRDCARAT != 0) {
        GridRowData.push(rowNode.data);
      }
    });
    for (let i = 0; i < GridRowData.length; i++) {
      let SaveObj = {
        USERID: GridRowData[i].USERID,
        USER_FULLNAME: GridRowData[i].EMP_NAME,
        U_PASS: GridRowData[i].USERID,
        PNT: GridRowData[i].PNT,
        DEPT_CODE: GridRowData[i].DEPT_CODE,
        PROC_CODE: GridRowData[i].PROC_CODE
      }
      RapSaveArr.push(SaveObj)
    }

    this.EmpMastServ.USERMASTSAVETEMP(RapSaveArr).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.spinner.hide()
          this.toastr.success('save successfully')
        } else {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(PCRes.data),
          })
        }
      } catch (err) {
        this.spinner.hide()
        this.toastr.error(err)
      }
    })
  }
  AddRow() {
    const newItems = [
      {
        DEPT_CODE: this.DEPT_CODE,
        PROC_CODE: this.PROC_CODE,
        EMP_CODE: '',
        EMP_NAME: '',
        GRP: '',
        PNT: '',
        USERID: '',
        GRD: '',
        CEMP_CODE: '',
        OEMP_CODE: '',
        M_CODE: '',
        SALARY: '',
        J_DATE: '',
        L_DATE: '',
        INNER_PRC: '',
        SFLG: '',
        ADD1: '',
        ADD2: '',
        ADD3: '',
        ISDASH: '',
        OPKT: '',
        LPKT: ''
      }
    ];
    let GridRowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      GridRowData.push(rowNode.data);
    });
    const res = this.gridApi.applyTransaction({
      add: newItems,
      addIndex: GridRowData.length + 1,
    });

  }
  filterDepts(code: string) {
    return this.DeptArr.filter(dept =>
      dept.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
  filterProcs(code: string) {
    return this.ProcArr.filter(proc =>
      proc.code.toString().indexOf(code) === 0);
  }
}
