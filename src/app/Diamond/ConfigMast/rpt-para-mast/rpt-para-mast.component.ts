import { Component, ElementRef, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { RptParaMastService } from 'src/app/Service/ConfigMast/rpt-para-mast.service';
import { ViewParaMastService } from 'src/app/Service/Master/view-para-mast.service';
import Swal from "sweetalert2";
import { DatePipe } from '@angular/common';
import PerfectScrollbar from 'perfect-scrollbar';
import { FrmOpePer } from '../../_helpers/frm-ope-per';

@Component({
  selector: 'app-rpt-para-mast',
  templateUrl: './rpt-para-mast.component.html',
  styleUrls: ['./rpt-para-mast.component.css']
})
export class RptParaMastComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  hide = true
  PASSWORD: any = ''
  NAME: any = ''
  DISPLAYNAME: any = ''
  CATE_NAME: any = ''
  DATATYPE: any = ''
  LOOKUP_STRING: any = ''
  DATATABLE: any = ''
  DISPLAYMEMBER: any = ''
  VALUEMEMBER: any = ''
  COLUMNS: any = ''
  CAPTIONS: any = ''

  GridHeader = []
  ALLOWINS: boolean = false
  ALLOWDEL: boolean = false
  ALLOWUPD: boolean = false
  EDITABLEGRID: boolean = false
  PASS: any = ''
  PER = []

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private RptParaMastServ: RptParaMastService,
    private ViewParaMastServ: ViewParaMastService,
    private datePipe: DatePipe,
    private elementRef: ElementRef,
    private _FrmOpePer: FrmOpePer,
  ) {
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      editable: this.EDITABLEGRID
    }
  }

  async ngOnInit() {
    this.PER = await this._FrmOpePer.UserFrmOpePer(this.constructor.name)
    this.ALLOWDEL = this.PER[0].DEL
    this.ALLOWINS = this.PER[0].INS
    this.ALLOWUPD = this.PER[0].UPD
    this.PASS = this.PER[0].PASS
    this.FillViewPara()
  }

  FillViewPara() {
    this.ViewParaMastServ.ViewParaFill({ FORMNAME: 'FrmRepPara' }).subscribe((VPRes) => {
      try {
        if (VPRes.success == 1) {
          this.GridHeader = VPRes.data.map((item) => { return item.FIELDNAME })

          let temp = []
          let op = this;
          temp.push({
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
          })
          for (let i = 0; i < VPRes.data.length; i++) {
            temp.push({
              headerName: VPRes.data[i].DISPNAME,
              headerClass: VPRes.data[i].HEADERALIGN,
              field: VPRes.data[i].FIELDNAME,
              width: VPRes.data[i].COLWIDTH,
              cellStyle: { 'text-align': VPRes.data[i].CELLALIGN },
              resizable: VPRes.data[i].ISRESIZE,
              // valueFormatter : VPRes.data[i].FORMAT == 'NumberFormat' ? this.NumberFormat : this.StringFormat,
              hide: VPRes.data[i].DISP == false ? true : false,
              editable: function (params) {
                return op.EDITABLEGRID;
              },
            })
            if (VPRes.data[i].FORMAT == 'NumberFormat') {
              temp[i].valueFormatter = this.NumberFormat
            } else if (VPRes.data[i].FORMAT == '') {
              temp[i].valueFormatter = this.StringFormat
            } else if (VPRes.data[i].FORMAT == 'DateFormat') {
              temp[i].cellRenderer = this.DateFormat.bind(this)
              delete temp[i].valueFormatter
            } else if (VPRes.data[i].FORMAT == 'TimeFormat') {
              temp[i].cellRenderer = this.TimeFormat.bind(this)
              delete temp[i].valueFormatter
            } else {
              temp[i].valueFormatter = this.StringFormat
            }
          }

          this.columnDefs = temp
          temp = []
          // let SelectionCol = {
          //   width: 28,
          //   field: 'CHK',
          //   headerCheckboxSelection: true,
          //   checkboxSelection: true,
          //   resizable: false,
          //   sortable: false,
          // }
          // this.columnDefs.unshift(SelectionCol)
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(VPRes.data),
          })
        }
      } catch (error) {
        this.toastr.error(error)
      }
    })
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData()
  }

  LoadGridData() {
    this.spinner.show()

    this.RptParaMastServ.RptParaMastFill({}).subscribe((FillRes) => {
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

  Save() {

    let SaveObj = {
      NAME: this.NAME ? this.NAME : this.NAME,
      DISPLAYNAME: this.DISPLAYNAME ? this.DISPLAYNAME : this.DISPLAYNAME,
      CATE_NAME: this.CATE_NAME ? this.CATE_NAME : this.CATE_NAME,
      DATATYPE: this.DATATYPE ? this.DATATYPE : this.DATATYPE,
      LOOKUP_STRING: this.LOOKUP_STRING ? this.LOOKUP_STRING : this.LOOKUP_STRING,
      DATATABLE: this.DATATABLE ? this.DATATABLE : this.DATATABLE,
      DISPLAYMEMBER: this.DISPLAYMEMBER ? this.DISPLAYMEMBER : this.DISPLAYMEMBER,
      VALUEMEMBER: this.VALUEMEMBER ? this.VALUEMEMBER : this.VALUEMEMBER,
      COLUMNS: this.COLUMNS ? this.COLUMNS : this.COLUMNS,
      CAPTIONS: this.CAPTIONS ? this.CAPTIONS : this.CAPTIONS,
    }

    this.spinner.show()
    this.RptParaMastServ.RptParaMastSave(SaveObj).subscribe((SaveRes) => {
      try {
        if (SaveRes.success == true) {
          this.spinner.hide()
          this.toastr.success('Save successfully.')
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

  onGridRowClicked(eve: any) {
    if (eve.event.target !== undefined) {
      let actionType = eve.event.target.getAttribute("data-action-type");

      if (actionType == 'DeleteData') {
        Swal.fire({
          title: "Are you sure you want to delete " + eve.data.NAME + "?",
          icon: "warning",
          cancelButtonText: "No",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(result => {
          if (result.value) {
            this.spinner.show()
            this.RptParaMastServ.RptParaMastDelete({ NAME: eve.data.NAME }).subscribe((DelRes) => {
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
      } else if (actionType == 'SaveData') {
        if (!eve.data.NAME) {
          this.toastr.warning('Fill Name')
          return
        }
        let SaveObj = {
          NAME: eve.data.NAME ? eve.data.NAME : '',
          DISPLAYNAME: eve.data.DISPLAYNAME ? eve.data.DISPLAYNAME : '',
          CATE_NAME: eve.data.CATE_NAME ? eve.data.CATE_NAME : '',
          DATATYPE: eve.data.DATATYPE ? eve.data.DATATYPE : '',
          LOOKUP_STRING: eve.data.LOOKUP_STRING ? eve.data.LOOKUP_STRING : '',
          DATATABLE: eve.data.DATATABLE ? eve.data.DATATABLE : '',
          DISPLAYMEMBER: eve.data.DISPLAYMEMBER ? eve.data.DISPLAYMEMBER : '',
          VALUEMEMBER: eve.data.VALUEMEMBER ? eve.data.VALUEMEMBER : '',
          COLUMNS: eve.data.COLUMNS ? eve.data.COLUMNS : '',
          CAPTIONS: eve.data.CAPTIONS ? eve.data.CAPTIONS : ''
        }

        this.spinner.show()
        this.RptParaMastServ.RptParaMastSave(SaveObj).subscribe((SaveRes) => {
          try {
            if (SaveRes.success == true) {
              this.spinner.hide()
              this.toastr.success('Save successfully.')
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

    }
  }

  CHANGEPASSWORD() {
    if (this.PASSWORD == this.PASS) {
      let RowData = []
      this.gridApi.forEachNode(function (rowNode, index) {
        RowData.push(rowNode.data);
      });
      this.EDITABLEGRID = true
      this.gridApi.setRowData(RowData);
    } else {
      let RowData = []
      this.gridApi.forEachNode(function (rowNode, index) {
        RowData.push(rowNode.data);
      });
      this.EDITABLEGRID = false
      this.gridApi.setRowData(RowData);
    }
  }

  NumberFormat(params) {
    if (params.value != 'NaN' && params.value != null) {
      return parseFloat(params.value).toFixed(2);
    } else {
      return '0.00'
    }
  }

  StringFormat(params) {
    if (params.value != 'NaN' && params.value != null) {
      return params.value
    } else {
      return ''
    }
  }

  DateFormat(params) {
    if (params.value) {
      return this.datePipe.transform(params.value, 'dd-MM-yyyy')
    } else {
      return ''
    }
  }

  TimeFormat(params) {
    if (params.value) {
      return this.datePipe.transform(params.value, 'hh:mm a', 'UTC+0')
    } else {
      return ''
    }
  }
  AddRow() {
    if (this.PASS == this.PASSWORD) {
      const newItems = [
        {
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
  }
}
