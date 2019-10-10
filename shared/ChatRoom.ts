import { IChatRoom } from './IChatRoom';
import { IContact } from './IContact';
import { IMessage } from './IMessage';

export class ChatRoom implements IChatRoom {
  constructor(
    private id: string,
    private chatMembers: IContact[],
    private messages: IMessage[] = [],
    private typingMembers: IContact[] = []
  ) {}

  get Id(): string {
    return this.id;
  }
  get ChatMembers(): IContact[] {
    return this.chatMembers;
  }
  get Messages(): IMessage[] {
    return this.messages;
  }
  get TypingMembers(): IContact[] {
    return this.typingMembers;
  }
}
