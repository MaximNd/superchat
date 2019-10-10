import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService } from '../../../services/ChatService/chat.service';
import { Subscription } from 'rxjs';
import { IContact, Message } from 'shared';
import { CurrentUserService } from '../../../services/CurrentUserService/current-user.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit, OnDestroy {
  private currentUserSubscription: Subscription;
  private selectedContactSubscription: Subscription;
  selectedContact: IContact;
  messageForm: FormGroup;
  messageText = '';
  isStartedWriting = false;
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
    this.selectedContactSubscription = this.chatService.SelectedContactSubject.subscribe(
      selectedContact => {
        this.selectedContact = selectedContact;
      }
    );
    this.initMessageForm();
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  private initMessageForm() {
    this.messageForm = new FormGroup({
      message: new FormControl(this.messageText, [
        Validators.required,
        this.noWhitespaceValidator
      ])
    });
  }

  onInputMessage() {
    const currentMessage: string = this.messageForm.value.message.trim();
    if (this.isStartedWriting && currentMessage.length === 0) {
      this.isStartedWriting = false;
      if (this.selectedContact) {
        this.chatService.stopWrite(this.selectedContact);
      }
    } else if (!this.isStartedWriting && currentMessage.length !== 0) {
      this.isStartedWriting = true;
      if (this.selectedContact) {
        this.chatService.startWrite(this.selectedContact);
      }
    }
  }

  onSendMessage() {
    if (this.messageForm.invalid) {
      return;
    }
    const message = new Message(
      this.currentUser,
      this.selectedContact,
      this.messageForm.value.message.trim(),
      new Date(),
      false,
      undefined
    );
    this.chatService.sendMessage(message);
    this.messageForm.reset();
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
    this.selectedContactSubscription.unsubscribe();
  }
}
