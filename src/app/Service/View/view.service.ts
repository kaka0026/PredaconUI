import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  PacketView(Data: any): Observable<any> {
    return this.http.post<any>('View/PacketView', Data)
  }

  PacketViewTotal(Data: any): Observable<any> {
    return this.http.post<any>('View/PacketViewTotal', Data)
  }

  ProcessView(Data: any): Observable<any> {
    return this.http.post<any>('View/ProcessView', Data)
  }

  ProcessViewTotal(Data: any): Observable<any> {
    return this.http.post<any>('View/ProcessViewTotal', Data)
  }

  PrcViewPrint(Data: any): Observable<any> {
    return this.http.post<any>('View/PrcViewPrint', Data)
  }

  PrcViewDetPrint(Data: any): Observable<any> {
    return this.http.post<any>('View/PrcViewDetPrint', Data)
  }

  PktViewPrint(Data: any): Observable<any> {
    return this.http.post<any>('View/PktViewPrint', Data)
  }

  InnerPacketView(Data: any): Observable<any> {
    return this.http.post<any>('View/InnerPacketView', Data)
  }

  InnerPacketViewTotal(Data: any): Observable<any> {
    return this.http.post<any>('View/InnerPacketViewTotal', Data)
  }

  InnerProcessView(Data: any): Observable<any> {
    return this.http.post<any>('View/InnerProcessView', Data)
  }

  InnerProcessViewTotal(Data: any): Observable<any> {
    return this.http.post<any>('View/InnerProcessViewTotal', Data)
  }

  InnPktViewPrint(Data: any): Observable<any> {
    return this.http.post<any>('View/InnPktViewPrint', Data)
  }

  InnPrcViewPrint(Data: any): Observable<any> {
    return this.http.post<any>('View/InnPrcViewPrint', Data)
  }

}
