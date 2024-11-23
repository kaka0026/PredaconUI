import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrcMakeableService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  async PrcMakTagCheck(Data: any) {
    return this.http.post<any>('PrcMakeable/PrcMakTagCheck', Data).toPromise()
  }

  async FrmPrcMakDisp(Data: any) {
    return this.http.post<any>('PrcMakeable/FrmPrcMakDisp', Data).toPromise()
  }

  FrmPrcMakSaveData(Data: any): Observable<any> {
    return this.http.post<any>('PrcMakeable/FrmPrcMakSaveData', Data)
  }

  FrmPrcMakEntSave(Data: any): Observable<any> {
    return this.http.post<any>('PrcMakeable/FrmPrcMakEntSave', Data)
  }
}

