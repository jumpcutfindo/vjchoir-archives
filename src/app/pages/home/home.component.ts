import { Component, OnInit } from '@angular/core';

import { HomeEvent, HomeHeader, HomeService } from './home.service';
import { Title } from '@angular/platform-browser';
import { LoadingService } from 'src/app/loading/loading.service';
import { DarkModeService } from 'src/app/services/darkmode.service';
import { CommonService } from 'src/app/services/common.service';
import { MiscService } from '../misc/misc.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeService]
})

export class HomeComponent implements OnInit {
  // Content
  header: HomeHeader;
  featuredPhotos: string[];
  upcomingEvents: HomeEvent[];
  updateLogs: any[];

  logoImage;

  test: string;

  constructor(private homeService: HomeService, 
    private commonService: CommonService,
    private miscService: MiscService,
    private titleService: Title,
    private loadingService: LoadingService,
    private darkModeService: DarkModeService) { }

  ngOnInit() {
    // Update title
    this.titleService.setTitle(this.commonService.getArchiveName());

    // Retrieve header content
    this.homeService.getHeader()
      .subscribe(header => this.header = header);

    // Retrieve upcoming events
    this.homeService.getUpcomingEvents()
      .subscribe(events => this.upcomingEvents = events);
    
    // Retrieve photo content
    this.homeService.getFeaturedPhotos()
      .subscribe(photos => this.featuredPhotos = photos);

    // Retrieve update content
    this.miscService.getUpdateLog()
      .subscribe(updateLogs => this.updateLogs = updateLogs);

    // Logo settings
    this.setLogoImage(this.darkModeService.getLocalSettings());
    this.darkModeService.themeToggled.subscribe(value => {
      this.setLogoImage(value);
    })
    
    // Finish loading
    this.loadingService.setLoading(false);
  }

  /**
   * Determines which logo image to use depending on the settings
   */
  setLogoImage(value: boolean) {
    if(value) {
      this.logoImage = this.header.logo.dark;
    } else {
      this.logoImage = this.header.logo.light;
    }
  }

  /**
   * Directs user to a provided link
   */
  openLink(url: string) {
    if (url) window.open(url, "_blank");
  }
}
