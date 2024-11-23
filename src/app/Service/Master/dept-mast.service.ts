import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DeptMastService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  DeptMastFill(Data: any): Observable<any> {
    return this.http.post<any>('DeptMast/DeptMastFill', Data)
  }

  DeptMastSave(Data: any): Observable<any> {
    return this.http.post<any>('DeptMast/DeptMastSave', Data)
  }

  DeptMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('DeptMast/DeptMastDelete', Data)
  }
}
