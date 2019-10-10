import { AbstractContact } from './AbstractContact';

export class Contact extends AbstractContact {
  handleDisconnect() {
    this.IsOnline = false;
    this.SocketId = undefined;
  }
}
