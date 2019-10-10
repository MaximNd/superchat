import { HttpService } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatEvents, ContactDto, IContact, MessageDto } from 'shared';
import { Server, Socket } from 'socket.io';
import { Bot } from '../bots/Bot';
import { IBot } from '../bots/IBot';
import { SpamBot } from '../bots/SpamBot';
import { ChatRoomService } from '../services/chat-room/chat-room.service';
import { ContactService } from '../services/contact/contact.service';

@WebSocketGateway()
export class ChatEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private contactService: ContactService,
    private chatRoomService: ChatRoomService,
    private httpService: HttpService,
  ) {}

  afterInit() {
    const bots: IBot[] = this.contactService.getBots() as IBot[];
    const spamBot = bots.find(bot => bot instanceof SpamBot);
    this.spamBotMessagesGenerator(spamBot);
  }

  private async spamBotMessagesGenerator(spamBot: IBot) {
    const min = 10;
    const max = 120;
    let i = 0;
    while (true) {
      const rand = Math.floor(min + Math.random() * (max + 1 - min));
      const randomTextPromise = this.httpService
        .get('https://litipsum.com/api/json')
        .toPromise();
      const delayPromise = new Promise(resolve => {
        setTimeout(() => resolve(), rand * 1000);
      });
      const [
        {
          data: { text },
        },
      ] = await Promise.all([randomTextPromise, delayPromise]);
      this.chatRoomService.getChatsWhereExists(spamBot).forEach(chatRoom => {
        const receiver: IContact = chatRoom.ChatMembers.find(
          member => member.Id !== spamBot.Id,
        );
        this.server.to(chatRoom.Id).emit(ChatEvents.message, {
          roomId: chatRoom.Id,
          message: new MessageDto(
            new ContactDto(
              spamBot.Id,
              spamBot.Username,
              spamBot.Avatar,
              spamBot.Description,
              spamBot.IsOnline,
              spamBot.SocketId,
            ),
            new ContactDto(
              receiver.Id,
              receiver.Username,
              receiver.Avatar,
              receiver.Description,
              receiver.IsOnline,
              receiver.SocketId,
            ),
            text.join(),
            new Date(),
            false,
            null,
          ),
        });
      });
      ++i;
    }
  }

  handleConnection(socket: Socket, ...args: any) {
    const contact = this.contactService.getAvailableContact();
    contact.SocketId = socket.id;
    socket.emit(ChatEvents.availableContact, contact);
    this.server.sockets.emit(ChatEvents.newContactOnline, contact);
  }

  handleDisconnect(socket: Socket, ...args: any) {
    socket.leaveAll();
    const userContact = this.contactService.getUserContactBySocketId(socket.id);
    if (userContact) {
      this.contactService.setOffline(userContact);
      this.server.sockets.emit(ChatEvents.contactDisconnected, {
        id: userContact.Id,
      });
    }
  }

  @SubscribeMessage(ChatEvents.message)
  handleMessage(socket: Socket, [messageDto]: [MessageDto, null]) {
    const room = this.chatRoomService.addMessage(messageDto);
    const from = room.ChatMembers.find(
      member => member.Id === messageDto.from.id,
    );
    const to = room.ChatMembers.find(member => member.Id === messageDto.to.id);
    this.server
      .to(room.Id)
      .emit(ChatEvents.message, { roomId: room.Id, message: messageDto });
    if (to instanceof Bot) {
      const obs = to.handleMessage(room.Messages[room.Messages.length - 1]);

      if (obs) {
        this.startedOrStoppedWriting(
          this.server,
          to.Id,
          from.Id,
          ChatEvents.startedWriting,
        );
        obs.subscribe(botMessageDto => {
          this.chatRoomService.addMessage(botMessageDto);
          this.startedOrStoppedWriting(
            this.server,
            to.Id,
            from.Id,
            ChatEvents.stoppedWriting,
          );
          this.server.to(room.Id).emit(ChatEvents.message, {
            roomId: room.Id,
            message: botMessageDto,
          });
        });
      }
    }
  }

  @SubscribeMessage(ChatEvents.messagesReaded)
  handleMessagesReaded(
    socket: Socket,
    [{ roomId, byId, date }]: [{ roomId: string; byId: number; date: Date }],
  ) {
    const room = this.chatRoomService.getRoomById(roomId);
    if (room) {
      const index = room.Messages.length - 1;
      for (let i = index; i >= 0; --i) {
        const message = room.Messages[i];

        if (message.From.Id !== byId) {
          if (message.IsReaded) {
            break;
          }
          message.IsReaded = true;
          message.ReadedDate = date;
        }
      }
    }
    this.server
      .to(roomId)
      .emit(ChatEvents.messagesReaded, { roomId, byId, date });
  }

  @SubscribeMessage(ChatEvents.startedWriting)
  handleStartedWriting(
    socket: Socket,
    [{ fromId, toId }]: [{ fromId: number; toId: number }],
  ) {
    this.startedOrStoppedWriting(
      this.server,
      fromId,
      toId,
      ChatEvents.startedWriting,
    );
  }

  @SubscribeMessage(ChatEvents.stoppedWriting)
  handleStoppedWriting(
    socket: Socket,
    [{ fromId, toId }]: [{ fromId: number; toId: number }],
  ) {
    this.startedOrStoppedWriting(
      this.server,
      fromId,
      toId,
      ChatEvents.stoppedWriting,
    );
  }

  private startedOrStoppedWriting(
    server: Server,
    fromId: number,
    toId: number,
    event: ChatEvents.startedWriting | ChatEvents.stoppedWriting,
  ) {
    const roomId = this.chatRoomService.getRoomId(fromId, toId);
    const contactId = fromId;
    server.to(roomId).emit(event, { roomId, contactId });
  }

  @SubscribeMessage(ChatEvents.joinRoom)
  handleJoinRoom(socket: Socket, [data]) {
    const from = this.contactService.getContactById(data.fromId);
    const to = this.contactService.getContactById(data.toId);

    const chatRoom = this.chatRoomService.createRoom([from, to]);

    socket.join(chatRoom.Id);
    this.server.to(chatRoom.Id).emit(ChatEvents.joinRoom, chatRoom);
  }
}
