import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class SizeMastService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  SizeMastFill(Data: any): Observable<any> {
    return this.http.post<any>('SizeMast/SizeMastFill', Data)
  }

  SizeMastSave(Data: any): Observable<any> {
    return this.http.post<any>('SizeMast/SizeMastSave', Data)
  }

  SizeMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('SizeMast/SizeMastDelete', Data)
  }
}
