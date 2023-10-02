import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, doc,
    onSnapshot, query, where, orderBy, connectFirestoreEmulator, runTransaction, limit,
    serverTimestamp, FieldValue, QueryDocumentSnapshot, DocumentData, startAfter, endBefore
} from 'firebase/firestore';
import {
    signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword,
    UserCredential, Auth, getAuth, signInAnonymously,
    onAuthStateChanged, linkWithCredential, EmailAuthProvider
} from "firebase/auth";
import { PublishNovel, RefineNovel, DraftNovel } from '../types/novel';
import Constants from 'expo-constants';
import { initialUser, User } from '../types/users';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const app = initializeApp(Constants.expoConfig?.extra?.firebase);
const db = getFirestore(app);
const storage = getStorage(app);
const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
//connectFirestoreEmulator(db, '10.0.2.2', 8081);

export const anonymousSignin = async (setSignInUser: (signInUser: User) => void) => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid;
            const userRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                setSignInUser(
                    {
                        id: uid,
                        ...userDoc.data(),
                    } as User
                );
            } else {
                const docRef = await setDoc(doc(db, "users", uid), {
                    ...initialUser
                });
                initialUser.id = uid;
                setSignInUser(initialUser);
            }
        } else {
            signInAnonymously(auth)
                .then(async (e) => {
                    console.log("user.uid: " + e.user.uid);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log("SingInError: " + error.message);
                });
        }
    });
}

export const signinByEmailPassword = async (setSignInUser: (signInUser: User) => void, email: string, password: string): Promise<boolean> => {
    const auth = getAuth();
    let success = false;
    await signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const userRef = doc(collection(db, 'users'), userCredential.user.uid);
            const userDoc = await getDoc(userRef);

            const fileName = auth.currentUser?.uid + ".png";
            const storageRef = ref(storage, `myDocs/${fileName}`);
            await getDownloadURL(storageRef)
                .then((downloadURL) => {
                    const user = {
                        image: downloadURL,
                        ...userDoc.data(),
                    } as User
                    setSignInUser(user);
                })
                .catch((error) => {
                    const user = {
                        image: 'https://picsum.photos/700',
                        ...userDoc.data(),
                    } as User
                    setSignInUser(user);
                });
            success = true;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("singIn Error: " + errorMessage);
            success = false;
        });
    return success;
}

export const signinByGoogle = async (setSignInUser: (signInUser: User) => void): Promise<boolean> => {
    const auth = getAuth(app);
    let success = false;

    try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        console.log("signInWithPopup");
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        success = true;
    } catch (error) {
        console.log("signInWithPopuperror:" + JSON.stringify(error));
        // Handle Errors here.
        // const errorCode = error?.code;
        // const errorMessage = error.message;
        // // The email of the user's account used.
        // const email = error.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    }


    return success;
}

export const uploadImageToFirebase = async (setImageUrl: (imageUrl: string) => void, blob: Blob, fileName: string) => {
    const sotrageRef = ref(storage, `myDocs/${fileName}`);
    const uploadTask = uploadBytesResumable(sotrageRef, blob);
    uploadTask.on(
        "state_changed", null,
        (error) => console.log(error),
        () => {
            getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                    //isUploadCompleted(true)
                    setImageUrl(downloadURL);
                });
        }
    );
}

export const updateUserName = async (name: string) => {
    const auth = getAuth();
    const now = new Date();
    try {
        const uid = auth.currentUser?.uid;
        const userRef = doc(collection(db, 'users'), uid);
        await updateDoc(userRef, {
            name: name,
        });
        return true;
    } catch {
        return false;
    }
};

export const linkAccountByEmail = async (setSignInUser: (signInUser: User) => void, name: string, email: string, password: string) => {
    const auth = getAuth();
    const credential = EmailAuthProvider.credential(email, password);
    linkWithCredential(auth.currentUser, credential)
        .then(async (userCredential: UserCredential) => {
            const uid = userCredential.user.uid;
            const userRef = doc(collection(db, 'users'), uid);
            await updateDoc(userRef, {
                name: name,
            });
            const userDoc = await getDoc(userRef);
            setSignInUser(
                {
                    ...userDoc.data(),
                } as User
            );
        })
        .catch((error) => {
            console.error('Error linking anonymous account: ', error);
        });
}

