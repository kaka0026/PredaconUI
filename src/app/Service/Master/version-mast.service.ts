import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VersionMastService {

  public url = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  VersionMastFill(Data: any): Observable<any> {
    return this.http.post<any>('VersionMast/VersionMastFill', Data)
  }

  VersionMastSave(Data: any): Observable<any> {
    return this.http.post<any>('VersionMast/VersionMastSave', Data)
  }

  VersionMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('VersionMast/VersionMastDelete', Data)
  }
}
