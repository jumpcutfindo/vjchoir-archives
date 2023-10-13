import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoadingService } from 'src/app/loading/loading.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private loadingService: LoadingService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Uh-oh!");
    this.loadingService.setLoading(false);
  }

}
