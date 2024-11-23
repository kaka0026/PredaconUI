import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class FloMastService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  FloMastFill(Data: any): Observable<any> {
    return this.http.post<any>('FloMast/FloMastFill', Data)
  }

  FloMastSave(Data: any): Observable<any> {
    return this.http.post<any>('FloMast/FloMastSave', Data)
  }

  FloMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('FloMast/FloMastDelete', Data)
  }

}
