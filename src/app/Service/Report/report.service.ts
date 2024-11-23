import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  FetchReportData(Data: any): Observable<any> {
    return this.http.post<any>('Report/FetchReportData', Data)
  }

  FillReportList(Data: any): Observable<any> {
    return this.http.post<any>('Report/FillReportList', Data)
  }

  GetReportParams(Data: any): Observable<any> {
    return this.http.post<any>('Report/GetReportParams', Data)
  }

  RPTDATA(Data: any): Observable<any> {
    return this.http.post<any>('Report/RPTDATA', Data)
  }

  FrmRptDataFill(Data: any): Observable<any> {
    return this.http.post<any>('Report/FrmRptDataFill', Data)
  }

}
