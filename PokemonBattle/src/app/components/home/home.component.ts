import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  userName: string | null = '';

  ngOnInit() {
    this.userName = localStorage.getItem('userName');
    const justLoggedIn = localStorage.getItem('justLoggedIn');
  
    if (this.userName && justLoggedIn === 'true') {
      localStorage.removeItem('justLoggedIn');
    }
  }
}
