import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, } from 'react-native';
import { Card, ProgressBar, Text, } from 'react-native-paper';
import CreateFAB from './CreateFAB';
import { getInitDraftNovel, getMoreDraftNovel } from '../lib/firebase';
import { DraftNovel, initialDraftNovel } from '../types/novel';
import { useRecoilState } from 'recoil';
import { signInUserState } from '../recoil/atoms';
import { fetchDraftNovelState } from '../recoil/atoms';
import EditNovelModalScreen from '../screens/EditNovelModalScreen';
import DeleteDraftNovelAlertDialog from './DeleteDraftNovelAlertDialog';
import { useNavigation } from '@react-navigation/native';

import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export default function DraftList() {
    const [signInUser, setSignInUser] = useRecoilState(signInUserState);
    const [fetchStatus, setFetchStatus] = useRecoilState(fetchDraftNovelState);
    const [novels, setNovels] = useState<DraftNovel[]>([]);
    const [novel, setNovel] = useState<DraftNovel>(initialDraftNovel);
    const [modalVisible, setModalVisible] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [onFetch, setOnFetch] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        if (fetchStatus) {
            fetchNovels();
            setFetchStatus(false);
        }
    }, [fetchStatus]);

    const openCreateModal = (item: DraftNovel) => {
        setModalVisible(true);
        setNovel(item);
    };

    const closeCreateModal = () => {
        console.log("closeCreateModal");
        setModalVisible(false);
        fetchNovels();
    };

    const fetchNovels = async () => {
        try {
            await getInitDraftNovel(setNovels, setLastVisible);
        } catch (error) {
            console.error(error);
        } finally {
            setOnFetch(false);
        }
    };

    const openDialog = (item: DraftNovel) => {
        setDialogVisible(true);
        setNovel(item);
    };

    const closeDialog = () => {
        console.log("closeDialog");
        setDialogVisible(false);
        fetchNovels();
    };

    const handleButtonPress = async (item: DraftNovel) => {
        try {
            navigation.navigate('DraftNovelModal', {
                id: item.id,
                title: item.title,
                genre: item.genre,
                summary: item.summary,
            });
        } catch (error) {
            console.log('Error fetching like_user:', error);
        }
    };

    const loadMoreData = async () => {
        if (onFetch) {
            return;
        }
        setOnFetch(true);
        try {
            await getMoreDraftNovel(setNovels, setLastVisible, lastVisible);
        } catch (error) {
            //console.error(error)
            console.log(error);
        } finally {
            setOnFetch(false);
        }
    };

    const limit = 100;
    const renderItem = ({ item }: { item: DraftNovel }) => (
        <Card style={styles.card}
            onPress={() => {
                handleButtonPress(item);
            }}
            mode="contained">
            {/* <Card.Cover source={require('../assets/images/players.jpg')} /> */}
            <Card.Title
                title={item.title}
                titleVariant="headlineMedium"
            />
            <Card.Content>
                {item.summary && (
                    <Text variant="bodyMedium">
                        {item.summary.length > limit ? item.summary.substring(0, limit) + "..." : item.summary}
                    </Text>
                )}
            </Card.Content>
            {/* <Card.Actions>
                <Button onPress={() => openDialog(item)}>Trash</Button>
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
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{ marginTop: 10 }}
            />
            <ProgressBar indeterminate={onFetch} />
            <CreateFAB />
            {/* <DeleteDraftNovelAlertDialog
                visible={dialogVisible}
                onClose={closeDialog}
                novel={novel}
            /> */}
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