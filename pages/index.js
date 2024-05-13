import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Modal, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons/'
import { FlatList } from 'react-native';


export default function Interface() {
    const [modalVisible, setModalVisible] = useState(false);
    const [nome, setNome] = useState('');
    const [precoUnitario, setPrecoUnitario] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [valorAlvo, setValorAlvo] = useState('R$ '); // Inicializa com "R$ "
    const [errorMessage, setErrorMessage] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [imgIndex, setImgIndex] = useState(1);
    const [mostrarModalProdutosSalvos, setMostrarModalProdutosSalvos] = useState(false);
    const [nomeLista, setNomeLista] = useState(''); // Estado para o nome da lista
    const navigation = useNavigation()
    const [view, setView] = useState(null);
    const [mostrarModalRecursos, setMostrarModalRecursos] = useState(false);

    useFonts({ 'Raleway': require('../assets/fonts/Raleway-VariableFont_wght.ttf') });

    useEffect(() => {
        const loadView = async () => {
            try {
                const savedView = await AsyncStorage.getItem('savedView');
                if (savedView !== null) {
                    setView(JSON.parse(savedView));
                }
            } catch (error) {
                console.error('Erro ao carregar a view salva:', error);
            }
        };
        loadView();
    }, []);

    useEffect(() => {
        const saveView = async () => {
            try {
                await AsyncStorage.setItem('savedView', JSON.stringify(view));
            } catch (error) {
                console.error('Erro ao salvar a view:', error);
            }
        };
        saveView();
    }, [view]);

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

    const removerProduto = (index) => {
        const novosProdutos = [...produtos];
        novosProdutos.splice(index, 1);
        setProdutos(novosProdutos);
    };

    const incrementarQuantidade = (index) => {
        const novosProdutos = [...produtos];
        novosProdutos[index].quantidade += 1;
        setProdutos(novosProdutos);
    };

    const decrementarQuantidade = (index) => {
        const novosProdutos = [...produtos];
        if (novosProdutos[index].quantidade > 1) {
            novosProdutos[index].quantidade -= 1;
            setProdutos(novosProdutos);
        }
    };

    const imagemMap = {
        'img1.png': img1,
        'img2.png': img2,
        'img3.png': img3,
    };

    const salvarCards = async () => {
        try {
            await AsyncStorage.setItem('produtos', JSON.stringify(produtos));
            setMostrarModalProdutosSalvos(true);
            console.log('Produtos salvos:', produtos);
        } catch (error) {
            console.error('Erro ao salvar produtos:', error);
        }
    };

    const fecharModalProdutosSalvos = () => {
        setMostrarModalProdutosSalvos(false);
    };

    const irParaListasCriadas = () => {
        setMostrarModalProdutosSalvos(false);
        navigation.navigate('listasCriadas', { nomeLista }); // Passando o nome da lista como parâmetro
    };


    const limparTudo = () => {
        setProdutos([]);
    };

    const handleChangeText = (text) => {
        // Adicione "R$" se o texto não começar com "R$"
        if (!text.startsWith('R$')) {
            setValorAlvo('R$ ' + text);
        } else {
            setValorAlvo(text);
        }
    };

    // Função para abrir e fechar o modal de recursos
    const toggleModalRecursos = () => {
        setMostrarModalRecursos(!mostrarModalRecursos);
    };

    // Função para fechar o modal de recursos
    const fecharModalRecursos = () => {
        setMostrarModalRecursos(false);
    };

    return (
        <ScrollView style={styles.scrollViewTudo}>
            <Animatable.View delay={600} animation='fadeInUp' style={styles.container}>
                {/* header */}
                <View style={styles.header}>
                    <Text style={styles.usuario}>Olá, usuário</Text>
                    <Image source={require('../assets/logoComFundo.png')} style={styles.logo} />
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

                <TouchableOpacity style={styles.botaoAdicionar} onPress={() => {
                    if (valorAlvo === 'R$ ') {
                        alert('Por favor, insira o valor alvo antes de adicionar um produto.');
                    } else {
                        setModalVisible(true);
                    }
                }}>
                    <Ionicons name="add-outline" style={[styles.iconePlus, { color: '#ED2D28' }]} />
                    <Text style={styles.textBotaoAdd}>Adicionar Produto</Text>
                </TouchableOpacity>

                {produtos.length === 0 && <Text style={styles.textNenhumProduto}>Nenhum produto adicionado</Text>}

                <View style={styles.tudo}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollView}>
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

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                    style={{ zIndex: 2 }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
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
                                <Text style={styles.buttonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={mostrarModalProdutosSalvos}
                    onRequestClose={fecharModalProdutosSalvos}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalHeaderText}>Digite o nome da lista:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome da Lista"
                                onChangeText={setNomeLista}
                                value={nomeLista}
                            />
                            <Text>Cards Salvos</Text>
                            <TouchableOpacity onPress={irParaListasCriadas}> {/* Alterado para chamar a função irParaListasCriadas */}
                                <Text>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={mostrarModalRecursos}
                    onRequestClose={fecharModalRecursos}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity onPress={() => { fecharModalRecursos() }}>x</TouchableOpacity>
                            <TouchableOpacity onPress={() => { salvarCards(); fecharModalRecursos(); }} style={styles.botao}>
                                <Text style={styles.textoBotao}>Salvar Cards</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { navigation.navigate('produtosAdicionados'); fecharModalRecursos(); }} style={styles.botao}>
                                <Text style={styles.textoBotao}>Ver cards</Text>
                            </TouchableOpacity>
                            <Text onPress={() => { limparTudo(); fecharModalRecursos(); }} style={[styles.limparTudoBotao, { color: 'blue' }]}>Limpar tudo</Text>
                            <Text style={[styles.limparTudoBotao, { color: 'blue' }]}>Ver listas</Text>
                        </View>
                    </View>
                </Modal>

                {view}
            </Animatable.View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    // tudo
    scrollViewTudo: {
        backgroundColor: '#F5F5F5',
        height: 50
    },
    container: {
        flex: 1,
        marginLeft: 50,
        marginTop: 40
    },
    // header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 50
    },
    usuario: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 22,
    },
    logo: {
        width: 110,
        height: 60,
        shadowColor: '#305BCC',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
        marginRight: 50
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
        marginRight: 50
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
        marginRight: 50
    },
    iconePlus: {
        fontSize: 30
    },
    textBotaoAdd: {
        fontFamily: 'Raleway',
        fontSize: 18,
        fontWeight: '500'
    },
    textNenhumProduto: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 60,
        marginBottom: 30,
        marginRight: 50
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: 200,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    // cards exibidos
    tudo: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
        marginTop: 10
    },
    produtosContainer: {
        flexDirection: 'row',
        minHeight: 10
    },
    containerProdutos: {
        alignItems: 'center',
        marginBottom: 20,
        minHeight: 10,
        marginLeft: 50,
        marginRight: 10,
    },
    imgProdutos: {
        width: 140,
        height: 140,
        zIndex: 1,
        position: 'absolute',
        top: 5,
    },
    boxProdutos: {
        backgroundColor: '#fff',
        width: 195,
        padding: 16,
        minHeight: 155,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        shadowColor: '#1C36B6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        marginTop: 104
    },
    nomeProduto: {
        fontSize: 25,
    },
    preco: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
    },
    boxQuantidade: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    circuloQuantidade: {
        backgroundColor: '#EB2F23',
        padding: 5,
        borderRadius: 30,
    },
    textQuantidade: {
        fontSize: 20,
    },
    scrollView: {
        minHeight: 10,
        overflow: 'hidden',
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
    // modal
    labelText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 5,
    },
    errorText: {
        fontFamily: 'Raleway',
        fontSize: 15,
        color: '#EB2F23',
        fontWeight: '600',
        margin: 10
    },
    salvarBotao: {
        fontSize: 18,
        marginBottom: 10,
    },
    modalHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    limparTudoBotao: {
        fontSize: 18,
        marginBottom: 10,
    },
});