export const createPublishNovelFromRefine = async (id: string, title: string, genre: string, summary: string, story: string) => {
    const auth = getAuth();
    const now = new Date();
    try {
        const delteNovelRef = doc(db, "refine_novel", id);
        const newNovelRef = doc(collection(db, "publish_novel"));
        const newNovelData = {
            title: title,
            genre: genre,
            summary: summary,
            author: auth.currentUser?.uid,
            story: story,
            like_count: 0,
            created_at: now,
            updated_at: now,
            is_active: true
        };
        const result = await runTransaction(db, async (transaction) => {
            transaction.delete(delteNovelRef);
            transaction.set(newNovelRef, newNovelData);
            return true;
        });
        return result;
    } catch (error) {
        console.error(error)
        return false;
    }
}

export const getInitPublishNovel = async (setNovels: (novels: PublishNovel[]) => void, setLastVisible: (lastVisible: QueryDocumentSnapshot<DocumentData>) => void) => {
    try {
        const novelsRef = collection(db, 'publish_novel');
        const novelsQuery = query(
            novelsRef,
            where('is_active', '==', true),
            orderBy("created_at", 'desc'), limit(12));
        const querySnapshot = await getDocs(novelsQuery);

        const novels: PublishNovel[] = [];
        await Promise.all(querySnapshot.docs.map(async (document) => {
            const data = document.data();

            const userRef = doc(collection(db, 'users'), data.author);
            const userDoc = await getDoc(userRef);
            const author = {
                ...userDoc.data(),
            } as User

            const fileName = data.author + ".png";
            const storageRef = ref(storage, `myDocs/${fileName}`);
            await getDownloadURL(storageRef)
                .then((downloadURL) => {
                    const date: Date = data.created_at.toDate();
                    const novel: PublishNovel = {
                        id: document.id,
                        title: data.title,
                        genre: data.genre,
                        summary: data.summary,
                        story: data.story,
                        author_name: author.name,
                        author_image: downloadURL,
                        like_count: data.like_count,
                        created_at: date,
                        is_active: data.is_active,
                    };
                    novels.push(novel);
                })
                .catch((error) => {
                    const date: Date = data.created_at.toDate();
                    const novel: PublishNovel = {
                        id: document.id,
                        title: data.title,
                        genre: data.genre,
                        summary: data.summary,
                        story: data.story,
                        author_name: author.name,
                        author_image: 'https://picsum.photos/700',
                        like_count: data.like_count,
                        created_at: date,
                        is_active: data.is_active,
                    };
                    novels.push(novel);
                });
        }));
        novels.sort((a: PublishNovel, b: PublishNovel) => getTime(b.created_at) - getTime(a.created_at));
        setNovels(novels);

        const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisible(lastVisibleDoc);
    } catch (error) {
        console.log("getInitPublishNovel");
        console.error(error)
    }
};

export const getMorePublishNovel = async (setNovels: (novels: PublishNovel[] | null) => void, setLastVisible: (lastVisible: QueryDocumentSnapshot<DocumentData> | null) => void, lastVisible: QueryDocumentSnapshot<DocumentData> | null) => {
    try {
        const novelsRef = collection(db, 'publish_novel');
        const novelsQuery = query(novelsRef,
            where('is_active', '==', true), orderBy("created_at", 'desc'), startAfter(lastVisible), limit(12));
        const querySnapshot = await getDocs(novelsQuery);

        const novels: PublishNovel[] | null = [];
        await Promise.all(querySnapshot.docs.map(async (document) => {
            const data = document.data();

            const userRef = doc(collection(db, 'users'), data.author);
            const userDoc = await getDoc(userRef);
            const author = {
                ...userDoc.data(),
            } as User

            const fileName = data.author + ".png";
            const storageRef = ref(storage, `myDocs/${fileName}`);
            await getDownloadURL(storageRef)
                .then((downloadURL) => {
                    const date: Date = data.created_at.toDate();
                    const novel: PublishNovel = {
                        id: document.id,
                        title: data.title,
                        genre: data.genre,
                        summary: data.summary,
                        story: data.story,
                        author_name: author.name,
                        author_image: downloadURL,
                        like_count: data.like_count,
                        created_at: date,
                        is_active: data.is_active,
                    };
                    novels.push(novel);
                })
                .catch((error) => {
                    const date: Date = data.created_at.toDate();
                    const novel: PublishNovel | null = {
                        id: document.id,
                        title: data.title,
                        genre: data.genre,
                        summary: data.summary,
                        story: data.story,
                        author_name: author.name,
                        author_image: 'https://picsum.photos/700',
                        like_count: data.like_count,
                        created_at: date,
                        is_active: data.is_active,
                    };
                    novels.push(novel);
                });
        }));

        novels.sort((a: PublishNovel, b: PublishNovel) => getTime(b.created_at) - getTime(a.created_at));
        await setNovels((prevData: PublishNovel[] | null) => [...prevData, ...novels]);

        const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisible(lastVisibleDoc);
    } catch (error) {
        //console.error(error)
    }
};

