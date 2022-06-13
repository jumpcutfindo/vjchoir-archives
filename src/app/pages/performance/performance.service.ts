import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import performancesJSON from '../../../assets/data/performances.json';
import { SymphVoices } from "../listen/listen.service";

export interface MediaSection {
    link?: string,
    title?: string,
    description: string,
}

export interface ImageSection extends MediaSection {
    image: string
}

export interface Performance {
    title: string,
    description?: string,
    link?: string,
    location?: string,
    image?: string,
    time: {
        start: number,
        end?: number
    },
    media?: MediaSection[] 
}

@Injectable({
    providedIn: 'root',
})
export class PerformanceService {
    getPerformanceIntro() {
        return of(performancesJSON.intro);
    }
    
    getPerformances(): Observable<Performance[]> {
        return of(performancesJSON.performances);
    }

    mapSOVtoPerformance(sovs: SymphVoices[]): Performance[] {
        return sovs.map(sov => {
            return <Performance>{
                title: sov.title,
                link: `/sov/${sov.id}`,
                location: sov.info.venue,
                image: sov.artwork,
                time: {
                    start: sov.info.date
                }
            };
        });
    }
}