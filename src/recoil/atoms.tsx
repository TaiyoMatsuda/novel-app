import { atom, selector } from 'recoil';
import { RefineNovel } from '../types/novel';
import { User } from '../types/users';

// リファイン小説の配列を管理するatom
export const refineNovelsState = atom<RefineNovel[]>({
    key: 'refineNovelState',
    default: [],
});

export const signInUserState = atom<User>({
    key: 'auth/signIn',
    default: undefined,
});

export const fetchMyPublishNovelState = atom<boolean>({
    key: 'fetchMyPublishNovelState',
    default: true,
});

export const fetchPublishNovelState = atom<boolean>({
    key: 'fetchPublishNovelState',
    default: true,
});

export const fetchDraftNovelState = atom<boolean>({
    key: 'fetchDraftNovelState',
    default: true,
});
// // refineNovelsStateを更新する関数を提供するselector
// export const setRefineNovels = selector({
//     key: 'setRefineNovels',
//     set: ({ set }, novelsData) => {
//         set(refineNovelsState, novelsData);
//     },
// });