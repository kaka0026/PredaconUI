import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InnPrcInwService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  InnInwFill(Data: any): Observable<any> {
    return this.http.post<any>('InnPrcInw/InnInwFill', Data)
  }

  InnInwSave(Data: any): Observable<any> {
    return this.http.post<any>('InnPrcInw/InnInwSave', Data)
  }
  async ChkInnInwSave(Data: any) {
    return this.http.post<any>('InnPrcInw/ChkInnInwSave', Data).toPromise()
  }
}
