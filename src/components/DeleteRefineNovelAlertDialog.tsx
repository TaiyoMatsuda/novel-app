import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { RefineNovel } from '../types/novel';
import { deleteRefineNovel } from '../lib/firebase';

interface Props {
    visible: boolean;
    onClose: (isDeleted: boolean) => void;
    id: string;
    title: string;
    //novel: RefineNovel
}

export default function DeleteRefineNovelAlertDialog({ visible, onClose, id, title }: Props) {

    const Cancel = () => {
        onClose(false);
    }

    const Delete = async () => {
        await deleteRefineNovel(id);
        onClose(true);
    }

    return (
        <Portal>
            <Dialog visible={visible}>
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