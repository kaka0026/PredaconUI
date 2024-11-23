import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RapOrgService {
  public url = environment.BaseUrl

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  RapOrgFill(Data: any): Observable<any> {
    return this.http.post<any>('RapOrg/RapOrgFill', Data)
  }

  async RapOrgSave(Data: any) {
    return this.http.post<any>('RapOrg/RapOrgSave', Data).toPromise()
  }

  RapDownload(Data: any): Observable<any> {
    return this.http.post<any>('RapOrg/RapDownload', Data)
  }
}
