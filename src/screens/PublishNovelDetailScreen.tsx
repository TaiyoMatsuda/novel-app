import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Button, Avatar, Divider, Chip } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { fetchPublishNovelState } from '../recoil/atoms';
import { addPublishNovelLike, deletePublishNovelLike } from '../lib/firebase';
import HeartIcon from '../components/HeartIcon'
import { AntDesign } from "@expo/vector-icons"

export default function PublishNovelDetailScreen({ navigation, route }: any) {
    const [fetchStatus, setFetchStatus] = useRecoilState(fetchPublishNovelState);
    const [likeCount, setLikeCount] = useState<number>(route.params?.like_count);
    const [isLiked, setIsLiked] = useState(route.params?.is_like);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const handleLikePress = async () => {
        setIsLiked(!isLiked);
        if (isLiked) {
            const deleteSuccess = await deletePublishNovelLike(route.params?.id);
            if (deleteSuccess) {
                setLikeCount(prevCount => {
                    return prevCount - 1;
                });
            }
        } else {
            const addSuccess = await addPublishNovelLike(route.params?.id);
            if (addSuccess) {
                setLikeCount(prevCount => {
                    return prevCount + 1;
                });
            }
        }
        setFetchStatus(true);
    };

    useEffect(() => {
        if (route.params?.id) {
            setLikeCount(route.params?.like_count);
            setIsLiked(route.params?.is_like);
        }
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeartIcon filled={isLiked} onPress={handleLikePress} />
            ),
        });
    }, [navigation, isLiked]);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ margin: 20 }}>
                <View>
                    <View>
                        <Text style={{ fontSize: 25 }}>Title: {route.params?.title}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <Text>Release date {route.params?.created_at}</Text>
                        <Text style={{ marginLeft: 10 }}><AntDesign name="heart" /> {likeCount}</Text>
                        <View style={styles.chipsContainer}>
                            <Chip style={[styles.chip]}>{route.params?.genre}</Chip>
                        </View>
                    </View>
                    <Divider style={{ marginVertical: 10 }} />
                    <View>
                        <Text style={{ fontSize: 25 }}>Story</Text>
                        <Text style={{ fontSize: 20 }}>{route.params?.story}</Text>
                    </View>
                    <Divider style={{ marginVertical: 20 }} />
                    <View>
                        <Text style={{ fontSize: 25 }}>Author</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                            <View></View>
                            <View>
                                <Avatar.Image size={50} source={{ uri: route.params?.author_image }} />
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontSize: 20 }}>{route.params?.author_name}</Text>
                            </View>
                        </View>
                    </View>
                    <Divider style={{ marginVertical: 20 }} />
                </View>
            </ScrollView >
        </View >
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
    },
    chip: {
        marginLeft: 10,
    },
});