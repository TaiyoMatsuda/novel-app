import { createStackNavigator } from '@react-navigation/stack';
import { SignUpScreen } from '../screens/SignUpScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import SignInScreen from '../screens/SignInScreen';

const AuthStack = createStackNavigator();

export const AuthStackNavigator = () => {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen
                name="SignIn"
                component={SignInScreen} />
            <AuthStack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{
                    headerShown: false
                }} />
            <AuthStack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                    headerShown: false
                }} />
        </AuthStack.Navigator>
    );
};