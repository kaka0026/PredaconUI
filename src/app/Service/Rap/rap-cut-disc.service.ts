import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RapCutDiscService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  RapCutDiscFill(Data: any): Observable<any> {
    return this.http.post<any>('RapCutDisc/RapCutDiscFill', Data)
  }
  RapCutdSave(Data: any): Observable<any> {
    return this.http.post<any>('RapCutDisc/RapCutdSave', Data)
  }
  RapCutdImport(Data: any): Observable<any> {
    return this.http.post<any>('RapCutDisc/RapCutdImport', Data)
  }
  RapCutdExport(Data: any): Observable<any> {
    return this.http.post<any>('RapCutDisc/RapCutdExport', Data)
  }
}
