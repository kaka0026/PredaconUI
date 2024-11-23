import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MakInwService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  MakInwChk(Data: any): Observable<any> {
    return this.http.post<any>('MakInw/MakInwChk', Data)
  }

  MakInwDisp(Data: any): Observable<any> {
    return this.http.post<any>('MakInw/MakInwDisp', Data)
  }

  MakInwdSave(Data: any): Observable<any> {
    return this.http.post<any>('MakInw/MakInwdSave', Data)
  }

}
