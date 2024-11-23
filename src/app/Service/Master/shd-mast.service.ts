import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ShdMastService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  ShdMastFill(Data: any): Observable<any> {
    return this.http.post<any>('ShdMast/ShdMastFill', Data)
  }

  ShdMastSave(Data: any): Observable<any> {
    return this.http.post<any>('ShdMast/ShdMastSave', Data)
  }

  ShdMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('ShdMast/ShdMastDelete', Data)
  }


}
