import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InnPrcRetSlipService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  async InnPrcRetSlipUpdate(Data: any) {
    return this.http.post<any>('InnPrcRetSlip/InnPrcRetSlipUpdate', Data).toPromise()
  }

  PrnIssSave(Data: any): Observable<any> {
    return this.http.post<any>('InnPrcRetSlip/PrnIssSave', Data)
  }

  PrnIssMaxNo(Data: any): Observable<any> {
    return this.http.post<any>('InnPrcRetSlip/PrnIssMaxNo', Data)
  }

  InnPrcRetSlipFill(Data: any): Observable<any> {
    return this.http.post<any>('InnPrcRetSlip/InnPrcRetSlipFill', Data)
  }

  InnPrcRetSlipDisplay(Data: any): Observable<any> {
    return this.http.post<any>('InnPrcRetSlip/InnPrcRetSlipDisplay', Data)
  }

  InnerPrcRetSlipPrint(Data: any): Observable<any> {
    return this.http.post<any>('InnPrcRetSlip/InnerPrcRetSlipPrint', Data)
  }
}
