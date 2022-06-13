import { Injectable } from '@angular/core';

import homeJSON from '../../../assets/data/home.json';
import { Observable, of } from 'rxjs';

export class HomeHeader {
  title: string;
  logo: {
    light: string;
    dark: string;
  };
  message: string;
}

export class HomeEvent {
  title: string;
  description: string;
  time: number;
  link?: string;
  daysRemaining: number;
}

@Injectable({
  providedIn: 'root',
})
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

  /**
   * Retrieve any upcoming events entered into the website.
   * Example:
   * {
      "title": "SOV2022",
      "description": "Symphony of Voices 2022 will be at the Esplanade!",
      "time": 1655895600000,
      "link": "https://www.example.com/"
    },
   */
  getUpcomingEvents(): Observable<HomeEvent[]> {
    let rawEvents = homeJSON.upcoming_events;
    rawEvents = rawEvents.filter(e => e.time > Date.now());

    const events: HomeEvent[] = rawEvents.map(event => {
      return {
        title: event.title,
        description: event.description,
        time: event.time,
        link: event.link,
        daysRemaining: Math.floor((event.time - Date.now()) / 8.64e7)
      }
    });

    return of(events);
  }
}