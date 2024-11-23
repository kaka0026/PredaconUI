import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from '../../Service/Utility/login.service';

@Injectable({ providedIn: 'root' })
export class FrmOpePer{
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  constructor(private LoginServ: LoginService) { }

  async UserFrmOpePer(data){
    let newres = []
    await this.LoginServ.UserFrmOpePer({USER_NAME:this.decodedTkn.UserId,FORM_NAME: data}).then(res =>
      {
        try{
          if(res.success == true && res.data.length !=0 ){
            newres = res.data
          }else{
            newres =  [{
                DEL: false,
                FORM_NAME: data,
                INS: false,
                PASS: "",
                UPD: false,
                USER_NAME: this.decodedTkn.UserId,
                VIW: false,
              }]
          }
        }catch{
          newres =  [{
            DEL: false,
            FORM_NAME: data,
            INS: false,
            PASS: "",
            UPD: false,
            USER_NAME: this.decodedTkn.UserId,
            VIW: false,
          }]
        }
      });
      return newres
  }
}
