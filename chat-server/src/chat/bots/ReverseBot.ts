import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IMessage, Message, MessageDto, ContactDto } from 'shared';
import { Bot } from './Bot';

export class ReverseBot extends Bot {
  handleMessage(message: IMessage): Observable<MessageDto> {
    let reversedMessage = '';
    for (let i = message.MessageText.length - 1; i >= 0; --i) {
      reversedMessage += message.MessageText.charAt(i);
    }
    return new Observable<MessageDto>(subscriber => {
      subscriber.next(
        new MessageDto(
          new ContactDto(
            message.To.Id,
            message.To.Username,
            message.To.Avatar,
            message.To.Description,
            message.To.IsOnline,
            message.To.SocketId,
          ),
          new ContactDto(
            message.From.Id,
            message.From.Username,
            message.From.Avatar,
            message.From.Description,
            message.From.IsOnline,
            message.From.SocketId,
          ),
          reversedMessage,
          new Date(),
          message.IsReaded,
          undefined,
        ),
      );
    }).pipe(delay(3000));
  }
}
