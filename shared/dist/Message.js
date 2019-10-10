"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Message = /** @class */ (function () {
    function Message(from, to, messageText, date, isReaded, readedDate) {
        if (isReaded === void 0) { isReaded = false; }
        if (readedDate === void 0) { readedDate = undefined; }
        this.from = from;
        this.to = to;
        this.messageText = messageText;
        this.date = date;
        this.isReaded = isReaded;
        this.readedDate = readedDate;
    }
    Object.defineProperty(Message.prototype, "From", {
        get: function () {
            return this.from;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "To", {
        get: function () {
            return this.to;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "MessageText", {
        get: function () {
            return this.messageText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "Date", {
        get: function () {
            return this.date;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "IsReaded", {
        get: function () {
            return this.isReaded;
        },
        set: function (value) {
            this.isReaded = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "ReadedDate", {
        get: function () {
            return this.readedDate;
        },
        set: function (value) {
            this.readedDate = value;
        },
        enumerable: true,
        configurable: true
    });
    return Message;
}());
exports.Message = Message;
