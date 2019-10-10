"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChatEvents;
(function (ChatEvents) {
    ChatEvents["message"] = "message";
    ChatEvents["messagesReaded"] = "messagesreaded";
    ChatEvents["joinRoom"] = "join";
    ChatEvents["leaveAllRooms"] = "leaveallrooms";
    ChatEvents["startedWriting"] = "startedwriting";
    ChatEvents["stoppedWriting"] = "stoppedWriting";
    ChatEvents["availableContact"] = "availablecontact";
    ChatEvents["newContactOnline"] = "newcontactonline";
    ChatEvents["contactDisconnected"] = "contactdisconnected";
})(ChatEvents = exports.ChatEvents || (exports.ChatEvents = {}));
