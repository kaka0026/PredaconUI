import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanFnlEntService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  async PlnFnlChk(Data: any) {
    return this.http.post<any>('PlanFnlEnt/PlnFnlChk', Data).toPromise()
  }
  async PlnFnlEnt(Data: any) {
    return this.http.post<any>('PlanFnlEnt/PlnFnlEnt', Data).toPromise()
  }
  PlnFnlFill(Data: any): Observable<any> {
    return this.http.post<any>('PlanFnlEnt/PlnFnlFill', Data)
  }
}
