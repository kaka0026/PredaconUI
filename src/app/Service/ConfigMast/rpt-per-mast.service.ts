import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RptPerMastService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  RptPerMastFill(Data: any): Observable<any> {
    return this.http.post<any>('RptPerMast/RptPerMastFill', Data)
  }

  RptPerMastSave(Data: any): Observable<any> {
    return this.http.post<any>('RptPerMast/RptPerMastSave', Data)
  }

  RptPerMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('RptPerMast/RptPerMastDelete', Data)
  }

  RptPerMastCopy(Data: any): Observable<any> {
    return this.http.post<any>('RptPerMast/RptPerMastCopy', Data)
  }

}
