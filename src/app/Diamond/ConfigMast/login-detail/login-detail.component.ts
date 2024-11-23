import { Component, OnInit, ElementRef } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DatePipe } from '@angular/common';

import { EncrDecrService } from 'src/app/Service/Common/encr-decr.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import PerfectScrollbar from 'perfect-scrollbar';

import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { UserMastService } from 'src/app/Service/ConfigMast/user-mast.service';
import { LoginDetailService } from 'src/app/Service/ConfigMast/login-detail.service';

export interface Dept {
  code: string;
  name: string;
}

export interface User {
  code: string;
  name: string;
}


@Component({
  selector: 'app-login-detail',
  templateUrl: './login-detail.component.html',
  styleUrls: ['./login-detail.component.css']
})
export class LoginDetailComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  decodedMast = JSON.parse(this.EncrDecrServ.get(localStorage.getItem("unfam1")));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  EMPDISABLE: boolean = false
  PASS: any = ''
  PER = []
  hide = true
  PASSWORD: any = ''

  deptCtrl: FormControl;
  filteredDepts: Observable<any[]>;
  depts: Dept[] = [];

  userCtrl: FormControl;
  filteredUsers: Observable<any[]>;
  users: User[] = [];

  DEPT_CODE: any = ''
  DEPT_NAME: any = ''
  U_CODE: any = ''
  U_NAME: any = ''
  RUN: any = ''

  constructor(
    private EncrDecrServ: EncrDecrService,
    private UserMastServ: UserMastService,
    private LoginDetailServ: LoginDetailService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef,
    private datepipe: DatePipe,
  ) {
    this.deptCtrl = new FormControl();
    this.userCtrl = new FormControl();

    this.columnDefs = [
      {
        headerName: 'User ID',
        field: 'USERID',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
      },
      {
        headerName: 'IP',
        field: 'IP',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center"
      },
      {
        headerName: 'Login Date',
        field: 'LOG_DATE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.DateFormat.bind(this),
      },
      {
        headerName: 'Logout Date',
        field: 'LOGOUT_DATE',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: this.DateFormat.bind(this),
      },
      {
        headerName: 'Running',
        field: 'RUN',
        cellStyle: { 'text-align': 'center' },
        headerClass: "text-center",
        cellRenderer: function (params) {
          if (params.data.RUN == true) {
            return '<input type="checkbox" checked data-action-type="RUNNING">';
          } else {
            return '<input type="checkbox">';
          }
        }
      }
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

    this.depts = this.decodedMast[10].map(item => {
      return { code: item.DEPT_CODE, name: item.DEPT_NAME };
    });
    this.filterarr('filteredDepts', 'deptCtrl', 'depts');


    this.UserMastServ.UserMastFill({ USERID: '' }).subscribe(UserRes => {
      try {
        if (UserRes.success == true) {

          this.users = UserRes.data.map(item => {
            return { code: item.USERID, name: item.USER_FULLNAME };
          });
          this.filterarr('filteredUsers', 'userCtrl', 'users');

        } else {
          this.spinner.hide();
          this.toastr.warning('Something gone wrong while get users');
        }
      } catch (error) {
        this.spinner.hide();
        this.toastr.error(error);
      }
    });

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.LoadGridData()
  }

  onGridRowClicked(eve: any) {
    if (eve.event.target !== undefined) {
      let actionType = eve.event.target.getAttribute('data-action-type');

      if (actionType == 'RUNNING') {
        this.LoginDetailServ.LoginDetailUpdate({ USERID: this.decodedTkn.UserId }).subscribe(LogDetRes => {
          try {
            if (LogDetRes.success == true) {
              this.spinner.hide();

            } else {
              this.spinner.hide();
              this.toastr.warning('Something gone wrong while editing running status.');
            }
          } catch (error) {
            this.spinner.hide();
            this.toastr.error(error);
          }
        });
      }
    }
  }

  LoadGridData() {
    this.spinner.show()
    this.LoginDetailServ.LoginDetailFill({ USERID: this.U_CODE, RUN: this.RUN }).subscribe(LogDetRes => {
      try {
        if (LogDetRes.success == true) {
          this.spinner.hide();
          this.gridApi.setRowData(LogDetRes.data);

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
          this.spinner.hide();
          this.toastr.warning('Something gone wrong while getting login deatils.');
        }
      } catch (error) {
        this.spinner.hide();
        this.toastr.error(error);
      }
    });
  }

  getDeptName() {
    if (this.DEPT_CODE) {
      if (this.depts.filter(option => option.code == this.DEPT_CODE).length != 0) {
        this.DEPT_NAME = this.depts.filter(option => option.code == this.DEPT_CODE)[0].name
      } else {
        this.DEPT_NAME = ''
      }
    } else {
      this.DEPT_NAME = ''
    }
  }

  getUserName() {
    if (this.U_CODE) {
      if (this.users.filter(option => option.code == this.U_CODE).length != 0) {
        this.U_NAME = this.users.filter(option => option.code == this.U_CODE)[0].name
      } else {
        this.U_NAME = ''
      }
    } else {
      this.U_NAME = ''
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

  filterarr(filteredarray: any, controlname: any, arrayname: any) {
    this[filteredarray] = this[controlname].valueChanges
      .pipe(
        startWith(''),
        map(grp => grp ? this.FinalFileterByChange(grp, arrayname) : this[arrayname])
      );
  }

  FinalFileterByChange(code: any, arrayname: any) {
    return this[arrayname].filter(grp =>
      grp.code.toString().indexOf(code) === 0);
  }

  CHANGEPASSWORD() {
    let RowData = []
    this.gridApi.forEachNode(function (rowNode, index) {
      RowData.push(rowNode.data);
    });
    this.gridApi.setRowData(RowData);
  }

}
