import { Injectable, RendererFactory2 } from '@angular/core';

import menuJSON from '../../../assets/data/menu.json';
import { Observable, of, Subject } from 'rxjs';

export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  isVisible?: boolean;
}

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

  /**
   * Retrieves the menu (sidebar) items
   */
  getMenuItems(): Observable<MenuItem[]> {
    if(!this.menuItems) {
        this.menuItems = menuJSON.items.map((x) => this.toMenuItem(x));
    } 

    return of(this.menuItems);
  }

  /**
   * Retrieves the default menu item (i.e. home page)
   */
  getDefaultActiveItem() {
    return this.menuItems[menuJSON.defaultActiveId];
  }

  /**
   * Convert a set of properties into a menu item
   */
  private toMenuItem(x) {
    return {
      id: x.id,
      name: x.name,
      icon: x.icon,
      isVisible: x.isVisible === undefined ? true : x.isVisible,
    };
  }

  /**
   * Handles the event when a song is clicked
   */
  onSongClick(event: any) {
    this.clickedSongSource.next(event);
  }

  /**
   * Handles the event when a link is clicked
   */
  onLinkClick(event: any) {
    this.clickedLinkSource.next(event);
  }
  
  /**
   * Toggles the sidebar.
   */
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
