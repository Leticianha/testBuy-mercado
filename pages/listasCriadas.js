import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons/';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

export default function ListasCriadas() {
    const navigation = useNavigation();
    const route = useRoute();
    const { savedLists } = route.params || { savedLists: [] };
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [listDates, setListDates] = useState({});
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        loadDates();
    }, []);

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

    useEffect(() => {
        onLayoutRootView();
    }, [fontsLoaded, fontError]);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();  // Correct method call
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const saveDates = async (dates) => {
        try {
            await AsyncStorage.setItem('listDates', JSON.stringify(dates));
        } catch (error) {
            console.error('Failed to save dates', error);
            // Handle error here
        }
    };

    const loadDates = async () => {
        try {
            const storedDates = await AsyncStorage.getItem('listDates');
            if (storedDates) {
                setListDates(JSON.parse(storedDates));
            }
        } catch (error) {
            console.error('Failed to load dates', error);
            // Handle error here
        }
    };

    const showDatePicker = (list) => {
        setSelectedList(list);
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
        setSelectedList(null);
    };

    const handleConfirm = (date) => {
        const newDates = {
            ...listDates,
            [selectedList.nomeLista]: date,
        };
        setListDates(newDates);
        saveDates(newDates);
        hideDatePicker();
    };

    const formatListNameAndEllipsis = (name) => {
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        if (formattedName.length > 15) {
            return formattedName.substring(0, 15) + '...';
        } else {
            return formattedName;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.scrollView}>
                <Animatable.View animation='fadeInUp' style={styles.container}>

                    {/* header */}
                    <View style={styles.header}>
                        <View style={styles.navegacaoHeader}>
                            <Ionicons name="chevron-back" size={35} style={styles.icon} onPress={() => {
                                navigation.navigate('index');
                                setProdutos([]); // Limpa a lista de produtos ao voltar para a tela principal
                            }} />
                            <Text style={styles.titleHeader}>Listas</Text>
                        </View>
                        <View style={styles.logoContainer}>
                            <Image source={require('../assets/logoComFundo.png')} style={styles.logo} />
                        </View>
                    </View>

                    {/* botões com as listas */}
                    <Text style={styles.textTodasListas}>
                        Todas suas listas
                    </Text>
                    <View style={styles.containerListas}>
                        {savedLists.map((list, index) => (
                            <View key={index} style={styles.listaContainer}>
                                <TouchableOpacity
                                    style={styles.listaBotao}
                                    onPress={() => navigation.navigate('produtosAdicionados', { list })}
                                >
                                    <View style={styles.listaContent}>

                                        <Text style={styles.nomeListas}>{formatListNameAndEllipsis(list.nomeLista)}</Text>

                                        <View style={styles.calendarContainer}>
                                            <Ionicons name="calendar" size={24} color="#DE6566" onPress={() => showDatePicker(list)} />
                                            {listDates[list.nomeLista] ? (
                                                <Text style={styles.dataListas}>
                                                    {moment(listDates[list.nomeLista]).format('DD/MM/YYYY')}
                                                </Text>
                                            ) : (
                                                <Text style={styles.dataIndefinida}>
                                                    Clique para definir data
                                                </Text>
                                            )}
                                        </View>

                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </Animatable.View>
                <StatusBar style="auto" />
            </ScrollView>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#F5F5F5',
        flex: 1,
    },
    container: {
        flex: 1,
        margin: 40
    },
    // header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: -10,
        marginBottom: 50
    },
    navegacaoHeader: {
        flexDirection: 'row'
    },
    titleHeader: {
        fontFamily: 'Raleway-SemiBold',
        fontSize: 22,
    },
    logoContainer: {
        shadowColor: '#305BCC',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logo: {
        width: 110,
        height: 60,
    },
    // botões das listas
    textTodasListas: {
        fontFamily: 'Raleway',
        fontSize: 18,
        marginBottom: 15
    },
    containerListas: {
        flex: 1
    },
    listaContainer: {
        backgroundColor: '#305BCC',
        padding: 30,
        borderRadius: 25,
        marginBottom: 20
    },
    listaBotao: {
        flex: 1
    },
    calendarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nomeListas: {
        fontFamily: 'Raleway',
        fontSize: 24,
        color: '#FFFFFF'
    },
    dataListas: {
        fontFamily: 'Raleway-Bold',
        fontSize: 16,
        color: '#FFFFFF',
        marginLeft: 10
    },
    dataIndefinida: {
        fontFamily: 'Raleway-SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
        marginLeft: 10,
    },
});
