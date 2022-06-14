import {
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";

import { MenuItem, NavControllerService } from "./nav-controller.service";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { LoadingService } from 'src/app/loading/loading.service';
import { combineLatest } from "rxjs";

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

  isSidebarActive = false;
  shouldLoad: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navControllerService: NavControllerService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        // Handle sidebar switching to proper page
        const pageId = val.url.split('/')[1];
        this.currActive = this.menu.filter(item => item.id === pageId)[0];

        if (this.shouldLoad) this.loadingService.setLoading(true);
      }
    });

    this.navControllerService.sidebarToggle.subscribe(val => {
      this.isSidebarActive = !this.isSidebarActive;
    })

    combineLatest([this.navControllerService.getMenuItems(), this.activatedRoute.url]).subscribe(([menuData, urlData]) => {
      this.menu = menuData;

      // Determine which sidebar item should be active
      let page = urlData[0].path;
      if (!page) page = window.location.pathname.split("/")[1];
      this.setActiveItem(page);
    });

    this.controller = this;
  }

  /**
   * Sets the active menu item based on the id provided.
   */
  private setActiveItem(id: string) {
    const oldActiveId = this.currActive ? this.currActive.id : undefined;

    this.currActive = this.menu.find(item => item.id === id) ?? this.menu[0];

    this.shouldLoad = oldActiveId !== this.currActive.id;
  }

  onActivate(event): void {
    window.scrollTo(0, 0);
  }
}
