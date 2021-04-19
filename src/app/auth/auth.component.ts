import {Component} from '@angular/core';
import {AuthService} from '../servises/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  constructor(public authService: AuthService) {
  }

  public login(): void {
    this.authService.login();
  }

  public logout(): void {
    this.authService.logout();
  }

}
