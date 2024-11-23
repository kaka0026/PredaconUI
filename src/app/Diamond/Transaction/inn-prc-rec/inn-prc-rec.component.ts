import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { PrcInwService } from 'src/app/Service/Transaction/prc-inw.service';
import { PktRecService } from 'src/app/Service/Transaction/pkt-rec.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { InnPrcRecService } from 'src/app/Service/Transaction/inn-prc-rec.service';
import { LotMastService } from 'src/app/Service/Master/lot-mast.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { EmpMastService } from 'src/app/Service/Master/emp-mast.service';
import * as $ from 'jquery';
import { FrmOpePer } from '../../_helpers/frm-ope-per';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PktEntService } from 'src/app/Service/Transaction/pkt-ent.service';

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
  selector: 'app-inn-prc-rec',
  templateUrl: './inn-prc-rec.component.html',
  styleUrls: ['./inn-prc-rec.component.css'],
})
export class InnPrcRecComponent implements OnInit {
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
  PRArr = [];

  gridarry = []
  source: any = {}
  dataAdapter: any
  PASSWORD: any = ''
  GRIDCARAT: any = ''
  GRIDTOGGLE: boolean = false;

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

  constructor(
    private PrcInwServ: PrcInwService,
    private InnPrcRecServ: InnPrcRecService,
    private PktRecServ: PktRecService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private LotMastServ: LotMastService,
    private EmpMastServ: EmpMastService,
    private _FrmOpePer: FrmOpePer,
    private PktEntServ: PktEntService
  ) {
    this.katiCtrl = new FormControl();
    this.EmpMastServ.EmpMastFill({ DEPT_CODE: 'POI', PROC_CODE: 17 }).subscribe(
      (EFRes) => {
        try {
          if (EFRes.success == true) {
            this.EMPCODEArr = EFRes.data
              .filter((data) => {
                return !data.L_DATE;
              })
              .map((item) => {
                return {
                  code: item.EMP_CODE,
                  value: item.EMP_NAME,
                  DEPT_CODE: item.DEPT_CODE,
                  L_DATE: item.L_DATE,
                  PROC_CODE: item.PROC_CODE,
                  GRD: item.GRD,
                  GRP: item.GRP,
                };
              });
            this.filterarr('filteredKatis', 'katiCtrl', 'EMPCODEArr');
          } else {
            this.toastr.warning(EFRes.data)
          }
        } catch (err) {
          this.toastr.error(err);
        }
      }
    );
    this.columns = [
      {
        text: 'Carat',
        datafield: 'CARAT',
        align: 'right',
        cellsalign: 'right',
        cellsformat: 'd',
        width: 70,
        columntype: 'numberinput',
        validation: (cell: any, value: number): any => {
          if (value < 0 || value > 15) {
            return {
              result: false,
              message: 'Price should be in the 0-15 interval',
            };
          }
          return true;
        },
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
        width: 67
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
      },
    ];
  }


