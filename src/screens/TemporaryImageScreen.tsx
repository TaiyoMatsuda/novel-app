import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, Image, PanResponder, StyleSheet } from 'react-native';


export default function TemporaryImageScreen({ navigation, route }: any) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const pan = useRef(new Animated.ValueXY()).current;

    useEffect(() => {
        setSelectedImage(route.params?.image);
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                Animated.event([null, { dx: pan.x, dy: pan.y }], {
                    useNativeDriver: false,
                })(_, gestureState);
            },
            onPanResponderRelease: () => {
                // ドラッグが終了した時の処理を追加することができます
            },
        })
    ).current;

    return (
        <View>
            {selectedImage ? (
                <Animated.View
                    style={[{ transform: [{ translateX: pan.x }, { translateY: pan.y }] }]}
                    {...panResponder.panHandlers}
                >
                    <Image source={{ uri: selectedImage }} style={{ width: 400, height: 800 }} />
                </Animated.View>
            ) : (
                <Animated.View
                    style={[{ transform: [{ translateX: pan.x }, { translateY: pan.y }] }]}
                    {...panResponder.panHandlers}
                >
                    <Image source={{ uri: 'https://picsum.photos/700' }} style={{ width: 200, height: 200 }} />
                </Animated.View>
            )}
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
