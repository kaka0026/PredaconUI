import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RapShdDiscService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  RapShdDiscFill(Data: any): Observable<any> {
    return this.http.post<any>('RapShdDisc/RapShdDiscFill', Data)
  }
  RapShdDiscSave(Data: any): Observable<any> {
    return this.http.post<any>('RapShdDisc/RapShdDiscSave', Data)
  }
  RapShdDiscImport(Data: any): Observable<any> {
    return this.http.post<any>('RapShdDisc/RapShdDiscImport', Data)
  }
  RapShdDiscExport(Data: any): Observable<any> {
    return this.http.post<any>('RapShdDisc/RapShdDiscExport', Data)
  }
}