  async ngOnInit() {
    this.PER = await this._FrmOpePer.UserFrmOpePer(this.constructor.name);
    this.ALLOWDEL = this.PER[0].DEL;
    this.ALLOWINS = this.PER[0].INS;
    this.ALLOWUPD = this.PER[0].UPD;
    this.PASS = this.PER[0].PASS;

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

    this.PrcInwServ.InwPrcMastFill({
      DEPT_CODE: 'POI',
      TYPE: 'INNER',
      IUSER: this.decodedTkn.UserId,
    }).subscribe((PCRes) => {
      try {
        if (PCRes.success == true) {
          this.PRArr = PCRes.data.map((item) => {
            return { PRC_CODE: item.PRC_CODE, PRC_NAME: item.PRC_NAME };
          });
          if (this.PRArr.length != 0 && this.PRArr[0].PRC_CODE) {
            this.TPROC_CODE = this.PRArr[0].PRC_CODE;
          }
        } else {
          this.toastr.warning(PCRes.data)
        }
      } catch (error) {
        this.toastr.error(error);
      }
    });
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
    this.InnPrcRecServ.InnPrcRecSaveCheck({
      DEPT_CODE: this.TPROC_CODE,
      L_CODE: this.L_CODE,
      SRNO: this.SRNO,
      TAG: this.TAG,
    }).then((Res1) => {
      try {
        if (Res1.data[''] == 'TRUE') {
          // this.TAG = Char.ConvertFromUtf32(64 + Convert.ToInt32(Conversion.Val(pStr)));
          this.InnPrcRecServ.InnerPrcRecEntFill({
            DEPT_CODE: this.TPROC_CODE,
            L_CODE: this.L_CODE,
            SRNO: this.SRNO,
            TAG: this.TAG,
          }).subscribe((PCRes) => {
            try {
              if (PCRes.success == true) {
                this.I_PCS = PCRes.data[0].I_PCS;
                this.I_CARAT = PCRes.data[0].I_CARAT.toFixed(3);
                this.I_EXTRA =
                  PCRes.data[0].E_PCS == null ? 0 : PCRes.data[0].E_PCS;
                this.I_LOSSPER = PCRes.data[0].L_CARAT.toFixed(3);
                this.I_DATE = PCRes.data[0].I_DATE
                  ? this.datepipe.transform(PCRes.data[0].I_DATE, 'yyyy-MM-dd')
                  : this.datepipe.transform(new Date(), 'yyyy-MM-dd');
                this.I_TIME = PCRes.data[0].I_TIME
                  ? this.datepipe.transform(PCRes.data[0].I_TIME, 'hh:mm a', 'UTC+0')
                  : this.datepipe.transform(new Date(), 'hh:mm a', 'UTC+0');
                this.R_PCS = PCRes.data[0].R_PCS == 0 ? 1 : PCRes.data[0].R_PCS;
                this.R_CARAT =
                  PCRes.data[0].R_CARAT == 0
                    ? PCRes.data[0].I_CARAT.toFixed(3)
                    : PCRes.data[0].R_CARAT.toFixed(3);
                this.R_EXTRA =
                  PCRes.data[0].E_CARAT == null
                    ? 0.0
                    : PCRes.data[0].E_CARAT.toFixed(3);
                this.R_DATE = PCRes.data[0].R_DATE
                  ? this.datepipe.transform(PCRes.data[0].R_DATE, 'yyyy-MM-dd')
                  : this.datepipe.transform(new Date(), 'yyyy-MM-dd');
                this.R_TIME = PCRes.data[0].R_TIME
                  ? this.datepipe.transform(PCRes.data[0].R_TIME, 'hh:mm a', 'UTC+0')
                  : this.datepipe.transform(new Date(), 'hh:mm a', 'UTC+0');
                this.S_CARAT =
                  PCRes.data[0].S_CARAT == null
                    ? 0.0
                    : PCRes.data[0].S_CARAT.toFixed(3);
                this.S_PCS =
                  PCRes.data[0].S_PCS == null ? 0 : PCRes.data[0].S_PCS;
                this.PktRecServ.PktRecSecFill({
                  L_CODE: this.L_CODE,
                  SRNO: this.SRNO,
                  TAG: this.TAG,
                }).subscribe((Res) => {
                  try {
                    if (Res.success == true) {
                      this.gridarry = Res.data;
                      this.source = {
                        localdata: this.gridarry,
                        datatype: 'array',
                        datafields: [
                          { name: 'CARAT', type: 'float' },
                          { name: 'PTAG', type: 'string' },
                          { name: 'DEL', type: 'bool' },
                          { name: 'DETID', type: 'number' },
                          { name: 'DETNO', type: 'number' },
                          { name: 'SRN', type: 'number' },
                          { name: 'EMP_CODE', type: 'string' },
                        ],
                        updaterow: (
                          rowid: any,
                          rowdata: any,
                          commit: any
                        ): void => {
                          commit(true);
                        },
                      };
                      this.dataAdapter = new jqx.dataAdapter(this.source);

                      this.myGrid.hidecolumn('DETID');
                      this.myGrid.hidecolumn('DETNO');
                      this.myGrid.hidecolumn('SRN');
                      this.myGrid.hidecolumn('EMP_CODE');

                      this.ConCArat = (
                        (PCRes.data[0].R_CARAT == 0
                          ? PCRes.data[0].I_CARAT
                          : PCRes.data[0].R_CARAT) -
                        PCRes.data[0].E_CARAT -
                        PCRes.data[0].S_CARAT
                      ).toFixed(3);
                      this.R_LOSSPER = (
                        (PCRes.data[0].L_CARAT * 100) /
                        PCRes.data[0].I_CARAT
                      ).toFixed(2);
                      $('#inncarat').focus();
                    } else {
                      this.toastr.warning(Res.data)
                      $('#innerlcode').focus()
                    }
                  } catch (error) {
                    this.toastr.error(error);
                    $('#innerlcode').focus()
                  }
                });
              } else {
                this.toastr.warning(PCRes.data)
                $('#innerlcode').focus()
              }
            } catch (error) {
              this.toastr.error(error);
              $('#innerlcode').focus()
            }
          });
        } else {
          this.toastr.warning(Res1.data[''])
          $('#innerlcode').focus()
        }
      } catch (error) {
        this.toastr.error(error);
        $('#innerlcode').focus()
      }
    });
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
      this.toastr.warning(
        'Insert Permission was not set!!',
        'Constact Administrator!!!!!'
      );
      return;
    }
    let time;
    this.dayNight(time)
    if (this.ConCArat <= 0) {
      this.toastr.warning("continue carat does not allowed zero")
      return
    }
    debugger
    if (parseFloat(this.I_CARAT).toFixed(3) != (parseFloat(this.ConCArat) + parseFloat(this.S_CARAT) + parseFloat(this.R_EXTRA) + parseFloat(this.I_LOSSPER)).toFixed(3)) {
      this.toastr.warning('Issue Carat Does not match with receive carat');
      return;
    }
    if (this.KATI == '') {
      this.toastr.warning('Select kati first!!');
      return;
    }
    if (!this.INO) {
      this.INO = await this.GetMaxPrnNo()
    }
    let griddata = this.myGrid.getrows();
    if (griddata.length == 0) {
      let SaveObj1 = {
        L_CODE: this.L_CODE,
        SRNO: this.SRNO,
        TAG: this.TAG.trim(),
        R_CARAT: this.R_CARAT,
        R_PCS: this.R_PCS,
        R_DATE: this.R_DATE
          ? this.datepipe.transform(this.R_DATE, 'yyyy-MM-dd')
          : this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
        R_TIME: this.R_TIME ? this.R_TIME : '',
        E_CARAT: this.R_EXTRA,
        E_PCS: this.I_EXTRA,
        L_CARAT: this.I_LOSSPER,
        S_CARAT: this.S_CARAT,
        S_PCS: this.S_PCS,
        RUSER: this.decodedTkn.UserId,
        RCOMP: this.decodedTkn.UserId,
        DEPT_CODE: this.TPROC_CODE,
        KATI: this.KATI,
      };
      this.InnPrcRecServ.PrcInwSave(SaveObj1).subscribe((Res) => {
        try {
          if (Res.success == true) {
            this.spinner.hide();
            $('#innerlcode').focus()
            this.toastr.success('Saved Successfully.')
            setTimeout(() => {
              this.CLEAR();
            }, 1000);
          } else {
            this.spinner.hide();
            this.toastr.warning(Res.data)
          }
        } catch (error) {
          this.spinner.hide();
        }
      });
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
            I_DATE: this.I_DATE
              ? this.datepipe.transform(this.I_DATE, 'yyyy-MM-dd')
              : '',
            I_TIME: this.I_TIME ? this.I_TIME : '',
            I_PCS: this.I_PCS,
            I_CARAT: griddata[i].CARAT,
            IUSER: this.decodedTkn.UserId,
            ICOMP: this.decodedTkn.UserId,
            FPROC_CODE: 'OR',
            TPROC_CODE: 'OR',
            R_DATE: this.R_DATE
              ? this.datepipe.transform(this.R_DATE, 'yyyy-MM-dd')
              : this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
            R_TIME: this.R_TIME ? this.R_TIME : '',
            INO: '0',
            DEPT_CODE: 'POI',
            DEL: griddata[i].DEL,
            PTYPE: 'L',
            KATI: this.KATI,
          };
          this.PktRecServ.PktRecSecForkSave(SaveObj).subscribe((CRes) => {
            try {
              if (CRes.success == true) {
                this.spinner.hide();
                this.S_CARAT = 0;
                this.S_PCS = 0;
                let records = this.myGrid.getrows();
                for (let i = 0; i < records.length; i++) {
                  if (records[i].CARAT != 0) {
                    this.S_CARAT =
                      parseFloat(this.S_CARAT) + parseFloat(records[i].CARAT);
                    this.S_PCS = this.S_PCS + 1;
                  }
                }
                let SaveObj1 = {
                  L_CODE: this.L_CODE,
                  SRNO: this.SRNO,
                  TAG: this.TAG.trim(),
                  R_CARAT: this.R_CARAT,
                  R_PCS: this.R_PCS,
                  R_DATE: this.R_DATE
                    ? this.datepipe.transform(this.R_DATE, 'yyyy-MM-dd')
                    : this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
                  R_TIME: this.R_TIME ? this.R_TIME : '',
                  E_CARAT: this.R_EXTRA,
                  E_PCS: this.I_EXTRA,
                  L_CARAT: this.I_LOSSPER,
                  S_CARAT: this.S_CARAT,
                  S_PCS: this.S_PCS,
                  RUSER: this.decodedTkn.UserId,
                  RCOMP: this.decodedTkn.UserId,
                  DEPT_CODE: this.TPROC_CODE,
                  KATI: this.KATI,
                };
                this.InnPrcRecServ.PrcInwSave(SaveObj1).subscribe((Res) => {
                  try {
                    if (Res.success == true) {
                      this.spinner.hide();
                      this.toastr.success('Saved Successfully.');
                      $('#innerlcode').focus()
                      setTimeout(() => {
                        this.CLEAR();
                      }, 1000);
                    } else {
                      this.spinner.hide();
                      this.toastr.warning(Res.data)
                    }
                  } catch (error) {
                    this.spinner.hide();
                  }
                });
              } else {
                this.spinner.hide();
                this.toastr.warning(CRes.data)
              }
            } catch (error) {
              this.spinner.hide();
            }
          });
        }
      }
    }
  }
  keypressLOT(eve: any, e: any) {
    if (e) {
      if (this.LOTs.filter((x) => x.CODE == e).length != 0) {
        this.L_NAME = this.LOTs.filter((x) => x.CODE == e)[0].NAME;
        this.PNT = this.LOTs.filter((x) => x.CODE == e)[0].PNT;
        this.L_CARAT = this.LOTs.filter((x) => x.CODE == e)[0].CARAT;
      } else {
        this.PNT = '';
        this.L_NAME = '';
        this.L_CARAT = '';
      }
    } else {
      this.PNT = '';
      this.L_NAME = '';
      this.L_CARAT = '';
    }
  }

  CheckLotVal(eve: any) {
    if (!eve) {
      this.L_CODE = '';
      this.SRNO = 0;
      this.PNT = '';
      this.L_NAME = '';
      this.L_CARAT = '';
    }
  }
  onEnterLOT(evt: any) {
    // if (evt.source.selected) {
    //   this.LOTCtrl.setValue(evt.source.value)
    //   this.L_NAME = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).NAME : ''
    //   this.PNT = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).PNT : ''
    //   this.L_CARAT = this.LOTs.find(option => option.CODE == evt.source.value) ? this.LOTs.find(option => option.CODE == evt.source.value).CARAT : ''
    // }
  }

  CLEAR() {
    this.L_CODE = '';
    this.L_NAME = '';
    this.PNT = '';
    this.L_CARAT = '';
    this.SRNO = 0;
    this.TAG = '';
    this.I_CARAT = 0;
    this.R_CARAT = 0;
    this.I_EXTRA = 0;
    this.R_EXTRA = 0;
    this.R_PCS = 0;
    this.I_PCS = 0;
    this.I_LOSSPER = 0;
    this.R_LOSSPER = 0;
    this.I_DATE = null;
    this.R_DATE = null;
    this.I_TIME = null;
    this.R_TIME = null;
    this.S_CARAT = 0;
    this.S_PCS = 0;
    this.ConCArat = 0;
    this.PASSWORD = '';
    this.GRIDCARAT = ''
    // if (this.PRArr.length != 0 && this.PRArr[0].PRC_CODE) {
    //   this.TPROC_CODE = this.PRArr[0].PRC_CODE
    // }
    this.source = {
      localdata: [],
      datatype: 'array',
      datafields: [
        { name: 'CARAT', type: 'float' },
        { name: 'PTAG', type: 'string' },
        { name: 'DEL', type: 'bool' },
        { name: 'DETID', type: 'number' },
        { name: 'DETNO', type: 'number' },
        { name: 'SRN', type: 'number' },
        { name: 'EMP_CODE', type: 'string' },
      ],
      updaterow: (rowid: any, rowdata: any, commit: any): void => {
        commit(true);
      },
    };
    this.dataAdapter = new jqx.dataAdapter(this.source);
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
      if (this.PASSWORD == '1') {
        this.myGrid.begincelledit(0, 'CARAT');
      } else {
        $('#save').focus();
      }
    }
  }

  nextenter(e: any, id: any) {
    if (e.keyCode == 13) {
      $('#' + id).focus();
    }
  }
  SETFLOAT(e: any, flonum: any) {
    return parseFloat(this[e]).toFixed(flonum);
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
  Delete() {

  }
  Barcode() {

  }
  filterarr(filteredarray: any, controlname: any, arrayname: any) {
    this[filteredarray] = this[controlname].valueChanges.pipe(
      startWith(''),
      map((grp) =>
        grp ? this.FinalFileterByChange(grp, arrayname) : this[arrayname]
      )
    );
  }

  FinalFileterByChange(code: any, arrayname: any) {
    return this[arrayname].filter(
      (grp) => grp.code.toString().indexOf(code) === 0
    );
  }
  CHANGERCARAT() {
    this.ConCArat = (
      (this.R_CARAT == 0 ? this.I_CARAT : this.R_CARAT) -
      this.R_EXTRA -
      this.S_CARAT
    ).toFixed(3);
    this.I_LOSSPER = (this.I_CARAT - this.R_CARAT).toFixed(3);
    this.R_LOSSPER = ((this.I_LOSSPER * 100) / this.I_CARAT).toFixed(2);
  }

  CHANGEECARAT() {
    this.ConCArat = (
      (this.R_CARAT == 0 ? this.I_CARAT : this.R_CARAT) -
      this.R_EXTRA -
      this.S_CARAT
    ).toFixed(3);
  }

  CHECKPASS() {
    if (this.PASSWORD == this.PASS) {
      if (this.TPROC_CODE == 'L') {
        this.GRIDTOGGLE = true
      } else {
        this.GRIDTOGGLE = false
      }
    } else {
      this.GRIDTOGGLE = false
    }
  }
}
