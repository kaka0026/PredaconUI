import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

import { ShftTrnMastService } from 'src/app/Service/Master/shft-trn-mast.service';
import { DatePipe } from '@angular/common';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Emp {
  code: string;
  name: string;
}

@Component({
  selector: 'app-shft-trn-mast',
  templateUrl: './shft-trn-mast.component.html',
  styleUrls: ['./shft-trn-mast.component.css']
})

export class ShftTrnMastComponent implements OnInit {

  @ViewChild("grid") myGrid: jqxGridComponent;
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  gridarry = []
  source: any = {}
  dataAdapter: any
  hide = true
  getWidth(): any {
    if (document.body.offsetWidth < 800) {
      return '90%';
    }

    return '99%';
  }
  columns: any[] = []

  PRCNAME: any = ''
  DEPT_CODE: any = ''
  S_CODE: any = ''
  S_NAME: any = ''
  S_DATE: any = new Date()
  MC_CODE: any = ''
  PRC_CODE: any = ''
  EMP_CODE: any = ''

  EMPARR = []

  deptCtrl: FormControl;
  filteredDepts: Observable<any[]>;
  DEPT_CODEArr: Emp[] = [];

  prcCtrl: FormControl;
  filteredPrcs: Observable<any[]>;
  PROCESSArr: Emp[] = [];

  sftCtrl: FormControl;
  filteredSfts: Observable<any[]>;
  SHIFTArr: Emp[] = [];

