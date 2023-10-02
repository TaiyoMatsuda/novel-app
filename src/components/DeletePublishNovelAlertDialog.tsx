import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { PublishNovel } from '../types/novel';
import { logicalDeletePublishNovel } from '../lib/firebase';
import { useRecoilState } from 'recoil';
import { fetchPublishNovelState } from '../recoil/atoms';

interface Props {
    visible: boolean;
    novelId: string;
    onClose: () => void;
    setDeleteSuccess: (setDeleteSuccess: boolean) => void;
}

export default function DeletePublishNovelAlertDialog({ visible, novelId, onClose, setDeleteSuccess }: Props) {
    const [fetchStatus, setFetchStatus] = useRecoilState(fetchPublishNovelState);

    const Cancel = () => {
        onClose();
    }

    const Delete = async () => {
        const result = await logicalDeletePublishNovel(novelId);
        if (result) {
            setFetchStatus(true);
            setDeleteSuccess(result);
        }
        onClose();
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={() => onClose()}>
                <Dialog.Icon icon="alert" />
                <Dialog.Title style={styles.title}>Delete Alert</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">Are you sure you want to delete it? This action cannot be undone.</Text>
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