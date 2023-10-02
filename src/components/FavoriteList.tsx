import React, { useEffect, useState } from 'react';
import {
    FlatList,
    ScrollView, StyleSheet, View
} from 'react-native';
import {
    Card, Title, Paragraph, List, Divider, FAB,
    Appbar,
    BottomNavigation,
    Button,
    Text,
    Chip,
    IconButton,
    Provider,
} from 'react-native-paper';
import CreateFAB from './CreateFAB';

type Novel = {
    id: string;
    reqPara: string;
    title: string;
    story: string;
};

export default function FavoriteList() {
    const [novels, setNovels] = useState<Novel[]>([]);
    useEffect(() => {
        fetchNovels();
    }, []);
    const fetchNovels = async () => {
        try {
            // const response = await axios.get(URL);
            // setNovels(response.data)
        } catch (error) {
            console.error(error)
        }
    };

    const limit = 50;
    const renderItem = ({ item }: { item: Novel }) => (
        <Card style={styles.card} mode="contained">
            {/* <Card.Cover source={require('../assets/images/players.jpg')} /> */}
            <Card.Title
                title={item.title}
                titleVariant="headlineMedium"
            />
            <Card.Content>
                {item.story && (
                    <Text variant="bodyMedium">
                        {item.story.length > limit ? item.story.substring(0, limit) + "..." : item.story}
                    </Text>
                )}
            </Card.Content>
            <Card.Actions>
                <Button onPress={() => { }}>Remove</Button>
                <Button onPress={() => { }}>Read more</Button>
            </Card.Actions>
        </Card>
    );

    return (
        <>
            <CreateFAB />
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