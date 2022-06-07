import { Injectable, ViewChild, Renderer2, RendererFactory2 } from '@angular/core';

import menuJSON from '../../../assets/data/menu.json';
import { MenuItem } from '../model/MenuItem';
import { Observable, of, Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';

const MENU_ARRAY = ['about', 'batches', 'sov', 'misc'];

/**
 * Handles fragments (e.g. sov#2019) and sets the appropriate section
 * based on the provided fragments. Also updates the title accordingly.
 */
 export const handleFragment = (url: string, fragments: any[], titleService?: Title) => {
  if (!url.includes("#")) return fragments[0];

  const fragmentId = url.split("#")[1];
  let resultFragment = fragments[0];
  for (const fragment of fragments) {
    if (fragmentId === fragment.id) {
      resultFragment = fragments.indexOf(fragment);
      break;
    }
  }
  
  if (titleService) titleService.setTitle(resultFragment.title);

  return resultFragment;
};

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
      linkName: x.linkName,
      icon: x.icon,
      active: x.active,
      isVisible: x.isVisible,
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
