import React, { useEffect, useState } from 'react';
import { FAB } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CreateFAB() {
    const navigation = useNavigation();
    const handleButtonPress = async () => {
        try {
            navigation.navigate('DraftNovelModal', {
                id: "",
                title: "",
                genre: "",
                summary: "",
            });
        } catch (error) {
            console.log('Error fetching like_user:', error);
        }
    };

    return (
        <>
            <FAB
                style={styles.fab}
                icon="lead-pencil"
                onPress={handleButtonPress}
            />
        </>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    }
});
