import { Observable } from 'rxjs';
import { IMessage, MessageDto } from 'shared';
import { Bot } from './Bot';

export class IgnoreBot extends Bot {
  handleMessage(message: IMessage): Observable<MessageDto> {
    return undefined;
  }
}
