export declare class ContactDto {
    readonly id: number;
    readonly username: string;
    readonly avatar: string;
    readonly description: string;
    readonly isOnline: boolean;
    readonly socketId: string;
    constructor(id: number, username: string, avatar: string, description: string, isOnline: boolean, socketId: string);
}
