import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'

import updateJSON from '../../../assets/data/updatelog.json'
import miscJSON from '../../../assets/data/misc.json'
import { UpdateLog } from './model/UpdateLog';

@Injectable({
    providedIn: "root"
})

export class MiscService {
    constructor() {
    
    }
    
    getUpdateLog(): Observable<any> {
        let updateLog = updateJSON.map(update => {
            return {
                title: update.title,
                date: update.date,
                summary: update.summary,
                changes: update.items.map(change => {
                    return change;
                })
            }
        });

        return of(updateLog);
    }

    getContent(): Observable<any> {
        return of(miscJSON);
    }
}