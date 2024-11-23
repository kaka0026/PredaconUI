import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TallyViewService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  InnPrcTallyFGrdView(Data: any): Observable<any> {
    return this.http.post<any>('TallyView/InnPrcTallyFGrdView', Data)
  }

  InnPrcTallySGrdView(Data: any): Observable<any> {
    return this.http.post<any>('TallyView/InnPrcTallySGrdView', Data)
  }

  TallyTotal(Data: any): Observable<any> {
    return this.http.post<any>('TallyView/TallyTotal', Data)
  }

  InnerPrcTallyClear(Data: any): Observable<any> {
    return this.http.post<any>('TallyView/InnerPrcTallyClear', Data)
  }

  InnerPrcTally(Data: any): Observable<any> {
    return this.http.post<any>('TallyView/InnerPrcTally', Data)
  }

  async InnerPrcChkPcTally(Data: any) {
    return this.http.post<any>('TallyView/InnerPrcChkPcTally', Data).toPromise()
  }
}
