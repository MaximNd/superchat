import { Injectable } from '@angular/core';
import { IContact } from 'shared';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private currentUserSubject = new BehaviorSubject<IContact>(null);
  private currentUser: IContact;

  constructor() {}

  setCurrentUser(contact: IContact) {
    this.currentUser = contact;
    this.currentUserSubject.next(this.currentUser);
  }

  getCurrentContact() {
    return this.currentUser;
  }

  checkIsMe(contact: IContact) {
    return contact.Id === this.currentUser.Id;
  }

  get CurrentUserSubject() {
    return this.currentUserSubject;
  }
}
