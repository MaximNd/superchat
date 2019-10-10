import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { IContact, IMessage } from 'shared';
import { ChatService } from '../../../services/ChatService/chat.service';
import { CurrentUserService } from '../../../services/CurrentUserService/current-user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  private dots = '...';
  private dotsSubscription: Subscription;
  private currentChatRoomSubscription: Subscription;

  @Input()
  messages: IMessage[];

  isTyping = false;
  typingMember: IContact;

  constructor(
    private readonly chatService: ChatService,
    private readonly currentUserService: CurrentUserService
  ) {}

  get Dots() {
    return this.dots;
  }

  ngOnInit() {
    this.dotsSubscription = interval(700).subscribe(value => {
      this.dots = '.'.repeat(value % 4);
    });
    this.currentChatRoomSubscription = this.chatService.CurrentChatRoomSubject.subscribe(
      room => {
        if (!room) {
          this.typingMember = null;
          return;
        }
        const typingMember = room.TypingMembers.find(
          typingMember => !this.currentUserService.checkIsMe(typingMember)
        );
        if (typingMember) {
          this.isTyping = true;
          this.typingMember = typingMember;
        } else {
          this.isTyping = false;
          this.typingMember = null;
        }
      }
    );
  }

  ngOnDestroy() {
    this.dotsSubscription.unsubscribe();
    this.currentChatRoomSubscription.unsubscribe();
  }
}
