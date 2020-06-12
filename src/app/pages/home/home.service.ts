import { Injectable } from '@angular/core';

import homeJSON from '../../../assets/data/home.json';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {

  constructor() { }

  getContent(): Observable<any> {
      return of(homeJSON);
  }
}