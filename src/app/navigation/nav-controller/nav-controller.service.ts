import { Injectable, RendererFactory2 } from '@angular/core';

import menuJSON from '../../../assets/data/menu.json';
import { Observable, of, Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';

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

  private routeUpdatesSource = new Subject<any>();
  routerUpdates = this.routeUpdatesSource.asObservable();

  private sidebarToggleSource = new Subject<any>();
  sidebarToggle = this.sidebarToggleSource.asObservable();

  private navBarTitleSource = new Subject<string>();
  navBarTitleUpdates = this.navBarTitleSource.asObservable();

  private isSidebarActive = false;

  constructor(private rendererFactory: RendererFactory2,
    private titleService: Title) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  
  /**
   * Sets the navbar title.
   */
  setNavTitle(title: string): void {
    this.navBarTitleSource.next(title);
  }

  /**
   * Sets the window title.
   */
  setWindowTitle(title: string): void {
    this.titleService.setTitle(title);
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
