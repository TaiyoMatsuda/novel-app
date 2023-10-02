import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Button, Modal, Portal, Divider, Chip } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import GenreChips from '../components/GenreChips';
import { useRecoilState } from 'recoil';
import { signInUserState } from '../recoil/atoms';
import { useSetRecoilState } from 'recoil';
import { fetchPublishNovelState } from '../recoil/atoms';
import { RefineNovel } from '../types/novel';
import { createDraftNovel, updateRefinetNovel, createPublishNovelFromRefine } from '../lib/firebase';
import DeleteRefineNovelAlertDialog from '../components/DeleteRefineNovelAlertDialog';

export default function RefineNovelModalScreen({ navigation, route }: any) {
    const setFetchStatus = useSetRecoilState(fetchPublishNovelState);
    const [novel, setNovel] = useState<RefineNovel>();
    const [id, setId] = useState(route.params?.id);
    const [title, setTitle] = useState(route.params?.title);
    const [summary, setSummary] = useState(route.params?.summary);
    const [story, setStory] = useState(route.params?.story);
    const [selectedGenre, setSelectedGenre] = useState(route.params?.genre);
    const [isSaved, setIsSaved] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);

    const handlePress = (value: any) => {
        setSelectedGenre(value);
    };

    // const Close = () => {
    //     setNovel(undefined);
    //     setTitle('');
    //     setSummary('');
    //     setSelectedGenre('');
    //     onColose();
    // }

    // const CreateRefineNovel = async () => {
    //     const now = new Date();
    //     try {
    //         const docRef = await addDoc(collection(db, "refine_novel"), {
    //             title: title,
    //             genre: selectedGenre,
    //             sumarry: summary,
    //             story: '',
    //             created_at: now,
    //             updated_at: now,
    //             is_generation_done: false
    //         });
    //     } catch (e) {
    //         console.error("Error adding document: ", e);
    //     }
    //     onColose();
    // };

    const SaveRefineNovel = async () => {
        console.log("SaveRefineNovel");
        const updateSuccessed = await updateRefinetNovel(setNovel, id, title, selectedGenre, story);
        console.log("SaveRefineNovel2:" + updateSuccessed);
        if (updateSuccessed) {
            setIsSaved(true);
            setTimeout(() => {
                setIsSaved(false);
            }, 2000);
        }
    };

    const PublishNovel = async () => {
        const publishSuccess = await createPublishNovelFromRefine(id, title, selectedGenre, summary, story);
        if (publishSuccess) {
            setFetchStatus(true);
            navigation.goBack();
        } else {

        }
    };

    const DeleteNovel = async () => {
        setDialogVisible(true);
        //setNovel(novel);
    };

    const closeDialog = (isDeleted: boolean) => {
        setDialogVisible(false);
        if (isDeleted) {
            navigation.goBack();
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={SaveRefineNovel}>Save</Button>
            ),
        });


        // if (imageUrl) {
        //     setSignInUser(prevUser => ({
        //         ...prevUser,
        //         image: imageUrl
        //     }));
        // }
    }, [navigation, title, selectedGenre, story]);

    return (
        <>
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ margin: 20 }}>
                    <View>
                        <View>
                            <Text style={{ fontSize: 25 }}>Title</Text>
                            <TextInput
                                mode="outlined"
                                label="Enter Title"
                                value={title}
                                onChangeText={title => setTitle(title)}
                            />
                        </View>
                        <Divider style={{ marginVertical: 20 }} />
                        <View>
                            <Text style={{ fontSize: 25, marginBottom: 10 }}>Genre</Text>
                            <GenreChips selectedGenre={selectedGenre} handlePress={handlePress} />
                        </View>
                        <Divider style={{ marginVertical: 20 }} />
                        <View>
                            <Text style={{ fontSize: 25 }}>Summary</Text>
                            <Text style={{ fontSize: 20 }}>{summary}</Text>
                        </View>
                        <Divider style={{ marginVertical: 20 }} />
                        <View>
                            <Text style={{ fontSize: 25 }}>Story</Text>
                            <TextInput
                                mode="outlined"
                                label="Enter Novel Story"
                                value={story}
                                onChangeText={story => setStory(story)}
                            />
                        </View>
                        <Divider style={{ marginVertical: 20 }} />
                        <Button onPress={PublishNovel}>Publish</Button>
                        <Divider style={{ marginVertical: 20 }} />
                        <Button onPress={DeleteNovel}>Delete</Button>
                        <Divider style={{ marginVertical: 20 }} />
                    </View>
                </ScrollView>
                {isSaved && (
                    <View style={styles.container}>
                        <View style={styles.chipsContainer}>
                            <Chip style={{
                                borderRadius: 12,
                            }}>
                                Save Successed
                            </Chip>
                        </View>
                    </View>
                )}
            </View>
            <DeleteRefineNovelAlertDialog
                visible={dialogVisible}
                onClose={closeDialog}
                id={id}
                title={title}
            />
        </>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 5,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
});