import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Button, Modal, Portal, Divider, Chip } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import GenreChips from '../components/GenreChips';
import { DraftNovel } from '../types/novel';
import { createRefineNovelFromEdit, updateDraftNovel } from '../lib/firebase';

interface Props {
    pNovel: DraftNovel;
    visible: boolean;
    onColose: () => void;
}

export default function EditNovelModalScreen({ pNovel, visible, onColose }: Props) {
    const [novel, setNovel] = useState<DraftNovel>(pNovel);
    const [title, setTitle] = useState<string>(pNovel.title);
    const [summary, setSummary] = useState(pNovel.summary);
    const [selectedGenre, setSelectedGenre] = useState(pNovel.genre);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setNovel(pNovel);
        setTitle(pNovel.title);
        setSummary(pNovel.summary);
        setSelectedGenre(pNovel.genre);
    }, [pNovel]);

    const handlePress = (value: any) => {
        setSelectedGenre(value);
    };

    const Close = () => {
        onColose();
    }

    const CreateRefineNovel = async () => {
        const createResult = await createRefineNovelFromEdit(novel.id, title, selectedGenre, summary);
        if (createResult) {
            Close();
        }
    };

    const UpdateDraftNovel = async () => {
        let registerSuccessed = false;
        registerSuccessed = await updateDraftNovel(novel.id, title, selectedGenre, summary);
        if (registerSuccessed) {
            setIsSaved(true);
            setTimeout(() => {
                setIsSaved(false);
            }, 2000);
        }
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onColose} contentContainerStyle={styles.modalContent} >
                <View style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <Button mode="text" onPress={Close}>
                            Close
                        </Button>
                        <Button mode="contained" onPress={UpdateDraftNovel}>
                            Save
                        </Button>
                    </View>
                    <ScrollView contentContainerStyle={{ margin: 20 }}>
                        <View>
                            <View>
                                <Text style={{ fontSize: 20 }}>Title</Text>
                                <TextInput
                                    mode="outlined"
                                    label="Enter Title"
                                    value={title}
                                    onChangeText={setTitle}
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
            </Modal>
        </Portal >
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