import { IMessage } from './IMessage';
import { IContact } from './IContact';
export declare class Message implements IMessage {
    private from;
    private to;
    private messageText;
    private date;
    private isReaded;
    private readedDate;
    constructor(from: IContact, to: IContact, messageText: string, date: Date, isReaded?: boolean, readedDate?: Date);
    readonly From: IContact;
    readonly To: IContact;
    readonly MessageText: string;
    readonly Date: Date;
    IsReaded: boolean;
    ReadedDate: Date;
}
