import { Injectable } from '@angular/core';

import aboutJSON from '../../../assets/data/about.json';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AboutService {

  constructor() { }

  getContent(): Observable<any> {
      return of(aboutJSON);
  }
}