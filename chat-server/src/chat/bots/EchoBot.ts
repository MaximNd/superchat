import { Observable } from 'rxjs';
import { IMessage, MessageDto, ContactDto } from 'shared';
import { Bot } from './Bot';

export class EchoBot extends Bot {
  handleMessage(message: IMessage): Observable<MessageDto> {
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
          message.MessageText,
          new Date(),
          message.IsReaded,
          undefined,
        ),
      );
    });
  }
}
