import { Component, OnInit } from '@angular/core';
import { User } from '@auth0/auth0-spa-js/dist/typings/global';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    standalone: false
})
export class ProfileComponent implements OnInit {
  profileJson: User | null = null;

  constructor(public auth: AuthService) { }

  ngOnInit() {
    this.auth.userProfile$.subscribe(
      profile => {
        this.profileJson = profile;
      }
    );
  }

}
