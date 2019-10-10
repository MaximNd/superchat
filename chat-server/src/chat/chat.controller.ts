import { Controller, Get } from '@nestjs/common';
import { ContactService } from './services/contact/contact.service';

@Controller('api/chat')
export class ChatController {
  constructor(private contactService: ContactService) {}

  @Get('contacts')
  getAllContacts() {
    return this.contactService.getContacts();
  }
}
