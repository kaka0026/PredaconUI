import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrkEntService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  async BrkEntCmbFill(Data: any) {
    return this.http.post<any>('BrkEnt/BrkEntCmbFill', Data).toPromise()
  }
  async BrkEntDisp(Data: any) {
    return this.http.post<any>('BrkEnt/BrkEntDisp', Data).toPromise()
  }
  async BrkEntAfterDisp(Data: any) {
    return this.http.post<any>('BrkEnt/BrkEntAfterDisp', Data).toPromise()
  }
  async FrmBrkEntSave(Data: any) {
    return this.http.post<any>('BrkEnt/FrmBrkEntSave', Data).toPromise()
  }
  async FrmBrkEntSaveGrd(Data: any) {
    return this.http.post<any>('BrkEnt/FrmBrkEntSaveGrd', Data).toPromise()
  }
}
