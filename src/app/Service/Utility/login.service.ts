import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  async LoginAuthentication(Data: any) {
    return this.http.post<any>('Login/LoginAuthentication', Data).toPromise()
  }

  async UserFrmOpePer(Data: any) {
    return this.http.post<any>('Login/UserFrmOpePer', Data).toPromise()
  }

  async UserFrmPer(Data: any) {

    // this.http.post<any>('Login/UserFrmPer', Data).subscribe(rapres => {
    //   try {
    //     if (rapres.success == true) {
    //       this.RAPTArray = rapres.data.map(item => {
    //         return { code: item.RAPTYPE, name: item.RAPNAME };
    //       });
    //       this.RAPTYPE = rapres.data[0].RAPTYPE
    //     } else {
    //     }
    //   } catch (error) {
    //     this.spinner.hide();
    //     this.toastr.error(error);
    //   }
    // });

    return this.http.post<any>('Login/UserFrmPer', Data).toPromise()
  }
}
