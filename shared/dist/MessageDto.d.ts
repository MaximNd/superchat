import { FromToDto } from './FromToDto';
import { ContactDto } from './ContactDto';
export declare class MessageDto extends FromToDto {
    readonly from: ContactDto;
    readonly to: ContactDto;
    readonly messageText: string;
    readonly date: Date;
    readonly isReaded: boolean;
    readonly readedDate: Date;
    constructor(from: ContactDto, to: ContactDto, messageText: string, date: Date, isReaded: boolean, readedDate: Date);
}
