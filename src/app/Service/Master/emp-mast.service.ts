import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EmpMastService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  EmpMastFill(Data: any): Observable<any> {
    return this.http.post<any>('EmpMast/EmpMastFill', Data)
  }

  EmpMastSave(Data: any): Observable<any> {
    return this.http.post<any>('EmpMast/EmpMastSave', Data)
  }

  EmpMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('EmpMast/EmpMastDelete', Data)
  }


  USERMASTSAVETEMP(Data: any): Observable<any> {
    return this.http.post<any>('EmpMast/USERMASTSAVETEMP', Data)
  }
}
