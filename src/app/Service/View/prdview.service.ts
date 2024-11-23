import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PrdviewService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  PrdViewDisp(Data: any): Observable<any> {
    return this.http.post<any>('PrdView/PrdViewDisp', Data)
  }

  PrdViewSave(Data: any): Observable<any> {
    return this.http.post<any>('PrdView/PrdViewSave', Data)
  }
}
