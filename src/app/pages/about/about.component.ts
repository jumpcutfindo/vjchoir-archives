import { Component, OnInit } from "@angular/core";

import { AboutService } from "./about.service";
import { handleFragment, NavControllerService } from "src/app/navigation/nav-controller/nav-controller.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { LoadingService } from "src/app/loading/loading.service";
import { combineLatest, forkJoin, Observable } from "rxjs";

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
    private activatedRoute: ActivatedRoute,
    private aboutService: AboutService,
    private router: Router,
    private titleService: Title,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    /**
     * Retrieve about content, and set section accordingly
     */
    combineLatest([this.aboutService.getContent(), this.activatedRoute.url]).subscribe(([aboutData, urlData]) => {
      this.aboutJSON = aboutData;
      this.setSection(urlData[1].path);
    });

    this.loadingService.setLoading(false);
  }

  setSection(sectionId: string): void {
    console.log(this.aboutJSON.sections);
    this.currActive = this.aboutJSON.sections.find(section => section.id === sectionId);
  }
}
