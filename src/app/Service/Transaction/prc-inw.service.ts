import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrcInwService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  async PrcInwSave(Data: any) {
    return this.http.post<any>('PrcInw/PrcInwSave', Data).toPromise()
  }

  async GetN1Chk(Data: any) {
    return this.http.post<any>('PrcInw/GetN1Chk', Data).toPromise()
  }

  async GetMCChk(Data: any) {
    return this.http.post<any>('PrcInw/GetMCChk', Data).toPromise()
  }

  async AutoTrfLoad(Data: any) {
    return this.http.post<any>('PrcInw/AutoTrfLoad', Data).toPromise()
  }

  FrmPrcInwFill(Data: any): Observable<any> {
    return this.http.post<any>('PrcInw/FrmPrcInwFill', Data)
  }

  async PrcInwSaveCheck(Data: any) {
    return this.http.post<any>('PrcInw/PrcInwSaveCheck', Data).toPromise()
  }

  InwPrcMastFill(Data: any): Observable<any> {
    return this.http.post<any>('PrcInw/InwPrcMastFill', Data)
  }

  GetSubPrcMastFill(Data: any): Observable<any> {
    return this.http.post<any>('PrcInw/GetSubPrcMastFill', Data)
  }

  FrmPrcInwEmpCodeFill(Data: any): Observable<any> {
    return this.http.post<any>('PrcInw/FrmPrcInwEmpCodeFill', Data)
  }

  FrmPrcInwDelete(Data: any) {
    return this.http.post<any>('PrcInw/FrmPrcInwDelete', Data).toPromise()
  }

  PrcInwDelete(Data: any): Observable<any> {
    return this.http.post<any>('PrcInw/PrcInwDelete', Data)
  }

  CheckEmp(Data: any): Observable<any> {
    return this.http.post<any>('PrcInw/CheckEmp', Data)
  }

  PrcPrint(Data: any): Observable<any> {
    return this.http.post<any>('PrcInw/PrcPrint', Data)
  }

  async PoolInnPrcISSCmbFill(Data: any) {
    return this.http.post<any>('PrcInw/InwPrcMastFill', Data).toPromise()
  }

}
