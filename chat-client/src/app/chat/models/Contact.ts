import { IContact, IMessage } from 'shared';
import { Observable } from 'rxjs';

export class Contact implements IContact {
  constructor(
    private id: number,
    private username: string,
    private avatar: string,
    private description: string,
    private isOnline: boolean,
    private socketId: string
  ) {}
  get Id(): number {
    return this.id;
  }
  get Username(): string {
    return this.username;
  }
  get Avatar(): string {
    return this.avatar;
  }
  get Description(): string {
    return this.description;
  }
  get IsOnline(): boolean {
    return this.isOnline;
  }
  set IsOnline(value) {
    this.isOnline = value;
  }
  get SocketId() {
    return this.socketId;
  }
  set SocketId(value) {
    this.socketId = value;
  }
  handleDisconnect() {
    this.isOnline = false;
  }
}
