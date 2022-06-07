import { Component, OnInit } from "@angular/core";

import { AboutService } from "./about.service";
import { ActivatedRoute } from "@angular/router";
import { LoadingService } from "src/app/loading/loading.service";
import { combineLatest } from "rxjs";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
})
export class AboutComponent implements OnInit {
  aboutJSON: any;
  currActive;

  constructor(
    private activatedRoute: ActivatedRoute,
    private aboutService: AboutService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    /**
     * Retrieve about content, and set section accordingly
     */
    combineLatest([this.aboutService.getContent(), this.activatedRoute.url]).subscribe(([aboutData, urlData]) => {
      this.aboutJSON = aboutData;

      // Load section based on the URL
      this.setSection(urlData[1].path);
    });

    this.loadingService.setLoading(false);
  }

  /**
   * Sets the section based on the section id provided
   */
  setSection(sectionId: string): void {
    this.currActive = this.aboutJSON.sections.find(section => section.id === sectionId);
  }
}
