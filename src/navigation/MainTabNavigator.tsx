import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import UserScreen from '../screens/UserScreen';
import PublishNovelDetailScreen from '../screens/PublishNovelDetailScreen';
import MyPublishNovelDetailScreen from '../screens/MyPublishNovelDetailScreen';

import { Feather } from "@expo/vector-icons"
import { Button } from 'react-native-paper';

const Tab = createBottomTabNavigator();
const UserStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

export const MainTabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home"
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="home" color={color} size={size} />
                    ),
                    headerShown: false
                }}
            >
                {() => (
                    <HomeStack.Navigator>
                        <HomeStack.Screen
                            name="HomeScreen"
                            component={HomeScreen}
                            options={{ headerShown: false }}
                        />
                        <HomeStack.Screen
                            name="PublishNovel"
                            component={PublishNovelDetailScreen}
                            options={{
                                headerTitle: 'Publish Novel',
                                headerRight: () => (
                                    <Button>Like</Button>
                                ),
                            }}
                        />
                    </HomeStack.Navigator>
                )}
            </Tab.Screen>
            <Tab.Screen name="User"
                options={{
                    tabBarLabel: "User",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="user" color={color} size={size} />
                    ),
                    headerShown: false
                }}
            >
                {() => (
                    <UserStack.Navigator>
                        <UserStack.Screen
                            name="UserScreen"
                            component={UserScreen}
                            options={{ headerShown: false }}
                        />
                        <UserStack.Screen
                            name="MyPublishNovel"
                            component={MyPublishNovelDetailScreen}
                            options={{
                                headerTitle: 'Publish Novel',
                                headerRight: () => (
                                    <Button>Like</Button>
                                ),
                            }}
                        />
                    </UserStack.Navigator>
                )}
            </Tab.Screen>
        </Tab.Navigator >
    );
}