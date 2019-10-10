export interface IContact {
    readonly Id: number;
    readonly Username: string;
    readonly Avatar: string;
    readonly Description: string;
    IsOnline: boolean;
    SocketId: string;
    handleDisconnect(): void;
}
