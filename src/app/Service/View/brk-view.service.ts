import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class BrkViewService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  BrkViewDisp(Data: any): Observable<any> {
    return this.http.post<any>('BrkView/BrkViewDisp', Data)
  }

  Brkconfirm(Data: any): Observable<any> {
    return this.http.post<any>('BrkView/Brkconfirm', Data)
  }
}
