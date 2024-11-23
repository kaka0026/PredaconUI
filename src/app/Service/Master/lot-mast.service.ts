import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LotMastService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  LotMastFill(Data: any): Observable<any> {
    return this.http.post<any>('LotMast/LotMastFill', Data)
  }

  LotMastSave(Data: any): Observable<any> {
    return this.http.post<any>('LotMast/LotMastSave', Data)
  }

  LotMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('LotMast/LotMastDelete', Data)
  }

}
