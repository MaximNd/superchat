import { FromToDto } from './FromToDto';
import { ContactDto } from './ContactDto';

export class MessageDto extends FromToDto {
  constructor(
    readonly from: ContactDto,
    readonly to: ContactDto,
    public readonly messageText: string,
    public readonly date: Date,
    public readonly isReaded: boolean,
    public readonly readedDate: Date
  ) {
    super(from, to);
  }
}
