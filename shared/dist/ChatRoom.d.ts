import { IChatRoom } from './IChatRoom';
import { IContact } from './IContact';
import { IMessage } from './IMessage';
export declare class ChatRoom implements IChatRoom {
    private id;
    private chatMembers;
    private messages;
    private typingMembers;
    constructor(id: string, chatMembers: IContact[], messages?: IMessage[], typingMembers?: IContact[]);
    readonly Id: string;
    readonly ChatMembers: IContact[];
    readonly Messages: IMessage[];
    readonly TypingMembers: IContact[];
}
