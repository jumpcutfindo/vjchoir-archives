import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";

import commonJSON from '../../assets/data/common.json';

/**
 * This service provides the different components and services with information deemed to be
 * constant throughout the application.
 */
@Injectable({
    providedIn: "root",
})
export class CommonService {
    getArchiveName(): string {
        return commonJSON.archive_name;
    }
}