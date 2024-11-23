import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrdEntService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  GrdEntDisplay(Data: any): Observable<any> {
    return this.http.post<any>('GrdEnt/GrdEntDisplay', Data)
  }

  GrdEntSaveData(Data: any): Observable<any> {
    return this.http.post<any>('GrdEnt/GrdEntSaveData', Data)
  }

  GIAEntSave(Data: any): Observable<any> {
    return this.http.post<any>('GrdEnt/GIAEntSave', Data)
  }


}
