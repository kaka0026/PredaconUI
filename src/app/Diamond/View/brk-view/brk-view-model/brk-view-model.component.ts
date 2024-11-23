import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ToastrService } from 'ngx-toastr';
import { EncrDecrService } from 'src/app/Service/Common/encr-decr.service';
import { RapCalcService } from 'src/app/Service/Rap/rap-calc.service';
import { BrkEntService } from 'src/app/Service/Transaction/brk-ent.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-brk-view-model',
  templateUrl: './brk-view-model.component.html',
  styleUrls: ['./brk-view-model.component.css']
})
export class BrkViewModelComponent implements OnInit {

  @ViewChild("grid1") myGrid1: jqxGridComponent;
  @ViewChild("grid2") myGrid2: jqxGridComponent;

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  decodedMast = JSON.parse(this.EncrDecrServ.get(localStorage.getItem("unfam1")));

  gridarry1 = []
  source1: any = {}
  dataAdapter1: any
  editable1: boolean = true
  datafields1 = []
  tempcolumn1 = []
  tempdatafeild1 = []
  columns1: any[] = []

  gridarry2 = []
  source2: any = {}
  dataAdapter2: any
  editable2: boolean = true
  datafields2 = []
  tempcolumn2 = []
  tempdatafield2 = []
  columns2: any[] = []

  L_CODE: any = ''
  DETNO: any = ''

  getWidth1(): any {
    if (document.body.offsetWidth < 800) {
      return '90%';
    }

    return '99%';
  }

  getWidth2(): any {
    if (document.body.offsetWidth < 800) {
      return '90%';
    }

    return '99%';
  }