const getTime = (date: Date) => {
    return date != null ? date.getTime() : 0;
}

export const getInitMyPublishNovels = async (setNovels: (novels: PublishNovel[]) => void, setLastVisible: (lastVisible: QueryDocumentSnapshot<DocumentData>) => void) => {
    const auth = getAuth();
    try {
        const novelsRef = collection(db, 'publish_novel');
        const novelsQuery = query(
            novelsRef, where('author', '==', auth.currentUser?.uid), where('is_active', '==', true),
            orderBy('created_at', 'desc'), limit(12)
        );
        const querySnapshot = await getDocs(novelsQuery);
        const novels: PublishNovel[] = [];
        await Promise.all(querySnapshot.docs.map(async (document) => {
            const data = document.data();

            const userRef = doc(collection(db, 'users'), data.author);
            const userDoc = await getDoc(userRef);
            const author = {
                ...userDoc.data(),
            } as User

            const date: Date = data.created_at.toDate();
            const novel: PublishNovel = {
                id: document.id,
                title: data.title,
                genre: data.genre,
                summary: data.summary,
                story: data.story,
                author_name: author.name,
                author_image: "",
                like_count: data.like_count,
                created_at: date,
                is_active: data.is_active,
            };
            novels.push(novel);
        }));
        await setNovels(novels);

        const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisible(lastVisibleDoc);
    } catch (error) {
        console.log("error" + error);
        console.error(error)
    }
};

export const getMoreMyPublishNovels = async (setNovels: (novels: PublishNovel[]) => void, setLastVisible: (lastVisible: QueryDocumentSnapshot<DocumentData>) => void, lastVisible: QueryDocumentSnapshot<DocumentData> | null) => {
    const auth = getAuth();
    try {
        const novelsRef = collection(db, 'publish_novel');
        const novelsQuery = query(
            novelsRef, where('author', '==', auth.currentUser?.uid), where('is_active', '==', true),
            orderBy('created_at', 'desc'), startAfter(lastVisible), limit(12)
        );
        const querySnapshot = await getDocs(novelsQuery);
        const novels: PublishNovel[] = [];
        await Promise.all(querySnapshot.docs.map(async (document) => {
            const data = document.data();

            const userRef = doc(collection(db, 'users'), data.author);
            const userDoc = await getDoc(userRef);
            const author = {
                ...userDoc.data(),
            } as User

            const date: Date = data.created_at.toDate();
            const novel: PublishNovel = {
                id: document.id,
                title: data.title,
                genre: data.genre,
                summary: data.summary,
                story: data.story,
                author_name: author.name,
                author_image: "",
                like_count: data.like_count,
                created_at: date,
                is_active: data.is_active,
            };
            novels.push(novel);
        }));
        await setNovels((prevData: PublishNovel[] | null) => [...prevData, ...novels]);

        const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisible(lastVisibleDoc);
    } catch (error) {
        console.log("error" + error);
        console.error(error)
    }
};

export const getIsLike = async (novelId: string, userId: string) => {
    const likeUserRef = collection(doc(db, 'publish_novel', novelId), 'like_user');
    const querySnapshot = await getDocs(likeUserRef);
    const likeUsers: string[] = [];
    querySnapshot.forEach((doc) => {
        likeUsers.push(doc.id);
    });
    return likeUsers.includes(userId);
};


export const addPublishNovelLike = async (id: string) => {
    const now = new Date();
    const auth = getAuth();
    const uid = auth.currentUser == null ? "" : auth.currentUser.uid;
    try {
        const likeUserRef = collection(doc(db, 'publish_novel', id), 'like_user');
        await setDoc(doc(likeUserRef, auth.currentUser?.uid), {
            created_at: now
        });

        const querySnapshot = await getDocs(likeUserRef);
        const likeCount = querySnapshot.size;

        const novelRef = doc(db, 'publish_novel', id);
        await updateDoc(novelRef, { like_count: likeCount });

        return true;
    } catch (e) {
        console.log("add_error: " + e);
        return false;
    }
};

