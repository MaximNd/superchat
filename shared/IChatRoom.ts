import { IContact } from './IContact';
import { IMessage } from './IMessage';

export interface IChatRoom {
  readonly Id: string;
  readonly ChatMembers: IContact[];
  readonly Messages: IMessage[];
  readonly TypingMembers: IContact[];
}
