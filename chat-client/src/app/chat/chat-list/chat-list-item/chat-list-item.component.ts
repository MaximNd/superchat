import { Component, OnInit, Input } from '@angular/core';
import { IContact, IMessage } from 'shared';
import { ChatService } from '../../../services/ChatService/chat.service';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.css']
})
export class ChatListItemComponent implements OnInit {
  @Input()
  contact: IContact;

  @Input()
  isActive: boolean;

  @Input()
  lastMessage: IMessage;

  @Input()
  unreadCount: number;

  constructor(private chatService: ChatService) {}

  ngOnInit() {}

  selectCurrentContact() {
    this.chatService.setCurrentContact(this.contact);
  }
}
