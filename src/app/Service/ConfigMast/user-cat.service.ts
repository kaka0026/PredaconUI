import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UserCatService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  UserCatMastFill(Data: any): Observable<any> {
    return this.http.post<any>('UserCatMast/UserCatMastFill', Data)
  }

  UserCatMastSave(Data: any): Observable<any> {
    return this.http.post<any>('UserCatMast/UserCatMastSave', Data)
  }

  UserCatMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('UserCatMast/UserCatMastDelete', Data)
  }
}
