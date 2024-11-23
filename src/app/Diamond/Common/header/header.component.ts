import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";

import { HeaderService } from "../../../Service/Common/header.service";
import { ShpMastComponent } from '../../Master/shp-mast/shp-mast.component';
import { SizeMastComponent } from '../../Master/size-mast/size-mast.component';
import { ColMastComponent } from '../../Master/col-mast/col-mast.component';
import { QuaMastComponent } from '../../Master/qua-mast/qua-mast.component';
import { CutMastComponent } from '../../Master/cut-mast/cut-mast.component';
import { FloMastComponent } from '../../Master/flo-mast/flo-mast.component';
import { ShdMastComponent } from '../../Master/shd-mast/shd-mast.component';
import { UserCatComponent } from '../../ConfigMast/user-cat/user-cat.component';
import { UserMastComponent } from '../../ConfigMast/user-mast/user-mast.component';
import { IncMastComponent } from '../../Master/inc-mast/inc-mast.component';
import { IncTypeMastComponent } from '../../Master/inc-type-mast/inc-type-mast.component';
import { RapOrgComponent } from '../../Rap/rap-org/rap-org.component';
import { ViewParaMastComponent } from '../../Master/view-para-mast/view-para-mast.component';
import { VersionMastComponent } from '../../Master/version-mast/version-mast.component';
import { LotMastComponent } from '../../Master/lot-mast/lot-mast.component';
import { FrmMastComponent } from '../../ConfigMast/frm-mast/frm-mast.component';
import { PerMastComponent } from '../../ConfigMast/per-mast/per-mast.component';
import { DeptMastComponent } from '../../Master/dept-mast/dept-mast.component';
import { ProcMastComponent } from '../../Master/proc-mast/proc-mast.component';
import { EmpMastComponent } from '../../Master/emp-mast/emp-mast.component';
import { RouTrnComponent } from '../../Master/rou-trn/rou-trn.component';
import { PktEntComponent } from '../../Transaction/pkt-ent/pkt-ent.component';
import { PrcMastComponent } from '../../Master/prc-mast/prc-mast.component';
import { PrcInwComponent } from '../../Transaction/prc-inw/prc-inw.component';
import { DashboardComponent } from './../../Dashboard/dashboard/dashboard.component';
import { DashStockComponent } from './../../Dashboard/dash-stock/dash-stock.component';
import { DashTop20markerComponent } from './../../Dashboard/dash-top20marker/dash-top20marker.component';
import { DashMakeableviewComponent } from './../../Dashboard/dash-makeableview/dash-makeableview.component';
import { DashTodaymakeableComponent } from './../../Dashboard/dash-todaymakeable/dash-todaymakeable.component';
import { DashCurrollingComponent } from './../../Dashboard/dash-currolling/dash-currolling.component';
import { DashPrependingComponent } from './../../Dashboard/dash-prepending/dash-prepending.component';
import { DashRecieveComponent } from './../../Dashboard/dash-recieve/dash-recieve.component';
import { ProcessViewComponent } from './../../View/process-view/process-view.component';
import { PacketViewComponent } from './../../View/packet-view/packet-view.component';
import { PrcRecIssueComponent } from '../../Transaction/prc-rec-issue/prc-rec-issue.component';
import { PktRecComponent } from '../../Transaction/pkt-rec/pkt-rec.component';
import { InnPrcComponent } from '../../Transaction/inn-prc/inn-prc.component';
import { ShftMastComponent } from '../../Master/shft-mast/shft-mast.component';
import { ShftTrnMastComponent } from '../../Master/shft-trn-mast/shft-trn-mast.component';
import { InnPrcIssComponent } from '../../Transaction/inn-prc-iss/inn-prc-iss.component';
import { TenMastComponent } from '../../Master/ten-mast/ten-mast.component';
import { InnPrcRecComponent } from '../../Transaction/inn-prc-rec/inn-prc-rec.component';
import { InnPrcRetSlipComponent } from '../../Transaction/inn-prc-ret-slip/inn-prc-ret-slip.component';
import { PrcRetPrntComponent } from '../../Transaction/prc-ret-prnt/prc-ret-prnt.component';
import { InnPrcViewComponent } from '../../View/inn-prc-view/inn-prc-view.component';
import { InnPktViewComponent } from '../../View/inn-pkt-view/inn-pkt-view.component';
import { TallyViewComponent } from '../../View/tally-view/tally-view.component';
import { RapMastComponent } from '../../Rap/rap-mast/rap-mast.component';
import { RapCutDiscComponent } from '../../Rap/rap-cut-disc/rap-cut-disc.component';
import { RapCalComponent } from '../../Rap/rap-cal/rap-cal.component';
import { PrcMakeableComponent } from '../../Transaction/prc-makeable/prc-makeable.component';
import { RapFloDiscComponent } from '../../Rap/rap-flo-disc/rap-flo-disc.component';
import { RapShdDiscComponent } from '../../Rap/rap-shd-disc/rap-shd-disc.component';
import { RapIncDiscComponent } from '../../Rap/rap-inc-disc/rap-inc-disc.component';
import { RapParamDiscComponent } from '../../Rap/rap-param-disc/rap-param-disc.component';
import { RapLabMastComponent } from '../../Master/rap-lab-mast/rap-lab-mast.component';
import { MakSlipEntComponent } from '../../Transaction/mak-slip-ent/mak-slip-ent.component';
import { EmpAutoTrnComponent } from '../../Transaction/emp-auto-trn/emp-auto-trn.component';
import { RmkMastComponent } from '../../Master/rmk-mast/rmk-mast.component';
import { PlanFnlEntComponent } from '../../Transaction/plan-fnl-ent/plan-fnl-ent.component';
import { BrkEntComponent } from '../../Transaction/brk-ent/brk-ent.component';
import { ReportComponent } from '../../Report/report/report.component';
import { PrdViewComponent } from '../../View/prd-view/prd-view.component';
import { BrkViewComponent } from '../../View/brk-view/brk-view.component';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import * as $ from "jquery";
import { DockPrcPendingComponent } from '../../Dock/dock-prc-pending/dock-prc-pending.component';
import { DockCurRollComponent } from '../../Dock/dock-cur-roll/dock-cur-roll.component';
import { DockProductionComponent } from '../../Dock/dock-production/dock-production.component';
import { RptParaMastComponent } from '../../ConfigMast/rpt-para-mast/rpt-para-mast.component';
import { RptMastComponent } from '../../ConfigMast/rpt-mast/rpt-mast.component';
import { PartyPrcMastComponent } from '../../Master/party-prc-mast/party-prc-mast.component';
import { RptPerMastComponent } from '../../ConfigMast/rpt-per-mast/rpt-per-mast.component';
import { GrdEntComponent } from '../../Transaction/grd-ent/grd-ent.component';
import { LoginDetailComponent } from '../../ConfigMast/login-detail/login-detail.component';
import { MakInwComponent } from '../../Transaction/mak-inw/mak-inw.component';
import { GrdOutEntComponent } from '../../Transaction/grd-out-ent/grd-out-ent.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  mini2: boolean = true;

  ComponentName: any = {};
  prcdockpin: boolean = false;
  Prcpin: boolean = false;
  CurRollpin: boolean = false;
  Curdockpin: boolean = false;
  Prodpin: boolean = false;
  proddockpin: boolean = false;
  selected = new FormControl(0);
  public dynamicTabs = [];

  clickEventsubscription: Subscription;

  constructor(
    public HeaderServ: HeaderService,
    public dialog: MatDialog,
  ) {
    this.clickEventsubscription = this.HeaderServ.getSidebarClickEvent().subscribe(() => {
      this.sideBarCheck();
    })
  }

  ngOnInit(): void {
    this.HeaderServ.sharedData$.subscribe(sharedData => {
      switch (sharedData) {

        case "Form Master":
          this.ComponentName = FrmMastComponent;
          break;
        case "Login Deatils":
          this.ComponentName = LoginDetailComponent;
          break;
        case "Permission Master":
          this.ComponentName = PerMastComponent;
          break;
        case "Report Master":
          this.ComponentName = RptMastComponent;
          break;
        case "Report Parameter Master":
          this.ComponentName = RptParaMastComponent;
          break;
        case "Report Permission Master":
          this.ComponentName = RptPerMastComponent;
          break;
        case "User Category Master":
          this.ComponentName = UserCatComponent;
          break;
        case "User Master":
          this.ComponentName = UserMastComponent;
          break;

        case "Dashboard":
          this.ComponentName = DashboardComponent;
          break;
        // case "Stock":
        //   this.ComponentName = DashStockComponent;
        //   break;
        // case "Recieve":
        //   this.ComponentName = DashRecieveComponent;
        //   break;
        // case "Current Rolling":
        //   this.ComponentName = DashCurrollingComponent;
        //   break;
        // case "Today Makeable":
        //   this.ComponentName = DashTodaymakeableComponent;
        //   break;
        // case "Makeable View":
        //   this.ComponentName = DashMakeableviewComponent;
        //   break;
        // case "Prediction Pending":
        //   this.ComponentName = DashPrependingComponent;
        //   break;
        // case "Top 20 Marker":
        //   this.ComponentName = DashTop20markerComponent;
        //   break;

        case "Clarity Master":
          this.ComponentName = QuaMastComponent;
          break;
        case "Color Master":
          this.ComponentName = ColMastComponent;
          break;
        case "Cut Master":
          this.ComponentName = CutMastComponent;
          break;
        case "Department Master":
          this.ComponentName = DeptMastComponent;
          break;
        case "Employee Master":
          this.ComponentName = EmpMastComponent;
          break;
        case "Fluorescence Master":
          this.ComponentName = FloMastComponent;
          break;
        case "Inclusion Master":
          this.ComponentName = IncMastComponent;
          break;
        case "Inclusion Type Master":
          this.ComponentName = IncTypeMastComponent;
          break;
        case "Lot Master":
          this.ComponentName = LotMastComponent;
          break;
        case "Party Process Master":
          this.ComponentName = PartyPrcMastComponent;
          break;
        case "Prc Master":
          this.ComponentName = PrcMastComponent;
          break;
        case "Process Master":
          this.ComponentName = ProcMastComponent;
          break;
        case "RAP Lab Master":
          this.ComponentName = RapLabMastComponent;
          break;
        case "Remark Master":
          this.ComponentName = RmkMastComponent;
          break;
        case "Rough Master":
          this.ComponentName = RouTrnComponent;
          break;
        case "Shade Master":
          this.ComponentName = ShdMastComponent;
          break;
        case "Shape Master":
          this.ComponentName = ShpMastComponent;
          break;
        case "Shift Master":
          this.ComponentName = ShftMastComponent;
          break;
        case "Shift Mode":
          this.ComponentName = ShftTrnMastComponent;
          break;
        case "Size Master":
          this.ComponentName = SizeMastComponent;
          break;
        case "Tension Master":
          this.ComponentName = TenMastComponent;
          break;
        case "ViewPara Master":
          this.ComponentName = ViewParaMastComponent;
          break;
        case "Version Master":
          this.ComponentName = VersionMastComponent;
          break;

        case "Rap Calc":
          this.ComponentName = RapCalComponent;
          break;
        case "Cut Discount":
          this.ComponentName = RapCutDiscComponent;
          break;
        case "Flo Discount":
          this.ComponentName = RapFloDiscComponent;
          break;
        case "Inclusion Discount":
          this.ComponentName = RapIncDiscComponent;
          break;
        case "Rap Mast":
          this.ComponentName = RapMastComponent;
          break;
        case "Rap Org":
          this.ComponentName = RapOrgComponent;
          break;
        case "Param Discount":
          this.ComponentName = RapParamDiscComponent;
          break;
        case "Shade Discount":
          this.ComponentName = RapShdDiscComponent;
          break;

        case "Breaking Entry":
          this.ComponentName = BrkEntComponent;
          break;
        case "Employee Auto Trasnfer":
          this.ComponentName = EmpAutoTrnComponent;
          break;
        case "Grading Entry":
          this.ComponentName = GrdEntComponent;
          break;
        case "Grading Out Entry":
          this.ComponentName = GrdOutEntComponent;
          break;
        case "Inner Process Inward":
          this.ComponentName = InnPrcComponent;
          break;
        case "Inner Process Issue":
          this.ComponentName = InnPrcIssComponent;
          break;
        case "Inner Process Recieve":
          this.ComponentName = InnPrcRecComponent;
          break;
        case "Inner Process Retrun Slip":
          this.ComponentName = InnPrcRetSlipComponent;
          break;
        case "Makeable Inward":
          this.ComponentName = MakInwComponent;
          break;
        case "Makeable Slip Entry":
          this.ComponentName = MakSlipEntComponent;
          break;
        case "Packet Entry":
          this.ComponentName = PktEntComponent;
          break;
        case "Packet Recieve":
          this.ComponentName = PktRecComponent;
          break;
        case "Process Inward":
          this.ComponentName = PrcInwComponent;
          break;
        case "Plan Final Entry":
          this.ComponentName = PlanFnlEntComponent;
          break;
        case "Process Makeable":
          this.ComponentName = PrcMakeableComponent;
          break;
        case "Process Recieve Issue":
          this.ComponentName = PrcRecIssueComponent;
          break;
        case "Process Return Print":
          this.ComponentName = PrcRetPrntComponent;
          break;

        case "Breaking View":
          this.ComponentName = BrkViewComponent;
          break;
        case "Inner Packet View":
          this.ComponentName = InnPktViewComponent;
          break;
        case "Inner Process View":
          this.ComponentName = InnPrcViewComponent;
          break;
        case "Packet View":
          this.ComponentName = PacketViewComponent;
          break;
        case "Process View":
          this.ComponentName = ProcessViewComponent;
          break;
        case "Prediction View":
          this.ComponentName = PrdViewComponent;
          break;
        case "Tally View":
          this.ComponentName = TallyViewComponent;
          break;

        case "Process Report":
          this.ComponentName = ReportComponent;
          break;
        case "Stock Report":
          this.ComponentName = ReportComponent;
          break;
        case "Final Report":
          this.ComponentName = ReportComponent;
          break;
        case "Sawing Report":
          this.ComponentName = ReportComponent;
          break;
        case "Final Report":
          this.ComponentName = ReportComponent;
          break;
        case "General Report":
          this.ComponentName = ReportComponent;
          break;
        case "Sarin Report":
          this.ComponentName = ReportComponent;
          break;
        case "Galaxy Report":
          this.ComponentName = ReportComponent;
          break;
        case "History Report":
          this.ComponentName = ReportComponent;
          break;
        case "4P Report":
          this.ComponentName = ReportComponent;
          break;
        case "16Pel Report":
          this.ComponentName = ReportComponent;
          break;
        case "Russian Report":
          this.ComponentName = ReportComponent;
          break;
      }

      let OpenTab;
      OpenTab = this.dynamicTabs.find(x => x.label == sharedData);

      if (OpenTab == undefined) {
        let Obj1 = {
          label: sharedData,
          component: this.ComponentName
        };

        this.dynamicTabs.push(Obj1);

        if (true) {
          this.selected.setValue(this.dynamicTabs.length - 1);
        }
      } else {
        const position = this.dynamicTabs.findIndex(PageName => {
          return PageName.label == sharedData;
        });

        this.selected.setValue(position);
      }
    });
  }


  removeTab(index) {
    this.dynamicTabs.splice(index, 1);
  }

  tabChanged(e: any) {
    this.HeaderServ.SetPageTitle(e.index == -1 ? '' : e.tab.textLabel)
  }

  openDialog(ComponentName: string) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      top: '5rem',
      right: '2rem'
    }
    dialogConfig.maxWidth = '50vw';
    dialogConfig.maxHeight = '85vh';
    // dialogConfig.minHeight = 'auto';
    // dialogConfig.height = 'min-content';

    if (ComponentName === 'DockPrcPendingComponent') {
      this.dialog.open(DockPrcPendingComponent, dialogConfig);
    } else if (ComponentName === 'DockCurRollComponent') {
      this.dialog.open(DockCurRollComponent, dialogConfig);
    } else if (ComponentName === 'DockProductionComponent') {
      this.dialog.open(DockProductionComponent, dialogConfig);
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  sideBarCheck() {
    if (this.mini2) {
      $("#main").addClass('l-full').removeClass('l-mini');
      this.mini2 = false;
    } else {
      $("#main").addClass('l-mini').removeClass('l-full');
      this.mini2 = true;
    }
  }


  // open(e: any, m: any) {
  //   $('.' + m + '').show();
  //   this[e] = true;
  // }
  // close(e: any, m: any, bol: any) {
  //   if (bol == false) {
  //     $('.' + m + '').hide();
  //     this[e] = false;
  //   }

  prcdockopen() {
    if (this.proddockpin) { return }
    if (this.Curdockpin) { return }
    $('.hub1').show();
    this.Prcpin = true;
  }
  prcdockclose() {
    if (this.prcdockpin == false) {
      $('.hub1').hide();
      this.Prcpin = false;
    }
  }
  Curdockopen() {
    if (this.prcdockpin) { return }
    if (this.proddockpin) { return }
    $('.hub2').show();
    this.CurRollpin = true;
  }
  Curdockclose() {
    if (this.Curdockpin == false) {
      $('.hub2').hide();
      this.CurRollpin = false;
    }
  }
  Proddockopen() {
    if (this.prcdockpin) { return }
    if (this.proddockpin) { return }
    $('.hub3').show();
    this.Prodpin = true;
  }
  Proddockclose() {
    if (this.proddockpin == false) {
      $('.hub3').hide();
      this.Prodpin = false;
    }
  }
  // DockPin() {
  //   this.dockpin = !this.dockpin
  // }

}


