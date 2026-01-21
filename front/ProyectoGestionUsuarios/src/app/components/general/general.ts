import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general',
  imports: [CommonModule],
  templateUrl: './general.html',
  styleUrl: './general.css',
})
export class General {

  isLoggedIn = false;
  username = '';

  constructor(private authService: Auth) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.username = this.authService.getUsername();
    });
  }

  logout() {
    this.authService.logout();
  }
}
