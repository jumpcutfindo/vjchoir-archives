import { Component, OnInit } from '@angular/core';
import { BlogService } from './blog.service';

@Component({
  selector: 'misc-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  blogInfo;

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.blogService.getBlogInfo().subscribe(info => {
      this.blogInfo = info;
    });
  }

}
