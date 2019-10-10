"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var FromToDto_1 = require("./FromToDto");
var MessageDto = /** @class */ (function (_super) {
    __extends(MessageDto, _super);
    function MessageDto(from, to, messageText, date, isReaded, readedDate) {
        var _this = _super.call(this, from, to) || this;
        _this.from = from;
        _this.to = to;
        _this.messageText = messageText;
        _this.date = date;
        _this.isReaded = isReaded;
        _this.readedDate = readedDate;
        return _this;
    }
    return MessageDto;
}(FromToDto_1.FromToDto));
exports.MessageDto = MessageDto;
