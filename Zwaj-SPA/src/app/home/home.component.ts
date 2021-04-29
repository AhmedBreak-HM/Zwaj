import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  registerMode:boolean= false;

  constructor(private http:HttpClient,private authService:AuthService,
    private router:Router) { }

  ngOnInit() {
    if (this.authService.isUser()) {
      this.router.navigate(['/members']);

    }
  }
  registerToggle(){
    this.registerMode = true;
  }

}
