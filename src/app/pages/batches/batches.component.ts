import { Component, OnInit } from '@angular/core';
import { BatchesService } from './batches.service';
import { BatchItem } from './model/BatchItem';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/loading/loading.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.scss']
})
export class BatchesComponent implements OnInit {

  batches: BatchItem[];
  batchesIntro: any;
  currActive: BatchItem;

  constructor(
    private activatedRoute: ActivatedRoute,
    private batchesService: BatchesService,
    private loadingService: LoadingService
  ) { 
  
  }

  ngOnInit() {
    this.batchesService.getIntro().subscribe(intro => this.batchesIntro = intro);

    combineLatest([this.batchesService.getBatches(), this.activatedRoute.url]).subscribe(([batches, urlData]) => {
      this.batches = batches;
      
      // Load batch based on the URL
      this.setBatch(urlData[1].path);

      this.loadingService.setLoading(false);
    });
  }

  setBatch(batchId: string): void {
    this.currActive = this.batches.find(batch => batch.id === batchId);
  }
}
