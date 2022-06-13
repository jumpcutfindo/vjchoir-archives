import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/loading/loading.service';
import { PerformanceService } from './performance.service';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent implements OnInit {
  intro: any;

  constructor(private loadingSerivce: LoadingService,
    private performanceService: PerformanceService) { }

  ngOnInit(): void {
    this.performanceService.getPerformanceIntro().subscribe(intro => this.intro = intro);

    this.loadingSerivce.setLoading(false);
  }

}
