import { IBot } from './IBot';
import { Observable } from 'rxjs';
import { MessageDto, IMessage } from 'shared';

export abstract class Bot implements IBot {
  private socketId: string = undefined;

  constructor(
    private id: number,
    private username: string,
    private avatar: string,
    private description: string,
    private isOnline: boolean,
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
  abstract handleMessage(message: IMessage): Observable<MessageDto>;
  handleDisconnect() {}
}
