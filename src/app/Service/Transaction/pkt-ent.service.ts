import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PktEntService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  PktEntFill(Data: any): Observable<any> {
    return this.http.post<any>('PktEnt/PktEntFill', Data)
  }

  async PktEntSave(Data: any) {
    return this.http.post<any>('PktEnt/PktEntSave', Data).toPromise()
  }

  PktEntDelete(Data: any): Observable<any> {
    return this.http.post<any>('PktEnt/PktEntDelete', Data)
  }

  PktEntGetSrNo(Data: any): Observable<any> {
    return this.http.post<any>('PktEnt/PktEntGetSrNo', Data)
  }

  async PrnIssMaxNo(Data: any) {
    return this.http.post<any>('PktEnt/PrnIssMaxNo', Data).toPromise()
  }

  PrnIssSave(Data: any): Observable<any> {
    return this.http.post<any>('PktEnt/PrnIssSave', Data)
  }

}
