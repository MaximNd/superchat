import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { IContact } from 'shared';
import { Observable } from 'rxjs';
import { ChatService } from '../chat.service';

@Injectable({
  providedIn: 'root'
})
export class ChatResolverService implements Resolve<IContact[]> {
  constructor(private chatService: ChatService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): IContact[] | Observable<IContact[]> | Promise<IContact[]> {
    return this.chatService.Contacts.length === 0
      ? this.chatService.fetchContacts()
      : this.chatService.Contacts;
  }
}
