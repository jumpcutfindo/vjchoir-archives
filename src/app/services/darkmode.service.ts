import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { Subject } from 'rxjs';

const IS_DARK_MODE_ID = "isDarkMode";

@Injectable({
  providedIn: "root",
})
export class DarkModeService {

  private themeToggledSource = new Subject<any>();
  themeToggled = this.themeToggledSource.asObservable();

  private renderer: Renderer2;
  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  getLocalSettings() {
    let isDarkMode = ('true' == localStorage.getItem(IS_DARK_MODE_ID));
    if(isDarkMode == null) {
        isDarkMode = false;
    }

    return isDarkMode;
  }

  setLightMode() {
    console.log("Turning on light mode!");
    this.renderer.removeClass(document.body, "dark-mode");
    this.renderer.addClass(document.body, "light-mode");

    this.themeToggledSource.next(false);
    localStorage.setItem(IS_DARK_MODE_ID, 'false');
  }

  setDarkMode() {
    const bool = true;
    console.log("Turning on dark mode!");
    this.renderer.addClass(document.body, "dark-mode");
    this.renderer.removeClass(document.body, "light-mode");

    this.themeToggledSource.next(true);
    localStorage.setItem(IS_DARK_MODE_ID, 'true');
  }
}
