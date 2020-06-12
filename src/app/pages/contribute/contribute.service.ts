import { Injectable } from "@angular/core";

import contributeJSON from "../../../assets/data/contribute.json";
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';

const HTTP_OPTIONS = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    }) 
}

const FORM_URL = "https://formspree.io/xbjzyjdk";

@Injectable({
    providedIn: "root",
})

export class ContributeService {
    constructor(private http: HttpClient) {

    }

    getContent(): Observable<any> {
        return of(contributeJSON);
    }

    sendFormToServer(data: any) {
        return this.http.post(FORM_URL, data, HTTP_OPTIONS);
    }
}