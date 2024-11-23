import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PartyPrcMastService {
  public url = environment.BaseUrl

  constructor(private http: HttpClient) { }

  PartyPrcMastFill(Data: any): Observable<any> {
    return this.http.post<any>('PartyPrcMast/PartyPrcMastFill', Data)
  }

  PartyPrcMastSave(Data: any): Observable<any> {
    return this.http.post<any>('PartyPrcMast/PartyPrcMastSave', Data)
  }

  PartyPrcMastDelete(Data: any): Observable<any> {
    return this.http.post<any>('PartyPrcMast/PartyPrcMastDelete', Data)
  }

}
