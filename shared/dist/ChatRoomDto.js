"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChatRoomDto = /** @class */ (function () {
    function ChatRoomDto(id, chatMembers, messages, typingMembers) {
        this.id = id;
        this.chatMembers = chatMembers;
        this.messages = messages;
        this.typingMembers = typingMembers;
    }
    return ChatRoomDto;
}());
exports.ChatRoomDto = ChatRoomDto;
