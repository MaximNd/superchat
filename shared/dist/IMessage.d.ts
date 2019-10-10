import { IFromTo } from './IFromTo';
export interface IMessage extends IFromTo {
    readonly MessageText: string;
    readonly Date: Date;
    IsReaded: boolean;
    ReadedDate: Date;
}
