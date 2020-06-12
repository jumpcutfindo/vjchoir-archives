import { Injectable } from "@angular/core";

import batchesJSON from "../../../assets/data/batches.json";
import { Observable, of } from "rxjs";
import { BatchItem } from "./model/BatchItem";

@Injectable({
  providedIn: "root",
})
export class BatchesService {
  private batchesItems: BatchItem[];

  constructor() {}

  getBatches(): Observable<any> {
    if (!this.batchesItems) {
      this.batchesItems = batchesJSON.batches.map((batch) => {
        let tempItem: BatchItem = {
          id: batch.id,
          name: batch.name,
          image: batch.image,
          desc: batch.desc,
          comms: batch.comms,
          sections: batch.sections,
        };

        if (batch.photos) {
          tempItem.photos = batch.photos;
        }

        return tempItem;
      });
    }
    return of(this.batchesItems);
  }

  getIntro(): Observable<any> {
      return of(batchesJSON.intro);
  }
}
