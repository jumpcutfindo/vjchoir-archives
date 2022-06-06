import {
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MenuItem } from "../model/MenuItem";

import { NavControllerService } from "./nav-controller.service";
import { Router, NavigationEnd } from "@angular/router";
import { LoadingService } from 'src/app/loading/loading.service';

@Component({
  selector: "nav-controller",
  templateUrl: "./nav-controller.component.html",
  styleUrls: ["./nav-controller.component.scss"],
})
export class NavControllerComponent implements OnInit {
  @ViewChild('sidebar') sidebar;

  menu: MenuItem[];
  controller: NavControllerComponent;
  currActive: MenuItem;

  isSidebarActive: boolean = false;

  constructor(
    private navControllerService: NavControllerService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.loadingService.setLoading(true);
        this.navControllerService.onRouteUpdate(val);
        this.navigateToLink(val.url);
      }
    });
    this.navControllerService.clickedLink.subscribe((val) => {
      this.navigateToLink(val);
    });

    this.navControllerService.sidebarToggle.subscribe(val => {
      this.isSidebarActive = !this.isSidebarActive;
    })
  }

  ngOnInit() {
    this.getMenu();
    this.setCurrActive();
    this.controller = this;
  }

  private getMenu() {
    this.navControllerService
      .getMenuItems()
      .subscribe((menu) => (this.menu = menu));
  }

  private setCurrActive() {
    const windowName = window.location.href;

    for (let i = 0; i < this.menu.length; i++) {
      let item = this.menu[i];

      if (windowName.includes(item.linkName)) {
        this.currActive = item;
        break;
      }
    }

    if (!this.currActive) {
      this.currActive = this.navControllerService.getDefaultActiveItem();
    }
  }

  navigateTo(item) {
    this.currActive = item;

    window.scroll(0, 0);
  }


  pages = ['home', 'about', 'batches', 'sov', 'listen', 'contribute', 'misc']
  navigateToLink(url: string) {
    for(let i = 0; i < this.pages.length; i ++) {
      let sourceUrl = url.split("#")[0];

      if(sourceUrl.toLowerCase().includes(this.pages[i])) {
        let temp = this.menu.filter(x => x.linkName.includes(this.pages[i]));
        this.navigateTo(temp[0]);
        return;
      }
    }
  }
}
