import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  BarCode(Data: any): Observable<any> {
    return this.http.post<any>('Common/BarCode', Data)
  }

}
