import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class RptMastService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  RptMastFill(Data: any): Observable<any> {
    return this.http.post<any>('RptMast/RptMastFill', Data)
  }

  RptMastSave(Data: any): Observable<any> {
    return this.http.post<any>('RptMast/RptMastSave', Data)
  }

  RptMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('RptMast/RptMastDelete', Data)
  }

}
