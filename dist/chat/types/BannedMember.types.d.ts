export interface BannedMemberConstructor {
    bannedAt: Date;
    user: {
        uuid: string;
        createdAt: Date;
        name: string;
        tag: string;
        description: string;
        avatar: string | null;
    };
}
