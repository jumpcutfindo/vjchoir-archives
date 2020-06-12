import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  isLoading: boolean;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.loadingService.loadingUpdates.subscribe(val => this.isLoading = val);
  }

}
