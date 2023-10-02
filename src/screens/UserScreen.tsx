import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import {
    Card, Title, Menu, Divider,
    Button,
    Text,
    Avatar,
} from 'react-native-paper';
import DraftList from '../components/DraftList';
import RefineList from '../components/RefineList';
import MyPublishList from '../components/MyPublishList';
import UpdateUserNameDialog from '../components/UpdateUserNameDialog';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useRecoilState } from 'recoil';
import { signInUserState } from '../recoil/atoms';
import { Feather } from "@expo/vector-icons"

const Draft = () => (
    <DraftList />
);

const Refine = () => (
    <RefineList />
);

const Publish = () => (
    <MyPublishList />
);

import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Home: undefined;
    Profile: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
}

type Route = {
    key: string;
    title: string;
}

export default function UserScreen({ navigation }: HomeScreenProps) {
    const [signInUser, setSignInUser] = useRecoilState(signInUserState);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'publish', title: 'Publish' },
        { key: 'refine', title: 'Refine' },
        { key: 'draft', title: 'Draft' },
    ]);
    const [dialogVisible, setDialogVisible] = useState(false);

    const renderScene = SceneMap({
        draft: Draft,
        refine: Refine,
        publish: Publish,
    });

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: '#1DA1F2' }}
        />
    );

    const handleSignIn = () => {
        setVisible(false);
        navigation.navigate('AuthStack', { screen: 'SignIn' });
    }

    const handleSignUp = () => {
        setVisible(false);
        navigation.navigate('AuthStack', { screen: 'SignUp' });
    }

    const handleSignOut = () => {
        setVisible(false);
        navigation.navigate('AuthStack', { screen: 'SignIn' });
    }

    const handleUpdateName = () => {
        setVisible(false);
        setDialogVisible(true);
    }

    const handleImagePress = () => {
        setVisible(false);
        navigation.navigate('MyImageScreen');
    };

    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const closeDialog = () => {
        setDialogVisible(false);
    };

    return (
        <>
            <Card style={{ borderRadius: 0 }}>
                <View style={{ marginTop: 10, marginBottom: 10, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={handleImagePress}>
                                <Avatar.Image size={80} source={{ uri: signInUser.image }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleUpdateName}>
                                <Card.Content>
                                    <Title>{signInUser.name}</Title>
                                </Card.Content>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Menu
                                visible={visible}
                                onDismiss={closeMenu}
                                anchor={
                                    <View style={{ alignSelf: 'flex-start' }}>
                                        <TouchableOpacity style={{ padding: 10 }} onPress={openMenu}>
                                            <Feather name="settings" size={24} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                }>
                                <View>
                                    {signInUser.type === 'Anonymous' && (
                                        <View>
                                            <Menu.Item onPress={handleSignIn} title="Sing In" />
                                            <Menu.Item onPress={handleSignUp} title="Sing up" />
                                        </View>
                                    )}
                                    <Menu.Item onPress={handleUpdateName} title="Edit Name" />
                                    <Menu.Item onPress={handleImagePress} title="Edit Image" />
                                    {signInUser.type !== 'Anonymous' && (
                                        <Menu.Item onPress={handleSignOut} title="Sing OUt" />
                                    )}
                                </View>
                            </Menu>
                        </View>
                    </View>
                    <Text>
                        {signInUser.introduction}
                    </Text>
                </View>
            </Card>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
            />
            <UpdateUserNameDialog
                visible={dialogVisible}
                onClose={closeDialog}
            />
            {/* <FAB icon="lead-pencil" onPress={() => { }} visible style={styles.fab} /> */}
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
    scene: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});