
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { NgxMaskModule, IConfig } from 'ngx-mask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AgGridModule } from 'ag-grid-angular';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatDatetimepickerModule, MatNativeDatetimeModule } from "@mat-datetimepicker/core";
import { MaterialModule } from './MaterialModule/material-module';

import { AuthInterceptor } from './Service/auth/auth.interceptor';
import { EncrDecrService } from './Service/Common/encr-decr.service';

import { LoginComponent } from './Diamond/Utility/login/login.component';
import { DashboardComponent } from './Diamond/Dashboard/dashboard/dashboard.component';
import { HeaderComponent } from './Diamond/Common/header/header.component';
import { SideBarComponent } from './Diamond/Common/side-bar/side-bar.component';
import { ShpMastComponent } from './Diamond/Master/shp-mast/shp-mast.component';
import { SizeMastComponent } from './Diamond/Master/size-mast/size-mast.component';
import { ColMastComponent } from './Diamond/Master/col-mast/col-mast.component';
import { QuaMastComponent } from './Diamond/Master/qua-mast/qua-mast.component';
import { CutMastComponent } from './Diamond/Master/cut-mast/cut-mast.component';
import { FloMastComponent } from './Diamond/Master/flo-mast/flo-mast.component';
import { ShdMastComponent } from './Diamond/Master/shd-mast/shd-mast.component';
import { UserMastComponent } from './Diamond/ConfigMast/user-mast/user-mast.component';
import { UserCatComponent } from './Diamond/ConfigMast/user-cat/user-cat.component';
import { IncMastComponent } from './Diamond/Master/inc-mast/inc-mast.component';
import { IncTypeMastComponent } from './Diamond/Master/inc-type-mast/inc-type-mast.component';
import { RapOrgComponent } from './Diamond/Rap/rap-org/rap-org.component';
import { ViewParaMastComponent } from './Diamond/Master/view-para-mast/view-para-mast.component';
import { VersionMastComponent } from './Diamond/Master/version-mast/version-mast.component';
import { LotMastComponent } from './Diamond/Master/lot-mast/lot-mast.component';
import { FrmMastComponent } from './Diamond/ConfigMast/frm-mast/frm-mast.component';
import { PerMastComponent } from './Diamond/ConfigMast/per-mast/per-mast.component';
import { DeptMastComponent } from './Diamond/Master/dept-mast/dept-mast.component';
import { ProcMastComponent } from './Diamond/Master/proc-mast/proc-mast.component';
import { EmpMastComponent } from './Diamond/Master/emp-mast/emp-mast.component';
import { RouTrnComponent } from './Diamond/Master/rou-trn/rou-trn.component';
import { PktEntComponent } from './Diamond/Transaction/pkt-ent/pkt-ent.component';
import { PrcMastComponent } from './Diamond/Master/prc-mast/prc-mast.component';
import { PrcInwComponent } from './Diamond/Transaction/prc-inw/prc-inw.component';
import { DashStockComponent } from './Diamond/Dashboard/dash-stock/dash-stock.component';
import { DashRecieveComponent } from './Diamond/Dashboard/dash-recieve/dash-recieve.component';
import { DashCurrollingComponent } from './Diamond/Dashboard/dash-currolling/dash-currolling.component';
import { DashTodaymakeableComponent } from './Diamond/Dashboard/dash-todaymakeable/dash-todaymakeable.component';
import { DashMakeableviewComponent } from './Diamond/Dashboard/dash-makeableview/dash-makeableview.component';
import { DashPrependingComponent } from './Diamond/Dashboard/dash-prepending/dash-prepending.component';
import { DashTop20markerComponent } from './Diamond/Dashboard/dash-top20marker/dash-top20marker.component';
import { PacketViewComponent } from './Diamond/View/packet-view/packet-view.component';
import { ProcessViewComponent } from './Diamond/View/process-view/process-view.component';
import { PrcRecIssueComponent } from './Diamond/Transaction/prc-rec-issue/prc-rec-issue.component';
import { PktRecComponent } from './Diamond/Transaction/pkt-rec/pkt-rec.component';
import { InnPrcComponent } from './Diamond/Transaction/inn-prc/inn-prc.component';
import { ShftMastComponent } from './Diamond/Master/shft-mast/shft-mast.component';
import { ShftTrnMastComponent } from './Diamond/Master/shft-trn-mast/shft-trn-mast.component';
import { InnPrcIssComponent } from './Diamond/Transaction/inn-prc-iss/inn-prc-iss.component';
import { TenMastComponent } from './Diamond/Master/ten-mast/ten-mast.component';
import { InnPrcRecComponent } from './Diamond/Transaction/inn-prc-rec/inn-prc-rec.component';
import { InnPrcRetSlipComponent } from './Diamond/Transaction/inn-prc-ret-slip/inn-prc-ret-slip.component';
import { PrcRetPrntComponent } from './Diamond/Transaction/prc-ret-prnt/prc-ret-prnt.component';
import { InnPrcViewComponent } from './Diamond/View/inn-prc-view/inn-prc-view.component';
import { InnPktViewComponent } from './Diamond/View/inn-pkt-view/inn-pkt-view.component';
import { TallyViewComponent } from './Diamond/View/tally-view/tally-view.component';
import { ListboxComponent } from './Diamond/Common/listbox/listbox.component';
import { RapMastComponent } from './Diamond/Rap/rap-mast/rap-mast.component';
import { RapCutDiscComponent } from './Diamond/Rap/rap-cut-disc/rap-cut-disc.component';
import { RapCalComponent } from './Diamond/Rap/rap-cal/rap-cal.component';
import { NumberEditableComponent } from './Diamond/Rap/rap-mast/number-editable/number-editable.component';
import { PrcMakeableComponent } from './Diamond/Transaction/prc-makeable/prc-makeable.component';
import { RapFloDiscComponent } from './Diamond/Rap/rap-flo-disc/rap-flo-disc.component';
import { RapShdDiscComponent } from './Diamond/Rap/rap-shd-disc/rap-shd-disc.component';
import { RapIncDiscComponent } from './Diamond/Rap/rap-inc-disc/rap-inc-disc.component';
import { RapParamDiscComponent } from './Diamond/Rap/rap-param-disc/rap-param-disc.component';
import { RapLabMastComponent } from './Diamond/Master/rap-lab-mast/rap-lab-mast.component';
import { MakSlipEntComponent } from './Diamond/Transaction/mak-slip-ent/mak-slip-ent.component';
import { EmpAutoTrnComponent } from './Diamond/Transaction/emp-auto-trn/emp-auto-trn.component';
import { PlanFnlEntComponent } from './Diamond/Transaction/plan-fnl-ent/plan-fnl-ent.component';
import { BrkEntComponent } from './Diamond/Transaction/brk-ent/brk-ent.component';
import { RmkMastComponent } from './Diamond/Master/rmk-mast/rmk-mast.component';
import { ReportComponent } from './Diamond/Report/report/report.component'
import { PrdViewComponent } from './Diamond/View/prd-view/prd-view.component';
import { BrkViewComponent } from './Diamond/View/brk-view/brk-view.component';
import { DockPrcPendingComponent } from './Diamond/Dock/dock-prc-pending/dock-prc-pending.component';
import { DockProductionComponent } from './Diamond/Dock/dock-production/dock-production.component';
import { DockCurRollComponent } from './Diamond/Dock/dock-cur-roll/dock-cur-roll.component';
import { DockViewComponent } from './Diamond/Dock/dock-view/dock-view.component';
import { BrkViewModelComponent } from './Diamond/View/brk-view/brk-view-model/brk-view-model.component';
import { RptParaMastComponent } from './Diamond/ConfigMast/rpt-para-mast/rpt-para-mast.component';
import { RptMastComponent } from './Diamond/ConfigMast/rpt-mast/rpt-mast.component';
import { PartyPrcMastComponent } from './Diamond/Master/party-prc-mast/party-prc-mast.component';
import { RptPerMastComponent } from './Diamond/ConfigMast/rpt-per-mast/rpt-per-mast.component';
import { GrdEntComponent } from './Diamond/Transaction/grd-ent/grd-ent.component';
import { LoginDetailComponent } from './Diamond/ConfigMast/login-detail/login-detail.component';
import { ReportListBoxComponent } from './Diamond/Common/report-list-box/report-list-box.component';
import { MakInwComponent } from './Diamond/Transaction/mak-inw/mak-inw.component';
import { GrdOutEntComponent } from './Diamond/Transaction/grd-out-ent/grd-out-ent.component';
import { SetFloatPipe } from './Diamond/_helpers/CustomPipe/set-float.pipe';
import { ColorSketchModule } from 'ngx-color/sketch';
import { AgGridAutoCompleteComponent } from './Diamond/_helpers/ag-grid-auto-complete.component';


