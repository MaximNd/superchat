import { Injectable } from '@nestjs/common';
import {
  IChatRoom,
  ChatRoom,
  IMessage,
  IContact,
  MessageDto,
  Message,
} from 'shared';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class ChatRoomService {
  private chatRooms: IChatRoom[] = [];

  constructor(private readonly contactService: ContactService) {}

  getRoomById(id: string) {
    return this.chatRooms.find(chatRoom => chatRoom.Id === id);
  }

  createRoom(contacts: IContact[]): IChatRoom {
    for (let i = 0; i < this.chatRooms.length; ++i) {
      const chatMembers = this.chatRooms[i].ChatMembers;
      if (
        chatMembers.length === contacts.length &&
        chatMembers.every(member => contacts.includes(member))
      ) {
        return this.chatRooms[i];
      }
    }
    const chatRoom = new ChatRoom(
      this.getRoomId(contacts[0].Id, contacts[1].Id),
      [...contacts],
    );
    this.chatRooms.push(chatRoom);
    return chatRoom;
  }

  addMessage(message: MessageDto) {
    const roomId = this.getRoomId(message.from.id, message.to.id);
    const room: IChatRoom = this.chatRooms.find(
      chatRoom => chatRoom.Id === roomId,
    );
    if (room) {
      room.Messages.push(
        new Message(
          this.contactService.getContactById(message.from.id),
          this.contactService.getContactById(message.to.id),
          message.messageText,
          message.date,
          message.isReaded,
          message.readedDate,
        ),
      );
      return room;
    }
  }

  getRoomId(n1: number, n2: number) {
    return n1 > n2 ? `${n2}-${n1}` : `${n1}-${n2}`;
  }

  getChatsWhereExists(contact: IContact) {
    return this.chatRooms.filter(room =>
      room.ChatMembers.some(member => member.Id === contact.Id),
    );
  }
}
