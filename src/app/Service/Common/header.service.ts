import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private sharedData: Subject<any> = new Subject<any>();
  sharedData$: Observable<any> = this.sharedData.asObservable();

  private sideBarToggle = new Subject<any>();

  private sharedPageName: Subject<any> = new Subject<any>();
  sharedPageName$: Observable<any> = this.sharedPageName.asObservable();

  constructor() { }

  setData(updatedData) {
    this.sharedData.next(updatedData);
  }

  SetPageTitle(PageName) {
    this.sharedPageName.next(PageName);
  }

  sendSidebarClickEvent() {
    this.sideBarToggle.next();
  }

  getSidebarClickEvent(): Observable<any> {
    return this.sideBarToggle.asObservable();
  }

}
