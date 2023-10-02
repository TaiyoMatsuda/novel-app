import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { signInUserState } from '../recoil/atoms';

interface Props {
    visible: boolean;
    onClose: () => void;
    setAgree: (signInAgree: boolean) => void;
}

export default function LoginAlertDialog({ setAgree, visible, onClose }: Props) {
    //const [visible, setVisible] = React.useState(false);
    // const hideDialog = () => setVisible(false);
    const [signInUser, setSignInUser] = useRecoilState(signInUserState);

    const Disagree = () => {
        setAgree(false);
        onClose();
    }

    const Agree = () => {
        setAgree(true);
        onClose();
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose}>
                <Dialog.Icon icon="alert" />
                <Dialog.Title style={styles.title}>Login Alert</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">You can not take over data whcih is created by {signInUser.name}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={Disagree}>Disagree</Button>
                    <Button onPress={Agree}>Agree</Button>
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