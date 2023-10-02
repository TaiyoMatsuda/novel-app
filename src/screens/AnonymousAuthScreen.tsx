import React, { useEffect } from "react";
import {
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    Text,
} from "react-native";
import { anonymousSignin } from "../lib/firebase";
import { useRecoilState, useSetRecoilState } from 'recoil';
import { initialUser, User } from '../types/users';
import { refineNovelsState, signInUserState } from '../recoil/atoms';

export const AnonymousAuthScreen: React.FC = () => {
    const setSignInUser = useSetRecoilState(signInUserState);
    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        await anonymousSignin(setSignInUser);
    }

    return (
        <SafeAreaView style={styles.container}>
            <ActivityIndicator size="large" />
            <Text style={styles.text}>login...</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        marginTop: 16,
        fontSize: 12,
        color: "#888",
    },
});