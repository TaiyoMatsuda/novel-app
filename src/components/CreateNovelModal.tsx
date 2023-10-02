import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Button, Modal, Portal, Divider, Chip } from 'react-native-paper';
import { useState } from 'react';
import { TextInput } from 'react-native-paper';
import GenreChips from './GenreChips';

interface Props {
    visible: boolean;
    onColose: () => void;
}

export default function CreateNovelModal({ visible, onColose }: Props) {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const handlePress = (value: any) => {
        setSelectedGenre(value);
    };

    const CreateRefineNovel = async () => {
        const now = new Date();
        try {
            // const docRef = await addDoc(collection(db, "refine_novel"), {
            //     title: title,
            //     genre: selectedGenre,
            //     sumarry: summary,
            //     story: '',
            //     created_at: now,
            //     updated_at: now,
            //     is_generation_done: false
            // });
            console.log("CreateRefineNovel");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        onColose();
    };

    const CreateDraftNovel = async () => {
        const now = new Date();
        try {
            // const docRef = await addDoc(collection(db, "refine_novel"), {
            //     title: title,
            //     genre: selectedGenre,
            //     sumarry: summary,
            //     story: '',
            //     created_at: now,
            //     updated_at: now,
            //     is_generation_done: false
            // });
            console.log("CreateDraftNovel");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        onColose();
    };


    return (
        <Portal>
            <Modal visible={visible} onDismiss={onColose} contentContainerStyle={styles.modalContent} >
                <View style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <Button mode="text" onPress={onColose}>
                            Cancel
                        </Button>
                        <Button mode="contained" onPress={CreateDraftNovel}>
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
                        </View>
                    </ScrollView>
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
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
    chipSelected: {
        backgroundColor: '#7d7d7d',
    },
});