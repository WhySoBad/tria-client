export interface MessageContstructor {
    uuid: string;
    sender: string;
    chat: string;
    createdAt: Date;
    editedAt: Date | null;
    edited: number;
    text: string;
}
export interface MessageEdit {
    chat: string;
    uuid: string;
    text: string;
    edited: number;
    editedAt: Date;
}
