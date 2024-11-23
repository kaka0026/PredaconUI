import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Router } from "@angular/router";

import * as $ from "jquery";

import { HeaderService } from '../../../Service/Common/header.service';
import { EncrDecrService } from '../../../Service/Common/encr-decr.service';
import { DashboardService } from 'src/app/Service/Dashboard/dashboard.service';
import { LoginService } from 'src/app/Service/Utility/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from './../header/header.component';
import { LoginDetailService } from 'src/app/Service/ConfigMast/login-detail.service';

import { Subscription } from 'rxjs';
import { ColorEvent } from 'ngx-color';
import { Color } from 'ag-grid-community';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {

    if (event.key == 'F1') {
      this.AddTab('Rap Calc')
      event.preventDefault()
    } else if (event.key == 'F2') {
      this.AddTab('Permission Master')
      event.preventDefault()
    } else if (event.key == 'F3') {
      this.AddTab('Report Master')
      event.preventDefault()
    }
  }

  @ViewChild(HeaderComponent) child;

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  on: string = "On";
  off: string = "Off";
  mini: boolean = true;
  USER_NAME: any = '';

  clickEventsubscription: Subscription;

  VIEWPERARR = []
  GROUPARR = []

  COLORPICKER: boolean = false;

  constructor(
    public router: Router,
    public toastr: ToastrService,
    public spinner: NgxSpinnerService,
    public HeaderServ: HeaderService,
    public EncrDecrServ: EncrDecrService,
    public DashboardServ: DashboardService,
    public LoginServ: LoginService,
    private LoginDetailServ: LoginDetailService,
    private elementRef: ElementRef
  ) {

  }

  async ngOnInit() {
    this.USER_NAME = this.decodedTkn.UserId;
    await this.FILLPPERARR()
    // this.disableContextMenu();
    window.addEventListener('contextmenu', function (e) {
      // do something here...
      e.preventDefault();
    }, false);


    // $(document).ready(function () {
    //   $('.dropmenu span').click(function () {
    //     if ($(this).parent().hasClass('dropmenu-active')) {
    //       $(this).parent().children('.dropmenu-container').slideUp();
    //       $(this).parent().removeClass('dropmenu-active');
    //     }
    //     else {
    //       $('.dropmenu').removeClass('dropmenu-active');
    //       $('.dropmenu').children('.dropmenu-container').slideUp();
    //       $(this).parent().addClass('dropmenu-active');
    //       $(this).parent().children('.dropmenu-container').slideDown();
    //     }
    //   });
    // });

    $(document).ready(function () {
      $('.menuItem').click(function () {
        if ($(this).children().hasClass('subMenu')) {
          $(this).addClass('test');
          $(this).children().removeClass('subMenu');
        } else {
          $(this).removeClass('test');
          $(this).children().addClass('subMenu');
        }
      });
    });

    await this.PageLoadApi()

  }

  handleChange($event: ColorEvent) {
    // console.log($event.color);
    document.documentElement.style.setProperty('--color-accent-r', $event.color.rgb.r.toString());
    document.documentElement.style.setProperty('--color-accent-g', $event.color.rgb.g.toString());
    document.documentElement.style.setProperty('--color-accent-b', $event.color.rgb.b.toString());
    document.documentElement.style.setProperty('--color-accent-a', $event.color.rgb.a.toString());
  }


  ThemeToggle() {
    // document.documentElement.style.setProperty('--color-accent', accent);
    this.COLORPICKER = !this.COLORPICKER
  }

  ChangeTheme(theme: string) {
    let accentColor, bgColor, sideColor, fontColor;
    // if (theme == 'dark') {
    //   accentColor = '#C84B31'
    //   bgColor = '#191919'
    //   fontColor = '#EEEEEE'
    // }
    switch (theme) {
      case 'dark':
        accentColor = '#4ECCA3'
        bgColor = '#232931'
        sideColor = '#393E46'
        fontColor = '#EEEEEE'
        break;
      case 'blue':
        accentColor = '#1B262C'
        bgColor = '#6B778D'
        sideColor = '#263859'
        fontColor = '#1B262C'
        break;
    }

    document.documentElement.style.setProperty('--color-accent', accentColor);
    document.documentElement.style.setProperty('--color-main-bg', bgColor);
    document.documentElement.style.setProperty('--color-main-side', sideColor);
    document.documentElement.style.setProperty('--color-font', fontColor);
    // document.documentElement.style.setProperty('--color-accent2', fontColor);
    // document.documentElement.style.setProperty(' --color-border', fontColor);

  }

  disableContextMenu() {
    window.addEventListener('contextmenu', function (e) {
      // do something here...
      e.preventDefault();
    }, false);
  }

  async FILLPPERARR() {
    await this.LoginServ.UserFrmPer({ USER_NAME: this.decodedTkn.UserId }).then(res => {
      try {
        if (res.success == true) {
          this.VIEWPERARR = res.data.map(item => {
            return item.FORM_NAME
          });

          this.GROUPARR = res.data.map(item => {
            return item.FORM_GROUP
          });

          this.GROUPARR = this.GROUPARR.filter((element, i) => i === this.GROUPARR.indexOf(element))
        } else {
          this.spinner.hide();
          this.toastr.warning('Something gone wrong while get shape');
        }
      } catch (error) {
        this.spinner.hide();
        this.toastr.error(error);
      }
    });
  }

  CHECKPER(e: any): boolean {
    if (this.VIEWPERARR.filter(x => x == e).length == 0) {
      return false
    } else {
      return true
    }
  }

  logout() {
    localStorage.removeItem('token'),
      localStorage.clear()
    this.router.navigate(['login']);

    this.LoginDetailServ.LoginDetailUpdate({ USERID: this.decodedTkn.UserId }).subscribe(LogDetRes => {
      try {
        if (LogDetRes.success == true) {
          this.spinner.hide();

        } else {
          this.spinner.hide();
          this.toastr.warning('Something gone wrong while logging out.');
        }
      } catch (error) {
        this.spinner.hide();
        this.toastr.error(error);
      }
    });
  }

  AddTab(Page: any) {
    this.HeaderServ.setData(Page);
  }

  async PageLoadApi() {
    await this.DashboardServ.FillAllMaster({}).then((FillRes) => {
      try {
        if (FillRes.success == true) {
          var encrypted = this.EncrDecrServ.set(JSON.stringify(FillRes.data));
          localStorage.removeItem('unfam1')
          localStorage.setItem('unfam1', encrypted)

        } else {

        }
      } catch (error) {
      }
    })
  }

  TABVIEW(e: any): boolean {
    if (this.GROUPARR.filter(x => x == e).length == 0) {
      return false
    } else {
      return true
    }
  }

  CHECKCAT(): boolean {
    if (this.decodedTkn.U_CAT == 'S') {
      return true
    } else {
      return false
    }
  }

  toggleSidebar() {
    if (this.mini) {
      $("header").addClass('top-header-full').removeClass('top-header-side');
      this.mini = false;
    } else {
      $("header").addClass('top-header-side').removeClass('top-header-full');
      this.mini = true;
      // this.mini = false;
    }
    this.HeaderServ.sendSidebarClickEvent();
  }

  ReportName(e: any) {
    localStorage.setItem('Report Tab', e)
  }

}
