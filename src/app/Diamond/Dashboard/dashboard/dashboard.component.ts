import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { DashboardService } from './../../../Service/Dashboard/dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  clickEventsubscription: Subscription;

  displayStk = false;
  displayRec = false;
  displayRol = false;
  displayTm = false;
  displayMv = false;
  displayPp = false;
  displayTtm = false;

  viewCounter = []

  constructor(
    private DashboardServ: DashboardService,
    private toastr: ToastrService,
  ) {
    this.clickEventsubscription = this.DashboardServ.getClickEvent().subscribe(() => {
      this.close();
    })
  }

  ngOnInit(): void {
    this.close();
  }

  onPress(e: any) {

    if (this.viewCounter.includes(e)) {
      return;
    }

    if (this.viewCounter.length < 4) {
      this.viewCounter.push(e)
    } else {
      this.toastr.warning('Can not add more than 4 views, please close alredy opened views to add new.')
      return;
    }

    //this.display = true;

    //To toggle the component
    // this.displayStk = !this.displayStk;
    if (e == 'DashStockComponent') {
      this.displayStk = true;
    }
    if (e == 'DashRecieveComponent') {
      this.displayRec = true;
    }
    if (e == 'DashCurrollingComponent') {
      this.displayRol = true;
    }
    if (e == 'DashTodaymakeableComponent') {
      this.displayTm = true;
    }
    if (e == 'DashMakeableviewComponent') {
      this.displayMv = true;
    }
    if (e == 'DashPrependingComponent') {
      this.displayPp = true;
    }
    if (e == 'DashTop20markerComponent') {
      this.displayTtm = true;
    }
  }

  close() {
    this.DashboardServ.componentName$.subscribe(componentName => {
      switch (componentName) {
        case "DashCurrollingComponent":
          this.displayRol = false;
          this.removeView("DashCurrollingComponent")
          break;
        case "DashMakeableviewComponent":
          this.displayMv = false;
          this.removeView("DashMakeableviewComponent")
          break;
        case "DashPrependingComponent":
          this.displayPp = false;
          this.removeView("DashPrependingComponent")
          break;
        case "DashRecieveComponent":
          this.displayRec = false;
          this.removeView("DashRecieveComponent")
          break;
        case "DashStockComponent":
          this.displayStk = false;
          this.removeView("DashStockComponent")
          break;
        case "DashTodaymakeableComponent":
          this.displayTm = false;
          this.removeView("DashTodaymakeableComponent")
          break;
        case "DashTop20markerComponent":
          this.displayTtm = false;
          this.removeView("DashTop20markerComponent")
          break;
      }
    })
  }

  removeView(e: any) {
    const index = this.viewCounter.indexOf(e);
    if (index > -1) {
      if (e == "DashCurrollingComponent" || e == "DashMakeableviewComponent" || e == "DashPrependingComponent" || e == "DashRecieveComponent" || e == "DashStockComponent" || e == "DashTodaymakeableComponent" || e == "DashTop20markerComponent") {
        this.viewCounter.splice(index, 1);
      }
    }
  }

}
