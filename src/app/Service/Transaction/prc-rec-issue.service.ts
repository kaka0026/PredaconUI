import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrcRecIssueService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  PrcRecIssueCarat(Data: any): Observable<any> {
    return this.http.post<any>('PrcRecIssue/PrcRecIssueCarat', Data)
  }

  async PrcRecIssueSaveCheck(Data: any) {
    return this.http.post<any>('PrcRecIssue/PrcRecIssueSaveCheck', Data).toPromise()
  }

  PrcRecIssueSave(Data: any): Observable<any> {
    return this.http.post<any>('PrcRecIssue/PrcRecIssueSave', Data)
  }

  PrcRecIssueFill(Data: any): Observable<any> {
    return this.http.post<any>('PrcRecIssue/PrcRecIssueFill', Data)
  }

  PktRecEntPrint(Data: any): Observable<any> {
    return this.http.post<any>('PrcRecIssue/PktRecEntPrint', Data)
  }
}
