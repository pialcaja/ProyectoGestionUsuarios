import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  constructor(private authService: Auth, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLogged()) {
      if (this.authService.hasRole('ADMIN')) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/general']);
      }
    }
  }
}
