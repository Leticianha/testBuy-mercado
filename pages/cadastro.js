import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons/'
import { useFonts } from 'expo-font';
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from 'react-native-animatable';

export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const navigation = useNavigation();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);


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

    const handleCadastro = async () => {
        if (nome && telefone && email && usuario && senha) {
            const user = { nome, telefone, email, usuario, senha };
            await AsyncStorage.setItem('user', JSON.stringify(user));
            Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
            navigation.navigate('login');
        } else {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
        }
    };

    const validateEmail = (text) => {
        setEmail(text.replace(/[^a-zA-Z0-9@._-]/g, ''));
    };

    const validatePhone = (text) => {
        setTelefone(text.replace(/[^0-9]/g, ''));
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.scrollView}>
                <Animatable.View animation='fadeInUp' style={styles.container}>
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
                        marginTop={25}
                        onPress={() => { navigation.navigate('login'); }}
                    />

                    <View style={styles.boxInputs}>
                        <Text style={styles.label}>Nome</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-circle" size={30} style={styles.icon} />
                            <TextInput
                                placeholder="Digite seu Nome"
                                style={styles.input}
                                onChangeText={setNome}
                                value={nome}
                            />
                        </View>
                        <Text style={styles.label}>Telefone</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="call" size={25} style={styles.icon} />
                            <TextInput
                                placeholder="Digite seu Telefone"
                                style={styles.input}
                                onChangeText={validatePhone}
                                value={telefone}
                                keyboardType="phone-pad"
                            />
                        </View>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail" size={27} style={styles.icon} />
                            <TextInput
                                placeholder="Digite seu Email"
                                style={styles.input}
                                onChangeText={validateEmail}
                                value={email}
                                keyboardType="email-address"
                            />
                        </View>
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
                                    style={styles.icon} />
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
                    <TouchableOpacity onPress={handleCadastro} style={styles.button}>
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>
                </Animatable.View>

            </ScrollView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#F5F5F5',
        minHeight: 100
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
        marginTop: 30,
        marginBottom: 20
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
        marginRight: 10,
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
        marginTop: 10,
        marginBottom: 50
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Raleway-ExtraBold',
    },
});
