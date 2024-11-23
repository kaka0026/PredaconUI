import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ColMastService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  ColMastFill(Data: any): Observable<any> {
    return this.http.post<any>('ColMast/ColMastFill', Data)
  }

  ColMastSave(Data: any): Observable<any> {
    return this.http.post<any>('ColMast/ColMastSave', Data)
  }

  ColMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('ColMast/ColMastDelete', Data)
  }

}
