export type User = {
    id: string;
    displayName: string;
    email: string;
    avatar: string;
    locale: string;
};

export type Story = {
    id: string;
    title: string;
    description: string;
    cover: string | null;
    createdAt: string;
    updatedAt: string;
    published: boolean;
};
