import { createStackNavigator } from '@react-navigation/stack';
import { MainTabNavigator } from './MainTabNavigator';
import { AuthStackNavigator } from './AuthStackNavigator';
import { TransitionPresets } from '@react-navigation/stack';
import RefineNovelModalScreen from '../screens/RefineNovelModalScreen';
import DraftNovelModalScreen from '../screens/DraftNovelModalScreen';
import MyImageScreen from '../screens/MyImageScreen';
import TemporaryImageScreen from '../screens/TemporaryImageScreen';
import { Button } from 'react-native-paper';

const RootStack = createStackNavigator();

export const MainNavigator = () => {
    return (
        <RootStack.Navigator
            screenOptions={{
                ...TransitionPresets.SlideFromRightIOS,
            }}
        >
            <RootStack.Group>
                <RootStack.Screen
                    name="Main"
                    component={MainTabNavigator}
                    options={{ headerShown: false }}
                />
                <RootStack.Screen
                    name="AuthStack"
                    component={AuthStackNavigator}
                    options={{ headerShown: false }}
                />
            </RootStack.Group>
            <RootStack.Group screenOptions={{ presentation: 'modal' }}>
                <RootStack.Screen
                    name="MyImageScreen"
                    component={MyImageScreen}
                    options={{
                        headerTitle: 'My Image',
                        headerRight: () => (
                            <Button>Edit</Button>
                        ),
                    }}
                />
                <RootStack.Screen
                    name="TemporaryImageScreen"
                    component={TemporaryImageScreen}
                    options={{
                        headerTitle: 'Temporary Image',
                    }}
                />
                <RootStack.Screen
                    name="DraftNovelModal"
                    component={DraftNovelModalScreen}
                    options={{
                        headerTitle: 'Draft Novel',
                        headerRight: () => (
                            <Button>Save</Button>
                        ),
                    }}
                />
                <RootStack.Screen
                    name="RefineNovelModal"
                    component={RefineNovelModalScreen}
                    options={{
                        headerTitle: 'Refine Novel',
                        headerRight: () => (
                            <Button>Save</Button>
                        ),
                    }}
                />
            </RootStack.Group>
        </RootStack.Navigator>
    );
}