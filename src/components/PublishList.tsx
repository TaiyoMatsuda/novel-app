import React, { useEffect, useState } from 'react';
import {
    FlatList, StyleSheet,
} from 'react-native';
import {
    Card,
    Text,
    ProgressBar,
    Avatar
} from 'react-native-paper';
import { PublishNovel, initialPublishNovel } from '../types/novel';
import { getInitPublishNovel, getMorePublishNovel, getIsLike } from '../lib/firebase';
import CreateFAB from './CreateFAB';
import { useRecoilState } from 'recoil';
import { signInUserState } from '../recoil/atoms';
import { fetchPublishNovelState } from '../recoil/atoms';
import DeletePublishNovelAlertDialog from './DeletePublishNovelAlertDialog';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons"

import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export default function PublishList() {
    const [signInUser, setSignInUser] = useRecoilState(signInUserState);
    const [fetchStatus, setFetchStatus] = useRecoilState(fetchPublishNovelState);
    const [novels, setNovels] = useState<PublishNovel[] | null>(null);
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [onFetch, setOnFetch] = useState(true);
    const navigation = useNavigation();

    // useEffect(() => {
    //     fetchNovels();
    // }, []);


    useEffect(() => {
        if (fetchStatus) {
            fetchNovels();
            setFetchStatus(false);
        }
    }, [fetchStatus]);

    const fetchNovels = async () => {
        setOnFetch(true);
        try {
            await getInitPublishNovel(setNovels, setLastVisible);
        } catch (error) {
            console.error(error);
        } finally {
            setOnFetch(false);
        }
    };

    const handleButtonPress = async (item: PublishNovel) => {
        try {
            var isUserLiked = false;
            if (item.like_count > 0) {
                isUserLiked = await getIsLike(item.id, signInUser.id);
            }
            navigation.navigate('PublishNovel', {
                id: item.id,
                title: item.title,
                genre: item.genre,
                story: item.story,
                author_name: item.author_name,
                author_image: item.author_image,
                is_like: isUserLiked,
                like_count: item.like_count,
                created_at: item.created_at.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            });
        } catch (error) {
            console.log('Error fetching like_user:', error);
        }
    };

    const limit = 200;
    const renderItem = ({ item }: { item: PublishNovel }) => (
        <Card
            style={styles.card}
            onPress={() => {
                handleButtonPress(item);
            }}
            mode="contained">
            <Card.Title
                title={item.title}
                subtitle={
                    <>
                        <AntDesign name="heart" />
                        {` ${item.like_count}`}
                        {` Author: ${item.author_name}`}
                    </>
                }
                left={(props) => <Avatar.Image  {...props} source={{ uri: item.author_image }} />}
                titleVariant="headlineMedium"
            />
            <Card.Content>
                {item.story && (
                    <Text variant="bodyMedium">
                        {item.story.length > limit ? item.story.substring(0, limit) + "..." : item.story}
                    </Text>
                )}
            </Card.Content>
            {/* <Card.Actions>
                <Button onPress={() => handleButtonPress(item)}>
                    Read more
                </Button>
            </Card.Actions> */}
        </Card >
    );

    const loadMoreData = async () => {
        if (onFetch) {
            return;
        }
        setOnFetch(true);
        try {
            await getMorePublishNovel(setNovels, setLastVisible, lastVisible);
        } catch (error) {
            //console.error(error)
            console.log(error);
        } finally {
            setOnFetch(false);
        }
    };

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
            <CreateFAB updateData={fetchNovels} />
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

const buttonStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});