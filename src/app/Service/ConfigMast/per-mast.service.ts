import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PerMastService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  PerMastFill(Data: any): Observable<any> {
    return this.http.post<any>('PerMast/PerMastFill', Data)
  }

  PerMastSave(Data: any): Observable<any> {
    return this.http.post<any>('PerMast/PerMastSave', Data)
  }

  PerMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('PerMast/PerMastDelete', Data)
  }

  PerMastCopy(Data: any): Observable<any> {
    return this.http.post<any>('PerMast/PerMastCopy', Data)
  }

}
