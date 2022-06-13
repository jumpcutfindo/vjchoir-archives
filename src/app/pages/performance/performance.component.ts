import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest } from 'rxjs';
import { LoadingService } from 'src/app/loading/loading.service';
import { SovService } from '../sov/sov.service';
import { Performance, PerformanceService } from './performance.service';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent implements OnInit {
  intro: any;
  performances: Record<string, Performance[]>;

  openedPerformance: Performance;

  constructor(private loadingSerivce: LoadingService,
    private performanceService: PerformanceService,
    private sovService: SovService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    // Retrieve component information
    this.performanceService.getPerformanceIntro().subscribe(intro => this.intro = intro);

    combineLatest([this.performanceService.getPerformances(), this.sovService.getSovInfo()]).subscribe(([performances, sovs]) => {
      this.performances = {};

      // Add SOVs to performances
      performances = performances.concat(this.performanceService.mapSOVtoPerformance(sovs));

      // Sort from latest to earliest
      const sortedPerformances = performances.sort((a, b) => b.time.start - a.time.start);

      const earliestYear = new Date(sortedPerformances[sortedPerformances.length - 1].time.start).getFullYear();
      const latestYear = new Date(sortedPerformances[0].time.start).getFullYear();

      // Split the performances into years
      for (let i = earliestYear; i <= latestYear; i++) {
        const yearPerformances = sortedPerformances.filter(performance => new Date(performance.time.start).getFullYear() === i);
        if (yearPerformances.length !== 0) this.performances[i.toString()] = yearPerformances;
      }
    });

    this.loadingSerivce.setLoading(false);
  }

  getYears(): string[] {
    return Object.keys(this.performances).reverse();
  }

  openModal(performance, modal): void {
    this.openedPerformance = performance;
    if (!performance.link) this.modalService.open(modal, { modalDialogClass: 'performance-modal', });
  }
}
