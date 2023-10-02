import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Logo from '../components/Logo';
import Header from '../components/Header';
import { Button } from "react-native-paper";
import { emailValidator, passwordValidator } from '../core/utils';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { signinByEmailPassword, signinByGoogle } from "../lib/firebase";
import { useRecoilState, useSetRecoilState } from 'recoil';
import { signInUserState, fetchMyPublishNovelState } from '../recoil/atoms';
import LoginAlertDialog from '../components/LoginAlertDialog';

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};

export default function SignInScreen({ navigation }: Props) {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [signInAgree, setAgree] = useState(false);
  const setSignInUser = useSetRecoilState(signInUserState);
  const setFetchMyPublishStatus = useSetRecoilState(fetchMyPublishNovelState);

  useEffect(() => {
    if (signInAgree) {
      signIn();
      navigation.goBack();
    }
  }, [signInAgree]);

  const signIn = async () => {
    const success = await signinByEmailPassword(setSignInUser, email.value, password.value);
    console.log("singIn:" + success);
    if (success) {
      setFetchMyPublishStatus(true);
      console.log("success");
    } else {
      console.log("success not");
    }
  }

  const signInWithGoogle = async () => {
    console.log("signInWithGoogle");
    await signinByGoogle(setSignInUser);
  }

  const _onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    else {
      openDialog();
    }
    // await signIn();
    // navigation.goBack();
  };
  const openDialog = () => {
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.container}>
        <Logo />
        <Header>Welcome!</Header>
      </View>
      <View >
        <View style={styles.container}>
          <Button
            mode="elevated"
            icon={({ size }) => (
              <Image
                source={require('../assets/images/google_icon.png')}
                style={styles.image}
              />
            )}
            onPress={signInWithGoogle}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            <Text style={styles.buttonText}>Sign In With Google</Text>
          </Button>
        </View>
        <View style={styles.container}>
          <Button
            mode="elevated"
            icon={({ size }) => (
              <Image source={require('../assets/images/twitter_icon.png')} style={styles.image} />
            )}
            onPress={() => { }}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            <Text style={styles.buttonText}>Sign In With Twitter</Text>
          </Button>
        </View>
        <View style={styles.container}>
          <Button
            mode="elevated"
            icon={({ size }) => (
              <Image source={require('../assets/images/facebook_icon.png')} style={styles.image} />
            )}
            onPress={() => { }}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            <Text style={styles.buttonText}>Sign In With Facebook</Text>
          </Button>
        </View>
      </View>
      <LoginAlertDialog
        setAgree={setAgree}
        visible={dialogVisible}
        onClose={closeDialog}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    width: 320,
    height: 60,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    width: 320,
    height: 50,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    marginLeft: 10,
    marginRight: 10
  },
});