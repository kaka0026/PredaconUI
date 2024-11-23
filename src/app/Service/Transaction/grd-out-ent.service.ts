import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrdOutEntService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  GrdOutEntChk(Data: any): Observable<any> {
    return this.http.post<any>('GrdOutEnt/GrdOutEntChk', Data)
  }

  GrdOutEntDisp(Data: any): Observable<any> {
    return this.http.post<any>('GrdOutEnt/GrdOutEntDisp', Data)
  }

  GrdOutEntSave(Data: any): Observable<any> {
    return this.http.post<any>('GrdOutEnt/GrdOutEntSave', Data)
  }

  // PrnIssMaxNo(Data: any): Observable<any> {
  //   return this.http.post<any>('GrdOutEnt/PrnIssMaxNo', Data)
  // }

  async PrnIssMaxNo(Data: any) {
    return this.http.post<any>('GrdOutEnt/PrnIssMaxNo', Data).toPromise()
  }

  PrnIssSave(Data: any): Observable<any> {
    return this.http.post<any>('GrdOutEnt/PrnIssSave', Data)
  }

  GrdOutEntPrint(Data: any): Observable<any> {
    return this.http.post<any>('GrdOutEnt/GrdOutEntPrint', Data)
  }

  GrdOutEntExport(Data: any): Observable<any> {
    return this.http.post<any>('GrdOutEnt/GrdOutEntExport', Data)
  }

}