const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    SideBarComponent,
    ShpMastComponent,
    SizeMastComponent,
    ColMastComponent,
    QuaMastComponent,
    CutMastComponent,
    FloMastComponent,
    ShdMastComponent,
    UserMastComponent,
    UserCatComponent,
    IncMastComponent,
    IncTypeMastComponent,
    RapOrgComponent,
    ViewParaMastComponent,
    VersionMastComponent,
    LotMastComponent,
    FrmMastComponent,
    PerMastComponent,
    DeptMastComponent,
    ProcMastComponent,
    EmpMastComponent,
    RouTrnComponent,
    PktEntComponent,
    PrcMastComponent,
    PrcInwComponent,
    DashStockComponent,
    DashRecieveComponent,
    DashCurrollingComponent,
    DashTodaymakeableComponent,
    DashMakeableviewComponent,
    DashPrependingComponent,
    DashTop20markerComponent,
    PacketViewComponent,
    ProcessViewComponent,
    PrcRecIssueComponent,
    PktRecComponent,
    InnPrcComponent,
    ShftMastComponent,
    ShftTrnMastComponent,
    InnPrcIssComponent,
    TenMastComponent,
    InnPrcRecComponent,
    InnPrcRetSlipComponent,
    PrcRetPrntComponent,
    InnPrcViewComponent,
    InnPktViewComponent,
    TallyViewComponent,
    ListboxComponent,
    RapMastComponent,
    RapCutDiscComponent,
    RapCalComponent,
    NumberEditableComponent,
    PrcMakeableComponent,
    RapFloDiscComponent,
    RapShdDiscComponent,
    RapIncDiscComponent,
    RapParamDiscComponent,
    RapLabMastComponent,
    MakSlipEntComponent,
    EmpAutoTrnComponent,
    PlanFnlEntComponent,
    BrkEntComponent,
    RmkMastComponent,
    ReportComponent,
    PrdViewComponent,
    BrkViewComponent,
    DockPrcPendingComponent,
    DockProductionComponent,
    DockCurRollComponent,
    DockViewComponent,
    BrkViewModelComponent,
    RptParaMastComponent,
    RptMastComponent,
    PartyPrcMastComponent,
    RptPerMastComponent,
    GrdEntComponent,
    LoginDetailComponent,
    ReportListBoxComponent,
    MakInwComponent,
    GrdOutEntComponent,
    SetFloatPipe,
    AgGridAutoCompleteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    MatNativeDatetimeModule,
    MatDatetimepickerModule,
    ToastrModule.forRoot(),
    AgGridModule.withComponents([]),
    jqxGridModule,
    BackButtonDisableModule.forRoot(),
    NgxMaskModule.forRoot(maskConfigFunction),
    ColorSketchModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }, DatePipe, EncrDecrService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: LOCALE_ID, useValue: 'en-GB' },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
