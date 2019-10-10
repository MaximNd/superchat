import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IChatRoom, IContact, IMessage } from 'shared';
import { ChatService } from '../../services/ChatService/chat.service';
import { CurrentUserService } from '../../services/CurrentUserService/current-user.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit, OnDestroy {
  private currentUserSubscription: Subscription;
  private chatRoomsSubscription: Subscription;
  private selectedContactSubscription: Subscription;
  private contactsSubscription: Subscription;
  private contacts: IContact[] = [];
  filteredContacts: IContact[] = [];
  selectedContact: IContact;
  chatRooms: IChatRoom[] = [];
  isShowAll = false;
  private search = '';
  currentUser: IContact;

  constructor(
    private readonly chatService: ChatService,
    private readonly currentUserService: CurrentUserService
  ) {}

  ngOnInit() {
    this.currentUserSubscription = this.currentUserService.CurrentUserSubject.subscribe(
      user => {
        this.currentUser = user;
      }
    );
    this.contactsSubscription = this.chatService.ContactsSubject.subscribe(
      contacts => {
        this.contacts = contacts;
        this.filterContacts();
      }
    );
    this.selectedContactSubscription = this.chatService.SelectedContactSubject.subscribe(
      selectedContact => {
        this.selectedContact = selectedContact;
      }
    );
    this.chatRoomsSubscription = this.chatService.CurrentChatRoomsSubject.subscribe(
      rooms => {
        this.chatRooms = rooms;
        this.filterContacts();
      }
    );
    this.filterContacts();
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
    this.selectedContactSubscription.unsubscribe();
    this.contactsSubscription.unsubscribe();
    this.chatRoomsSubscription.unsubscribe();
  }

  checkIfCurrentUser(contact: IContact) {
    return this.currentUser && contact.Id === this.currentUser.Id;
  }

  changeShowMode(value: boolean) {
    this.isShowAll = value;
    this.filterContacts();
  }

  setSearch(value: string) {
    this.search = value;
    this.filterContacts();
  }

  getLastMessage(contact: IContact): IMessage {
    const chatRoom = this.chatRooms.find(chatRoom =>
      chatRoom.ChatMembers.includes(contact)
    );
    if (!chatRoom) {
      return undefined;
    }
    const messages = chatRoom.Messages;
    if (messages.length > 0) {
      const message = messages[messages.length - 1];
      return message;
    }
    return undefined;
  }

  getUnreadCount(contact: IContact): number {
    const chatRoom = this.chatRooms.find(chatRoom =>
      chatRoom.ChatMembers.includes(contact)
    );
    if (!chatRoom) {
      return 0;
    }
    const messages = chatRoom.Messages;
    if (messages.length > 0) {
      let count = 0;
      const currentContactId = this.currentUser.Id;
      for (let i = messages.length - 1; i >= 0; --i) {
        const message = messages[i];
        if (message.From.Id !== currentContactId) {
          if (message.IsReaded) {
            break;
          }
          ++count;
        }
      }
      return count;
    }
    return 0;
  }

  private filterContacts() {
    this.filteredContacts = this.contacts.slice().filter(contact => {
      if (this.checkIfCurrentUser(contact)) {
        return false;
      }
      const isContainSearch = contact.Username.toLocaleLowerCase().includes(
        this.search.toLocaleLowerCase()
      );
      if (!this.isShowAll) {
        return contact.IsOnline && isContainSearch;
      }
      return isContainSearch;
    });
  }
}
