import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';

SplashScreen.preventAutoHideAsync();

export default function Login() {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigation = useNavigation();

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

    const handleLogin = async () => {
        if (!usuario || !senha) {
            Alert.alert('Atenção', 'Preencha todos os campos');
            return;
        }

        const userData = await AsyncStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.usuario === usuario && user.senha === senha) {
                navigation.navigate('home');
            } else {
                Alert.alert('Atenção', 'Usuário ou senha incorretos.');
            }
        } else {
            Alert.alert('Atenção', 'Usuário não encontrado. Por favor, cadastre-se.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.scrollView}>
                <Animatable.View animation="fadeInUp" style={styles.container}>
                    <View style={styles.dentroTenda}>
                        <Image
                            source={require('../assets/logo-tenda.png')}
                            style={styles.image}
                        />
                    </View>

                    <Ionicons
                        name="chevron-back"
                        size={35}
                        marginLeft={25}
                        marginTop={20}
                        onPress={() => { navigation.navigate('inicio'); }}
                    />

                    <View style={styles.separa}>
                        <View style={styles.boxInputs}>
                            <Text style={styles.label}>Usuário</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person" size={25} style={styles.icon} />
                                <TextInput
                                    placeholder="Digite seu Usuário"
                                    style={styles.input}
                                    onChangeText={setUsuario}
                                    value={usuario}
                                />
                            </View>
                            <Text style={styles.label}>Senha</Text>
                            <View style={styles.inputContainer}>
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                    <Ionicons
                                        name={isPasswordVisible ? "eye" : "eye-off"}
                                        size={25}
                                        style={styles.icon}
                                    />
                                </TouchableOpacity>
                                <TextInput
                                    placeholder="Digite sua Senha"
                                    style={styles.input}
                                    secureTextEntry={!isPasswordVisible}
                                    onChangeText={setSenha}
                                    value={senha}
                                />
                               
                            </View>
                        </View>

                        <TouchableOpacity onPress={handleLogin} style={styles.button}>
                            <Text style={styles.buttonText}>Entrar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('cadastro')} style={styles.link}>
                            <Text style={styles.linkText}>
                                Não possui uma conta? <Text style={styles.linkTextAzul}>Cadastre-se</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#F5F5F5',
        minHeight: 100,
    },
    container: {
        flex: 1,
    },
    dentroTenda: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
        backgroundColor: '#305BCC',
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,
        marginBottom: 30
    },
    image: {
        width: 160,
        height: 160,
        resizeMode: 'contain',
    },
    label: {
        fontFamily: 'Raleway-SemiBold',
        fontSize: 20,
        marginBottom: 8,
        marginTop: 10,
    },
    boxInputs: {
        margin: 40,
        marginTop: 0,
        marginBottom: 20,
    },
    separa: {
        marginTop: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6E6E6',
        borderRadius: 20,
        marginBottom: 10,
        paddingHorizontal: 10,
        height: 60,
    },
    icon: {
        color: '#F6282A',
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: '#E6E6E6',
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#305BCC',
        borderRadius: 20,
        alignItems: 'center',
        padding: 10,
        margin: 40,
        marginTop: 0,
        marginBottom: 0,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Raleway-ExtraBold',
    },
    link: {
        marginTop: 20,
        margin: 40,
        alignItems: 'center',
    },
    linkText: {
        fontSize: 18,
        fontFamily: 'Raleway-SemiBold',
        textAlign: 'center',
    },
    linkTextAzul: {
        color: '#305BCC',
        fontSize: 18,
        fontFamily: 'Raleway-SemiBold',
    },
});
