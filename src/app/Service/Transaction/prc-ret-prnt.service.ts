import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrcRetPrntService {

  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }


  async FNPrcRetPrntDisp(Data: any) {
    return this.http.post<any>('PrcRetPrnt/FNPrcRetPrntDisp', Data).toPromise()
  }

  PrcRetSlipFill(Data: any): Observable<any> {
    return this.http.post<any>('PrcRetPrnt/PrcRetSlipFill', Data)
  }

  PrcRetSlipSave(Data: any): Observable<any> {
    return this.http.post<any>('PrcRetPrnt/PrcRetSlipSave', Data)
  }

  // UsecDetFill(Data:any):Observable<any>{
  //   return this.http.post<any>('PrcRetPrnt/UsecDetFill',Data)
  // }

}
