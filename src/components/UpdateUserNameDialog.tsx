import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { signInUserState } from '../recoil/atoms';
import { updateUserName } from '../lib/firebase';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function UpdateUserNameDialog({ visible, onClose }: Props) {
    const [signInUser, setSignInUser] = useRecoilState(signInUserState);
    const [name, setName] = useState('Guest');

    const Cancel = () => {
        onClose();
    }

    const Edit = async () => {
        const updateResult = await updateUserName(name);
        if (updateResult) {
            setSignInUser(prevUser => ({
                ...prevUser,
                name: name
            }));
            onClose();
        } else {

        }
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose}>
                <Dialog.Icon icon="account-circle" />
                <Dialog.Title style={styles.title}>Edit Name?</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        mode="outlined"
                        label="Enter Name"
                        value={name}
                        onChangeText={name => setName(name)}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={Cancel}>Cancel</Button>
                    <Button onPress={Edit}>Edit</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
    },
})