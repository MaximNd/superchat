import { IContact, IMessage } from 'shared';
import { Observable } from 'rxjs';
import { MessageDto } from 'shared';

export interface IBot extends IContact {
  handleMessage(message: IMessage): Observable<MessageDto>;
}
