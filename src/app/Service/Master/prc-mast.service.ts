import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrcMastService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  PrcMastFill(Data: any): Observable<any> {
    return this.http.post<any>('PrcMast/PrcMastFill', Data)
  }

  PrcMastSave(Data: any): Observable<any> {
    return this.http.post<any>('PrcMast/PrcMastSave', Data)
  }

  PrcMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('PrcMast/PrcMastDelete', Data)
  }

}
