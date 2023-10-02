import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Button, Modal, Portal, Divider, Chip } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import GenreChips from '../components/GenreChips';
import { useRecoilState } from 'recoil';
import { fetchDraftNovelState } from '../recoil/atoms';
import { createDraftNovel, updateDraftNovel, createRefineNovel, createRefineNovelFromEdit } from '../lib/firebase';
import DeleteDraftNovelAlertDialog from '../components/DeleteDraftNovelAlertDialog';

export default function DraftNovelModalScreen({ navigation, route }: any) {
    const [fetchStatus, setFetchStatus] = useRecoilState(fetchDraftNovelState);
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);

    const handlePress = (value: any) => {
        setSelectedGenre(value);
    };

    useEffect(() => {
        if (route.params?.id) {
            setId(route.params?.id);
            setTitle(route.params?.title);
            setSelectedGenre(route.params?.genre);
            setSummary(route.params?.summary);
        }
    }, []);

    const CreateRefineNovel = async () => {
        let createResult = false;
        if (id === "") {
            createResult = await createRefineNovel(title, selectedGenre, summary);
        } else {
            createResult = await createRefineNovelFromEdit(id, title, selectedGenre, summary);
        }
        if (createResult) {
            navigation.goBack();
            setFetchStatus(true);
        }
    };

    const SaveDraftNovel = async () => {
        let registerSuccessed = false;
        if (id === "") {
            registerSuccessed = await createDraftNovel(title, selectedGenre, summary);

        } else {
            registerSuccessed = await updateDraftNovel(id, title, selectedGenre, summary);
        }

        if (registerSuccessed) {
            setIsSaved(true);
            setTimeout(() => {
                setIsSaved(false);
            }, 2000);
            console.log("registerSuccessed: " + fetchStatus);
            setFetchStatus(true);
        }
    };

    const openDialog = () => {
        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
        navigation.goBack();
        setFetchStatus(true);
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={SaveDraftNovel}>Save</Button>
            ),
        });
    }, [navigation, title, selectedGenre, summary]);

    return (
        <>
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ margin: 20 }}>
                    <View>
                        <View>
                            <Text style={{ fontSize: 20 }}>Title</Text>
                            <TextInput
                                mode="outlined"
                                label="Enter Title"
                                value={title}
                                onChangeText={title => setTitle(title)}
                            />
                        </View>
                        <Divider style={{ marginVertical: 20 }} />
                        <View>
                            <Text style={{ fontSize: 20, marginBottom: 10 }}>Genre</Text>
                            <GenreChips selectedGenre={selectedGenre} handlePress={handlePress} />
                        </View>
                        <Divider style={{ marginVertical: 20 }} />
                        <View>
                            <Text style={{ fontSize: 20 }}>Summary</Text>
                            <TextInput
                                mode="outlined"
                                label="Enter Novel Summary"
                                value={summary}
                                onChangeText={text => setSummary(text)}
                                multiline={true}
                            />
                        </View>
                        <Divider style={{ marginVertical: 20 }} />
                        <Button onPress={CreateRefineNovel}>Request</Button>
                        {id &&
                            <>
                                <Divider style={{ marginVertical: 20 }} />
                                <Button onPress={openDialog}>Delete</Button>
                            </>
                        }
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
            <DeleteDraftNovelAlertDialog
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