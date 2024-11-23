import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { FrmMastService } from '../../../Service/ConfigMast/frm-mast.service';

@Component({
  selector: 'app-frm-mast',
  templateUrl: './frm-mast.component.html',
  styleUrls: ['./frm-mast.component.css'],
})
export class FrmMastComponent implements OnInit {
  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;

  FORM_ID: any = '';
  FORM_GROUP: any = '';
  FORM_NAME: any = '';
  DESCR: any = '';
  DESCR1: any = '';

  FrmArray = [
    { FORM_GROUP: 'Configuration', FORM_NAME: 'FrmMastComponent', DESCR: 'Form Master' },
    { FORM_GROUP: 'Configuration', FORM_NAME: 'LoginDetailComponent', DESCR: 'Login Deatils' },
    { FORM_GROUP: 'Configuration', FORM_NAME: 'PerMastComponent', DESCR: 'Permission Master' },
    { FORM_GROUP: 'Configuration', FORM_NAME: 'RptMastComponent', DESCR: 'Report Master' },
    { FORM_GROUP: 'Configuration', FORM_NAME: 'RptParaMastComponent', DESCR: 'Report Parameter Master' },
    { FORM_GROUP: 'Configuration', FORM_NAME: 'RptPerMastComponent', DESCR: 'Report Permission Master' },
    { FORM_GROUP: 'Configuration', FORM_NAME: 'UserCatComponent', DESCR: 'User Category Master' },
    { FORM_GROUP: 'Configuration', FORM_NAME: 'UserMastComponent', DESCR: 'user Master' },

    { FORM_GROUP: 'Dashborad', FORM_NAME: 'Dashboard', DESCR: 'Dashboard' },

    { FORM_GROUP: 'Master', FORM_NAME: 'QuaMastComponent', DESCR: 'Clarity Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'ColMastComponent', DESCR: 'Color Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'CutMastComponent', DESCR: 'Cut Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'DeptMastComponent', DESCR: 'Department Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'EmpMastComponent', DESCR: 'Employee Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'FloMastComponent', DESCR: 'Fluorescence Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'IncMastComponent', DESCR: 'Inclusion Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'IncTypeMastComponent', DESCR: 'Inclusion Type Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'LotMastComponent', DESCR: 'Lot Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'PartyPrcMastComponent', DESCR: 'Party Prc Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'PrcMastComponent', DESCR: 'Inner Prc Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'ProcMastComponent', DESCR: 'Process Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'RapLabMastComponent', DESCR: 'Rap Labour Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'RmkMastComponent', DESCR: 'Remark Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'RouTrnComponent', DESCR: 'Rough Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'ShdMastComponent', DESCR: 'Shade Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'ShpMastComponent', DESCR: 'Shape Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'ShftMastComponent', DESCR: 'Shift Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'ShftTrnMastComponent', DESCR: 'Shift Mode' },
    { FORM_GROUP: 'Master', FORM_NAME: 'SizeMastComponent', DESCR: 'Size Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'TenMastComponent', DESCR: 'Tension Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'ViewParaMastComponent', DESCR: 'ViewPara Master' },
    { FORM_GROUP: 'Master', FORM_NAME: 'VersionMastComponent', DESCR: 'Version Master' },

    { FORM_GROUP: 'Pricing', FORM_NAME: 'RapCalComponent', DESCR: 'Rap Calculator' },
    { FORM_GROUP: 'Pricing', FORM_NAME: 'RapCutDiscComponent', DESCR: 'Rap Cut Discount' },
    { FORM_GROUP: 'Pricing', FORM_NAME: 'RapFloDiscComponent', DESCR: 'Rap Fluorescence Discount' },
    { FORM_GROUP: 'Pricing', FORM_NAME: 'RapIncDiscComponent', DESCR: 'Rap Inclusion Discount' },
    { FORM_GROUP: 'Pricing', FORM_NAME: 'RapMastComponent', DESCR: 'Rap Master' },
    { FORM_GROUP: 'Pricing', FORM_NAME: 'RapOrgComponent', DESCR: 'Rap Org' },
    { FORM_GROUP: 'Pricing', FORM_NAME: 'RapParamDiscComponent', DESCR: 'Rap Param Discount' },
    { FORM_GROUP: 'Pricing', FORM_NAME: 'RapShdDiscComponent', DESCR: 'Rap Shade Discount' },

    { FORM_GROUP: 'Report', FORM_NAME: 'ReportComponent', DESCR: 'Report' },

    { FORM_GROUP: 'Transaction', FORM_NAME: 'BrkEntComponent', DESCR: 'Breaking Entry' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'EmpAutoTrnComponent', DESCR: 'Employee Auto Trasnfer' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'GrdEntComponent', DESCR: 'Grading Entry' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'GrdOutEntComponent', DESCR: 'Grading Out Entry' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'InnPrcComponent', DESCR: 'Inner Process Inward' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'InnPrcIssComponent', DESCR: 'Inner Process Issue' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'InnPrcRecComponent', DESCR: 'Inner Process Recieve' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'InnPrcRetSlipComponent', DESCR: 'Inner Process Retrun Slip' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'MakInwComponent', DESCR: 'Makeable Inward' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'MakSlipEntComponent', DESCR: 'Makeable Slip Entry' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'PktEntComponent', DESCR: 'Packet Entry' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'PktRecComponent', DESCR: 'Packet Recieve' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'PlanFnlEntComponent', DESCR: 'Plan Final Entry' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'PrcInwComponent', DESCR: 'Process Inward' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'PrcMakeableComponent', DESCR: 'Process Makeable' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'PrcRecIssueComponent', DESCR: 'Process Recieve Issue' },
    { FORM_GROUP: 'Transaction', FORM_NAME: 'PrcRetPrntComponent', DESCR: 'Process Return Print' },

    { FORM_GROUP: 'View', FORM_NAME: 'InnPktViewComponent', DESCR: 'Inner Packet View' },
    { FORM_GROUP: 'View', FORM_NAME: 'InnPrcViewComponent', DESCR: 'Inner Process View' },
    { FORM_GROUP: 'View', FORM_NAME: 'PacketViewComponent', DESCR: 'Packet View' },
    { FORM_GROUP: 'View', FORM_NAME: 'ProcessViewComponent', DESCR: 'Process View' },
    { FORM_GROUP: 'View', FORM_NAME: 'TallyViewComponent', DESCR: 'Tally View' },
    { FORM_GROUP: 'View', FORM_NAME: 'PrdViewComponent', DESCR: 'Prediction View' },
    { FORM_GROUP: 'View', FORM_NAME: 'BrkViewComponent', DESCR: 'Breaking View' },
  ];

  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, private FrmMastServ: FrmMastService) {
    this.columnDefs = [
      {
        headerName: 'Name',
        field: 'FORM_NAME',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'Group',
        field: 'FORM_GROUP',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
      {
        headerName: 'DESCR',
        field: 'DESCR',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'text-center',
      },
    ];

    this.defaultColDef = {
      resizable: true,
      sortable: true,
    };
  }

  ngOnInit(): void {
    this.Save();

    localStorage.setItem('FrmARRAy', JSON.stringify(this.FrmArray));
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData();
  }

  Save() {
    this.FrmMastServ.FrmMastSave(this.FrmArray).subscribe((SaveRes) => {
      try {
        if (SaveRes.success == true) {
          this.spinner.hide();
          this.toastr.success('Save successfully.');
          this.LoadGridData();
        } else {
          this.spinner.hide();
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(SaveRes.data),
          });
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }

  LoadGridData() {
    this.spinner.show();

    this.FrmMastServ.FrmMastFill({}).subscribe((FillRes) => {
      try {
        if (FillRes.success == true) {
          this.spinner.hide();
          this.gridApi.setRowData(FillRes.data);
          this.gridApi.sizeColumnsToFit();
        } else {
          this.spinner.hide();
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(FillRes.data),
          });
        }
      } catch (error) {
        this.spinner.hide();
        this.toastr.error(error);
      }
    });
  }

  onGridRowClicked(eve: any) {
    if (eve.event.target !== undefined) {
      let actionType = eve.event.target.getAttribute('data-action-type');

      if (actionType == 'DeleteData') {
        Swal.fire({
          title: 'Are you sure you want to delete ' + eve.data.FORM_ID + '?',
          icon: 'warning',
          cancelButtonText: 'No',
          showCancelButton: true,
          confirmButtonText: 'Yes',
        }).then((result) => {
          if (result.value) {
            this.spinner.show();
            this.FrmMastServ.FrmMastDelete({ FORM_ID: eve.data.Form_ID }).subscribe((DelRes) => {
              try {
                if (DelRes.success == true) {
                  this.spinner.hide();
                  this.toastr.success('Delete successfully.');
                  this.LoadGridData();
                } else {
                  this.spinner.hide();
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: JSON.stringify(DelRes.data),
                  });
                }
              } catch (err) {
                this.spinner.hide();
                this.toastr.error(err);
              }
            });
          } else {
            return;
          }
        });
      } else if (actionType == 'EditData') {
        this.FORM_ID = eve.data.Form_ID ? eve.data.Form_ID : '';
        this.FORM_NAME = eve.data.Form_Name ? eve.data.Form_Name : '';
        this.FORM_GROUP = eve.data.FORM_GROUP ? eve.data.FORM_GROUP : '';
        this.DESCR = eve.data.Descr ? eve.data.Descr : '';
        this.DESCR1 = eve.data.DESCR1 ? eve.data.DESCR1 : '';
      }
    }
  }
}
