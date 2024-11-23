import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TenMastService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  TenMastFill(Data: any): Observable<any> {
    return this.http.post<any>('TenMast/TenMastFill', Data)
  }

  TenMastSave(Data: any): Observable<any> {
    return this.http.post<any>('TenMast/TenMastSave', Data)
  }

  TenMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('TenMast/TenMastDelete', Data)
  }
}
