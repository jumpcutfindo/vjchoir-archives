import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { HomeService } from './home.service';
import { Title } from '@angular/platform-browser';
import { LoadingService } from 'src/app/loading/loading.service';
import { DarkModeService } from 'src/app/services/darkmode.service';

const ARCHIVE_NAME = "The VJChoir Archives"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class HomeComponent implements OnInit {

  homeJSON;

  logoImage;

  test: string;

  constructor(private homeService: HomeService, 
    private titleService: Title,
    private loadingService: LoadingService,
    private darkModeService: DarkModeService) { }

  ngOnInit() {
    this.homeService.getContent()
      .subscribe(home => this.homeJSON = home);
    
    this.titleService.setTitle(ARCHIVE_NAME);
    
    this.loadingService.setLoading(false);

    this.setLogoImage(this.darkModeService.getLocalSettings());

    this.darkModeService.themeToggled.subscribe(value => {
      this.setLogoImage(value);
    })
  }

  setLogoImage(value: boolean) {
    if(value) {
      this.logoImage = this.homeJSON.header.image_dark;
    } else {
      this.logoImage = this.homeJSON.header.image_light;
    }
  }

}
