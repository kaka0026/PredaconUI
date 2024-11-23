import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RapCalcService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  RapCalcDisp(Data: any): Observable<any> {
    return this.http.post<any>('RapCalc/RapCalcDisp', Data)
  }

  PrdEmpFill(Data: any): Observable<any> {
    return this.http.post<any>('RapCalc/PrdEmpFill', Data)
  }

  RapCalcCrtFill(Data: any): Observable<any> {
    return this.http.post<any>('RapCalc/RapCalcCrtFill', Data)
  }

  async FindRap(Data: any) {
    return this.http.post<any>('RapCalc/FindRap', Data).toPromise()
  }

  async FindRapType(Data: any) {
    return this.http.post<any>('RapCalc/FindRapType', Data).toPromise()
  }

  RapSave(Data: any): Observable<any> {
    return this.http.post<any>('RapCalc/RapSave', Data)
  }

  async RapCalcSaveValidation(Data: any) {
    return this.http.post<any>('RapCalc/RapCalcSaveValidation', Data).toPromise()
  }

  async RapCalcSelectValidation(Data: any) {
    return this.http.post<any>('RapCalc/RapCalcSelectValidation', Data).toPromise()
  }

  async RapPrint(Data: any) {
    return this.http.post<any>('RapCalc/RapPrint', Data).toPromise()
  }

  async RapPrintOP(Data: any) {
    return this.http.post<any>('RapCalc/RapPrintOP', Data).toPromise()
  }

}
