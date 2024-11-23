import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CutMastService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  CutMastFill(Data: any): Observable<any> {
    return this.http.post<any>('CutMast/CutMastFill', Data)
  }

  CutMastSave(Data: any): Observable<any> {
    return this.http.post<any>('CutMast/CutMastSave', Data)
  }

  CutMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('CutMast/CutMastDelete', Data)
  }

}
