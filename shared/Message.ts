import { IMessage } from './IMessage';
import { IContact } from './IContact';

export class Message implements IMessage {
  constructor(
    private from: IContact,
    private to: IContact,
    private messageText: string,
    private date: Date,
    private isReaded: boolean = false,
    private readedDate: Date = undefined
  ) {}

  get From(): IContact {
    return this.from;
  }
  get To(): IContact {
    return this.to;
  }
  get MessageText(): string {
    return this.messageText;
  }
  get Date(): Date {
    return this.date;
  }
  get IsReaded(): boolean {
    return this.isReaded;
  }
  set IsReaded(value: boolean) {
    this.isReaded = value;
  }
  get ReadedDate(): Date {
    return this.readedDate;
  }
  set ReadedDate(value: Date) {
    this.readedDate = value;
  }
}
