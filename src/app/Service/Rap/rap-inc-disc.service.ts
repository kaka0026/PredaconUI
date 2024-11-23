import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RapIncDiscService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  RapIncDiscFill(Data: any): Observable<any> {
    return this.http.post<any>('RapIncDisc/RapIncDiscFill', Data)
  }
  RapIncDiscSave(Data: any): Observable<any> {
    return this.http.post<any>('RapIncDisc/RapIncDiscSave', Data)
  }
  RapIncDiscImport(Data: any): Observable<any> {
    return this.http.post<any>('RapIncDisc/RapIncDiscImport', Data)
  }
  RapIncDiscExport(Data: any): Observable<any> {
    return this.http.post<any>('RapIncDisc/RapIncDiscExport', Data)
  }
}
