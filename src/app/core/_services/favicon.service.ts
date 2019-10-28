import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';
import { fromEventPattern } from 'rxjs';
import { pluck } from 'rxjs/operators';

/**
 * A service to set the favicon.
 */
@Injectable({
  providedIn: 'root'
})
export class FaviconService {
  constructor(@Inject(DOCUMENT) private _doc: any) {}

  private darkScheme = '(prefers-color-scheme:dark)';
  private prefersColorScheme$ = fromEventPattern(handler => window.matchMedia(this.darkScheme).addListener(handler)).pipe(pluck('matches'));

  /**
   * Set the title of the current HTML document.
   * @param iconURL - Default favicon URL
   * @param altIconURL - Optional, dark theme favicon URL
   */
  setFavicon(iconURL: string, altIconURL?: string) {
    const link = getDOM().querySelector(this._doc, "link[rel*='icon']") || getDOM().createElement('link');

    if (altIconURL && window.matchMedia(this.darkScheme).matches) {
      this.appendLinkTag(link, altIconURL);
      this.subscribeToChangesInTheme(link, iconURL, altIconURL);
    } else {
      this.appendLinkTag(link, iconURL);
    }
  }

  /**
   * Subscribe to the theme color changes in browser/OS and apply the appropiate favicon
   * @param link - DOM element
   * @param iconURL - Default favicon URL
   * @param altIconURL - Optional, dark theme favicon URL
   */
  private subscribeToChangesInTheme(link: any, iconURL: string, altIconURL: string) {
    this.prefersColorScheme$.subscribe(isDarkTheme => {
      if (isDarkTheme) {
        this.appendLinkTag(link, altIconURL);
      } else {
        this.appendLinkTag(link, iconURL);
      }
    });
  }

  /**
   * Append new link to HEAD
   * @param link - DOM element
   * @param iconURL - favicon URL
   */
  private appendLinkTag(link: any, iconURL: string) {
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = iconURL;
    getDOM()
      .getElementsByTagName(this._doc, 'head')[0]
      .appendChild(link);
  }
}
