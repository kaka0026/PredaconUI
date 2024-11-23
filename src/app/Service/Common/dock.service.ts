import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DockService {
  public url = environment.BaseUrl
  constructor(private http: HttpClient) { }

  async DockPrcPen(Data: any) {
    return this.http.post<any>('Dock/DockPrcPen', Data).toPromise()
  }
  async DockPrcPenDet(Data: any) {
    return this.http.post<any>('Dock/DockPrcPenDet', Data).toPromise()
  }
  async DockProduction(Data: any) {
    return this.http.post<any>('Dock/DockProduction', Data).toPromise()
  }
  async DockCurRoll(Data: any) {
    return this.http.post<any>('Dock/DockCurRoll', Data).toPromise()
  }
  async DockCurRollDet(Data: any) {
    return this.http.post<any>('Dock/DockCurRollDet', Data).toPromise()
  }
}
