import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { isEmpty, map, startWith } from 'rxjs/operators';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

import { PktRecService } from 'src/app/Service/Transaction/pkt-rec.service';
import { PktEntService } from 'src/app/Service/Transaction/pkt-ent.service';
import { PrcInwService } from '../../../Service/Transaction/prc-inw.service';
import { LotMastService } from 'src/app/Service/Master/lot-mast.service';
import { PrcRecIssueService } from 'src/app/Service/Transaction/prc-rec-issue.service';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EmpMastService } from 'src/app/Service/Master/emp-mast.service';
import * as $ from 'jquery';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { CommonService } from 'src/app/Service/Common/common.service';

export interface LOTInt {
  CODE: string;
  NAME: string;
  PNT: string;
  CARAT: string;
}

export interface Emp {
  code: string;
  name: string;
}

@Component({
  selector: 'app-pkt-rec',
  templateUrl: './pkt-rec.component.html',
  styleUrls: ['./pkt-rec.component.css']
})
export class PktRecComponent implements OnInit {
  @ViewChild("grid") myGrid: jqxGridComponent;
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  SRNO: any = ''
  TAG: any = ''
  STAG: any = ''
  INO: any = ''
  L_CODE: any = ''
  RCOMP: any = ''
  RUSER: any = ''
  DEPT_CODE: any = ''
  DETID: any = ''
  D_TYPE: any = ''
  TAB_NAME: any = ''
  FRM_NAME: any = ''
  DCOMP: any = ''
  DUSER: any = ''
  DREMARK: any = ''

  I_PCS: any = ''
  I_CARAT: any = ''
  I_EXTRA: any = ''
  I_LOSSPER: any = ''
  I_DATE: any = ''
  I_TIME: any = ''

  R_PCS: any = ''
  R_CARAT: any = ''
  R_EXTRA: any = ''
  R_LOSSPER: any = ''
  R_DATE: any = ''
  R_TIME: any = ''

  T_SECOND: any = ''
  F_SECOND: any = ''
  ConCArat: any = ''
  SRN: any = ''
  PTYPE: any = ''
  PNT: any = this.decodedTkn.PNT
  L_NAME: any = ''
  L_CARAT: any = ''
  BARCODE: boolean = false
  ISCFM: boolean = false
  DEL: boolean = false
  hide = true

  TPROC_CODE: any = ''
  PROC_CODE: any = ''
  PRC_TYP: any = ''

  //save declrations
  Urgent: any = ''
  FPROC_CODE: any = ''
  LPnt: any = ''
  IS_BRK: any = ''
  IS_FAN: any = ''
  E_CARAT: any = ''
  S_CARAT: any = ''
  E_PCS: any = ''
  S_PCS: any = ''
  SYN: any = ''
  INO_rec: any = ''
  RNO: any = ''
  ICOMP: any = ''
  IUSER: any = ''
  ConCarat: any = ''
  EMP_CODE: any = ''
  PEMP_CODE: any = ''
  KATI: any = ''
  ITYPE: any = ''
  ISLOSS: any = ''
  SHIF: any = ''
  ISOK: any = ''
  Password: any = ''

  katiCtrl: FormControl;
  filteredKatis: Observable<any[]>;
  EMPCODEArr: Emp[] = [];

  times = [];

  gridarry = []
  source: any = {}
  dataAdapter: any
  PASSWORD: any = ''
  GRIDCARAT: any = ''

  getWidth(): any {
    if (document.body.offsetWidth < 300) {
      return '90%';
    }

    return 300;
  }
  columns: any[] = []


  intialarr: {
    CARAT: 0, PTAG: "", DET: false
  }

  editable: boolean = true
  selectedTime: any = ''
  LOTs: LOTInt[] = [];
  RCVArr = []
  RCVINWDArr = []

  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  PASS: any = ''
  PER = []

