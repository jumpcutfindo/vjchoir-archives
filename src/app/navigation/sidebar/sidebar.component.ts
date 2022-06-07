import { Component, Input, OnInit } from '@angular/core';
import { AppRoutingModule } from '../../app-routing/app-routing.module';

import { MenuItem } from "../model/MenuItem";
import { DarkModeService } from 'src/app/services/darkmode.service';
import { NavControllerService } from '../nav-controller/nav-controller.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() sidebarItems;
  @Input() controller;
  @Input() currActive;

  isDarkMode: boolean;

  sidebarActiveItem: MenuItem;

  constructor(private navControllerSerivce: NavControllerService, private darkModeService: DarkModeService) { }

  ngOnInit() {
    this.currActive.active = true;
    this.sidebarActiveItem = this.currActive;
    this.isDarkMode = this.darkModeService.getLocalSettings();
    this.turnOnMode();
  }

  setActive() {
    this.sidebarActiveItem.active = false;
    this.sidebarActiveItem = this.currActive;
    this.currActive.active = true;
  }

  changeMode() {
    this.turnOnMode();
  }

  turnOnMode() {
    if(this.isDarkMode) {
      this.darkModeService.setDarkMode();
    } else {
      this.darkModeService.setLightMode();
    }
  }

  toggleSidebar() {
    if(window.innerWidth <= 1024) {
      this.navControllerSerivce.toggleSidebar();
    }
  }
}
