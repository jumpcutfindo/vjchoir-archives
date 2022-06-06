import { Injectable } from '@angular/core';

import homeJSON from '../../../assets/data/home.json';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class HomeHeader {
  title: string;
  logo: {
    light: string;
    dark: string;
  };
  message: string;
}

export class HomeService {
  /**
   * Retreive the information for the home header
   */
  getHeader(): Observable<HomeHeader> {
    return of(<HomeHeader> homeJSON.header);
  }

  /**
   * Retrieve the photos to be used in the 'Featured Photos' carousel.
   * Ensure that: 
   * 1. Number of photos indicated in the file is correct, 
   * 2. File formats are correct
   */
  getFeaturedPhotos(): Observable<string[]> {
    const location = homeJSON.featured_photos.location;
    const base = homeJSON.featured_photos.base_name;
    const filetype = homeJSON.featured_photos.filetype;
    const count = homeJSON.featured_photos.count;

    const photos = [];
    for (let i = 0; i < count; i++) {
      photos.push(location + "/" + base + i + "." + filetype);
    }

    return of(photos);
  }
}