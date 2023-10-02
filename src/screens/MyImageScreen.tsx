import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Button, Avatar, Portal, Divider, Chip } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRecoilState } from 'recoil';
import { signInUserState } from '../recoil/atoms';
import { uploadImageToFirebase } from '../lib/firebase';


export default function MyImageScreen({ navigation, route }: any) {
    const [signInUser, setSignInUser] = useRecoilState(signInUserState);
    const [imageUrl, setImageUrl] = useState<string>(signInUser.image);

    const EditImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === 'granted') {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) {
                // navigation.navigate('TemporaryImageScreen', {
                //     image: result.assets[0].uri,
                // });
                const response = await fetch(result.assets[0].uri);
                const blob = await response.blob();
                const fileName = signInUser.id + '.png';
                await uploadImageToFirebase(setImageUrl, blob, fileName);
            }
        } else {
            console.log('Permission not granted');
        }
    };

    useEffect(() => {
        if (imageUrl) {
            setSignInUser(prevUser => ({
                ...prevUser,
                image: imageUrl
            }));
        }
    }, [imageUrl]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={EditImage}>Edit</Button>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Avatar.Image size={300} source={{ uri: imageUrl }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