  editable: boolean = false
  PASSWORD: any = ''

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private ShftTrnMastServ: ShftTrnMastService,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef
  ) {
    this.sftCtrl = new FormControl();
    this.prcCtrl = new FormControl();
    this.deptCtrl = new FormControl();

    this.ShftTrnMastServ.ShiftTrnInsert({ S_DATE: this.S_DATE }).then((Res) => {
      try {
        if (Res.success == true) {

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(Res.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    let l = this
    this.columns = [{
      text: 'Machine code',
      datafield: 'MC_CODE',
      width: 100,
      columntype: 'string',
      editable: false,
    },
    {
      text: 'Machine Name',
      datafield: 'MC_NAME',
      columntype: 'string',
      width: 250,
      editable: false,
    },
    {
      text: 'Emp Code',
      datafield: 'EMP_CODE',
      width: 250,
      columntype: 'dropdownlist',
      createeditor: function (row, cellvalue, editor) {
        editor.jqxDropDownList({ displayMember: 'EMP_CODE', valueMember: 'EMP_CODE', source: l.EMPARR });
      }
    },
    {
      text: 'Emp Name',
      datafield: 'EMP_NAME',
      columntype: 'string',
      width: 250,
      editable: false,
    },
    {
      text: 'Process',
      datafield: 'PRC_CODE',
      columntype: 'string',
      width: 100,
      editable: false,
    }
    ];
  }
  async myGridOnCellEndEdit(event: any) {
    let emp = event.args.value
    if (event.args.datafield == "EMP_CODE") {
      if (this.EMPARR.filter(x => x.EMP_CODE == emp).length == 0) {
        event.args.row.EMP_NAME = ''
      } else {
        event.args.row.EMP_NAME = this.EMPARR.filter(x => x.EMP_CODE == emp)[0].EMP_NAME
      }
      if (!emp) {
        return
      }
      let ShiftTrnSaveChk = await this.ShiftTrnSaveChk(event.args.row, emp)
      if (ShiftTrnSaveChk == 'TRUE') {
        this.SAVE(event.args.row, emp)
      } else {
        this.toastr.warning(ShiftTrnSaveChk)
        this.FillData()
      }
    }
  };
  async ngOnInit() {
    this.PER = await this._FrmOpePer.UserFrmOpePer(this.constructor.name)
    this.ALLOWDEL = this.PER[0].DEL
    this.ALLOWINS = this.PER[0].INS
    this.ALLOWUPD = this.PER[0].UPD
    this.PASS = this.PER[0].PASS

    this.ShftTrnMastServ.ShiftTrnCmbFill({ TYPE: 'SHIFT' }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          this.SHIFTArr = Res.data.map((item) => {
            return { code: item.S_CODE, name: item.S_NAME }
          })
          this.filteredSfts = this.sftCtrl.valueChanges
            .pipe(
              startWith(''),
              map(grp => grp ? this.filterSfts(grp) : this.SHIFTArr)
            );
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...ngoninit',
            text: JSON.stringify(Res.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    this.ShftTrnMastServ.ShiftTrnCmbFill({ TYPE: 'DEPT' }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          this.DEPT_CODEArr = Res.data.map((item) => {
            return { code: item.DEPT_CODE, name: item.DEPT_NAME }
          })
          this.filteredDepts = this.deptCtrl.valueChanges
            .pipe(
              startWith(''),
              map(grp => grp ? this.filterDepts(grp) : this.DEPT_CODEArr)
            );
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...ngoninit',
            text: JSON.stringify(Res.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

  }

  Clear() {
    this.DEPT_CODE = ''
    this.S_CODE = ''
    this.PRC_CODE = ''
    this.S_DATE = ''
    this.S_NAME = ''

    this.myGrid.clear()
  }

  async ShiftTrnSaveChk(e: any, emp: any) {

    let Chk;
    if (!this.S_CODE) {
      Chk = 'Scode is required'
      return Chk
    } else if (!this.DEPT_CODE) {
      Chk = 'department is required'
      return Chk
    } else if (!this.S_DATE) {
      Chk = 'date is required'
      return Chk
    } else if (!this.PRC_CODE) {
      Chk = 'process is required'
      return Chk
    } else if (!emp) {
      Chk = 'employee is required'
      return Chk
    }
    let ChkObj = {
      DEPT_CODE: this.DEPT_CODE.trim(),
      S_DATE: this.S_DATE ? this.datepipe.transform(this.S_DATE, 'yyyy-MM-dd') : '',
      EMP_CODE: emp,
      S_CODE: this.S_CODE,
      MC_CODE: e.MC_CODE.trim(),
    }

    await this.ShftTrnMastServ.ShiftTrnSaveChk(ChkObj).then((CRes) => {

      try {
        if (CRes.success == true) {
          Chk = CRes.data['']
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(CRes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    return Chk
  }
  async SAVE(e: any, emp: any) {
    if (!this.ALLOWUPD) {
      this.toastr.warning("Update Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
    if (this.PASS != this.PASSWORD) {
      this.toastr.warning("Password Not Match")
      return
    }
    if (!this.S_CODE) {
      this.toastr.warning('Scode is required')
      return
    } else if (!this.DEPT_CODE) {
      this.toastr.warning('department is required')
      return
    } else if (!this.S_DATE) {
      this.toastr.warning('date is required')
      return
    } else if (!this.PRC_CODE) {
      this.toastr.warning('process is required')
      return
    } else if (!emp) {
      this.toastr.warning('employee is required')
      return
    }
    let SaveObj = {
      DEPT_CODE: this.DEPT_CODE.trim(),
      S_DATE: this.S_DATE ? this.datepipe.transform(this.S_DATE, 'yyyy-MM-dd') : '',
      S_CODE: this.S_CODE,
      MC_CODE: e.MC_CODE,
      PRC_CODE: this.PRC_CODE,
      EMP_CODE: emp
    }
    this.spinner.show()
    this.ShftTrnMastServ.ShiftTrnSave(SaveObj).subscribe((SaveRes) => {
      try {
        if (SaveRes.success == true) {
          this.spinner.hide()
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

  prcFill() {

    this.ShftTrnMastServ.ShiftTrnCmbFill({ DEPT_CODE: this.DEPT_CODE, TYPE: 'PROCESS' }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          this.PROCESSArr = Res.data.map((item) => {
            return { code: item.PRC_CODE, name: item.PRC_NAME }
          })
          this.filteredPrcs = this.prcCtrl.valueChanges
            .pipe(
              startWith(''),
              map(grp => grp ? this.filterPrcs(grp) : this.PROCESSArr)
            );
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...ngoninit',
            text: JSON.stringify(Res.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }
  filterDepts(code: string) {
    return this.DEPT_CODEArr.filter(grp =>
      grp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
  filterSfts(code: string) {
    return this.SHIFTArr.filter(grp =>
      grp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
  filterPrcs(code: string) {
    return this.PROCESSArr.filter(grp =>
      grp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }

  GETPRCNAME() {
    if (this.PRC_CODE) {
      if (this.PROCESSArr.filter(option => option.code.toLocaleLowerCase().includes(this.PRC_CODE.toLowerCase())).length != 0) {
        this.PRCNAME = this.PROCESSArr.filter(option => option.code.toLocaleLowerCase().includes(this.PRC_CODE.toLowerCase()))[0].name
      } else {
        this.PRCNAME = ''
      }
    } else {
      this.PRCNAME = ''
    }
  }

  FillData() {
    this.myGrid.clear()

    this.ShftTrnMastServ.ShiftTrnEmpFill({ DEPT_CODE: this.DEPT_CODE, PRC_CODE: this.PRC_CODE }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          this.EMPARR = Res.data
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(Res.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    this.ShftTrnMastServ.ShiftTrnFill({
      DEPT_CODE: this.DEPT_CODE,
      S_CODE: this.S_CODE,
      S_DATE: this.S_DATE,
      PRC_CODE: this.PRC_CODE
    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          this.gridarry = Res.data.map((item) => {
            return {
              MC_CODE: item.MC_CODE,
              MC_NAME: item.MC_NAME,
              EMP_CODE: item.EMP_CODE,
              EMP_NAME: this.EMPARR.filter(x => x.EMP_CODE == item.EMP_CODE).length == 0 ? '' : this.EMPARR.filter(x => x.EMP_CODE == item.EMP_CODE)[0].EMP_NAME,
              PRC_CODE: item.PRC_CODE
            }
          })
          this.source = {
            localdata: this.gridarry,
            datatype: 'array',
            datafields:
              [
                { name: 'MC_CODE', type: 'string' },
                { name: 'MC_NAME', type: 'string' },
                { name: 'EMP_CODE', type: 'string' },
                { name: 'EMP_NAME', type: 'string' },
                { name: 'PRC_CODE', type: 'string' },
              ],
            updaterow: (rowid: any, rowdata: any, commit: any): void => {
              commit(true);
            }
          };
          this.dataAdapter = new jqx.dataAdapter(this.source);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(Res.data),
          })
        }
      } catch (error) {
        this.toastr.warning(error)
      }
    })

  }
  PASSWORDCHANGE() {
    if (this.PASS == this.PASSWORD) {
      if (this.ALLOWUPD == true) {
        this.editable = true
      }
      else {
        this.editable = false
      }
    } else {
      this.editable = false
    }
  }
}
