import { Injectable } from "@angular/core";
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class LoadingService {
    
    private loadingUpdatesSource = new Subject<any>();
    loadingUpdates = this.loadingUpdatesSource.asObservable();
    
    constructor() {

    }

    setLoading(value: boolean) {
        this.loadingUpdatesSource.next(value);
    }
}