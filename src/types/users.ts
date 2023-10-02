
export type User = {
    id: string;
    name: string;
    type: string;
    introduction: string;
    image: string;
    updatedAt: Date;
    createdAt: Date;
}

export const initialUser: User = {
    id: "",
    name: "Guest",
    type: "Anonymous",
    introduction: "",
    image: 'https://picsum.photos/700',
    updatedAt: new Date(),
    createdAt: new Date(),
}