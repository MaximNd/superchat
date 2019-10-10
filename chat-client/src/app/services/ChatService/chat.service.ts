import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import {
  IChatRoom,
  Message,
  ChatEvents,
  IMessage,
  IContact,
  ContactDto,
  ChatRoom
} from 'shared';
import { SocketService } from '../SocketService/socket.service';
import { CurrentUserService } from '../CurrentUserService/current-user.service';
import { tap, map, filter, mapTo } from 'rxjs/operators';
import { Contact } from '../../chat/models/Contact';
import { UnknownContact } from '../../chat/models/UnknownContact';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {
  private contacts: IContact[] = [];
  private chatRooms: IChatRoom[] = [];
  private currentRoom: IChatRoom = null;
  private currentChatRoomsSubject = new BehaviorSubject<IChatRoom[]>([]);
  private currentMessagesSubject = new BehaviorSubject<IMessage[]>([]);
  private currentChatRoomSubject = new BehaviorSubject<IChatRoom>(null);
  private selectedContactSubject = new BehaviorSubject<IContact>(null);
  private contactsSubject = new BehaviorSubject<IContact[]>([]);

  private onNewContactOnlineSubscription: Subscription;
  private onContactDisconnectedSubscription: Subscription;
  private onJoinRoomSubscription: Subscription;
  private onStartedWritingSubscription: Subscription;
  private onStoppedWritingSubscription: Subscription;
  private onMessageSubscription: Subscription;
  private onMessagesReadedSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
    private currentUserService: CurrentUserService
  ) {}

  private initUnknownContact(contactDto: ContactDto) {
    this.contacts.push(
      new Contact(
        contactDto.id,
        contactDto.username,
        contactDto.avatar,
        contactDto.description,
        contactDto.isOnline,
        contactDto.socketId
      )
    );
  }

  private initOnNewContactOnline() {
    this.onNewContactOnlineSubscription = this.socketService
      .on(ChatEvents.newContactOnline)
      .subscribe(contactDto => {
        const me = this.currentUserService.getCurrentContact();
        if (me.Id === contactDto.id) {
          return;
        }
        const newOnlineContact = this.contacts.find(
          ({ Id }) => contactDto.id === Id
        );
        if (newOnlineContact) {
          newOnlineContact.IsOnline = true;
          this.contactsSubject.next(this.contacts.slice());
          this.socketService.emit(ChatEvents.joinRoom, {
            fromId: me.Id,
            toId: newOnlineContact.Id
          });
        } else {
          const unknownContact = new UnknownContact(
            contactDto.id,
            contactDto.username,
            contactDto.avatar,
            contactDto.description,
            true,
            contactDto.socketId
          );
          this.contacts.push(unknownContact);
          this.contactsSubject.next(this.contacts.slice());
          this.socketService.emit(ChatEvents.joinRoom, {
            fromId: me.Id,
            toId: unknownContact.Id
          });
        }
      });
  }

  private initOnContactDisconnected() {
    this.onContactDisconnectedSubscription = this.socketService
      .on(ChatEvents.contactDisconnected)
      .subscribe(data => {
        const disconnectedContact = this.contacts.find(
          ({ Id }) => Id === data.id
        );
        if (disconnectedContact) {
          const me = this.currentUserService.getCurrentContact();
          disconnectedContact.handleDisconnect();
          if (disconnectedContact instanceof UnknownContact) {
            const index = this.contacts.findIndex(
              unknownUser => unknownUser.Id === disconnectedContact.Id
            );
            this.contacts.splice(index, 1);
            if (
              this.currentRoom &&
              disconnectedContact.Id ===
                this.currentRoom.ChatMembers.find(member => member.Id !== me.Id)
                  .Id
            ) {
              this.currentRoom = null;
              this.CurrentChatRoomSubject.next(this.currentRoom);
              this.CurrentMessagesSubject.next([]);
            }
          }
          this.contactsSubject.next(this.contacts.slice());
        }
      });
  }

  private initOnJoinRoom() {
    this.onJoinRoomSubscription = this.socketService
      .on(ChatEvents.joinRoom)
      .pipe(
        filter(
          chatRoomDto =>
            !this.chatRooms.find(chatRoom => chatRoomDto.id === chatRoom.Id)
        ),
        map(chatRoomDto => {
          const [member1, member2] = chatRoomDto.chatMembers;
          const contact1 = this.contacts.find(
            contact => contact.Id === member1.id
          );
          const contact2 = this.contacts.find(
            contact => contact.Id === member2.id
          );
          return new ChatRoom(
            chatRoomDto.id,
            [contact1, contact2],
            chatRoomDto.messages.map(message => {
              const isFromFirst = message.from.id === contact1.Id;
              const from = isFromFirst ? contact1 : contact2;
              const to = isFromFirst ? contact2 : contact1;
              return new Message(
                from,
                to,
                message.messageText,
                message.date,
                message.isReaded,
                message.readedDate
              );
            })
          );
        })
      )
      .subscribe(chatRoom => {
        this.chatRooms.push(chatRoom);
        this.currentChatRoomsSubject.next(this.chatRooms);
      });
  }

  private initOnStartedWriting() {
    this.onStartedWritingSubscription = this.socketService
      .on(ChatEvents.startedWriting)
      .subscribe(({ contactId, roomId }) => {
        const contact = this.contacts.find(contact => contact.Id === contactId);
        const room = this.chatRooms.find(room => room.Id === roomId);
        if (contact && room) {
          room.TypingMembers.push(contact);
          if (this.currentRoom && this.currentRoom.Id === room.Id) {
            this.currentChatRoomSubject.next(room);
          }
        }
      });
  }

  private initOnStoppedWriting() {
    this.onStoppedWritingSubscription = this.socketService
      .on(ChatEvents.stoppedWriting)
      .subscribe(({ contactId, roomId }) => {
        const room = this.chatRooms.find(room => room.Id === roomId);
        if (room) {
          const index = room.TypingMembers.findIndex(
            member => member.Id === contactId
          );
          if (index !== -1) {
            room.TypingMembers.splice(index, 1);
            if (this.currentRoom && this.currentRoom.Id === room.Id) {
              this.currentChatRoomSubject.next(room);
            }
          }
        }
      });
  }

  private initOnMessage() {
    this.onMessageSubscription = this.socketService
      .on(ChatEvents.message)
      .pipe(
        map(({ roomId, message }): {
          roomId: string;
          message: IMessage;
        } => {
          return {
            roomId,
            message: new Message(
              this.contacts.find(contact => contact.Id === message.from.id),
              this.contacts.find(contact => contact.Id === message.to.id),
              message.messageText,
              message.date,
              message.isReaded,
              message.readedDate
            )
          };
        })
      )
      .subscribe(({ roomId, message }) => {
        const room = this.chatRooms.find(room => room.Id === roomId);
        if (room) {
          room.Messages.push(message);
          if (this.currentRoom && room.Id === this.currentRoom.Id) {
            this.currentMessagesSubject.next(room.Messages.slice());
            this.messagesReaded(
              room,
              this.currentUserService.getCurrentContact(),
              new Date()
            );
          }
        }
        this.CurrentChatRoomsSubject.next(this.chatRooms.slice());
      });
  }

  private initOnMessagesReaded() {
    this.onMessagesReadedSubscription = this.socketService
      .on(ChatEvents.messagesReaded)
      .subscribe(({ roomId, byId, date }) => {
        const room = this.chatRooms.find(chatRoom => chatRoom.Id === roomId);
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
          this.currentChatRoomsSubject.next(this.chatRooms.slice());
          if (this.currentRoom && this.currentRoom.Id === roomId) {
            this.currentMessagesSubject.next(this.currentRoom.Messages.slice());
          }
        }
      });
  }

  private unsubscribeAll() {
    this.onNewContactOnlineSubscription.unsubscribe();
    this.onContactDisconnectedSubscription.unsubscribe();
    this.onJoinRoomSubscription.unsubscribe();
    this.onStartedWritingSubscription.unsubscribe();
    this.onStoppedWritingSubscription.unsubscribe();
    this.onMessageSubscription.unsubscribe();
    this.onMessagesReadedSubscription.unsubscribe();
  }

  private initSocket() {
    this.socketService.onConnect().then(() => {
      this.socketService
        .on(ChatEvents.availableContact)
        .subscribe(contactDto => {
          // UNKNOWN CONTACT
          if (!this.contacts.find(({ Id }) => Id === contactDto.id)) {
            this.initUnknownContact(contactDto);
          }
          this.currentUserService.setCurrentUser(
            this.getContactById(contactDto.id)
          );
          this.connectChats(this.currentUserService.getCurrentContact());

          this.initOnNewContactOnline();
          this.initOnContactDisconnected();
          this.initOnJoinRoom();
          this.initOnStartedWriting();
          this.initOnStoppedWriting();
          this.initOnMessage();
          this.initOnMessagesReaded();
        });
      this.socketService.onDisconnect(() => {
        this.unsubscribeAll();
        this.initSocket();
      });
    });
  }
  private connectChats(me: IContact) {
    for (let contact of this.contacts) {
      if (contact.Id !== me.Id) {
        this.socketService.emit(ChatEvents.joinRoom, {
          fromId: me.Id,
          toId: contact.Id
        });
      }
    }
  }
  get CurrentChatRoomsSubject() {
    return this.currentChatRoomsSubject;
  }
  get CurrentChatRoomSubject() {
    return this.currentChatRoomSubject;
  }
  get CurrentMessagesSubject() {
    return this.currentMessagesSubject;
  }
  get ContactsSubject() {
    return this.contactsSubject;
  }
  get Contacts(): IContact[] {
    return this.contacts;
  }
  get SelectedContactSubject(): BehaviorSubject<IContact> {
    return this.selectedContactSubject;
  }

  setCurrentContact(contact: IContact) {
    this.selectedContactSubject.next(contact);
    const currentRoom = this.chatRooms.find(room =>
      room.ChatMembers.includes(contact)
    );
    this.currentRoom = currentRoom;
    this.currentChatRoomSubject.next(this.currentRoom);
    this.currentMessagesSubject.next(this.currentRoom.Messages.slice());
    if (
      this.currentRoom &&
      this.currentRoom.Messages.length > 0 &&
      !this.currentRoom.Messages[this.currentRoom.Messages.length - 1].IsReaded
    ) {
      this.messagesReaded(
        this.currentRoom,
        this.currentUserService.getCurrentContact(),
        new Date()
      );
    }
  }

  getContactById(id: number) {
    return this.contacts.find(contact => contact.Id === id);
  }

  fetchContacts(): Observable<IContact[]> {
    return this.http
      .get<ContactDto[]>('http://localhost:3000/api/chat/contacts')
      .pipe(
        map(contactsDto =>
          contactsDto.map(
            contactDto =>
              new Contact(
                contactDto.id,
                contactDto.username,
                contactDto.avatar,
                contactDto.description,
                contactDto.isOnline,
                contactDto.socketId
              )
          )
        ),
        tap(contacts => {
          this.contacts = contacts;
          this.initSocket();
          this.contactsSubject.next(this.contacts.slice());
        })
      );
  }

  startWrite(to: IContact) {
    this.socketService.emit(ChatEvents.startedWriting, {
      fromId: this.currentUserService.getCurrentContact().Id,
      toId: to.Id
    });
  }

  stopWrite(to: IContact) {
    this.socketService.emit(ChatEvents.stoppedWriting, {
      fromId: this.currentUserService.getCurrentContact().Id,
      toId: to.Id
    });
  }

  sendMessage(message: IMessage) {
    this.stopWrite(message.To);
    this.socketService.emit(ChatEvents.message, message);
  }

  messagesReaded(chatRoom: IChatRoom, by: IContact, date: Date) {
    this.socketService.emit(ChatEvents.messagesReaded, {
      roomId: chatRoom.Id,
      byId: by.Id,
      date
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }
}
