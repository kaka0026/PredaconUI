import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LoginDetailService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  LoginDetailFill(Data: any): Observable<any> {
    return this.http.post<any>('LoginDetail/LoginDetailFill', Data)
  }

  LoginDetailUpdate(Data: any): Observable<any> {
    return this.http.post<any>('LoginDetail/LoginDetailUpdate', Data)
  }

  LoginDetailSave(Data: any): Observable<any> {
    return this.http.post<any>('LoginDetail/LoginDetailSave', Data)
  }



}
