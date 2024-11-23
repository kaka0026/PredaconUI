import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RapFloDiscService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  RapFloDiscFill(Data: any): Observable<any> {
    return this.http.post<any>('RapFloDisc/RapFloDiscFill', Data)
  }
  RapFloDiscSave(Data: any): Observable<any> {
    return this.http.post<any>('RapFloDisc/RapFloDiscSave', Data)
  }
  RapFloDiscImport(Data: any): Observable<any> {
    return this.http.post<any>('RapFloDisc/RapFloDiscImport', Data)
  }
  RapFloDiscExport(Data: any): Observable<any> {
    return this.http.post<any>('RapFloDisc/RapFloDiscExport', Data)
  }
}
