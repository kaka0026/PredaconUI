import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'


@Injectable({
  providedIn: 'root'
})

export class RmkMastService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  RmkMastFill(Data: any): Observable<any> {
    return this.http.post<any>('RmkMast/RmkMastFill', Data)
  }

  RmkMastSave(Data: any): Observable<any> {
    return this.http.post<any>('RmkMast/RmkMastSave', Data)
  }

  RmkMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('RmkMast/RmkMastDelete', Data)
  }


}
