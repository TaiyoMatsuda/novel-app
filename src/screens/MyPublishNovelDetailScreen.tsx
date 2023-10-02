import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Button, Avatar, Divider, Chip } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { fetchPublishNovelState, fetchMyPublishNovelState } from '../recoil/atoms';
import { addPublishNovelLike, deletePublishNovelLike } from '../lib/firebase';
import DeletePublishNovelAlertDialog from '../components/DeletePublishNovelAlertDialog';
import HeartIcon from '../components/HeartIcon'
import { AntDesign } from "@expo/vector-icons"

export default function MyPublishNovelDetailScreen({ navigation, route }: any) {
    const [fetchStatus, setFetchStatus] = useRecoilState(fetchPublishNovelState);
    const [fetchMyPublishStatus, setFetchMyPublishStatus] = useRecoilState(fetchMyPublishNovelState);
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [summary, setSummary] = useState('');
    const [story, setStory] = useState('');
    const [author, setAuthor] = useState('');
    const [likeCount, setLikeCount] = useState<number>(route.params?.like_count);
    const [isLiked, setIsLiked] = useState(route.params?.is_like);
    const [releaseDate, setReleaseDate] = useState(route.params?.created_at);
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
            setId(route.params?.id);
            setTitle(route.params?.title);
            setGenre(route.params?.genre);
            setSummary(route.params?.summary);
            setStory(route.params?.story);
            setAuthor(route.params?.author);
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

    useEffect(() => {
        if (deleteSuccess) {
            navigation.goBack();
        }
    }, [deleteSuccess]);

    const openDialog = () => {
        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
    };
    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ margin: 20 }}>
                <View>
                    <View>
                        <Text style={{ fontSize: 25 }}>Title: {title}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <Text>Release date {releaseDate}</Text>
                        <Text style={{ marginLeft: 10 }}><AntDesign name="heart" /> {likeCount}</Text>
                        <View style={styles.chipsContainer}>
                            <Chip style={[styles.chip]}>{genre}</Chip>
                        </View>
                    </View>
                    {/* <View style={styles.header}>
                        <View style={styles.chipsContainer}>
                            <Chip style={[styles.chip]}>{genre}</Chip>
                        </View>
                        <Text>Release date {releaseDate}</Text>
                        <Text><AntDesign name="heart" /> {likeCount}</Text>
                    </View> */}
                    <Divider style={{ marginVertical: 10 }} />
                    <View>
                        <Text style={{ fontSize: 25 }}>Summary</Text>
                        <Text style={{ fontSize: 20 }}>{summary}</Text>
                    </View>
                    <Divider style={{ marginVertical: 20 }} />
                    <View>
                        <Text style={{ fontSize: 25 }}>Story</Text>
                        <Text style={{ fontSize: 20 }}>{story}</Text>
                    </View>
                    <Divider style={{ marginVertical: 20 }} />
                    <View>
                        <Text style={{ fontSize: 25 }}>Author</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                            <View></View>
                            <View>
                                <Avatar.Image size={50} source={{ uri: 'https://picsum.photos/700' }} />
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontSize: 20 }}>{author}</Text>
                            </View>
                        </View>
                    </View>
                    <Button onPress={openDialog}>Delete</Button>
                    <Divider style={{ marginVertical: 20 }} />
                </View>
            </ScrollView >
            <DeletePublishNovelAlertDialog
                visible={dialogVisible}
                novelId={id}
                onClose={closeDialog}
                setDeleteSuccess={setDeleteSuccess}
            />
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