  constructor(
    private EncrDecrServ: EncrDecrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _mdr: MatDialogRef<BrkViewModelComponent>,
    private RapCalcServ: RapCalcService,
    private toastr: ToastrService,
    private BrkEntServ: BrkEntService
  ) {
    this.L_CODE = data.L_CODE
    this.DETNO = data.DETNO
    let l = this
    this.columns1 = [
      {
        text: 'Action',
        datafield: 'Action',
        width: 50,
        columntype: 'button',
        editable: false,
        hidden: true,
        cellsrenderer: (): string => {
          return 'Delete';
        },
        buttonclick: (row: number, rowid: number): void => {
          Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
              let rowId = this.myGrid1.getrowid(row);
              this.myGrid1.deleterow(rowId);
            }
          })
        }
      },
      {
        text: 'BTag',
        datafield: 'BTAG',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Shp',
        datafield: 'BRKS_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Quality',
        datafield: 'BRKQ_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
        hidden: true,
      },
      {
        text: 'Quality',
        datafield: 'Q_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Col',
        datafield: 'BRKC_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
        hidden: true,
      },
      {
        text: 'Col',
        datafield: 'C_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Carat',
        datafield: 'BRKCARAT',
        width: 50,
        columntype: 'float',
        editable: false,
      },
      {
        text: 'Cut',
        datafield: 'BRKCUT_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
        hidden: true,
      },
      {
        text: 'Cut',
        datafield: 'CUT_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Pol',
        datafield: 'BRKPOL_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
        hidden: true,
      },
      {
        text: 'Pol',
        datafield: 'POL_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Sym',
        datafield: 'BRKSYM_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
        hidden: true,
      },
      {
        text: 'Sym',
        datafield: 'SYM_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Fl',
        datafield: 'BRKFL_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
        hidden: true,
      },
      {
        text: 'Fl',
        datafield: 'FL_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Inc',
        datafield: 'BRKIN_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
        hidden: true,
      },
      {
        text: 'Inc',
        datafield: 'IN_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Shade',
        datafield: 'BRKSH_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
        hidden: true,
      },
      {
        text: 'Shade',
        datafield: 'SH_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Amt',
        datafield: 'AMOUNT',
        width: 70,
        columntype: 'float',
        editable: false,
      },
      {
        text: 'Tab',
        datafield: 'TABLE',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'TabBlk',
        datafield: 'BRKTABLE_BLACK',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'TabOp',
        datafield: 'BRKTABLE_OPEN',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Side',
        datafield: 'BRKSIDE',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'SideBlk',
        datafield: 'BRKSIDE_BLACK',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'SideOp',
        datafield: 'BRKSIDE_OPEN',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'CrOp',
        datafield: 'BRKCROWN_OPEN',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'GrdOp',
        datafield: 'BRKGIRDLE_OPEN',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'PavOp',
        datafield: 'BRKPAV_OPEN',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'BRKCULET',
        datafield: 'Culet',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'ExtFac',
        datafield: 'BRKEXTFACET',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'EycCln',
        datafield: 'BRKEYECLEAN',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Gran',
        datafield: 'BRKGRAINING',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Lust',
        datafield: 'BRKLUSTER',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Milky',
        datafield: 'BRKMILKY',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Natural',
        datafield: 'BRKNATURAL',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'RedSp',
        datafield: 'BRKREDSPOT',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Diameter',
        datafield: 'BRKDIA_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Ratio',
        datafield: 'BRKRAT_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Depth',
        datafield: 'BRKDEPTH_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Table',
        datafield: 'BRKTAB_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Rate',
        datafield: 'RATE',
        width: 60,
        columntype: 'float',
        editable: false,
        hide: true
      },
      {
        text: 'Typ',
        datafield: 'TYP',
        width: 50,
        columntype: 'string',
        editable: false,
        hide: true
      },
    ]
    this.columns2 = [
      {
        text: 'Action',
        datafield: 'Action',
        width: 50,
        columntype: 'button',
        editable: false,
        hidden: true,
        cellsrenderer: (): string => {
          return 'New';
        },
        buttonclick: (row: number, rowid: number): void => {
          let rowsCount = this.myGrid2.getdatainformation().rowscount;
          this.myGrid2.addrow(rowsCount, {}, "last");
        }
      },
      {
        text: 'BTag',
        datafield: 'BTAG',
        width: 50,
        columntype: 'combobox',
        createeditor: (row: number, column: any, editor: any): void => {
          let list = l.decodedMast[39].map(item => { return item.TAG });;
          editor.jqxComboBox({ autoDropDownHeight: false, source: list, promptText: 'Please Choose:' });
        },
        cellvaluechanging: (row: number, column: any, columntype: any, oldvalue: any, newvalue: any): any => {
          if (newvalue == '') return oldvalue;
        }
      },
      {
        text: 'Shp',
        datafield: 'BRKS_CODE',
        width: 50,
        editable: false,
        columntype: 'combobox',
        createeditor: (row: number, column: any, editor: any): void => {
          let list = l.decodedMast[0].map(item => { return item.S_CODE });;
          editor.jqxComboBox({ autoDropDownHeight: false, source: list, promptText: 'Please Choose:' });
        },
        cellvaluechanging: (row: number, column: any, columntype: any, oldvalue: any, newvalue: any): any => {
          if (newvalue == '') return oldvalue;
        }
      },
      {
        text: 'Quality',
        datafield: 'BRKQ_CODE',
        width: 50,
        hidden: true,
        columntype: 'combobox',
        createeditor: (row: number, column: any, editor: any): void => {
          let list = l.decodedMast[4].map(item => { return item.Q_CODE.toString() });;
          editor.jqxComboBox({ autoDropDownHeight: false, source: list, promptText: 'Please Choose:' });
        },
        cellvaluechanging: (row: number, column: any, columntype: any, oldvalue: any, newvalue: any): any => {
          if (newvalue == '') return oldvalue;
        }
      },
      {
        text: 'Quality',
        datafield: 'Q_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Col',
        datafield: 'BRKC_CODE',
        width: 50,
        columntype: 'combobox',
        hidden: true,
        createeditor: (row: number, column: any, editor: any): void => {
          let list = l.decodedMast[3].map(item => { return item.C_CODE.toString() });;
          editor.jqxComboBox({ autoDropDownHeight: false, source: list, promptText: 'Please Choose:' });
        },
        cellvaluechanging: (row: number, column: any, columntype: any, oldvalue: any, newvalue: any): any => {
          if (newvalue == '') return oldvalue;
        }
      },
      {
        text: 'Col',
        datafield: 'C_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Carat',
        datafield: 'BRKCARAT',
        width: 50,
        columntype: 'float',
        editable: false,
      },
      {
        text: 'Cut',
        datafield: 'BRKCUT_CODE',
        width: 50,
        columntype: 'combobox',
        hidden: true,
        createeditor: (row: number, column: any, editor: any): void => {
          let list = l.decodedMast[5].map(item => { return item.CT_CODE.toString() });;
          editor.jqxComboBox({ autoDropDownHeight: false, source: list, promptText: 'Please Choose:' });
        },
        cellvaluechanging: (row: number, column: any, columntype: any, oldvalue: any, newvalue: any): any => {
          if (newvalue == '') return oldvalue;
        }
      },
      {
        text: 'Cut',
        datafield: 'CUT_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Pol',
        datafield: 'BRKPOL_CODE',
        width: 50,
        columntype: 'combobox',
        hidden: true,
        createeditor: (row: number, column: any, editor: any): void => {
          let list = l.decodedMast[5].map(item => { return item.CT_CODE.toString() });;
          editor.jqxComboBox({ autoDropDownHeight: false, source: list, promptText: 'Please Choose:' });
        },
        cellvaluechanging: (row: number, column: any, columntype: any, oldvalue: any, newvalue: any): any => {
          if (newvalue == '') return oldvalue;
        }
      },
      {
        text: 'Pol',
        datafield: 'POL_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Sym',
        datafield: 'BRKSYM_CODE',
        width: 50,
        columntype: 'combobox',
        hidden: true,
        createeditor: (row: number, column: any, editor: any): void => {
          let list = l.decodedMast[5].map(item => { return item.CT_CODE.toString() });;
          editor.jqxComboBox({ autoDropDownHeight: false, source: list, promptText: 'Please Choose:' });
        },
        cellvaluechanging: (row: number, column: any, columntype: any, oldvalue: any, newvalue: any): any => {
          if (newvalue == '') return oldvalue;
        }
      },
      {
        text: 'Sym',
        datafield: 'SYM_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Fl',
        datafield: 'BRKFL_CODE',
        width: 50,
        columntype: 'combobox',
        hidden: true,
        createeditor: (row: number, column: any, editor: any): void => {
          let list = l.decodedMast[6].map(item => { return item.FL_CODE.toString() });;
          editor.jqxComboBox({ autoDropDownHeight: false, source: list, promptText: 'Please Choose:' });
        },
        cellvaluechanging: (row: number, column: any, columntype: any, oldvalue: any, newvalue: any): any => {
          if (newvalue == '') return oldvalue;
        }
      },
      {
        text: 'Fl',
        datafield: 'FL_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Inc',
        datafield: 'BRKIN_CODE',
        width: 50,
        columntype: 'combobox',
        hidden: true,
        createeditor: (row: number, column: any, editor: any): void => {
          let list = l.decodedMast[37].map(item => { return item.I_CODE.toString() });;
          editor.jqxComboBox({ autoDropDownHeight: false, source: list, promptText: 'Please Choose:' });
        },
        cellvaluechanging: (row: number, column: any, columntype: any, oldvalue: any, newvalue: any): any => {
          if (newvalue == '') return oldvalue;
        }
      },
      {
        text: 'Inc',
        datafield: 'IN_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Shade',
        datafield: 'BRKSH_CODE',
        width: 50,
        columntype: 'combobox',
        hidden: true,
        createeditor: (row: number, column: any, editor: any): void => {
          let list = l.decodedMast[19].map(item => { return item.SH_CODE.toString() });;
          editor.jqxComboBox({ autoDropDownHeight: false, source: list, promptText: 'Please Choose:' });
        },
        cellvaluechanging: (row: number, column: any, columntype: any, oldvalue: any, newvalue: any): any => {
          if (newvalue == '') return oldvalue;
        }
      },
      {
        text: 'Shade',
        datafield: 'SH_NAME',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Amt',
        datafield: 'AMOUNT',
        width: 70,
        columntype: 'float',
        editable: false,
      },
      {
        text: 'Tab',
        datafield: 'TABLE',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'TabBlk',
        datafield: 'BRKTABLE_BLACK',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'TabOp',
        datafield: 'BRKTABLE_OPEN',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Side',
        datafield: 'BRKSIDE',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'SideBlk',
        datafield: 'BRKSIDE_BLACK',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'SideOp',
        datafield: 'BRKSIDE_OPEN',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'CrOp',
        datafield: 'BRKCROWN_OPEN',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'GrdOp',
        datafield: 'BRKGIRDLE_OPEN',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'PavOp',
        datafield: 'BRKPAV_OPEN',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'BRKCULET',
        datafield: 'Culet',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'ExtFac',
        datafield: 'BRKEXTFACET',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'EycCln',
        datafield: 'BRKEYECLEAN',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Gran',
        datafield: 'BRKGRAINING',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Lust',
        datafield: 'BRKLUSTER',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Milky',
        datafield: 'BRKMILKY',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Natural',
        datafield: 'BRKNATURAL',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'RedSp',
        datafield: 'BRKREDSPOT',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Diameter',
        datafield: 'BRKDIA_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Ratio',
        datafield: 'BRKRAT_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Depth',
        datafield: 'BRKDEPTH_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Table',
        datafield: 'BRKTAB_CODE',
        width: 50,
        columntype: 'string',
        editable: false,
      },
      {
        text: 'Rate',
        datafield: 'RATE',
        width: 60,
        columntype: 'float',
        editable: false,
        hide: true
      },
      {
        text: 'Typ',
        datafield: 'TYP',
        width: 50,
        columntype: 'string',
        editable: false,
        hide: true
      },
    ]
  }

  async ngOnInit() {
    await this.fillgridData()
  }

  async myGridOnCellEndEdit1(event: any) {
    let value = event.args.value
  };
  async myGridOnCellEndEdit2(event: any) {
    let value = event.args.value
    if (event.args.datafield == "BRKQ_CODE") {
      if (this.decodedMast[4].filter(x => x.Q_CODE == value).length == 0) {
        event.args.row.Q_NAME = ''
      } else {
        event.args.row.Q_NAME = this.decodedMast[4].filter(x => x.Q_CODE == value)[0].Q_NAME
      }
    } else if (event.args.datafield == "BRKC_CODE") {
      if (this.decodedMast[3].filter(x => x.C_CODE == value).length == 0) {
        event.args.row.C_NAME = ''
      } else {
        event.args.row.C_NAME = this.decodedMast[3].filter(x => x.C_CODE == value)[0].C_NAME
      }
    } else if (event.args.datafield == "BRKCUT_CODE") {
      if (this.decodedMast[5].filter(x => x.CT_CODE == value).length == 0) {
        event.args.row.CUT_NAME = ''
      } else {
        event.args.row.CUT_NAME = this.decodedMast[5].filter(x => x.CT_CODE == value)[0].CT_NAME
      }
    } else if (event.args.datafield == "BRKPOL_CODE") {
      if (this.decodedMast[5].filter(x => x.CT_CODE == value).length == 0) {
        event.args.row.POL_NAME = ''
      } else {
        event.args.row.POL_NAME = this.decodedMast[5].filter(x => x.CT_CODE == value)[0].CT_NAME
      }
    } else if (event.args.datafield == "BRKSYM_CODE") {
      if (this.decodedMast[5].filter(x => x.CT_CODE == value).length == 0) {
        event.args.row.SYM_NAME = ''
      } else {
        event.args.row.SYM_NAME = this.decodedMast[5].filter(x => x.CT_CODE == value)[0].CT_NAME
      }
    } else if (event.args.datafield == "BRKFL_CODE") {
      if (this.decodedMast[6].filter(x => x.FL_CODE == value).length == 0) {
        event.args.row.FL_NAME = ''
      } else {
        event.args.row.FL_NAME = this.decodedMast[6].filter(x => x.FL_CODE == value)[0].FL_NAME
      }
    } else if (event.args.datafield == "BRKIN_CODE") {
      if (this.decodedMast[37].filter(x => x.I_CODE == value).length == 0) {
        event.args.row.IN_NAME = ''
      } else {
        event.args.row.IN_NAME = this.decodedMast[37].filter(x => x.I_CODE == value)[0].I_SHORTNAME
      }
    } else if (event.args.datafield == "BRKSH_CODE") {
      if (this.decodedMast[19].filter(x => x.SH_CODE == value).length == 0) {
        event.args.row.SH_NAME = ''
      } else {
        event.args.row.SH_NAME = this.decodedMast[19].filter(x => x.SH_CODE == value)[0].SH_NAME
      }
    }

    if (!event.args.row.BRKCARAT) {
      return
    } else if (!event.args.row.BRKS_CODE) {
      return
    } else if (!event.args.row.BRKQ_CODE) {
      return
    } else if (!event.args.row.BRKC_CODE) {
      return
    } else if (!event.args.row.BRKCUT_CODE) {
      return
    } else if (!event.args.row.BRKPOL_CODE) {
      return
    } else if (!event.args.row.BRKSYM_CODE) {
      return
    } else if (!event.args.row.BRKFL_CODE) {
      return
    }

    await this.RapCalcServ.FindRap(
      {
        S_CODE: event.args.row.BRKS_CODE,
        Q_CODE: event.args.row.BRKQ_CODE,
        C_CODE: event.args.row.BRKC_CODE,
        CARAT: event.args.row.BRKCARAT,
        CUT_CODE: event.args.row.BRKCUT_CODE,
        POL_CODE: event.args.row.BRKPOL_CODE,
        SYM_CODE: event.args.row.BRKSYM_CODE,
        FL_CODE: event.args.row.BRKFL_CODE,
        IN_CODE: event.args.row.BRKIN_CODE,
        SH_CODE: event.args.row.BRKSH_CODE,
        TABLE: event.args.row.TABLE,
        TABLE_BLACK: event.args.row.BRKTABLE_BLACK,
        TABLE_OPEN: event.args.row.BRKTABLE_OPEN,
        SIDE: event.args.row.BRKSIDE,
        SIDE_BLACK: event.args.row.BRKSIDE_BLACK,
        SIDE_OPEN: event.args.row.BRKSIDE_OPEN,
        CROWN_OPEN: event.args.row.BRKCROWN_OPEN,
        GIRDLE_OPEN: event.args.row.BRKGIRDLE_OPEN,
        PAV_OPEN: event.args.row.BRKPAV_OPEN,
        CULET: event.args.row.BRKCULET,
        EXTFACET: event.args.row.BRKEXTFACET,
        EYECLAEN: event.args.row.BRKEYECLEAN,
        GRAINING: event.args.row.BRKGRAINING,
        LUSTER: event.args.row.BRKLUSTER,
        MILKY: event.args.row.BRKMILKY,
        NATURAL: event.args.row.BRKNATURAL,
        REDSPOT: event.args.row.BRKREDSPOT,
        V_CODE: 0,
        RAPTYPE: 'LB',
        DIA: event.args.row.BRKDIA_CODE,
        DEPTH: event.args.row.BRKDEPTH_CODE,
        RATIO: event.args.row.BRKRAT_CODE,
        TAB: event.args.row.BRKTAB_CODE
      }
    ).then((PCRes) => {
      try {
        if (PCRes.success == true) {
          event.args.row.RATE = PCRes.data[1][0][''] == null ? 0 : (PCRes.data[1][0]['']).toFixed(0)
          event.args.row.AMOUNT = PCRes.data[1][0][''] == null ? 0 : (PCRes.data[1][0][''] * event.args.row.BRKCARAT).toFixed(0)
          event.args.row.TYP = PCRes.data[2][0][''] == null ? '' : PCRes.data[2][0]['']
        } else {
          event.args.row.RATE = 0
          event.args.row.AMOUNT = 0
          event.args.row.TYP = ''
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
    let totalamount1 = 0
    let totalamount2 = 0
    let totalcarat1 = 0
    let totalcarat2 = 0
    for (let i = 0; i < this.myGrid1.getrows().length; i++) {
      totalamount1 = totalamount1 + parseFloat(this.myGrid1.getcellvalue(i, 'AMOUNT'))
      totalcarat1 = totalcarat1 + parseFloat(this.myGrid1.getcellvalue(i, 'BRKCARAT'))
    }
    for (let i = 0; i < this.myGrid2.getrows().length; i++) {
      totalamount2 = totalamount2 + parseFloat(this.myGrid2.getcellvalue(i, 'AMOUNT'))
      totalcarat2 = totalcarat2 + parseFloat(this.myGrid2.getcellvalue(i, 'BRKCARAT'))
    }
  }
  async fillgridData() {
    await this.BrkEntServ.BrkEntDisp({
      L_CODE: this.L_CODE,
      DETNO: this.DETNO
    }).then((Res) => {
      try {
        if (Res.success == true) {
          this.myGrid1.clear()
          this.myGrid2.clear()
          let griddata = []
          griddata = Res.data[0].map((item) => {
            return {
              BRKTYPE: item.BRKTYPE,
              DETNO: item.DETNO,
              BTAG: item.BTAG,
              BRKS_CODE: item.BRKS_CODE,
              BRKQ_CODE: item.BRKQ_CODE,
              Q_NAME: this.decodedMast[4].filter(x => x.Q_CODE == item.BRKQ_CODE)[0].Q_NAME,
              BRKC_CODE: item.BRKC_CODE,
              C_NAME: this.decodedMast[3].filter(x => x.C_CODE == item.BRKC_CODE)[0].C_NAME,
              BRKCARAT: item.BRKCARAT,
              BRKCUT_CODE: item.BRKCUT_CODE,
              CUT_NAME: this.decodedMast[5].filter(x => x.CT_CODE == item.BRKCUT_CODE)[0].CT_NAME,
              BRKPOL_CODE: item.BRKPOL_CODE,
              POL_NAME: this.decodedMast[5].filter(x => x.CT_CODE == item.BRKPOL_CODE)[0].CT_NAME,
              BRKSYM_CODE: item.BRKSYM_CODE,
              SYM_NAME: this.decodedMast[5].filter(x => x.CT_CODE == item.BRKSYM_CODE)[0].CT_NAME,
              BRKFL_CODE: item.BRKFL_CODE,
              FL_NAME: this.decodedMast[6].filter(x => x.FL_CODE == item.BRKFL_CODE)[0].FL_NAME,
              BRKIN_CODE: item.BRKIN_CODE,
              IN_NAME: this.decodedMast[37].filter(x => x.I_CODE == item.BRKIN_CODE)[0].I_SHORTNAME,
              BRKSH_CODE: item.BRKSH_CODE,
              SH_NAME: this.decodedMast[19].filter(x => x.SH_CODE == item.BRKSH_CODE)[0].SH_NAME,
              BRKTABLE: item.BRKTABLE,
              BRKTABLE_BLACK: item.BRKTABLE_BLACK,
              BRKTABLE_OPEN: item.BRKTABLE_OPEN,
              BRKSIDE: item.BRKSIDE,
              BRKSIDE_BLACK: item.BRKSIDE_BLACK,
              BRKSIDE_OPEN: item.BRKSIDE_OPEN,
              BRKCROWN_OPEN: item.BRKCROWN_OPEN,
              BRKGIRDLE_OPEN: item.BRKGIRDLE_OPEN,
              BRKPAV_OPEN: item.BRKPAV_OPEN,
              BRKCULET: item.BRKCULET,
              BRKEXTFACET: item.BRKEXTFACET,
              BRKEYECLEAN: item.BRKEYECLEAN,
              BRKGRAINING: item.BRKGRAINING,
              BRKLUSTER: item.BRKLUSTER,
              BRKMILKY: item.BRKMILKY,
              BRKNATURAL: item.BRKNATURAL,
              BRKREDSPOT: item.BRKREDSPOT,
              BRKDIA_CODE: item.BRKDIA_CODE,
              BRKRAT_CODE: item.BRKRAT_CODE,
              BRKDEPTH_CODE: item.BRKDEPTH_CODE,
              BRKTAB_CODE: item.BRKTAB_CODE,
              RATE: item.RATE,
              AMOUNT: item.AMOUNT,
              TYP: item.TYP
            }
          })

          let grid1data = griddata.filter(x => x.BRKTYPE == 'B')
          let grid2data = griddata.filter(x => x.BRKTYPE == 'A')

          this.source1 = {
            localdata: grid1data,
            datatype: 'array',
            datafields: [
              { name: 'Action', type: 'button' },
              { name: 'BTAG', type: 'string' },
              { name: 'BRKS_CODE', type: 'string' },
              { name: 'BRKQ_CODE', type: 'string' },
              { name: 'Q_NAME', type: 'string' },
              { name: 'BRKC_CODE', type: 'string' },
              { name: 'C_NAME', type: 'string' },
              { name: 'BRKCARAT', type: 'float' },
              { name: 'BRKCUT_CODE', type: 'string' },
              { name: 'CUT_NAME', type: 'string' },
              { name: 'BRKPOL_CODE', type: 'string' },
              { name: 'POL_NAME', type: 'string' },
              { name: 'BRKSYM_CODE', type: 'string' },
              { name: 'SYM_NAME', type: 'string' },
              { name: 'BRKFL_CODE', type: 'string' },
              { name: 'FL_NAME', type: 'string' },
              { name: 'BRKIN_CODE', type: 'string' },
              { name: 'IN_NAME', type: 'string' },
              { name: 'BRKSH_CODE', type: 'string' },
              { name: 'SH_NAME', type: 'string' },
              { name: 'BRKTABLE', type: 'string' },
              { name: 'BRKTABLE_BLACK', type: 'string' },
              { name: 'BRKTABLE_OPEN', type: 'string' },
              { name: 'BRKSIDE', type: 'string' },
              { name: 'BRKSIDE_BLACK', type: 'string' },
              { name: 'BRKSIDE_OPEN', type: 'string' },
              { name: 'BRKCROWN_OPEN', type: 'string' },
              { name: 'BRKGIRDLE_OPEN', type: 'string' },
              { name: 'BRKPAV_OPEN', type: 'string' },
              { name: 'BRKCULET', type: 'string' },
              { name: 'BRKEXTFACET', type: 'string' },
              { name: 'BRKEYECLEAN', type: 'string' },
              { name: 'BRKGRAINING', type: 'string' },
              { name: 'BRKLUSTER', type: 'string' },
              { name: 'BRKMILKY', type: 'string' },
              { name: 'BRKNATURAL', type: 'string' },
              { name: 'BRKREDSPOT', type: 'string' },
              { name: 'BRKDIA_CODE', type: 'string' },
              { name: 'BRKRAT_CODE', type: 'string' },
              { name: 'BRKDEPTH_CODE', type: 'string' },
              { name: 'BRKTAB_CODE', type: 'string' },
              { name: 'RATE', type: 'float' },
              { name: 'AMOUNT', type: 'float' },
              { name: 'TYP', type: 'string' }
            ],
            updaterow: (rowid: any, rowdata: any, commit: any): void => {
              commit(true);
            }
          };
          this.dataAdapter1 = new jqx.dataAdapter(this.source1);

          this.source2 = {
            localdata: grid2data,
            datatype: 'array',
            datafields: [
              { name: 'Action', type: 'button' },
              { name: 'BTAG', type: 'string' },
              { name: 'BRKS_CODE', type: 'string' },
              { name: 'BRKQ_CODE', type: 'string' },
              { name: 'Q_NAME', type: 'string' },
              { name: 'BRKC_CODE', type: 'string' },
              { name: 'C_NAME', type: 'string' },
              { name: 'BRKCARAT', type: 'float' },
              { name: 'BRKCUT_CODE', type: 'string' },
              { name: 'CUT_NAME', type: 'string' },
              { name: 'BRKPOL_CODE', type: 'string' },
              { name: 'POL_NAME', type: 'string' },
              { name: 'BRKSYM_CODE', type: 'string' },
              { name: 'SYM_NAME', type: 'string' },
              { name: 'BRKFL_CODE', type: 'string' },
              { name: 'FL_NAME', type: 'string' },
              { name: 'BRKIN_CODE', type: 'string' },
              { name: 'IN_NAME', type: 'string' },
              { name: 'BRKSH_CODE', type: 'string' },
              { name: 'SH_NAME', type: 'string' },
              { name: 'BRKTABLE', type: 'string' },
              { name: 'BRKTABLE_BLACK', type: 'string' },
              { name: 'BRKTABLE_OPEN', type: 'string' },
              { name: 'BRKSIDE', type: 'string' },
              { name: 'BRKSIDE_BLACK', type: 'string' },
              { name: 'BRKSIDE_OPEN', type: 'string' },
              { name: 'BRKCROWN_OPEN', type: 'string' },
              { name: 'BRKGIRDLE_OPEN', type: 'string' },
              { name: 'BRKPAV_OPEN', type: 'string' },
              { name: 'BRKCULET', type: 'string' },
              { name: 'BRKEXTFACET', type: 'string' },
              { name: 'BRKEYECLEAN', type: 'string' },
              { name: 'BRKGRAINING', type: 'string' },
              { name: 'BRKLUSTER', type: 'string' },
              { name: 'BRKMILKY', type: 'string' },
              { name: 'BRKNATURAL', type: 'string' },
              { name: 'BRKREDSPOT', type: 'string' },
              { name: 'BRKDIA_CODE', type: 'string' },
              { name: 'BRKRAT_CODE', type: 'string' },
              { name: 'BRKDEPTH_CODE', type: 'string' },
              { name: 'BRKTAB_CODE', type: 'string' },
              { name: 'RATE', type: 'float' },
              { name: 'AMOUNT', type: 'float' },
              { name: 'TYP', type: 'string' }
            ],
            updaterow: (rowid: any, rowdata: any, commit: any): void => {
              commit(true);
            }
          };
          this.dataAdapter2 = new jqx.dataAdapter(this.source2);
        } else {
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }
}
