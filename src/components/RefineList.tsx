import React, { useEffect, useState } from 'react';
import {
    FlatList, StyleSheet, View
} from 'react-native';
import { Card, ProgressBar, Text, Chip } from 'react-native-paper';
import { getInitRefineNovels, listenRefineNovels, getMoreRefineNovels } from '../lib/firebase';
import CreateFAB from './CreateFAB';
import { RefineNovel, initialRefineNovel } from '../types/novel';
import { useSetRecoilState } from 'recoil';
import { fetchPublishNovelState } from '../recoil/atoms';
import DeleteRefineNovelAlertDialog from './DeleteRefineNovelAlertDialog';
import { useNavigation } from '@react-navigation/native';

import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export default function RefineList() {
    const setfetchPublishNovelStatus = useSetRecoilState(fetchPublishNovelState);
    const [novels, setNovels] = useState<RefineNovel[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        fetchNovels();
        reloadNovels();
    }, []);

    const fetchNovels = async () => {
        try {
            await getInitRefineNovels(setNovels);
        } catch (error) {
            console.error(error);
        } finally {
        }
    };

    const closeDialog = () => {
        setDialogVisible(false);
    };

    const reloadNovels = async () => {
        console.log("reloadNovels:" + novels.length);
        const unsubscribe = await listenRefineNovels(setNovels);
        return () => unsubscribe();
    }

    const handleButtonPress = async (item: RefineNovel) => {
        console.log("handleButtonPress:" + JSON.stringify(item));
        try {
            navigation.navigate('RefineNovelModal', {
                id: item.id,
                title: item.title,
                genre: item.genre,
                summary: item.summary,
                story: item.story,
                author: item.author,
                // created_at: item.created_at.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            });
        } catch (error) {
            console.log('Error fetching like_user:', error);
        }
    };

    const limit = 100;
    const renderItem = ({ item }: { item: RefineNovel }) => (
        <Card
            style={styles.card}
            onPress={() => {
                handleButtonPress(item);
            }}
            mode="contained">
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Card.Title
                        title={item.title}
                        titleVariant="headlineMedium"
                    />
                </View>
                <View style={{ alignSelf: 'flex-start' }}>
                    <Chip style={{ margin: 8 }}>
                        {item.genre}
                    </Chip>
                </View>
            </View>
            <Card.Content>
                {item.story && (
                    <Text variant="bodyMedium">
                        {item.story.length > limit ? item.story.substring(0, limit) + "..." : item.story}
                    </Text>
                )}
            </Card.Content>
            {/* <Card.Actions>
                <Button onPress={() => handleButtonPress(item)}>Edit</Button>
            </Card.Actions> */}
        </Card>
    );

    return (
        <>
            <FlatList
                data={novels}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{ marginTop: 10 }}
            />
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
    card: {
        marginHorizontal: 8,
        marginBottom: 8,
    },
    cardContainer: {
        marginBottom: 80,
    },
    chipsContainer: {
        flexDirection: 'row',
    },
    chipsContent: {
        paddingLeft: 8,
        paddingVertical: 8,
    },
});