import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RapParamDiscService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  RapParamDiscFill(Data: any): Observable<any> {
    return this.http.post<any>('RapParamDisc/RapParamDiscFill', Data)
  }
  RapParamDiscSave(Data: any): Observable<any> {
    return this.http.post<any>('RapParamDisc/RapParamDiscSave', Data)
  }
  RapParamDiscImport(Data: any): Observable<any> {
    return this.http.post<any>('RapParamDisc/RapParamDiscImport', Data)
  }
  RapParamDiscExport(Data: any): Observable<any> {
    return this.http.post<any>('RapParamDisc/RapParamDiscExport', Data)
  }
}
