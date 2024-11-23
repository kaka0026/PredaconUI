import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { EncrDecrService } from 'src/app/Service/Common/encr-decr.service';
import { DashboardService } from 'src/app/Service/Dashboard/dashboard.service';
import { JwtHelperService } from '@auth0/angular-jwt';

import { LoginDetailService } from 'src/app/Service/ConfigMast/login-detail.service';
import { LoginService } from '../../../Service/Utility/login.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));
  RUN: boolean = true

  loginForm: FormGroup;

  constructor(
    public LoginServ: LoginService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private DashboardServ: DashboardService,
    private LoginDetailServ: LoginDetailService,
    private EncrDecrServ: EncrDecrService
  ) {
    this.loginForm = new FormGroup({
      UserId: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('dashboard');
    } else {
      this.router.navigateByUrl('login');
    }
  }

  async onSubmit() {
    let LoginObj = {
      USERID: this.loginForm.value.UserId,
      PASS: this.loginForm.value.password
    }
    this.spinner.show()
    await this.LoginServ.LoginAuthentication(LoginObj).then(async (LoginRes) => {
      try {
        if (LoginRes.success == true) {
          this.spinner.hide()
          localStorage.setItem('token', LoginRes.data)

          let SaveObj = {
            USERID: this.loginForm.value.UserId,
            RUN: this.RUN
          }

          await this.LoginDetailServ.LoginDetailSave(SaveObj).subscribe(SaveRes => {
            try {

              if (SaveRes.success == true) {
                this.spinner.hide();

              } else {
                this.spinner.hide();
                this.toastr.warning('Cannot save login details.');
              }
            } catch (error) {
              this.spinner.hide();
              this.toastr.error(error);
            }
          });

          await this.DashboardServ.FillAllMaster({}).then((FillRes) => {
            try {
              if (FillRes.success == true) {
                var encrypted = this.EncrDecrServ.set(JSON.stringify(FillRes.data));
                localStorage.setItem('unfam1', encrypted)

              } else {

              }
            } catch (error) {
            }
          })
          this.router.navigateByUrl('dashboard');

        } else if (LoginRes.success == 2) {
          this.spinner.hide()
          this.toastr.warning('Not Found')
        } else if (LoginRes.success == 3) {
          this.spinner.hide()
          this.toastr.warning('Password does not match')
        } else if (LoginRes.success == 5) {
          this.spinner.hide()
          this.toastr.warning('User not found')
        } else if (LoginRes.success == 6) {
          this.spinner.hide()
          this.toastr.warning(LoginRes.data)
        }
        else {
          this.spinner.hide()
          this.toastr.warning("Something went wrong.")
        }
      } catch (err) {
        this.spinner.hide()
        this.toastr.error(err)
      }
    })
  }


}
