import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UserMastService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  UserMastFill(Data: any): Observable<any> {
    return this.http.post<any>('UserMast/UserMastFill', Data)
  }

  UserMastSave(Data: any): Observable<any> {
    return this.http.post<any>('UserMast/UserMastSave', Data)
  }

  UserMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('UserMast/UserMastDelete', Data)
  }
}
