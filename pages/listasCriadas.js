import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ListasCriadas({ route }) {
    const { nomeLista } = route.params; // Obtendo o nome da lista dos parâmetros de navegação

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.botao}>
                <Text style={styles.textoBotao}>{nomeLista}</Text> {/* Botão com o nome da lista */}
            </TouchableOpacity>
            {/* Outros componentes da tela listasCriadas */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botao: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    textoBotao: {
        color: 'white',
        fontSize: 18,
    },
});
