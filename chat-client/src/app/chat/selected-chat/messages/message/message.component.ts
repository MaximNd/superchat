import { Component, Input, OnInit } from '@angular/core';
import { IMessage } from 'shared';
import { CurrentUserService } from '../../../../services/CurrentUserService/current-user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input()
  message: IMessage;
  isMe: boolean;

  constructor(private currentUserService: CurrentUserService) {}

  ngOnInit() {
    this.isMe = this.currentUserService.checkIsMe(
      this.message && this.message.From
    );
  }
}
