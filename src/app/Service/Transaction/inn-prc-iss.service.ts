import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InnPrcIssService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  async InnPrcISSCmbFill(Data: any) {
    return this.http.post<any>('InnPrcIss/InnPrcISSCmbFill', Data).toPromise()
  }

  async InnPrcIssSaveCheck(Data: any) {
    return this.http.post<any>('InnPrcIss/InnPrcIssSaveCheck', Data).toPromise()
  }

  async InnPrcIssCarat(Data: any) {
    return this.http.post<any>('InnPrcIss/InnPrcIssCarat', Data).toPromise()
  }

  InnPrcIssSave(Data: any): Observable<any> {
    return this.http.post<any>('InnPrcIss/InnPrcIssSave', Data)
  }

  InnPrcIssFill(Data: any): Observable<any> {
    return this.http.post<any>('InnPrcIss/InnPrcIssFill', Data)
  }

  InnerPrcIssPrintDet(Data: any): Observable<any> {
    return this.http.post<any>('InnPrcIss/InnerPrcIssPrintDet', Data)
  }

  InnerPrcIssPrint(Data: any): Observable<any> {
    return this.http.post<any>('InnPrcIss/InnerPrcIssPrint', Data)
  }

}
