import { Module, HttpModule } from '@nestjs/common';
import { ChatEventsGateway } from './chat-events/chat-events.gateway';
import { ChatController } from './chat.controller';
import { ContactService } from './services/contact/contact.service';
import { ChatRoomService } from './services/chat-room/chat-room.service';

@Module({
  imports: [HttpModule],
  providers: [ChatEventsGateway, ContactService, ChatRoomService],
  controllers: [ChatController],
})
export class ChatModule {}
