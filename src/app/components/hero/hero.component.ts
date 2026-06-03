import { Component } from '@angular/core';
import {AuthService} from '../../auth/auth.service';

@Component({
    selector: 'app-hero',
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.css'],
    standalone: false
})
export class HeroComponent {

  constructor(public auth: AuthService) { }
}
