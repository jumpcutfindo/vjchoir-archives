import { Component, Input, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/darkmode.service';
import { MenuItem, NavControllerService } from '../nav-controller/nav-controller.service';

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

  constructor(private navControllerSerivce: NavControllerService, private darkModeService: DarkModeService) { }

  ngOnInit() {
    this.isDarkMode = this.darkModeService.getLocalSettings();
    this.turnOnMode();
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
