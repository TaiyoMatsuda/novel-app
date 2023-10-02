import { serverTimestamp, FieldValue } from 'firebase/firestore';
// export type PublishNovel = {
//     id: string;
//     title: string;
//     genre: string;
//     summary: string;
//     story: string;
//     author: string;
//     like_count: number;
//     is_like: boolean;
//     created_at: Date;
//     updated_at: Date;
//     is_active: boolean;
// };

// export const initialPublishNovel: PublishNovel = {
//     id: "",
//     title: "",
//     genre: "",
//     summary: "",
//     story: "",
//     author: "",
//     like_count: 0,
//     is_like: false,
//     created_at: new Date(),
//     updated_at: new Date(),
//     is_active: true
// };

export type PublishNovel = {
    id: string;
    title: string;
    genre: string;
    summary: string;
    story: string;
    author_name: string;
    author_image: string;
    like_count: number;
    created_at: Date;
    is_active: boolean;
};

export const initialPublishNovel: PublishNovel = {
    id: "",
    title: "",
    genre: "",
    summary: "",
    story: "",
    author_name: "",
    author_image: "https://picsum.photos/700",
    like_count: 0,
    created_at: new Date(),
    is_active: true
};

export type RefineNovel = {
    id: string;
    title: string;
    genre: string;
    summary: string;
    story: string;
    author: string;
    created_at: Date;
    updated_at: Date;
    is_generation_done: boolean;
};

export const initialRefineNovel: RefineNovel = {
    id: "",
    title: "",
    genre: "",
    summary: "",
    story: "",
    author: "",
    created_at: new Date(),
    updated_at: new Date(),
    is_generation_done: true
};

export type DraftNovel = {
    id: string;
    title: string;
    genre: string;
    summary: string;
    author: string;
    created_at: Date;
    updated_at: Date;
};

export const initialDraftNovel: DraftNovel = {
    id: "",
    title: "",
    genre: "",
    summary: "",
    author: "",
    created_at: new Date(),
    updated_at: new Date()
}