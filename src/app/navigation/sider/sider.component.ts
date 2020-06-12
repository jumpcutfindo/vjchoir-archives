import { Component, OnInit } from '@angular/core';

import siderJSON from '../../../assets/data/sider.json';

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.scss']
})
export class SiderComponent implements OnInit {

  siderJSON: any;

  constructor() { }

  ngOnInit() {
    this.siderJSON = siderJSON;
  }

}
