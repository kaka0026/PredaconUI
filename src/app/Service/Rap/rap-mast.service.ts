import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RapMastService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  RapTypeFill(Data: any): Observable<any> {
    return this.http.post<any>('RapMast/RapTypeFill', Data)
  }

  RapMastFill(Data: any): Observable<any> {
    return this.http.post<any>('RapMast/RapMastFill', Data)
  }

  async RapMastRapOrgRate(Data: any) {
    return this.http.post<any>('RapMast/RapMastRapOrgRate', Data).toPromise()
  }

  RapMastSave(Data: any): Observable<any> {
    return this.http.post<any>('RapMast/RapMastSave', Data)
  }

  RapMastExport(Data: any): Observable<any> {
    return this.http.post<any>('RapMast/RapMastExport', Data)
  }

  async RapMastImportUpdate(Data: any) {
    return this.http.post<any>('RapMast/RapMastImportUpdate', Data).toPromise()
  }

  async RapMastImport(Data: any) {
    return this.http.post<any>('RapMast/RapMastImport', Data).toPromise()
  }

}
