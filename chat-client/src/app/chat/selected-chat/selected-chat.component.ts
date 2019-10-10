import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IContact, IMessage } from 'shared';
import { ChatService } from '../../services/ChatService/chat.service';
import { CurrentUserService } from '../../services/CurrentUserService/current-user.service';

@Component({
  selector: 'app-selected-chat',
  templateUrl: './selected-chat.component.html',
  styleUrls: ['./selected-chat.component.css']
})
export class SelectedChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagescontainer', { static: false })
  private messagesContainer: ElementRef;

  private currentUserSubscription: Subscription;
  private currentChatRoomSubscription: Subscription;
  private currentMessagesSubscription: Subscription;
  currentMessages: IMessage[] = [];
  currentContact: IContact = null;
  currentUser: IContact;

  constructor(
    private chatService: ChatService,
    private currentUserService: CurrentUserService
  ) {}
  ngOnInit() {
    this.currentUserSubscription = this.currentUserService.CurrentUserSubject.subscribe(
      user => {
        this.currentUser = user;
      }
    );
    this.currentChatRoomSubscription = this.chatService.CurrentChatRoomSubject.subscribe(
      selectedChatRoom => {
        if (!selectedChatRoom) {
          this.currentContact = null;
          return;
        }
        this.currentContact = selectedChatRoom.ChatMembers.find(
          member => member.Id !== this.currentUser.Id
        );
      }
    );
    this.currentMessagesSubscription = this.chatService.CurrentMessagesSubject.subscribe(
      messages => {
        this.currentMessages = messages;
        setTimeout(() => {
          if (!this.messagesContainer) {
            return;
          }
          const messagesContainerDiv = this.messagesContainer
            .nativeElement as HTMLDivElement;

          messagesContainerDiv.scrollTop = messagesContainerDiv.scrollHeight;
        }, 0);
      }
    );
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
    this.currentChatRoomSubscription.unsubscribe();
    this.currentMessagesSubscription.unsubscribe();
  }
}
