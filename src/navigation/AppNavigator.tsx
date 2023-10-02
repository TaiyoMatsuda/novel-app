import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainNavigator } from "./MainNavigator";
import { AnonymousAuthScreen } from "../screens/AnonymousAuthScreen";
import { useRecoilState } from 'recoil';
import { signInUserState } from '../recoil/atoms';

const Stack = createStackNavigator();
export const AppNavigator = () => {
    const [signInUser, setSignInUser] = useRecoilState(signInUserState);
    return (
        < NavigationContainer >
            {signInUser ? <MainNavigator /> : <AnonymousAuthScreen />}
        </NavigationContainer >
    );
};