import React from 'react';
import { IconButton } from 'react-native-paper';

interface props {
    filled: boolean;
    onPress: () => void;
}

const HeartIcon = ({ filled, onPress }: props) => {
    const name = filled ? 'heart' : 'heart-outline';
    const color = filled ? 'red' : 'black';

    return (
        <IconButton
            icon={name}
            iconColor={color}
            onPress={onPress}
        />
    );
};

export default HeartIcon;