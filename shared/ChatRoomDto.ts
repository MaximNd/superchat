import { ContactDto } from './ContactDto';
import { MessageDto } from './MessageDto';

export class ChatRoomDto {
  constructor(
    readonly id: string,
    readonly chatMembers: ContactDto[],
    readonly messages: MessageDto[],
    readonly typingMembers: ContactDto[]
  ) {}
}
