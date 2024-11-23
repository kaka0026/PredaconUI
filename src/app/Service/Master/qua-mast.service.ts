import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class QuaMastService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  QuaMastFill(Data: any): Observable<any> {
    return this.http.post<any>('QuaMast/QuaMastFill', Data)
  }

  QuaMastSave(Data: any): Observable<any> {
    return this.http.post<any>('QuaMast/QuaMastSave', Data)
  }

  QuaMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('QuaMast/QuaMastDelete', Data)
  }


}
