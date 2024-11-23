import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class RapLabMastService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  RapLabMastFill(Data: any): Observable<any> {
    return this.http.post<any>('RapLabMast/RapLabMastFill', Data)
  }

  RapLabMastSave(Data: any): Observable<any> {
    return this.http.post<any>('RapLabMast/RapLabMastSave', Data)
  }

  RapLabMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('RapLabMast/RapLabMastDelete', Data)
  }


}
