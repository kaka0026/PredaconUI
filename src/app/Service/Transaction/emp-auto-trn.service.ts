import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpAutoTrnService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  async AutoTrfSaveChk(Data: any) {
    return this.http.post<any>('EmpAutoTrn/AutoTrfSaveChk', Data).toPromise()
  }

  AutoTrfSave(Data: any): Observable<any> {
    return this.http.post<any>('EmpAutoTrn/AutoTrfSave', Data)
  }

  AutoTrfLoad(Data: any): Observable<any> {
    return this.http.post<any>('EmpAutoTrn/AutoTrfLoad', Data)
  }

  AutoTrfFill(Data: any): Observable<any> {
    return this.http.post<any>('EmpAutoTrn/AutoTrfFill', Data)
  }
  AutoTrfPrint(Data: any): Observable<any> {
    return this.http.post<any>('EmpAutoTrn/AutoTrfPrint', Data)
  }
}
