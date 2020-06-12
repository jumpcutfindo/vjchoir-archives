import { Injectable, ViewChild, Renderer2, RendererFactory2 } from '@angular/core';

import menuJSON from '../../../assets/data/menu.json';
import { MenuItem } from '../model/MenuItem';
import { Observable, of, Subject } from 'rxjs';

const MENU_ARRAY = ['about', 'batches', 'sov', 'misc'];

@Injectable({
  providedIn: 'root',
})
export class NavControllerService {

  private renderer;
  
  private menuItems: MenuItem[];

  private clickedSongSource = new Subject<any>();
  clickedSong = this.clickedSongSource.asObservable();

  private clickedLinkSource = new Subject<any>();
  clickedLink = this.clickedLinkSource.asObservable();

  private routeUpdatesSource = new Subject<any>();
  routerUpdates = this.routeUpdatesSource.asObservable();

  private sidebarToggleSource = new Subject<any>();
  sidebarToggle = this.sidebarToggleSource.asObservable();

  private isSidebarActive = false;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  getMenuItems(): Observable<MenuItem[]> {
    if(!this.menuItems) {
        this.menuItems = menuJSON.items.map((x) => this.toMenuItem(x));
    } 

    return of(this.menuItems);
  }

  getDefaultActiveItem() {
    return this.menuItems[menuJSON.defaultActiveId];
  }

  private toMenuItem(x) {
    return {
      id: x.id,
      name: x.name,
      linkName: x.linkName,
      icon: x.icon,
      active: x.active,
      isVisible: x.isVisible,
    };
  }

  onSongClick(event: any) {
    this.clickedSongSource.next(event);
  }

  onLinkClick(event: any) {
    this.clickedLinkSource.next(event);
  }

  onRouteUpdate(value: any) {
    const url = value.url;
    
    let route = url.split('#')[0];
    let fragment = url.split('#')[1];
    
    for(let item of MENU_ARRAY) {
      if(route.includes(item)) {
        this.routeUpdatesSource.next({
          route: item,
          fragment: fragment,
          url: url
        });
        break;
      }
    }
  }
  
  toggleSidebar() {
    this.sidebarToggleSource.next();
    this.isSidebarActive = !this.isSidebarActive;

    if(this.isSidebarActive) {
      this.renderer.addClass(document.body, 'no-scroll');
    } else {
      this.renderer.removeClass(document.body, 'no-scroll');
    }
  }

  getIsSidebarActive() {
    return this.isSidebarActive;
  }
}
