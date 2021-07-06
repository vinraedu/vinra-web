import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '../helperservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router,private helperService: HelperService) { }

  ngOnInit() {}

  logout(){
    if(this.helperService.logout())
      this.router.navigate(['cms']);
  }

}
