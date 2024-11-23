import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LocationMastService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  LocationMastFill(Data: any): Observable<any> {
    return this.http.post<any>('LocationMast/LocationMastFill', Data)
  }

  LocationMastSave(Data: any): Observable<any> {
    return this.http.post<any>('LocationMast/LocationMastSave', Data)
  }

  LocationMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('LocationMast/LocationMastDelete', Data)
  }
}
