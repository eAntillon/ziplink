export interface url {
    url: string;
    id: number;
    shortUrl: string;
    userId: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    expiresAt: Date | null;
}