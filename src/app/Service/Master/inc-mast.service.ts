import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class IncMastService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  IncMastFill(Data: any): Observable<any> {
    return this.http.post<any>('IncMast/IncMastFill', Data)
  }

  IncMastSave(Data: any): Observable<any> {
    return this.http.post<any>('IncMast/IncMastSave', Data)
  }

  IncMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('IncMast/IncMastDelete', Data)
  }

  IncMastGetMaxId(Data: any): Observable<any> {
    return this.http.post<any>('IncMast/IncMastGetMaxId', Data)
  }
}
