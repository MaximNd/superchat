import { ContactDto } from './ContactDto';
import { MessageDto } from './MessageDto';
export declare class ChatRoomDto {
    readonly id: string;
    readonly chatMembers: ContactDto[];
    readonly messages: MessageDto[];
    readonly typingMembers: ContactDto[];
    constructor(id: string, chatMembers: ContactDto[], messages: MessageDto[], typingMembers: ContactDto[]);
}
