import React, { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Text, View, Image, TextInput, TouchableOpacity, Modal } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons/'
import Icon from 'react-native-vector-icons/FontAwesome';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function Interface() {
    const [valorAlvo, setValorAlvo] = useState('R$ '); // Inicializa com "R$ "
    const [mostrarModalRecursos, setMostrarModalRecursos] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [nome, setNome] = useState('');
    const [precoUnitario, setPrecoUnitario] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [imgIndex, setImgIndex] = useState(1);
    const [produtos, setProdutos] = useState([]);

    // navegar entra as páginas
    const navigation = useNavigation()

    // fonte
    const [fontsLoaded, fontError] = useFonts({
        'Raleway': require('../assets/fonts/Raleway-VariableFont_wght.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    // valor alvo - deixar fixo o R$
    const handleChangeText = (text) => {
        if (!text.startsWith('R$')) {
            setValorAlvo('R$ ' + text);
        } else {
            setValorAlvo(text);
        }
    };

    // Função para abrir o modal de recursos
    const toggleModalRecursos = () => {
        setMostrarModalRecursos(!mostrarModalRecursos);
    };

    // Função para fechar o modal de recursos
    const fecharModalRecursos = () => {
        setMostrarModalRecursos(false);
    };

    // função de salvar e verifir os valor do valor alvo e modal
    const handleSalvar = () => {
        if (!nome || !precoUnitario || !quantidade || !valorAlvo) {
            setErrorMessage('Todos os campos são obrigatórios.');
            return;
        }

        const precoFloat = parseFloat(precoUnitario.replace(',', '.'));
        const quantidadeInt = parseInt(quantidade);
        const valorAlvoFloat = parseFloat(valorAlvo.replace(/[^\d,]/g, '').replace(',', '.'));

        if (isNaN(precoFloat) || precoFloat <= 0 || isNaN(quantidadeInt) || quantidadeInt <= 0 || isNaN(valorAlvoFloat) || valorAlvoFloat <= 0) {
            setErrorMessage('Por favor, insira valores válidos para preço unitário, quantidade e valor alvo.');
            return;
        }

        const novoProduto = {
            nome: nome.charAt(0).toUpperCase() + nome.slice(1),
            precoUnitario: precoFloat,
            quantidade: quantidadeInt,
            imagem: `img${imgIndex}.png`,
        };
        setProdutos([...produtos, novoProduto]);
        setImgIndex(imgIndex === 3 ? 1 : imgIndex + 1);

        setNome('');
        setPrecoUnitario('');
        setQuantidade('');
        setErrorMessage('');
        setModalVisible(false);
    };

    // remover produto da exibição cards
    const removerProduto = (index) => {
        const novosProdutos = [...produtos];
        novosProdutos.splice(index, 1);
        setProdutos(novosProdutos);
    };

    // aumentar uma quantidade do produto da exibição cards
    const incrementarQuantidade = (index) => {
        const novosProdutos = [...produtos];
        novosProdutos[index].quantidade += 1;
        setProdutos(novosProdutos);
    };

    // diminuir uma quantidade do produto da exibição cards
    const decrementarQuantidade = (index) => {
        const novosProdutos = [...produtos];
        if (novosProdutos[index].quantidade > 1) {
            novosProdutos[index].quantidade -= 1;
            setProdutos(novosProdutos);
        }
    };

    // fechar modal de infos do produto
    const fecharModalInfos = () => {
        setModalVisible(false);
        setNome('');
        setPrecoUnitario('');
        setQuantidade('');
        setErrorMessage('');
    };

    // exibição dos cards
    const imagemMap = {
        'img1.png': img1,
        'img2.png': img2,
        'img3.png': img3,
    };

    // valor total
    const valorTotal = produtos.reduce((total, produto) => {
        return total + (produto.precoUnitario * produto.quantidade);
    }, 0);

    let mensagem = '';
    let textColor = styles.textGastosValor.color; // Cor padrão para o texto "Valor alcançado"
    if (valorTotal > parseFloat(valorAlvo.replace(/[^\d,]/g, '').replace(',', '.'))) {
        const diferenca = (valorTotal - parseFloat(valorAlvo.replace(/[^\d,]/g, '').replace(',', '.'))).toFixed(2);
        mensagem = (
            <>
                <View style={styles.quebra}>
                    <Text>Valor ultrapassado - </Text>
                    <Text>Difirença de <Text style={[{ color: '#EB2F23' }]}>R$ {diferenca}</Text></Text>
                </View>
            </>
        );
    } else {
        textColor = '#58B02E';
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.scrollView}>
                <Animatable.View delay={600} animation='fadeInUp' style={styles.container} onLayout={onLayoutRootView}>
                    {/* header */}
                    <View style={styles.header}>
                        <Text style={styles.usuario}>Olá, usuário</Text>
                        <View style={styles.logoContainer}>
                            <Image source={require('../assets/logoComFundo.png')} style={styles.logo} />
                        </View>
                    </View>

                    {/* valor alvo */}
                    <Text style={styles.textValorAlvo}>Valor</Text>
                    <View style={styles.containerValorAlvo}>
                        <Text style={styles.textInsira}>Insira o valor alvo</Text>
                        <TextInput
                            style={styles.inputValorAlvo}
                            placeholder="R$ 0,00"
                            keyboardType="numeric"
                            onChangeText={handleChangeText}
                            value={valorAlvo}
                        />
                    </View>

                    {/* cards */}
                    <View style={styles.containerCards}>
                        <Text style={styles.textCards}>Cards</Text>
                        <TouchableOpacity onPress={toggleModalRecursos}>
                            <Image source={require('../assets/menuTresPontos.png')} style={styles.imgRecursos} />
                        </TouchableOpacity>
                    </View>

                    {/* modal recursos */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={mostrarModalRecursos}
                        onRequestClose={fecharModalRecursos}
                    >
                        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={styles.contarinerRecursos}>
                                <Text style={styles.textRecursos}>Recursos</Text>
                                <TouchableOpacity style={styles.botaoRecursos} onPress={toggleModalRecursos}>
                                    <Image source={require('../assets/vetorSalvarCards.png')} style={styles.imgRecursos} />
                                    <Text style={styles.modalTextRecursos}>Salvar Cards</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.botaoRecursos} onPress={() => { navigation.navigate('produtosAdicionados'); toggleModalRecursos() }}>
                                    <Image source={require('../assets/vetorVerCards.png')} style={styles.imgRecursos} />
                                    <Text style={styles.modalTextRecursos}>Ver Cards</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.botaoRecursos} onPress={() => { navigation.navigate('listasCriadas'); toggleModalRecursos() }}>
                                    <Image source={require('../assets/vetorVerLista.png')} style={styles.imgRecursos} />
                                    <Text style={styles.modalTextRecursos}>Ver Listas</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.botaoRecursos} onPress={toggleModalRecursos}>
                                    <Image source={require('../assets/vetorLimparTudo.png')} style={styles.imgRecursos} />
                                    <Text style={styles.modalTextRecursos}>Limpar Tudo</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* botao adicionar */}
                    <TouchableOpacity style={styles.botaoAdicionar} onPress={() => {
                        if (valorAlvo === 'R$ ') {
                            alert('Por favor, insira o valor alvo antes de adicionar um produto.');
                        } else {
                            setModalVisible(true);
                        }
                    }}>
                        <Ionicons name="add-outline" style={[styles.iconePlus, { color: '#ED2D28' }]} />
                        <Text style={styles.textBotaoAdd}>Adicionar produto</Text>
                    </TouchableOpacity>

                    {/* mensagem de nenhum produto adicionando */}
                    {produtos.length === 0 && <Text style={styles.textNenhumProduto}>Nenhum produto adicionado</Text>}

                    {/* modal infos produtos */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            fecharModalInfos
                        }}
                        style={{ zIndex: 2 }}
                    >
                        <View style={styles.modalInfosProdutos}>
                            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                            <TouchableOpacity onPress={fecharModalInfos}>
                                <Ionicons name="close-circle-outline" style={[styles.iconePlus, { color: '#305BCC', marginLeft: '81%' }]} />
                            </TouchableOpacity>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome"
                                onChangeText={setNome}
                                value={nome}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Preço Unitário"
                                keyboardType="numeric"
                                onChangeText={setPrecoUnitario}
                                value={precoUnitario}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Quantidade"
                                keyboardType="numeric"
                                onChangeText={setQuantidade}
                                value={quantidade}
                            />
                            <TouchableOpacity onPress={handleSalvar}>
                                <Text style={styles.buttonText}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                    {/* exibição dos cards */}
                    <View style={styles.tudo}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollExibicao}>
                            <View style={styles.produtosContainer}>
                                {produtos.map((produto, index) => (
                                    <View key={index} style={styles.containerProdutos}>
                                        <Image source={imagemMap[produto.imagem]} style={styles.imgProdutos} />
                                        <View style={styles.boxProdutos}>
                                            <TouchableOpacity onPress={() => removerProduto(index)} style={{ backgroundColor: 'transparent' }}>
                                                <Icon name="trash" size={25} color="red" style={{ marginBottom: 5 }} />
                                            </TouchableOpacity>
                                            <Text style={styles.nomeProduto}>{produto.nome}</Text>
                                            <Text style={styles.preco}>R$ {(produto.precoUnitario * produto.quantidade).toFixed(2)}</Text>
                                            <View style={styles.boxQuantidade}>
                                                <TouchableOpacity onPress={() => decrementarQuantidade(index)} style={styles.circuloQuantidade}>
                                                    <Icon name="minus" size={20} color="white" />
                                                </TouchableOpacity>
                                                <Text style={styles.textQuantidade}>{produto.quantidade}</Text>
                                                <TouchableOpacity onPress={() => incrementarQuantidade(index)} style={styles.circuloQuantidade}>
                                                    <Icon name="plus" size={20} color="white" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* gastos */}
                    <View style={styles.containerGastos}>
                        <Text style={styles.textGastos}>Gastos - </Text>
                        <Text style={[
                            styles.textGastos,
                            valorTotal > parseFloat(valorAlvo.replace(/[^\d,]/g, '').replace(',', '.')) && { color: '#ED2D28' },
                            valorTotal == parseFloat(valorAlvo.replace(/[^\d,]/g, '').replace(',', '.')) && { color: '#67ff1e' },
                        ]}>
                            R$ {valorTotal.toFixed(2)}
                        </Text>
                    </View>

                    <Text style={[styles.textGastosValor, { color: textColor }]}>
                        {mensagem}
                        {valorTotal === parseFloat(valorAlvo.replace(/[^\d,]/g, '').replace(',', '.')) && "Valor alcançado"}
                    </Text>
                    <StatusBar style="auto" />
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
        marginLeft: 40,
        marginTop: 40
    },
    // header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 40
    },
    usuario: {
        fontFamily: 'Raleway',
        fontWeight: '700',
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
    // valor alvo
    textValorAlvo: {
        fontFamily: 'Raleway',
        fontWeight: '500',
        fontSize: 20,
        marginTop: 40,
        marginBottom: 15,
    },
    containerValorAlvo: {
        backgroundColor: '#305BCC',
        padding: 20,
        borderRadius: 20,
        marginBottom: 40,
        marginRight: 40
    },
    textInsira: {
        fontFamily: 'Raleway',
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '400',
        marginBottom: 10
    },
    inputValorAlvo: {
        backgroundColor: '#6F8DDB',
        borderRadius: 15,
        padding: 10,
        fontFamily: 'Raleway',
        fontSize: 20,
        fontWeight: '500',
        color: '#FFFFFF'
    },
    // cards
    containerCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginRight: 40,
    },
    textCards: {
        fontFamily: 'Raleway',
        fontWeight: '500',
        fontSize: 20,
        alignItems: 'center',
        display: 'flex'
    },
    imgRecursos: {
        width: 35,
        height: 35
    },
    // modal recursos
    textRecursos: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 22,
        marginBottom: 20
    },
    contarinerRecursos: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 40,
        width: 250,
        position: 'absolute',
        right: 50,
        top: 50,
    },
    botaoRecursos: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    modalTextRecursos: {
        fontFamily: 'Raleway',
        fontSize: 18,
        fontWeight: '600'
    },
    imgRecursos: {
        width: 40,
        height: 40,
        marginRight: 10
    },
    // botao adicionar
    botaoAdicionar: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        padding: 10,
        shadowColor: '#305BCC',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 20,
        marginRight: 40
    },
    iconePlus: {
        marginRight: 10,
        marginBottom: 2,
        fontSize: 35
    },
    textBotaoAdd: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 18,
        color: '#305BCC'
    },
    // nenhum produto adicionado
    textNenhumProduto: {
        fontFamily: 'Raleway',
        fontSize: 18,
        fontWeight: '600',
        color: '#FF0000',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginRight: 40,
        height: 200,
        paddingTop: '25%'
    },
    // modal infos produtos
    modalInfosProdutos: {
        backgroundColor: '#F5F5F5',
        padding: 40,
        borderRadius: 40,
        width: '80%',
        position: 'absolute',
        top: '30%',
        left: '10%',
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        fontFamily: 'Raleway',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
        fontSize: 18,
    },
    buttonText: {
        fontFamily: 'Raleway',
        backgroundColor: '#305BCC',
        borderRadius: 15,
        padding: 10,
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center'
    },
    // exibição dos cards
    scrollExibicao: {
    },
    tudo: {
    },
    produtosContainer: {
        flexDirection: 'row',
        marginBottom: 25,
    },
    containerProdutos: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#305BCC',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginRight: 50,
    },
    imgProdutos: {
        width: 150,
        height: 150,
        borderRadius: 20,
        alignSelf: 'center',
        marginBottom: 10,
    },
    boxProdutos: {
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nomeProduto: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 18,
        marginBottom: 5
    },
    preco: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 10
    },
    boxQuantidade: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#305BCC',
        borderRadius: 20,
        padding: 5,
        alignSelf: 'center',
        marginTop: 5
    },
    circuloQuantidade: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#ED2D28',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5
    },
    textQuantidade: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 16,
        color: '#FFFFFF'
    },
    // gastos
    containerGastos: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#305BCC',
        borderRadius: 30,
        padding: 12,
        marginRight: 50
    },
    textGastos: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 20,
        color: '#FFFFFF',
    },
    textGastosValor: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
        marginRight: 50,
        marginTop: 20,
        marginBottom: 30
    },
});