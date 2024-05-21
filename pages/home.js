import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

export default function Home() {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;

     // fonte
     const [fontsLoaded, fontError] = useFonts({
        'Raleway': require('../assets/fonts/Raleway-Regular.ttf'),
        'Raleway-Black': require('../assets/fonts/Raleway-Black.ttf'),
        'Raleway-Bold': require('../assets/fonts/Raleway-Bold.ttf'),
        'Raleway-ExtraBold': require('../assets/fonts/Raleway-ExtraBold.ttf'),
        'Raleway-Light': require('../assets/fonts/Raleway-Light.ttf'),
        'Raleway-Medium': require('../assets/fonts/Raleway-Medium.ttf'),
        'Raleway-SemiBold': require('../assets/fonts/Raleway-SemiBold.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true,
            }).start(() => {
                navigation.navigate('index');
            });
        }, 1500);

        return () => clearTimeout(timer);
    }, [fadeAnim, navigation]);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.imagemTenda, { opacity: fadeAnim }]}>
                <Image
                    source={require('../assets/logo-tenda.png')}
                    style={styles.image}
                />
                {/* Texto envolvido em um componente Text */}
                <Text style={styles.text}>Bem-Vindo cliente</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#305BCC',
    },
    text: {
        fontSize: 24,
        fontFamily: 'Raleway',
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',

    },
    image: {
        width: 230,
        height: 230,
    }
});
