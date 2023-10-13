import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'

import updateJSON from '../../../assets/data/update_log.json'
import miscJSON from '../../../assets/data/misc.json'

export interface UpdateLog {
    title: string;
    date: string;
    summary: string;
    changes: [];
}

@Injectable({
    providedIn: "root"
})
export class MiscService {getUpdateLog(): Observable<any> {
        const updateLog = updateJSON.map(update => {
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