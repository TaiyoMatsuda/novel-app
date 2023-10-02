import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { signInUserState } from '../recoil/atoms';
import { DraftNovel } from '../types/novel';
import { deleteDraftNovel } from '../lib/firebase';

interface Props {
    visible: boolean;
    onClose: () => void;
    id: string;
    title: string;
}

export default function DeleteDraftNovelAlertDialog({ visible, onClose, id, title }: Props) {

    const Cancel = () => {
        onClose();
    }

    const Delete = async () => {
        await deleteDraftNovel(id);
        onClose();
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose}>
                <Dialog.Icon icon="alert" />
                <Dialog.Title style={styles.title}>Delete Alert</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">Are you sure you want to delete {title}? This action cannot be undone.</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={Cancel}>Cancel</Button>
                    <Button onPress={Delete}>Delete</Button>
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