  GRIDTOGGLE: boolean = false

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private PktRecServ: PktRecService,
    private PktEntServ: PktEntService,
    private datepipe: DatePipe,
    private PrcInwServ: PrcInwService,
    private LotMastServ: LotMastService,
    private PrcRecIssueServ: PrcRecIssueService,
    private EmpMastServ: EmpMastService,
    private _FrmOpePer: FrmOpePer,
    private elementRef: ElementRef,
    private CommonServ: CommonService
  ) {
    this.katiCtrl = new FormControl();
    this.EmpMastServ.EmpMastFill({ DEPT_CODE: 'POI', PROC_CODE: 17 }).subscribe((EFRes) => {
      try {
        if (EFRes.success == true) {
          this.EMPCODEArr = EFRes.data.filter(data => { return !data.L_DATE }).map(item => {
            return {
              code: item.EMP_CODE,
              name: item.EMP_NAME,
              DEPT_CODE: item.DEPT_CODE,
              L_DATE: item.L_DATE,
              PROC_CODE: item.PROC_CODE,
              GRD: item.GRD,
              GRP: item.GRP
            }
          });
          this.filteredKatis = this.katiCtrl.valueChanges
            .pipe(
              startWith(''),
              map(grp => grp ? this.filterKatis(grp) : this.EMPCODEArr)
            );
        } else {
          this.toastr.warning(EFRes.data)
        }
      } catch (err) {
        this.toastr.error(err)
      }
    })
    this.columns = [{
      text: 'Carat',
      datafield: 'CARAT',
      align: 'right',
      cellsalign: 'right',
      cellsformat: 'd',
      width: 70,
      editable: this.editable,
      columntype: 'numberinput',
      createeditor: function (row, cellvalue, editor) {
        editor.jqxNumberInput({ decimalDigits: 3, spinButtons: false });
      }
    },
    {
      text: 'Tag',
      datafield: 'PTAG',
      columntype: 'textbox',
      width: 80,
      editable: false
    },
    {
      text: 'Del',
      datafield: 'DEL',
      columntype: 'checkbox',
      width: 67,
      editable: this.editable
    },
    {
      text: 'DetId',
      datafield: 'DETID',
      columntype: 'number',
      width: 0,
      editable: false
    },
    {
      text: 'DelNo',
      datafield: 'DETNO',
      columntype: 'number',
      width: 0,
      editable: false
    },
    {
      text: 'Srn',
      datafield: 'SRN',
      columntype: 'number',
      width: 0,
      editable: false
    },
    {
      text: 'Emp',
      datafield: 'EMP_CODE',
      width: 0,
      editable: false
    }
    ];
  }

  async ngOnInit() {
    this.PER = await this._FrmOpePer.UserFrmOpePer(this.constructor.name)
    this.ALLOWDEL = this.PER[0].DEL
    this.ALLOWINS = this.PER[0].INS
    this.ALLOWUPD = this.PER[0].UPD
    this.PASS = this.PER[0].PASS

    this.times = [
      {
        name: 'day',
        id: 1
      },
      {
        name: 'night',
        id: 2
      },
    ];

    if (this.times) {
      this.dayNight(this.times[0]);
    }

    let time
    this.dayNight(time)

    this.LotMastServ.LotMastFill({}).subscribe((LFRes) => {
      try {
        if (LFRes.success == true) {
          this.LOTs = LFRes.data.map((item) => {
            return { CODE: item.L_CODE, NAME: item.L_NAME.toString(), CARAT: item.L_CARAT, PNT: item.PNT }
          })
        } else {
          this.toastr.warning(LFRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    this.PrcInwServ.InwPrcMastFill({ DEPT_CODE: 'POI', TYPE: 'RCV', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.RCVArr = PCRes.data.map((item) => {
            return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME }
          })
          if (this.RCVArr.length != 0 && this.RCVArr[0].PRC_CODE) {
            this.FPROC_CODE = this.RCVArr[0].PRC_CODE
          }
        } else {
          this.toastr.warning(PCRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    this.PrcInwServ.InwPrcMastFill({ DEPT_CODE: 'POI', TYPE: 'RCVINWD', IUSER: this.decodedTkn.UserId }).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.RCVINWDArr = PCRes.data.map((item) => {
            return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME }
          })
          if (this.RCVINWDArr.length != 0 && this.RCVINWDArr[0].PRC_CODE) {
            this.TPROC_CODE = this.RCVINWDArr[0].PRC_CODE
          }
        } else {
          this.toastr.warning(PCRes.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }
  myGridOnCellEndEdit(event: any): void {
    this.S_CARAT = 0
    this.S_PCS = 0
    let records = this.myGrid.getrows();
    for (let i = 0; i < records.length; i++) {
      if (records[i].S_CODE != 0) {
        this.S_CARAT = parseFloat(this.S_CARAT) + parseFloat(records[i].CARAT)
        this.S_PCS = this.S_PCS + 1;
      }
    }
    this.ConCArat = ((this.R_CARAT == 0 ? this.I_CARAT : this.R_CARAT) - this.R_EXTRA - this.S_CARAT).toFixed(3)
  };

  tagFillCheck() {
    let Obj = {
      L_CODE: this.L_CODE,
      SRNO: this.SRNO ? this.SRNO : '',
      TAG: this.TAG.trim() ? this.TAG.trim() : '',
      TPROC_CODE: this.FPROC_CODE ? this.FPROC_CODE : '',
      ISCFM: this.ISCFM == true ? true : false,
    }
    this.PktRecServ.FNPktRcvEntFill(Obj).then((Res) => {
      try {
        if (Res.success == true) {
          if (Res.data[''] == 'TRUE') {
            let Obj = {
              L_CODE: this.L_CODE,
              SRNO: this.SRNO ? this.SRNO : '',
              TAG: this.TAG.trim() ? this.TAG.trim() : '',
              TPROC_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
            }

            this.PktRecServ.PktRcvEntFill(Obj).subscribe((Res) => {
              try {
                if (Res.success == true) {
                  this.spinner.hide()
                  this.ConCArat = Res.data[0].Con_CARAT
                  this.I_PCS = Res.data[0].I_PCS
                  this.I_CARAT = Res.data[0].I_CARAT.toFixed(3)
                  this.I_EXTRA = Res.data[0].E_PCS == null ? 0 : Res.data[0].E_PCS
                  this.I_DATE = Res.data[0].I_DATE ? this.datepipe.transform(Res.data[0].I_DATE, 'yyyy-MM-dd') : this.datepipe.transform(new Date(), 'yyyy-MM-dd')
                  this.I_TIME = Res.data[0].I_TIME ? this.datepipe.transform(Res.data[0].I_TIME, 'hh:mm a', 'UTC+0') : this.datepipe.transform(new Date(), 'hh:mm a', 'UTC+0')
                  this.R_PCS = Res.data[0].R_PCS == 0 ? 1 : Res.data[0].R_PCS
                  this.R_CARAT = Res.data[0].R_CARAT == 0 ? Res.data[0].I_CARAT.toFixed(3) : parseFloat(Res.data[0].R_CARAT).toFixed(3)
                  this.R_EXTRA = Res.data[0].E_CARAT == null ? 0.000 : Res.data[0].E_CARAT.toFixed(3)
                  this.R_DATE = Res.data[0].R_DATE ? this.datepipe.transform(Res.data[0].R_DATE, 'yyyy-MM-dd') : this.datepipe.transform(new Date(), 'yyyy-MM-dd')
                  this.R_TIME = Res.data[0].R_TIME ? this.datepipe.transform(Res.data[0].R_TIME, 'hh:mm a', 'UTC+0') : this.datepipe.transform(new Date(), 'hh:mm a', 'UTC+0')
                  this.S_CARAT = Res.data[0].S_CARAT == null ? 0.000 : Res.data[0].S_CARAT.toFixed(3)
                  this.S_PCS = Res.data[0].S_PCS == null ? 0 : Res.data[0].S_PCS
                  this.I_LOSSPER = (this.I_CARAT - this.R_CARAT).toFixed(3)
                  this.ConCArat = ((Res.data[0].R_CARAT == 0 ? Res.data[0].I_CARAT : Res.data[0].R_CARAT) - Res.data[0].E_CARAT - Res.data[0].S_CARAT).toFixed(3)
                  this.R_LOSSPER = ((this.I_LOSSPER * 100) / this.I_CARAT).toFixed(2)
                  this.PktRecServ.PktRecSecFill({ L_CODE: this.L_CODE, SRNO: this.SRNO, TAG: this.TAG }).subscribe((Res) => {
                    try {
                      if (Res.success == true) {
                        if (Res.data.length > 0) {
                          this.gridarry = Res.data
                          this.source = {
                            localdata: this.gridarry,
                            datatype: 'array',
                            datafields:
                              [
                                { name: 'CARAT', type: 'float' },
                                { name: 'PTAG', type: 'string' },
                                { name: 'DEL', type: 'bool' },
                                { name: 'DETID', type: 'number' },
                                { name: 'DETNO', type: 'number' },
                                { name: 'SRN', type: 'number' },
                                { name: 'EMP_CODE', type: 'string' }
                              ],
                            updaterow: (rowid: any, rowdata: any, commit: any): void => {
                              commit(true);
                            }
                          };
                          this.dataAdapter = new jqx.dataAdapter(this.source);
                        } else {
                          this.myGrid.clear()
                          // let rowsCount = this.myGrid.getdatainformation().rowscount;
                          // this.myGrid.addrow(rowsCount, {
                          //   CARAT: 0,
                          //   PTAG: '',
                          //   DEL: false, DETID: 0, DETNO: 0, SRN: 0, EMP_CODE: ''
                          // }, "last");
                          // this.myGrid.hidecolumn("DETID");
                          // this.myGrid.hidecolumn("DETNO");
                          // this.myGrid.hidecolumn("SRN");
                          // this.myGrid.hidecolumn("EMP_CODE");
                        }


                        // if (this.GRIDTOGGLE == true) {
                        //   debugger
                        this.myGrid.hidecolumn("DETID");
                        this.myGrid.hidecolumn("DETNO");
                        this.myGrid.hidecolumn("SRN");
                        this.myGrid.hidecolumn("EMP_CODE");
                        // } else {
                        //   $('#save').focus()
                        // }
                        $('#carat').focus()
                      } else {
                        this.toastr.warning(Res.data)
                        $('#lcode').focus()
                      }
                    } catch (error) {
                      this.toastr.error(error)
                      $('#lcode').focus()
                    }
                  })
                } else {
                  this.spinner.hide()
                  this.toastr.warning(Res.data)
                  $('#lcode').focus()
                }
              } catch (error) {
                this.spinner.hide()
                $('#lcode').focus()
              }
            })
          } else {
            this.toastr.warning(Res.data[''])
            $('#lcode').focus()
          }
        } else {
          this.toastr.warning(Res.data)
          $('#lcode').focus()
        }
      } catch (error) {
        this.toastr.error(error)
        $('#lcode').focus()
      }
    })
  }

  async GetMaxPrnNo() {
    let MaxNo = ''
    let PrnNoObj = {
      DEPT_CODE: 'POI',
      PRC_CODE: this.TPROC_CODE,
      I_DATE: this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd'),
      ETYPE: 'I',
      PNT: this.PNT
    }
    await this.PktEntServ.PrnIssMaxNo(PrnNoObj).then((Res) => {
      try {
        if (Res.success == true) {
          MaxNo = Res.data[0].INO
        } else {
          this.toastr.warning(Res.data)
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
      DEPT_CODE: 'POI',
      PRC_CODE: this.TPROC_CODE,
      I_DATE: this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd'),
      ETYPE: 'I',
      INO: this.INO,
      PNT: this.PNT
    }
    this.PktEntServ.PrnIssSave(PrnSaveObj).subscribe((Res) => {
      try {
        if (Res.success == true) {
          this.PNT = ''
          this.CLEAR()
        } else {
          this.toastr.warning(Res.data)
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  async Save() {
    if (!this.ALLOWINS) {
      this.toastr.warning("Insert Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
    let time;
    this.dayNight(time)
    if (this.ConCArat <= 0) {
      this.toastr.warning("continue carat does not allowed zero")
      return
    }
    console.log((parseFloat(this.ConCArat) + parseFloat(this.S_CARAT) + parseFloat(this.R_EXTRA) + parseFloat(this.I_LOSSPER)).toFixed(3));

    if (this.I_CARAT != (parseFloat(this.ConCArat) + parseFloat(this.S_CARAT) + parseFloat(this.R_EXTRA) + parseFloat(this.I_LOSSPER)).toFixed(3)) {
      this.toastr.warning("Issue Carat Does not match with receive carat")
      return
    }
    if (this.KATI == "") {
      this.toastr.warning("Select kati first!!")
      return
    }
    if (!this.INO) {
      this.INO = await this.GetMaxPrnNo()
    }

    let griddata = this.myGrid.getrows();
    if (griddata.length == 0) {
      let SaveObj1 = {
        L_CODE: this.L_CODE ? this.L_CODE : '',
        SRNO: this.SRNO ? this.SRNO : '',
        TAG: this.TAG.trim() ? this.TAG.trim() : '',
        PNT: this.PNT ? this.PNT : '',
        FPROC_CODE: this.FPROC_CODE ? this.FPROC_CODE : '',
        TPROC_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
        R_CARAT: this.R_CARAT ? this.R_CARAT : '',
        R_PCS: this.R_PCS ? this.R_PCS : '',
        R_DATE: this.R_DATE ? this.datepipe.transform(this.R_DATE, 'yyyy-MM-dd') : '',
        R_TIME: this.R_TIME ? this.R_TIME : '',
        E_CARAT: this.R_EXTRA ? this.R_EXTRA : '',
        E_PCS: this.I_EXTRA ? this.I_EXTRA : '',
        L_CARAT: this.I_LOSSPER ? this.I_LOSSPER : '',
        S_CARAT: this.S_CARAT ? this.S_CARAT : '',
        S_PCS: this.S_PCS ? this.S_PCS : '',
        SYN: this.SYN ? this.SYN : '',
        RUSER: this.decodedTkn.UserId,
        INO: this.INO ? this.INO : '',
        RNO: this.ISCFM == true ? this.INO : 0,
        IUSER: this.decodedTkn.UserId,
        RCOMP: this.decodedTkn.UserId,
        ICOMP: this.decodedTkn.UserId,
        DEPT_CODE: this.DEPT_CODE ? this.DEPT_CODE : '',
        ITYPE: this.ITYPE ? this.ITYPE : '',
        ConCarat: this.ConCArat ? this.ConCArat : '',
        EMP_CODE: this.EMP_CODE ? this.EMP_CODE : '',
        PEMP_CODE: this.PEMP_CODE ? this.PEMP_CODE : '',
        KATI: this.KATI ? this.KATI : '',
        ISLOSS: this.ISLOSS ? this.ISLOSS : '',
        SHIF: this.SHIF ? this.SHIF : '',
        ISOK: this.ISOK ? this.ISOK : '',
        PRC_TYP: this.PRC_TYP ? this.PRC_TYP : '',
        ISCFM: this.ISCFM == true ? true : false,
      }
      this.PrcRecIssueServ.PrcRecIssueSave(SaveObj1).subscribe((Res) => {
        try {
          if (Res.success == true) {
            this.spinner.hide()
            this.toastr.success('Saved Successfully.')
            this.PrnIssSave()
            this.L_CODE = ''
            this.TAG = ''
            this.SRNO = 0
            this.L_NAME = ''
            this.L_CARAT = ''
            this.source = {
              localdata: [],
              datatype: 'array',
              datafields:
                [
                  { name: 'CARAT', type: 'float' },
                  { name: 'PTAG', type: 'string' },
                  { name: 'DEL', type: 'bool' },
                  { name: 'DETID', type: 'number' },
                  { name: 'DETNO', type: 'number' },
                  { name: 'SRN', type: 'number' },
                  { name: 'EMP_CODE', type: 'string' }
                ],
              updaterow: (rowid: any, rowdata: any, commit: any): void => {
                // synchronize with the server - send update command
                commit(true);
              }
            };
            this.dataAdapter = new jqx.dataAdapter(this.source);
            $('#lcode').focus()
          } else {
            this.spinner.hide()
            this.toastr.warning(Res.data)
          }
        } catch (error) {
          this.spinner.hide()
        }
      })
    } else {
      for (let i = 0; i < griddata.length; i++) {
        if (griddata[i].CARAT != 0) {

          let SaveObj = {
            L_CODE: this.L_CODE,
            SRNO: this.SRNO,
            TAG: this.TAG.trim(),
            STAG: griddata[i].PTAG,
            PNT: this.PNT,
            SRN: griddata[i].SRN,
            DETID: griddata[i].DETID,
            DETNO: griddata[i].DETNO,
            I_DATE: this.I_DATE ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd') : '',
            I_TIME: this.I_TIME ? this.I_TIME : '',
            I_PCS: this.I_PCS,
            I_CARAT: griddata[i].CARAT,
            IUSER: this.decodedTkn.UserId,
            ICOMP: this.decodedTkn.UserId,
            FPROC_CODE: 'OR',
            TPROC_CODE: 'OR',
            R_DATE: this.R_DATE ? this.datepipe.transform(this.R_DATE, 'yyyy-MM-dd') : this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
            R_TIME: this.R_TIME ? this.R_TIME : '',
            INO: this.INO,
            DEPT_CODE: "POI",
            DEL: griddata[i].DEL,
            PTYPE: '',
            KATI: this.KATI
          }
          await this.PktRecServ.PktRecSecSave(SaveObj).then((CRes) => {
            try {
              if (CRes.success == true) {
                this.spinner.hide()
                this.S_CARAT = 0
                this.S_PCS = 0
                let records = this.myGrid.getrows();
                for (let i = 0; i < records.length; i++) {
                  if (records[i].CARAT != 0) {
                    this.S_CARAT = parseFloat(this.S_CARAT) + parseFloat(records[i].CARAT);
                    this.S_PCS = this.S_PCS + 1;
                  }
                }
              } else {
                this.spinner.hide()
                this.toastr.warning(CRes.data)
              }
            } catch (error) {
              this.spinner.hide()
            }
          })
        }
      }
      let SaveObj1 = {
        L_CODE: this.L_CODE ? this.L_CODE : '',
        SRNO: this.SRNO ? this.SRNO : '',
        TAG: this.TAG.trim() ? this.TAG.trim() : '',
        PNT: this.PNT ? this.PNT : '',
        FPROC_CODE: this.FPROC_CODE ? this.FPROC_CODE : '',
        TPROC_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
        R_CARAT: this.R_CARAT ? this.R_CARAT : '',
        R_PCS: this.R_PCS ? this.R_PCS : '',
        R_DATE: this.R_DATE ? this.datepipe.transform(this.R_DATE, 'yyyy-MM-dd') : '',
        R_TIME: this.R_TIME ? this.R_TIME : '',
        E_CARAT: this.R_EXTRA ? this.R_EXTRA : '',
        E_PCS: this.I_EXTRA ? this.I_EXTRA : '',
        L_CARAT: this.I_LOSSPER ? this.I_LOSSPER : '',
        S_CARAT: this.S_CARAT ? this.S_CARAT : '',
        S_PCS: this.S_PCS ? this.S_PCS : '',
        SYN: this.SYN ? this.SYN : '',
        RUSER: this.decodedTkn.UserId,
        INO: this.INO ? this.INO : '',
        RNO: this.ISCFM == true ? this.INO : 0,
        IUSER: this.decodedTkn.UserId,
        RCOMP: this.decodedTkn.UserId,
        ICOMP: this.decodedTkn.UserId,
        DEPT_CODE: this.DEPT_CODE ? this.DEPT_CODE : '',
        ITYPE: this.ITYPE ? this.ITYPE : '',
        ConCarat: this.ConCArat ? this.ConCArat : '',
        EMP_CODE: this.EMP_CODE ? this.EMP_CODE : '',
        PEMP_CODE: this.PEMP_CODE ? this.PEMP_CODE : '',
        KATI: this.KATI ? this.KATI : '',
        ISLOSS: this.ISLOSS ? this.ISLOSS : '',
        SHIF: this.SHIF ? this.SHIF : '',
        ISOK: this.ISOK ? this.ISOK : '',
        PRC_TYP: this.PRC_TYP ? this.PRC_TYP : '',
        ISCFM: this.ISCFM ? this.ISCFM : '',
      }
      this.PrcRecIssueServ.PrcRecIssueSave(SaveObj1).subscribe((Res) => {
        try {
          if (Res.success == true) {
            this.spinner.hide()
            this.toastr.success('Saved Successfully.')
            this.PrnIssSave()
            this.L_CODE = ''
            this.TAG = ''
            this.SRNO = 0
            this.L_NAME = ''
            this.L_CARAT = ''

            this.source = {
              localdata: [],
              datatype: 'array',
              datafields:
                [
                  { name: 'CARAT', type: 'float' },
                  { name: 'PTAG', type: 'string' },
                  { name: 'DEL', type: 'bool' },
                  { name: 'DETID', type: 'number' },
                  { name: 'DETNO', type: 'number' },
                  { name: 'SRN', type: 'number' },
                  { name: 'EMP_CODE', type: 'string' }
                ],
              updaterow: (rowid: any, rowdata: any, commit: any): void => {
                // synchronize with the server - send update command
                commit(true);
              }
            };
            this.dataAdapter = new jqx.dataAdapter(this.source);
            $('#lcode').focus()
          } else {
            this.spinner.hide()
            this.toastr.warning(Res.data)
          }
        } catch (error) {
          this.spinner.hide()
        }
      })
    }


  }

  CLEAR() {
    this.L_CODE = ''
    this.L_NAME = ''
    this.PNT = ''
    this.L_CARAT = ''
    this.SRNO = 0
    this.TAG = ''
    this.INO = 0
    this.ISCFM = false
    this.I_CARAT = 0
    this.R_CARAT = 0
    this.I_EXTRA = 0
    this.R_EXTRA = 0
    this.R_PCS = 0
    this.I_PCS = 0
    this.I_LOSSPER = 0
    this.R_LOSSPER = 0
    this.I_DATE = null
    this.R_DATE = null
    this.I_TIME = null
    this.R_TIME = null
    this.S_CARAT = 0
    this.S_PCS = 0
    this.GRIDCARAT = ''
    this.ConCArat = 0
    this.source = {
      localdata: [],
      datatype: 'array',
      datafields:
        [
          { name: 'CARAT', type: 'float' },
          { name: 'PTAG', type: 'string' },
          { name: 'DEL', type: 'bool' },
          { name: 'DETID', type: 'number' },
          { name: 'DETNO', type: 'number' },
          { name: 'SRN', type: 'number' },
          { name: 'EMP_CODE', type: 'string' }
        ],
      updaterow: (rowid: any, rowdata: any, commit: any): void => {
        commit(true);
      }
    };
    this.dataAdapter = new jqx.dataAdapter(this.source);
    $('#pktreclcode').focus()
  }

  Delete() {
    if (this.PASSWORD != this.PASS) {
      this.toastr.warning("Password Not Set")
      return
    }
    if (!this.ALLOWDEL) {
      this.toastr.warning("Delete Permission was not set!!", "Constact Administrator!!!!!")
      return
    }
    let DelObj = {
      L_CODE: this.L_CODE ? this.L_CODE : '',
      SRNO: this.SRNO ? this.SRNO : '',
      TAG: this.TAG.trim() ? this.TAG.trim() : '',
      TPROC_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
    }

    let chk;

    this.PktRecServ.FNPktRecEntDelete(DelObj).then((DelRes) => {
      try {
        if (DelRes.success == true) {

          chk = DelRes.data['']

          if (chk == "TRUE") {
            let DelObj = {
              L_CODE: this.L_CODE ? this.L_CODE : '',
              SRNO: this.SRNO ? this.SRNO : '',
              TAG: this.TAG.trim() ? this.TAG.trim() : '',
              STAG: this.STAG ? this.STAG : '',
              TPROC_CODE: this.TPROC_CODE ? this.TPROC_CODE : '',
              RCOMP: this.RCOMP ? this.RCOMP : '',
              RUSER: this.RUSER ? this.RUSER : '',
            }

            this.PktRecServ.PktRecEntDelete(DelObj).subscribe((DelRes) => {
              try {
                if (DelRes.success == true) {

                  this.spinner.hide()
                  this.toastr.success('Delete successfully.')
                  this.CLEAR()
                } else {
                  this.spinner.hide()
                  this.toastr.warning('Something went to wrong while delete code.')
                }
              } catch (err) {
                this.spinner.hide()
                this.toastr.error(err)
              }
            })

            let DelSaveObj = {
              DEPT_CODE: this.DEPT_CODE ? this.DEPT_CODE : '',
              L_CODE: this.L_CODE ? this.L_CODE : '',
              SRNO: this.SRNO ? this.SRNO : '',
              TAG: this.TAG.trim() ? this.TAG.trim() : '',
              DETID: this.DETID ? this.DETID : '',
              PROC_CODE: this.PROC_CODE ? this.PROC_CODE : '',
              PCS: this.I_PCS ? this.I_PCS : '',
              CARAT: this.I_CARAT ? this.I_CARAT : '',
              D_TYPE: this.D_TYPE ? this.D_TYPE : '',
              TAB_NAME: this.TAB_NAME ? this.TAB_NAME : '',
              FRM_NAME: this.FRM_NAME ? this.FRM_NAME : '',
              DCOMP: this.DCOMP ? this.DCOMP : '',
              DUSER: this.DUSER ? this.DUSER : '',
              DREMARK: this.DREMARK ? this.DREMARK : '',
            }

            this.PktRecServ.PktTrnEntSaveDelete(DelSaveObj).subscribe((DelRes) => {
              try {
                if (DelRes.success == true) {

                  this.spinner.hide()
                } else {
                  this.spinner.hide()
                }
              } catch (err) {
                this.spinner.hide()
                this.toastr.error(err)
              }
            })
          } else {
            this.toastr.warning('Error')
          }
        } else {
          this.spinner.hide()
          this.toastr.warning(DelRes.data)
        }
      } catch (err) {
        this.spinner.hide()
        this.toastr.error(err)
      }
    })
  }

  CHANGERCARAT() {
    this.ConCArat = ((this.R_CARAT == 0 ? this.I_CARAT : this.R_CARAT) - this.R_EXTRA - this.S_CARAT).toFixed(3)
    this.I_LOSSPER = (this.I_CARAT - this.R_CARAT).toFixed(3)
    this.R_LOSSPER = ((this.I_LOSSPER * 100) / this.I_CARAT).toFixed(2)
  }

  // CHANGEECARAT() {
  //   this.ConCArat = ((this.R_CARAT == 0 ? this.I_CARAT : this.R_CARAT) - this.R_EXTRA - this.S_CARAT).toFixed(3)
  // }

  CHECKPASS() {
    if (this.PASSWORD == this.PASS) {
      this.editable = true
      if (this.FPROC_CODE == 'C' || this.FPROC_CODE == 'L') {
        this.GRIDTOGGLE = true
      } else {
        this.GRIDTOGGLE = false
      }
      // if (this.myGrid.getrows().find(e => e.CARAT == 0) == undefined) {
      //   let rowsCount = this.myGrid.getdatainformation().rowscount;
      //   // this.myGrid.addrow(rowsCount, {
      //   //   CARAT: 0,
      //   //   PTAG: '',
      //   //   DEL: false, DETID: 0, DETNO: 0, SRN: 0, EMP_CODE: ''
      //   // }, "last");
      //   this.myGrid.hidecolumn("DETID");
      //   this.myGrid.hidecolumn("DETNO");
      //   this.myGrid.hidecolumn("SRN");
      //   this.myGrid.hidecolumn("EMP_CODE");
      // } else if (this.myGrid.getrows().find(e => e.CARAT == 0) != undefined) {
      //   this.myGrid.deleterow(this.myGrid.getrows().length - 1)
      //   this.myGrid.hidecolumn("DETID");
      //   this.myGrid.hidecolumn("DETNO");
      //   this.myGrid.hidecolumn("SRN");
      //   this.myGrid.hidecolumn("EMP_CODE");
      // }
    }
    else {
      this.GRIDTOGGLE = false
    }
  }

  keypressLOT(eve: any, e: any) {
    if (e) {
      if (this.LOTs.filter(x => x.CODE == e).length != 0) {
        this.L_NAME = this.LOTs.filter(x => x.CODE == e)[0].NAME
        this.PNT = this.LOTs.filter(x => x.CODE == e)[0].PNT
        this.L_CARAT = this.LOTs.filter(x => x.CODE == e)[0].CARAT
      } else {
        this.PNT = ''
        this.L_NAME = ''
        this.L_CARAT = ''
      }
    } else {
      this.PNT = ''
      this.L_NAME = ''
      this.L_CARAT = ''
    }
  }


  dayNight(time) {
    let C_TIME = this.datepipe.transform(new Date(), 'HH:mm')
    if (C_TIME <= "20:00" && C_TIME >= "08:00") {
      this.selectedTime = this.times[0].id;
    } else {
      this.selectedTime = this.times[1].id;
    }
  }

  focusinnext(e: any) {
    if (e.keyCode == 13) {
      if (this.PASSWORD == "1") {
        this.myGrid.begincelledit(0, 'CARAT')
      } else {
        $('#save').focus()
      }
    }
  }

  nextenter(e: any, id: any) {
    if (e.keyCode == 13) {
      $('#' + id).focus()
    }
  }

  Barcode() {
    this.CommonServ.BarCode({
      IUSER: this.decodedTkn.UserId,
      TYPE: 'RCV'
    }).subscribe((Res) => {
      try {
        if (Res.success == true) {
          let text = ''
          for (var i = 0; i < Res.data.length; i++) {
            text = text + Res.data[i].BCODE + '\n';
          }
          if (Res.data.length != 0) {
            this.download("BARCODE.txt", text);
          } else {
            this.toastr.warning('No data')
          }

        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
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
  SETFLOAT(e: any, flonum: any) {
    return parseFloat(this[e]).toFixed(flonum)
  }
  ADDDATAGRID() {
    if (this.GRIDCARAT != '') {
      if (this.PASSWORD == this.PASS) {
        if (this.myGrid.getrows().find(e => e.CARAT == 0) == undefined) {
          this.editable = true
          let rowsCount = this.myGrid.getdatainformation().rowscount;
          this.myGrid.addrow(rowsCount, {
            CARAT: this.GRIDCARAT,
            PTAG: '',
            DEL: false, DETID: 0, DETNO: 0, SRN: 0, EMP_CODE: ''
          }, "last");
          this.myGrid.hidecolumn("DETID");
          this.myGrid.hidecolumn("DETNO");
          this.myGrid.hidecolumn("SRN");
          this.myGrid.hidecolumn("EMP_CODE");
          this.GRIDCARAT = ''
        } else {
          this.myGrid.clear()
          this.editable = true
          let rowsCount = this.myGrid.getdatainformation().rowscount;
          this.myGrid.addrow(rowsCount, {
            CARAT: this.GRIDCARAT,
            PTAG: '',
            DEL: false, DETID: 0, DETNO: 0, SRN: 0, EMP_CODE: ''
          }, "last");
          this.myGrid.hidecolumn("DETID");
          this.myGrid.hidecolumn("DETNO");
          this.myGrid.hidecolumn("SRN");
          this.myGrid.hidecolumn("EMP_CODE");
          this.GRIDCARAT = ''
        }
      }
    } else {
      $('#save').focus()
    }
  }
  filterKatis(code: string) {
    return this.EMPCODEArr.filter(grp =>
      grp.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }
}
