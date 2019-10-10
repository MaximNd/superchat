import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ChatEvents,
  ChatRoomDto,
  ContactDto,
  IMessage,
  MessageDto
} from 'shared';
import * as io from 'socket.io-client';

type StartedOrStoppedWriting =
  | ChatEvents.startedWriting
  | ChatEvents.stoppedWriting;
type ContactIdRoomId = { roomId: string; contactId: number };
type FromIdToId = { fromId: number; toId: number };
type RoomIdMessage = { roomId: string; message: MessageDto };
type MessagesReadedData = { roomId: string; byId: number; date: Date };
@Injectable({ providedIn: 'root' })
export class SocketService {
  private host: string = 'http://localhost:3000/';
  private socket: SocketIOClient.Socket;

  constructor() {}

  onConnect(): Promise<void> {
    this.socket = io(this.host);
    return new Promise<void>(resolve => {
      this.socket.on('connect', () => resolve());
    });
  }
  onDisconnect(callback: () => void) {
    this.socket.on('disconnect', () => callback());
  }

  emit(
    eventName: ChatEvents.message,
    data: IMessage,
    callback?: (...args: any) => void
  );
  emit(
    eventName: ChatEvents.messagesReaded,
    data: MessagesReadedData,
    callback?: (...args: any) => void
  );
  emit(
    eventName: StartedOrStoppedWriting,
    data: FromIdToId,
    callback?: (...args: any) => void
  );
  emit(
    eventName: ChatEvents.joinRoom,
    data: FromIdToId,
    callback?: (...args: any) => void
  );
  emit(
    eventName: ChatEvents.contactDisconnected,
    data: { id: number },
    callback?: (...args: any) => void
  );
  emit<E extends ChatEvents, T extends any>(
    eventName: E,
    data: T,
    callback?: (...args: any) => void
  ) {
    this.socket.emit(eventName, data, callback);
  }

  on<E extends ChatEvents.message, T extends RoomIdMessage>(
    eventName: E
  ): Observable<T>;
  on<E extends ChatEvents.messagesReaded, T extends MessagesReadedData>(
    eventName: E
  ): Observable<T>;
  on<E extends StartedOrStoppedWriting, T extends ContactIdRoomId>(
    eventName: E
  ): Observable<T>;
  on<E extends ChatEvents.newContactOnline, T extends ContactDto>(
    eventName: E
  ): Observable<T>;
  on<E extends ChatEvents.availableContact, T extends ContactDto>(
    eventName: E
  ): Observable<T>;
  on<E extends ChatEvents.joinRoom, T extends ChatRoomDto>(
    eventName: E
  ): Observable<T>;
  on<E extends ChatEvents.contactDisconnected, T extends { id: number }>(
    eventName: E
  ): Observable<T>;
  on<E extends ChatEvents, T extends any>(eventName: E): Observable<T> {
    return new Observable<T>(subscriber => {
      if (eventName === ChatEvents.availableContact) {
        this.socket.once(eventName, (data: T) => {
          subscriber.next(data);
        });
      } else {
        this.socket.off(eventName);
        this.socket.on(eventName, (data: T) => {
          subscriber.next(data);
        });
      }
    });
  }
}
