"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChatRoom = /** @class */ (function () {
    function ChatRoom(id, chatMembers, messages, typingMembers) {
        if (messages === void 0) { messages = []; }
        if (typingMembers === void 0) { typingMembers = []; }
        this.id = id;
        this.chatMembers = chatMembers;
        this.messages = messages;
        this.typingMembers = typingMembers;
    }
    Object.defineProperty(ChatRoom.prototype, "Id", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatRoom.prototype, "ChatMembers", {
        get: function () {
            return this.chatMembers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatRoom.prototype, "Messages", {
        get: function () {
            return this.messages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatRoom.prototype, "TypingMembers", {
        get: function () {
            return this.typingMembers;
        },
        enumerable: true,
        configurable: true
    });
    return ChatRoom;
}());
exports.ChatRoom = ChatRoom;
