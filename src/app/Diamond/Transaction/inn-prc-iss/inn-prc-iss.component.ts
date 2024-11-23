import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { DatePipe } from '@angular/common';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";
import { InnPrcIssService } from '../../../Service/Transaction/inn-prc-iss.service'
import { PrcInwService } from 'src/app/Service/Transaction/prc-inw.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PktEntService } from 'src/app/Service/Transaction/pkt-ent.service';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';
import * as $ from 'jquery';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import PerfectScrollbar from 'perfect-scrollbar';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Emp {
  code: string;
  name: string;
}

@Component({
  selector: 'app-inn-prc-iss',
  templateUrl: './inn-prc-iss.component.html',
  styleUrls: ['./inn-prc-iss.component.css']
})
export class InnPrcIssComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  @ViewChild("lcode", { static: true }) LCODE: any;

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public pinnedBottomRowData;
  public frameworkComponents;

  ISSArr = []
  ISSINWDArr = []
  times = []

  S_DATE: any = new Date()
  I_DATE: any = new Date()
  INO: any = ''
  TENTION: any = ''
  TEN_CODE: any = ''
  TPROC_CODE: any = ''
  DEPT_CODE: any = ''
  PRC_CODE: any = ''
  PROC_CODE: any = ''
  PRC_TYP: any = ''
  innPrcIssTime: any = ''
  EMP_CODE: any = ''
  M_CODE: any = ''
  L_CODE: any = ''
  SRNO: any = '';
  TAG: any = ''
  EMPNAME: any = ''
  M_NAME: any = ''

  empCtrl: FormControl;
  filteredEmps: Observable<any[]>;
  EMPCODEArr: Emp[] = [];

  mCtrl: FormControl;
  filteredMs: Observable<any[]>;
  MANAGERArr: Emp[] = [];

  tenCtrl: FormControl;
  filteredTens: Observable<any[]>;
  TENTIONArr: Emp[] = [];

  ISUPDATE: boolean = false
  ISROLLING: boolean = false
  showEMP: boolean = false
  showTNSN: boolean = false

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private InnPrcIssServ: InnPrcIssService,
    private PrcInwServ: PrcInwService,
    private PktEntServ: PktEntService,
    private ViewParaMastServ: ViewParaMastService,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef
  ) {
    this.tenCtrl = new FormControl();
    this.empCtrl = new FormControl();
    this.mCtrl = new FormControl();

    let FillObj = {
      DEPT_CODE: '',
      PRC_CODE: '',
      M_CODE: '',
      EMP_CODE: '',
      S_DATE: null,
      S_CODE: '',
      TYPE: 'TEN',
      IUSER: this.decodedTkn.UserId
    }

    this.InnPrcIssServ.InnPrcISSCmbFill(FillObj).then((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.TENTIONArr = PCRes.data.map((item) => {
            return { code: item.TEN_CODE, name: item.TEN_NAME }
          })
          this.filterarr('filteredTens', 'tenCtrl', 'TENTIONArr');
        } else {
          this.toastr.warning(PCRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    this.times = [
      {
        name: 'day',
        id: 'D'
      },
      {
        name: 'night',
        id: 'N'
      },
    ];

    if (this.times) {
      this.dayNightinnerprc(this.times[0]);
    }
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'FrmInnerPrcIss' }).subscribe((VPRes) => {


      try {
        if (VPRes.success == 1) {
          let temp = []

          for (let i = 0; i < VPRes.data.length; i++) {
            if (VPRes.data[i].FIELDNAME == "I_DATE") {
              temp.push({
                headerName: VPRes.data[i].DISPNAME,
                headerClass: VPRes.data[i].HEADERALIGN,
                field: VPRes.data[i].FIELDNAME,
                width: VPRes.data[i].COLWIDTH,
                cellStyle: { 'text-align': VPRes.data[i].CELLALIGN },
                resizable: VPRes.data[i].ISRESIZE,
                hide: VPRes.data[i].DISP == false ? true : false,
                cellRenderer: this.IDateConv.bind(this)
              })
            } else {
              temp.push({
                headerName: VPRes.data[i].DISPNAME,
                headerClass: VPRes.data[i].HEADERALIGN,
                field: VPRes.data[i].FIELDNAME,
                width: VPRes.data[i].COLWIDTH,
                cellStyle: { 'text-align': VPRes.data[i].CELLALIGN },
                resizable: VPRes.data[i].ISRESIZE,
                hide: VPRes.data[i].DISP == false ? true : false
              })
            }
            if (VPRes.data[i].FORMAT == 'TimeFormat') {
              temp[i].cellRenderer = this.TimeFormat.bind(this)
              delete temp[i].valueFormatter
            }
          }
          this.columnDefs = temp
        } else {
          this.toastr.error(VPRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    this.defaultColDef = {
      resizable: true,
      sortable: true
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
  ITimeConv(params) {

    if (params.value) {
      return this.datepipe.transform(params.value, 'hh:mm a', 'UTC+0')
    } else {
      return ''
    }
  }
  IDateConv(params) {
    if (params.value) {
      return this.datepipe.transform(params.value, 'dd/MM/yyyy', 'UTC+0')
    } else {
      return ''
    }
  }
  async ngOnInit() {
    this.PER = await this._FrmOpePer.UserFrmOpePer(this.constructor.name)
    this.ALLOWDEL = this.PER[0].DEL
    this.ALLOWINS = this.PER[0].INS
    this.ALLOWUPD = this.PER[0].UPD
    this.PASS = this.PER[0].PASS

    await this.PrcInwServ.PoolInnPrcISSCmbFill({ DEPT_CODE: 'POI', TYPE: 'INNER', IUSER: this.decodedTkn.UserId }).then((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.ISSArr = PCRes.data.map((item) => {
            return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME }
          })
          if (this.ISSArr.length != 0 && this.ISSArr[0].PRC_CODE) {
            this.TPROC_CODE = this.ISSArr[0].PRC_CODE
            this.FillSubPrc()
            this.CMBHideShow
          }
        } else {
          this.toastr.error(PCRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })

    await this.FillManager()
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  LoadGridData() {
    this.spinner.show()
    let Obj = {
      DEPT_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
      PRC_CODE: this.PRC_TYP ? this.PRC_TYP : '',
      I_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
      INO: this.INO ? this.INO : 0,
    }

    this.InnPrcIssServ.InnPrcIssFill(Obj).subscribe((FillRes) => {
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
          this.pinnedBottomRowData = this.FooterCal(FillRes.data.length);
        } else {
          this.spinner.hide()
          this.toastr.error(FillRes.data)
        }
      } catch (error) {
        this.spinner.hide()
        this.toastr.error(error)
      }
    })
  }

  FillSubPrc() {
    this.spinner.show()
    this.PRC_TYP = ''
    this.PrcInwServ.InwPrcMastFill({ SDEPT_CODE: this.TPROC_CODE, DEPT_CODE: 'POI', TYPE: 'INNPRC', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {

        if (PCRes.success == true) {
          this.ISSINWDArr = PCRes.data.map((item) => {
            return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME }
          })
          if (this.ISSINWDArr.length != 0 && this.ISSINWDArr[0].PRC_CODE) {
            this.PRC_TYP = this.ISSINWDArr[0].PRC_CODE
            this.CMBHideShow()
          }
        } else {
          this.toastr.error(PCRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  dayNightinnerprc(time) {
    let C_TIME = this.datepipe.transform(new Date(), 'HH:mm')
    if (C_TIME <= "20:00") {
      this.innPrcIssTime = this.times[0].id;
    } else {
      this.innPrcIssTime = this.times[1].id;
    }
  }

  CMBHideShow() {
    if (this.PRC_TYP == 'M' || this.PRC_TYP == 'F' || this.PRC_TYP == 'UP') {
      this.showEMP = false
    } else {
      this.showEMP = true
    }

    if (this.PRC_TYP == 'CH') {
      this.showTNSN = true
    } else {
      this.showTNSN = false
    }
  }

  GETEMPNAME() {
    if (this.EMP_CODE) {
      if (this.EMPCODEArr.filter(option => option.code.toLocaleLowerCase().includes(this.EMP_CODE.toLowerCase())).length != 0) {
        this.EMPNAME = this.EMPCODEArr.filter(option => option.code.toLocaleLowerCase().includes(this.EMP_CODE.toLowerCase()))[0].name
      } else {
        this.EMPNAME = ''
      }
    } else {
      this.EMPNAME = ''
    }
  }

  GETMANEGERNAME() {
    if (this.M_CODE) {
      if (this.MANAGERArr.filter(option => option.code.toLocaleLowerCase().includes(this.M_CODE.toLowerCase())).length != 0) {
        this.M_NAME = this.MANAGERArr.filter(option => option.code.toLocaleLowerCase().includes(this.M_CODE.toLowerCase()))[0].name
      } else {
        this.M_NAME = ''
      }
    } else {
      this.M_NAME = ''
    }
  }
  FillEmployee() {

    let FillObj = {
      DEPT_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
      PRC_CODE: this.PRC_TYP ? this.PRC_TYP : '',
      M_CODE: this.M_CODE ? this.M_CODE : '',
      EMP_CODE: this.EMP_CODE ? this.EMP_CODE : '',
      S_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
      S_CODE: this.innPrcIssTime ? this.innPrcIssTime : '',
      TYPE: 'EMP',
      IUSER: this.decodedTkn.UserId
    }
    this.InnPrcIssServ.InnPrcISSCmbFill(FillObj).then((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.EMPCODEArr = PCRes.data.map((item) => {
            return { code: item.EMP_CODE, name: item.EMP_NAME }
          })
          this.filterarr('filteredEmps', 'empCtrl', 'EMPCODEArr');
        } else {
          this.toastr.error(PCRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }
  async FillManager() {

    let FillObj = {
      DEPT_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
      PRC_CODE: this.PRC_TYP ? this.PRC_TYP : '',
      M_CODE: this.M_CODE ? this.M_CODE : '',
      EMP_CODE: this.EMP_CODE ? this.EMP_CODE : '',
      S_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
      S_CODE: this.innPrcIssTime ? this.innPrcIssTime : '',
      TYPE: 'MAN',
      IUSER: this.decodedTkn.UserId
    }

    await this.InnPrcIssServ.InnPrcISSCmbFill(FillObj).then((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.MANAGERArr = PCRes.data.map((item) => {
            return { code: item.EMP_CODE, name: item.EMP_NAME }
          })
          this.filterarr('filteredMs', 'mCtrl', 'MANAGERArr');
        } else {
          this.toastr.error(PCRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  clear() {
    this.M_CODE = ""
    this.M_NAME = ""
    this.EMP_CODE = ""
    this.EMPNAME = ""
    this.TENTION = ''
    this.INO = 0
    this.L_CODE = ''
    this.SRNO = 0
    this.TAG = ''
    this.gridApi.setRowData([]);
  }

  async IssSave() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }

    if (!this.INO) {
      this.INO = await this.GetMaxPrnNo()
    }

    if (!this.L_CODE) {
      this.toastr.warning("lot is required")
      return
    } else if (!this.SRNO) {
      this.toastr.warning("SRNO is required")
      return
    } else if (!this.TAG.trim()) {
      this.toastr.warning("TAG is required")
      return
    } else if (!this.I_DATE) {
      this.toastr.warning("date is required")
      return
    } else if (this.showEMP) {
      if (!this.EMP_CODE) {
        this.toastr.warning("Employee is required")
        return
      }
    } else if (!this.M_CODE) {
      this.toastr.warning("manager is required")
      return
    }

    let FillObj = {
      DEPT_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
      L_CODE: this.L_CODE,
      SRNO: this.SRNO,
      TAG: this.TAG.trim(),
      EMP_CODE: this.EMP_CODE,
      M_CODE: this.M_CODE,
      PRC_CODE: this.PRC_TYP ? this.PRC_TYP : '',
      IsUpdate: this.ISUPDATE,
      Urgent: this.ISROLLING,
      IS_TRF: false,
      SHIFT: this.innPrcIssTime,
      I_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
      FRM_NAME: 'InnPrcIssComponent'
    }
    this.InnPrcIssServ.InnPrcIssSaveCheck(FillObj).then((PCRes) => {
      try {
        if (PCRes.data[''] == 'TRUE') {
          let Obj = {
            DEPT_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
            L_CODE: this.L_CODE,
            SRNO: this.SRNO,
            TAG: this.TAG.trim(),
          }
          this.InnPrcIssServ.InnPrcIssCarat(Obj).then((Res) => {
            try {
              if (Res.data[''] != 0) {
                let Obj1 = {
                  DEPT_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
                  L_CODE: this.L_CODE,
                  SRNO: this.SRNO,
                  TAG: this.TAG.trim(),
                  PRC_CODE: this.PRC_TYP ? this.PRC_TYP : '',
                  I_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
                  INO: this.INO ? this.INO : 0,
                  IUSER: this.decodedTkn.UserId,
                  ICOMP: this.decodedTkn.UserId,
                  EMP_CODE: this.EMP_CODE,
                  M_CODE: this.M_CODE,
                  OEMP_CODE: '',
                  I_CARAT: Res.data[''],
                  ISUPDATE: this.ISUPDATE,
                  IS_TRF: false,
                  IS_ABS: false,
                  SHIFT: this.innPrcIssTime,
                  TEN_CODE: 0
                }
                this.InnPrcIssServ.InnPrcIssSave(Obj1).subscribe((Res1) => {
                  try {

                    if (Res1.success == 1) {
                      this.PrnIssSave()
                      this.L_CODE = ''
                      this.SRNO = 0
                      this.TAG = ''
                      // this.toastr.success("Saved Successfully..")
                      this.LCODE.nativeElement.focus()
                      const newItems = [
                        {
                          L_CODE: Res1.data[0].L_CODE,
                          SRNO: Res1.data[0].SRNO,
                          TAG: Res1.data[0].TAG,
                          DETID: Res1.data[0].DETID,
                          DETNO: Res1.data[0].DETNO,
                          M_CODE: Res1.data[0].M_CODE,
                          EMP_CODE: Res1.data[0].EMP_CODE,
                          PRC_CODE: Res1.data[0].PRC_CODE,
                          I_DATE: Res1.data[0].I_DATE,
                          I_TIME: Res1.data[0].I_TIME,
                          I_PCS: Res1.data[0].I_PCS,
                          I_CARAT: Res1.data[0].I_CARAT,
                          INO: Res1.data[0].INO,
                          PRC_TYP: Res1.data[0].PRC_TYP,
                          PEMP_CODE: Res1.data[0].PEMP_CODE,
                          OEMP_CODE: Res1.data[0].OEMP_CODE
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

                      this.pinnedBottomRowData = this.FooterCal(GridRowData.length + 1);
                    } else {
                      this.toastr.error("Something Went Wrong..")
                    }
                  } catch (error) {
                    this.toastr.error(error)
                  }
                })
              } else {
                this.toastr.error('Carat is zero(0).')
              }
            } catch (error) {
              this.toastr.error(error)
            }
          })
        } else {
          this.toastr.error(PCRes.data[''])
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }
  async GetMaxPrnNo() {
    let MaxNo = ''
    let PrnNoObj = {
      DEPT_CODE: this.TPROC_CODE,
      PRC_CODE: this.PRC_TYP,
      I_DATE: this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd'),
      ETYPE: 'I',
      PNT: 0
    }
    await this.PktEntServ.PrnIssMaxNo(PrnNoObj).then((Res) => {
      try {
        if (Res.success == true) {
          MaxNo = Res.data[0].INO
        } else {
          this.toastr.error(Res.data)
          MaxNo = ''
        }
      } catch (error) {
        this.toastr.warning(error)
        MaxNo = ''
      }
    })
    return MaxNo
  }
  PrnIssSave() {
    let PrnSaveObj = {
      DEPT_CODE: this.TPROC_CODE,
      PRC_CODE: this.PRC_TYP,
      I_DATE: this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd'),
      ETYPE: 'I',
      INO: this.INO ? this.INO : 0,
      PNT: 0
    }
    this.PktEntServ.PrnIssSave(PrnSaveObj).subscribe((Res) => {
      try {
        if (Res.success == true) {

        } else {
          this.toastr.error(Res.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }
  FooterCal(e: any) {
    var result = [];
    result.push({
      L_CODE: e,
      SRNO: '',
      TAG: '',
      DETID: '',
      DETNO: '',
      PRC_CODE: '',
      M_CODE: '',
      EMP_CODE: '',
      I_DATE: '',
      I_TIME: '',
      I_PCS: '',
      I_CARAT: '',
      INO: 0,
      PRC_TYP: '',
      PEMP_CODE: '',
      OEMP_CODE: ''
    })
    return result
  }
  TimeFormat(params) {
    if (params.value) {
      return this.datepipe.transform(params.value, 'HH:mm a', 'UTC+0')
    } else {
      return ''
    }
  }
  download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  PRINT() {
    this.InnPrcIssServ.InnerPrcIssPrintDet({
      DEPT_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
      PRC_CODE: this.PRC_TYP ? this.PRC_TYP : '',
      I_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
      INO: this.INO ? this.INO : 0,
      IUSER: this.decodedTkn.UserId
    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          if (Res.data.length != 0) {
            let TOTALWEG = 0
            let TOTALPCS = 0
            let text = 'Process Issue Detail(E' + this.ISSArr.filter(x => x.PRC_CODE == this.TPROC_CODE)[0].PRC_NAME + 'F)\n'
            text = text + '(' + this.datepipe.transform(Date(), 'dd/MM-hh:mm a') + ')\n'
            text = text + 'Inward No : E' + this.INO + 'F\n'
            text = text + 'Process : E' + this.ISSINWDArr.filter(x => x.PRC_CODE == this.PRC_TYP)[0].PRC_NAME + 'F\n'
            text = text + '=================================\n'
            text = text + 'LotNo  Srno   Emp   Pcs   Carat\n'
            text = text + '=================================\n'
            for (var i = 0; i < Res.data.length; i++) {
              let srno = Res.data[i].SRNO + '-' + Res.data[i].TAG
              text = text + Res.data[i].L_CODE + this.GETSPACE(9, Res.data[i].L_CODE.toString().length)
              text = text + srno + this.GETSPACE(6, srno.toString().length)
              text = text + 'E' + Res.data[i].EMP_CODE + 'F' + this.GETSPACE(6, Res.data[i].EMP_CODE.toString().length)
              text = text + Res.data[i].I_PCS + this.GETSPACE(5, Res.data[i].I_PCS.toString().length)
              text = text + Res.data[i].I_CARAT + this.GETSPACE(5, Res.data[i].I_CARAT.toString().length) + '\n';
              TOTALWEG = TOTALWEG + Res.data[i].I_CARAT
              TOTALPCS = TOTALPCS + Res.data[i].I_PCS
            }
            text = text + '=================================\n'
            text = text + 'ETotal :           E   ' + TOTALPCS + this.GETSPACE(2, TOTALPCS.toString().length) + 'E  ' + TOTALWEG + ' F\n'
            text = text + '=================================\n'
            text = text + 'User :' + this.decodedTkn.UserId + '\n\n'
            text = text + 'Signature: _____________\n'
            this.download("PRNISSDET.txt", text);
          } else {
            this.toastr.warning('No data')
          }
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  SUMMARY() {
    this.InnPrcIssServ.InnerPrcIssPrint({
      DEPT_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
      PRC_CODE: this.PRC_TYP ? this.PRC_TYP : '',
      I_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
      INO: this.INO ? this.INO : 0,
      IUSER: this.decodedTkn.UserId
    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          if (Res.data.length != 0) {
            let TOTALWEG = 0
            let TOTALPCS = 0
            let text = 'Process Issue Detail(E' + this.ISSArr.filter(x => x.PRC_CODE == this.TPROC_CODE)[0].PRC_NAME + 'F)\n'
            text = text + '(' + this.datepipe.transform(Date(), 'dd/MM-hh:mm a') + ')\n'
            text = text + 'Inward No : E' + this.INO + 'F\n'
            text = text + 'Process : E' + this.ISSINWDArr.filter(x => x.PRC_CODE == this.PRC_TYP)[0].PRC_NAME + 'F\n'
            text = text + '==============================\n'
            text = text + 'Lot No    Emp   Pcs  Carat\n'
            text = text + '==============================\n'
            for (var i = 0; i < Res.data.length; i++) {
              text = text + Res.data[i].L_CODE + this.GETSPACE(10, Res.data[i].L_CODE.toString().length)
              text = text + 'E' + Res.data[i].EMP + 'F' + this.GETSPACE(8, Res.data[i].EMP.toString().length)
              text = text + Res.data[i].IPCS + this.GETSPACE(4, Res.data[i].IPCS.toString().length)
              text = text + Res.data[i].ICRT + this.GETSPACE(5, Res.data[i].ICRT.toString().length) + '\n';
              TOTALWEG = TOTALWEG + Res.data[i].ICRT
              TOTALPCS = TOTALPCS + Res.data[i].IPCS
            }
            text = text + '==============================\n'
            text = text + 'ETotal :        E  ' + TOTALPCS + this.GETSPACE(2, TOTALPCS.toString().length) + 'E  ' + TOTALWEG + ' F\n'
            text = text + '==============================\n'
            text = text + 'User :' + this.decodedTkn.UserId + '\n\n'
            text = text + 'Signature: _____________\n'
            this.download("PRNISSSUMMURY.txt", text);
          } else {
            this.toastr.warning('No data')
          }
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  GETSPACE(totspace: any, itemspace: any) {
    let SPACE = ''
    for (let l = 0; l < totspace - itemspace; l++) {
      SPACE = SPACE + ' '
    }
    return SPACE
  }

  SETFLOAT(e: any, flonum: any) {
    return parseFloat(this[e]).toFixed(flonum)
  }
}
