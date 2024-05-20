import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'; // Adicionei TouchableOpacity para o ícone de voltar
import { useRoute } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons/';
import { useNavigation } from '@react-navigation/native';

export default function ProdutosAdicionados() {
    const [produtos, setProdutos] = useState([]); // Adicionei useState aqui
    const navigation = useNavigation();

    const route = useRoute();
    const { list } = route.params || {};

    if (!list) {
        return (
            <View style={styles.container}>
                <Text>Erro: Nenhuma lista fornecida.</Text>
            </View>
        );
    }

    const limparProdutos = () => {
        setProdutos([]);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.scrollView}>
                <Animatable.View delay={600} animation='fadeInUp' style={styles.container}>
                    {/* header */}
                    <View style={styles.header}>
                        <View style={styles.navegacaoHeader}>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('index');
                                limparProdutos(); // Limpa a lista de produtos ao voltar para a tela principal
                            }}>
                                <Ionicons name="chevron-back" size={35} style={styles.icon} />
                            </TouchableOpacity>
                            <Text style={styles.titleHeader}>Cards</Text>
                        </View>
                        <View style={styles.logoContainer}>
                            <Image source={require('../assets/logoComFundo.png')} style={styles.logo} />
                        </View>
                    </View>

                    <Text style={styles.listName}>{list.nomeLista}</Text>
                    <ScrollView>
                        {list.produtos.map((produto, index) => (
                            <View key={index} style={styles.productCard}>
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={getImageSource(produto.imagem)}
                                        style={styles.productImage}
                                        resizeMode="cover"
                                        onError={(e) =>
                                            console.log(
                                                `Erro ao carregar a imagem: ${produto.imagem}`,
                                                e.nativeEvent.error
                                            )
                                        }
                                    />
                                </View>
                                <View style={styles.productDetails}>
                                    <Text style={styles.productName}>{produto.nome}</Text>
                                    <Text style={styles.quantidade}>Quantidade: {produto.quantidade}</Text>
                                    <Text style={styles.total}>R$ {(produto.precoUnitario * produto.quantidade).toFixed(2)}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </Animatable.View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Função para obter a imagem do diretório assets
function getImageSource(imageName) {
    let source = null;
    switch (imageName) {
        case 'img1.png':
            source = require('../assets/img1.png');
            break;
        case 'img2.png':
            source = require('../assets/img2.png');
            break;
        // Adicione mais cases conforme necessário para suas imagens
        default:
            source = require('../assets/img3.png'); // Imagem padrão caso a imagem não seja encontrada
            break;
    }
    return source;
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
    listName: {
        fontFamily: 'Raleway',
        fontSize: 18,
        marginBottom: 15
    },
    productCard: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#305BCC',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5, 
        marginBottom: 30
    },
    productImage: {
        width: 120,
        height: 120,
        marginLeft: 10,
        marginRight: 10
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontFamily: 'Raleway'
    },
    quantidade: {
        fontFamily: 'Raleway',
        fontSize: 14
    },
    total: {
        fontFamily: 'Raleway-Bold',
        fontSize: 22,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
});