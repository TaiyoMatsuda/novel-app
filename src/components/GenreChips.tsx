import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip } from 'react-native-paper';

interface Props {
    selectedGenre: string;
    handlePress: (value: string) => void;
}

export default function GenreChips({ selectedGenre, handlePress }: Props) {
    return (
        <View style={styles.chipsContainer}>
            <Chip
                style={[styles.chip, selectedGenre === 'SF' && styles.chipSelected]}
                onPress={() => handlePress('SF')}
            >
                Science Fiction
            </Chip>
            <Chip
                style={[styles.chip, selectedGenre === 'Fantasy' && styles.chipSelected]}
                onPress={() => handlePress('Fantasy')}
            >
                Fantasy
            </Chip>
            <Chip
                style={[styles.chip, selectedGenre === 'Historical' && styles.chipSelected]}
                onPress={() => handlePress('Historical')}
            >
                Historical
            </Chip>
            <Chip
                style={[styles.chip, selectedGenre === 'Horror' && styles.chipSelected]}
                onPress={() => handlePress('Horror')}
            >
                Horror
            </Chip>
            <Chip
                style={[styles.chip, selectedGenre === 'Detective' && styles.chipSelected]}
                onPress={() => handlePress('Detective')}
            >
                Detective
            </Chip>
            <Chip
                style={[styles.chip, selectedGenre === 'Comedy' && styles.chipSelected]}
                onPress={() => handlePress('Comedy')}
            >
                Comedy
            </Chip>
            <Chip
                style={[styles.chip, selectedGenre === 'Love' && styles.chipSelected]}
                onPress={() => handlePress('Love')}
            >
                Love
            </Chip>
            <Chip
                style={[styles.chip, selectedGenre === 'Adolescent' && styles.chipSelected]}
                onPress={() => handlePress('Adolescent')}
            >
                Adolescent
            </Chip>
            <Chip
                style={[styles.chip, selectedGenre === 'Action' && styles.chipSelected]}
                onPress={() => handlePress('Action')}
            >
                Action
            </Chip>
        </View>
    );
};

const styles = StyleSheet.create({
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
    chipSelected: {
        backgroundColor: '#7d7d7d',
    },
});