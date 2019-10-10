"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContactDto = /** @class */ (function () {
    function ContactDto(id, username, avatar, description, isOnline, socketId) {
        this.id = id;
        this.username = username;
        this.avatar = avatar;
        this.description = description;
        this.isOnline = isOnline;
        this.socketId = socketId;
    }
    return ContactDto;
}());
exports.ContactDto = ContactDto;
