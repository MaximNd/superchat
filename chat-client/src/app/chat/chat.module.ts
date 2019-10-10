import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatListComponent } from './chat-list/chat-list.component';
import { SelectedChatComponent } from './selected-chat/selected-chat.component';
import { ChatComponent } from './chat.component';
import { SearchComponent } from './chat-list/search/search.component';
import { ChatListItemComponent } from './chat-list/chat-list-item/chat-list-item.component';
import { ContactInfoComponent } from './selected-chat/contact-info/contact-info.component';
import { MessagesComponent } from './selected-chat/messages/messages.component';
import { SendMessageComponent } from './selected-chat/send-message/send-message.component';
import { MessageComponent } from './selected-chat/messages/message/message.component';

@NgModule({
  declarations: [
    ChatListComponent,
    SelectedChatComponent,
    ChatComponent,
    SearchComponent,
    ChatListItemComponent,
    ContactInfoComponent,
    MessagesComponent,
    SendMessageComponent,
    MessageComponent
  ],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule]
})
export class ChatModule {}
