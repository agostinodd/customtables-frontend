import { Component, OnInit } from '@angular/core';
import {CustomTableService} from '../../services/custom-table.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss']
})
export class NavHeaderComponent implements OnInit {

  constructor(private customTableService: CustomTableService) { }

  ngOnInit() {
  }

  getMail() {
    const mailString = environment.testEmail;
    return mailString;
  }
}
