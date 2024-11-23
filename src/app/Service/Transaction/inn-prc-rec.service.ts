import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InnPrcRecService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  async InnPrcRecSaveCheck(Data: any) {
    return this.http.post<any>('InnPrcRec/InnPrcRecSaveCheck', Data).toPromise()
  }

  PrcInwSave(Data: any): Observable<any> {
    return this.http.post<any>('InnPrcRec/InnPrcRecSave', Data)
  }
  InnerPrcRecEntFill(Data: any): Observable<any> {
    return this.http.post<any>('InnPrcRec/InnerPrcRecEntFill', Data)
  }
}
