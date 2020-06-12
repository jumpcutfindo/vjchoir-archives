import { Component, OnInit, HostListener } from '@angular/core';
import { BatchesService } from './batches.service';
import { BatchItem } from './model/BatchItem';
import { NavControllerService } from 'src/app/navigation/nav-controller/nav-controller.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoadingService } from 'src/app/loading/loading.service';

const BATCHES_NAME = "Batches";
const BATCH_OF = "Batch of ";

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.scss']
})
export class BatchesComponent implements OnInit {

  batches: BatchItem[];
  batchesIntro: any;
  currActive: BatchItem;

  constructor(private navControllerService: NavControllerService, 
    private batchesService: BatchesService, 
    private router: Router,
    private titleService: Title,
    private loadingService: LoadingService) { 
  
  }

  ngOnInit() {
    this.batchesService.getIntro().subscribe(intro => this.batchesIntro = intro);
    this.batchesService.getBatches().subscribe(batches => {
      this.batches = batches
      this.handleFragment();
    });
    
    this.navControllerService.routerUpdates.subscribe(val => {
      this.handleFragment();
    });
  }

  private handleFragment() {
    if (!this.router.url.includes("#")) {
      this.currActive = null;
    } else {
      let fragment = this.router.url.split("#")[1];
      for (let item of this.batches) {
        if (fragment.includes(item.id)) {
          this.currActive = item;
          this.titleService.setTitle(BATCH_OF + this.currActive.name);
          this.loadingService.setLoading(false);
          return;
        }
      }
      this.currActive = null;
    }
    
    this.titleService.setTitle(BATCHES_NAME);
    this.loadingService.setLoading(false);
  }
}
