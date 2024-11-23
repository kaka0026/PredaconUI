import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public url = environment.BaseUrl

  // private subject = new Subject<any>();
  private subject: Subject<any> = new Subject<any>();
  componentName$: Observable<any> = this.subject.asObservable();

  constructor(private http: HttpClient) { }

  async FillAllMaster(Data: any) {
    return this.http.post<any>('Dashboard/FillAllMaster', Data).toPromise()
  }

  DashStockFill(Data: any): Observable<any> {
    return this.http.post<any>('Dashboard/DashStockFill', Data)
  }

  DashReceiveFill(Data: any): Observable<any> {
    return this.http.post<any>('Dashboard/DashReceiveFill', Data)
  }

  DashReceiveStockConfirm(Data: any): Observable<any> {
    return this.http.post<any>('Dashboard/DashReceiveStockConfirm', Data)
  }

  DashCurrentRollingFill(Data: any): Observable<any> {
    return this.http.post<any>('Dashboard/DashCurrentRollingFill', Data)
  }

  DashTodayMakeableFill(Data: any): Observable<any> {
    return this.http.post<any>('Dashboard/DashTodayMakeableFill', Data)
  }

  DashMakeableViewFill(Data: any): Observable<any> {
    return this.http.post<any>('Dashboard/DashMakeableViewFill', Data)
  }

  DashPredictionPendingFill(Data: any): Observable<any> {
    return this.http.post<any>('Dashboard/DashPredictionPendingFill', Data)
  }

  DashTop20MarkerFill(Data: any): Observable<any> {
    return this.http.post<any>('Dashboard/DashTop20MarkerFill', Data)
  }

  sendClickEvent(componentName) {
    this.subject.next(componentName);
  }

  sendOnlyClickEvent() {
    this.subject.next();
  }

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}