export const deletePublishNovelLike = async (id: string) => {
    const auth = getAuth();
    try {
        const likeUserRef = collection(doc(db, 'publish_novel', id), 'like_user');
        await deleteDoc(doc(likeUserRef, auth.currentUser?.uid));

        const querySnapshot = await getDocs(likeUserRef);
        const likeCount = querySnapshot.size;

        const novelRef = doc(db, 'publish_novel', id);
        await updateDoc(novelRef, { like_count: likeCount });
        // const docRef = doc(db, 'publish_novel', id);
        // const mapField = 'like_user';
        // await updateDoc(docRef, {
        //     like_user: FieldValue.delete(auth.currentUser?.uid),
        // });
        return true;
    } catch (e) {
        console.log("delete_error: " + e);
        return false;
    }
};

export const logicalDeletePublishNovel = async (id: string) => {
    const now = new Date();
    try {
        const docRef = doc(collection(db, "publish_novel"), id);
        //const docNovel = await getDoc(docRef);
        await updateDoc(docRef, {
            updated_at: now,
            is_active: false
        });
        return true;
    } catch (e) {
        return false;
    }
};

export const createRefineNovel = async (title: string, selectedGenre: string, summary: string) => {
    const auth = getAuth();
    const now = new Date();
    try {
        const docRef = await addDoc(collection(db, "refine_novel"), {
            title: title,
            genre: selectedGenre,
            summary: summary,
            story: '',
            created_at: now,
            updated_at: now,
            is_generation_done: false,
            author: auth.currentUser?.uid
        });
        const doc = await getDoc(docRef);
        if (doc.exists()) {
            const novel = {
                id: doc.id,
                ...doc.data()
            } as RefineNovel;
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
};

export const createRefineNovelFromEdit = async (id: string, title: string, selectedGenre: string, summary: string) => {
    const auth = getAuth();
    const now = new Date();
    try {
        const delteNovelRef = doc(db, "draft_novel", id);
        const newNovelRef = doc(collection(db, "refine_novel"));
        const newNovelData = {
            title: title,
            genre: selectedGenre,
            summary: summary,
            story: '',
            created_at: now,
            updated_at: now,
            is_generation_done: false,
            author: auth.currentUser?.uid
        };

        await runTransaction(db, async (transaction) => {
            transaction.delete(delteNovelRef);
            transaction.set(newNovelRef, newNovelData);
        });
        return true;
    } catch (e) {
        return false;
    }
};

export const updateRefinetNovel = async (setNovel: (novel: RefineNovel) => void, id: string, title: string, selectedGenre: string, story: string) => {
    const now = new Date();
    try {
        console.log("updateRefinetNovel: " + id);
        const docRef = doc(collection(db, "refine_novel"), id);
        console.log("updateRefinetNovel2:" + title);
        await updateDoc(docRef, {
            title: title,
            genre: selectedGenre,
            story: story,
            updated_at: now,
        });

        const docNovel = await getDoc(docRef);
        console.log("updateRefinetNovel3:" + JSON.stringify(docNovel));
        if (docNovel.exists()) {
            setNovel(
                {
                    id: docNovel.id,
                    ...docNovel.data()
                } as RefineNovel
            );
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log("update_error: " + e);
        return false;
    }
};

export const getInitRefineNovels = async (setNovels: (novels: RefineNovel[]) => void) => {
    const auth = getAuth();
    try {
        const novelsRef = collection(db, 'refine_novel');
        const novelsQuery = query(
            novelsRef,
            where('author', '==', auth.currentUser?.uid),
            orderBy('created_at', 'desc')
        );
        const novelsSnapshot = await getDocs(novelsQuery);
        const novelsData = novelsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as RefineNovel[];
        setNovels(novelsData);
    } catch (error) {
        console.error(error)
    }
};

export const getMoreRefineNovels = async (setNovels: (novels: RefineNovel[]) => void, setLastVisible: (lastVisible: QueryDocumentSnapshot<DocumentData>) => void, lastVisible: QueryDocumentSnapshot<DocumentData> | null) => {
    const auth = getAuth();
    try {
        const novelsRef = collection(db, 'refine_novel');
        const novelsQuery = query(
            novelsRef, where('author', '==', auth.currentUser?.uid),
            orderBy('created_at', 'desc'), startAfter(lastVisible), limit(12)
        );
        const novelsSnapshot = await getDocs(novelsQuery);
        const novelsData = novelsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as RefineNovel[];
        setNovels((prevData: RefineNovel[] | null) => [...prevData, ...novelsData]);

        const lastVisibleDoc = novelsSnapshot.docs[novelsSnapshot.docs.length - 1];
        setLastVisible(lastVisibleDoc);
    } catch (error) {
        console.error(error)
    }
};

export const deleteRefineNovel = async (id: string) => {
    try {
        await deleteDoc(doc(db, "refine_novel", id));
        return true;
    } catch (e) {
        return false;
    }
};

export const createDraftNovel = async (title: string, selectedGenre: string, summary: string) => {
    const now = new Date();
    const auth = getAuth();
    try {
        const docRef = await addDoc(collection(db, "draft_novel"), {
            title: title,
            genre: selectedGenre,
            summary: summary,
            created_at: now,
            updated_at: now,
            author: auth.currentUser?.uid
        });
        const doc = await getDoc(docRef);
        if (doc.exists()) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
};

export const updateDraftNovel = async (id: string, title: string, selectedGenre: string, summary: string) => {
    const now = new Date();
    try {
        const docRef = doc(collection(db, "draft_novel"), id);
        await updateDoc(docRef, {
            title: title,
            genre: selectedGenre,
            summary: summary,
            updated_at: now
        });

        const docNovel = await getDoc(docRef);
        if (docNovel.exists()) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log("update_error: " + e);
        return false;
    }
};

export const getInitDraftNovel = async (setNovels: (novels: DraftNovel[]) => void, setLastVisible: (lastVisible: QueryDocumentSnapshot<DocumentData>) => void) => {
    const auth = getAuth();
    try {
        const novelsRef = collection(db, 'draft_novel');
        const novelsQuery = query(
            novelsRef,
            where('author', '==', auth.currentUser?.uid),
            orderBy('updated_at', 'desc'), limit(12)
        );
        const novelsSnapshot = await getDocs(novelsQuery);
        const novelsData = novelsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as DraftNovel[];
        setNovels(novelsData);

        const lastVisibleDoc = novelsSnapshot.docs[novelsSnapshot.docs.length - 1];
        setLastVisible(lastVisibleDoc);
    } catch (error) {
        console.error(error)
    }
};

export const getMoreDraftNovel = async (setNovels: (novels: DraftNovel[]) => void, setLastVisible: (lastVisible: QueryDocumentSnapshot<DocumentData>) => void, lastVisible: QueryDocumentSnapshot<DocumentData> | null) => {
    const auth = getAuth();
    try {
        const novelsRef = collection(db, 'draft_novel');
        const novelsQuery = query(
            novelsRef,
            where('author', '==', auth.currentUser?.uid),
            orderBy('updated_at', 'desc'), startAfter(lastVisible), limit(12)
        );
        const novelsSnapshot = await getDocs(novelsQuery);
        const novelsData = novelsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as DraftNovel[];
        await setNovels((prevData: DraftNovel[] | null) => [...prevData, ...novelsData]);

        const lastVisibleDoc = novelsSnapshot.docs[novelsSnapshot.docs.length - 1];
        setLastVisible(lastVisibleDoc);
    } catch (error) {
        console.error(error)
    }
};

export const deleteDraftNovel = async (id: string) => {
    try {
        await deleteDoc(doc(db, "draft_novel", id));
        return true;
    } catch (e) {
        return false;
    }
};

export const listenRefineNovels = async (setNovels: (novels: RefineNovel[]) => void) => {

    const auth = getAuth();
    const novelsRef = collection(db, 'refine_novel');
    const novelsQuery = query(
        novelsRef, where('author', '==', auth.currentUser?.uid),
        orderBy("created_at", 'desc'));
    const unsubscribe = await onSnapshot(novelsQuery, (novelsSnapshot) => {
        const updatedNovels = novelsSnapshot.docs.map((doc, index) => ({
            id: doc.id,
            ...doc.data(),
        })) as RefineNovel[];
        setNovels(updatedNovels);
    });
    return unsubscribe;
};