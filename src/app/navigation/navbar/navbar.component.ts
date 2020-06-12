import { Component, Input, OnInit } from '@angular/core';
import { NavControllerService } from '../nav-controller/nav-controller.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() menu;
  @Input() controller;
  @Input() currActive;
  
  private navTitle: string;
  isSidebarActive = false;
  
  constructor(private navControllerService: NavControllerService) { }

  ngOnInit() {
    this.navTitle = this.currActive.name;

    this.navControllerService.sidebarToggle.subscribe(val => {
      this.isSidebarActive = !this.isSidebarActive;
    })
  }

  toggleSidebar() {
    this.navControllerService.toggleSidebar();
  }

}
