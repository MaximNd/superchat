import { Component, OnInit, OnDestroy } from '@angular/core';
import { CurrentUserService } from '../services/CurrentUserService/current-user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private currentUserSubscription: Subscription;
  avatar = '';
  name = '';

  constructor(private currentUserService: CurrentUserService) {}

  ngOnInit() {
    this.currentUserSubscription = this.currentUserService.CurrentUserSubject.subscribe(
      user => {
        if (user) {
          this.avatar = user.Avatar;
          this.name = user.Username;
        }
      }
    );
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }
}
