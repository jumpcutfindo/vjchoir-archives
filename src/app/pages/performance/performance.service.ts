import { Injectable } from "@angular/core";
import { of } from "rxjs";
import performancesJSON from '../../../assets/data/performances.json';

export interface MediaSource {
    link?: string,
    title?: string,
    description: string,
}

export interface Performance {
    title: string,
    description: string,
    time: number,
    media: MediaSource[] 
}

@Injectable({
    providedIn: 'root',
})
export class PerformanceService {
    getPerformanceIntro() {
        return of(performancesJSON.intro);
    }
    
    getPerformances(): Performance[] {
        return performancesJSON.performances;
    }
}