import { Component, OnInit, HostListener } from "@angular/core";

import { AboutService } from "./about.service";
import { NavControllerService } from "src/app/navigation/nav-controller/nav-controller.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { Title } from '@angular/platform-browser';
import { LoadingService } from 'src/app/loading/loading.service';

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
})
export class AboutComponent implements OnInit {
  aboutJSON: any;
  currActive;

  constructor(
    private navControllerService: NavControllerService,
    private aboutService: AboutService,
    private router: Router,
    private titleService: Title,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.aboutService.getContent().subscribe((about) => {
      this.aboutJSON = about;
      this.handleFragment();
    });

    this.navControllerService.routerUpdates.subscribe(val => {
      this.handleFragment();
    });

    this.loadingService.setLoading(false);
  }

  private handleFragment() {
    if (!this.router.url.includes("#")) {
      this.currActive = this.aboutJSON.sections[0];
    } else {
      let fragment = this.router.url.split("#")[1];
      for (let item of this.aboutJSON.sections) {
        if (fragment.includes(item.id)) {
          this.currActive = item;
          break;
        }
      }
    }
    this.titleService.setTitle(this.currActive.title);
    this.loadingService.setLoading(false);
  }
}
