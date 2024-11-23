import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProcMastService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  ProcMastFill(Data: any): Observable<any> {
    return this.http.post<any>('ProcMast/ProcMastFill', Data)
  }

  ProcMastSave(Data: any): Observable<any> {
    return this.http.post<any>('ProcMast/ProcMastSave', Data)
  }

  ProcMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('ProcMast/ProcMastDelete', Data)
  }
}
