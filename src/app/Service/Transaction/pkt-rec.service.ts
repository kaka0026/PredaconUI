import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PktRecService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  async FNPktRcvEntFill(Data: any) {
    return this.http.post<any>('PktRec/FNPktRcvEntFill', Data).toPromise()
  }

  PktRcvEntFill(Data: any): Observable<any> {
    return this.http.post<any>('PktRec/PktRcvEntFill', Data)
  }

  PktRecSecFill(Data: any): Observable<any> {
    return this.http.post<any>('PktRec/PktRecSecFill', Data)
  }

  async PktRecSecSave(Data: any) {
    return this.http.post<any>('PktRec/PktRecSecSave', Data).toPromise()
  }

  PktUsecDetail(Data: any): Observable<any> {
    return this.http.post<any>('PktRec/PktUsecDetail', Data)
  }

  FNPktRecEntDelete(Data: any) {
    return this.http.post<any>('PktRec/FNPktRecEntDelete', Data).toPromise()
  }

  PktRecEntDelete(Data: any): Observable<any> {
    return this.http.post<any>('PktRec/PktRecEntDelete', Data)
  }

  PktTrnEntSaveDelete(Data: any): Observable<any> {
    return this.http.post<any>('PktRec/PktTrnEntSaveDelete', Data)
  }

  PktRecSecForkSave(Data: any): Observable<any> {
    return this.http.post<any>('PktRec/PktRecSecSave', Data)
  }
}
