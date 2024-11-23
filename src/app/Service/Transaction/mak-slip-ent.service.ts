import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MakSlipEntService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  async MakSlipInoEnt(Data: any) {
    return this.http.post<any>('MakSlipEnt/MakSlipInoEnt', Data).toPromise()
  }

  MakSlipInoEntSave(Data: any): Observable<any> {
    return this.http.post<any>('MakSlipEnt/MakSlipInoEntSave', Data)
  }

  MakInoEntFill(Data: any): Observable<any> {
    return this.http.post<any>('MakSlipEnt/MakInoEntFill', Data)
  }

  MakInoEntPrint(Data: any): Observable<any> {
    return this.http.post<any>('MakSlipEnt/MakInoEntPrint', Data)
  }

}
