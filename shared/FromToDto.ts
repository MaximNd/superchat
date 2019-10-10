import { ContactDto } from './ContactDto';

export class FromToDto {
  constructor(
    public readonly from: ContactDto,
    public readonly to: ContactDto
  ) {}
}
