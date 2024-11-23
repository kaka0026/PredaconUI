import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ShftTrnMastService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  async ShiftTrnSaveChk(Data: any) {
    return this.http.post<any>('ShftTrnMast/ShiftTrnSaveChk', Data).toPromise()
  }

  ShiftTrnFill(Data: any): Observable<any> {
    return this.http.post<any>('ShftTrnMast/ShiftTrnFill', Data)
  }

  ShiftTrnEmpFill(Data: any): Observable<any> {
    return this.http.post<any>('ShftTrnMast/ShiftTrnEmpFill', Data)
  }

  async ShiftTrnInsert(Data: any) {
    return this.http.post<any>('ShftTrnMast/ShiftTrnInsert', Data).toPromise()
  }

  ShiftTrnCmbFill(Data: any): Observable<any> {
    return this.http.post<any>('ShftTrnMast/ShiftTrnCmbFill', Data)
  }

  ShiftTrnSave(Data: any): Observable<any> {
    return this.http.post<any>('ShftTrnMast/ShiftTrnSave', Data)
  }

  ShiftTrnDelete(Data: any): Observable<any> {
    return this.http.post<any>('ShftTrnMast/ShiftTrnDelete', Data)
  }
}
