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
    const [modalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [nome, setNome] = useState('');
    const [precoUnitario, setPrecoUnitario] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [imgIndex, setImgIndex] = useState(1);
    const [produtos, setProdutos] = useState([]);
    const [confirmacaoVisible, setConfirmacaoVisible] = useState(false);
    const [limparTudoConfirmacaoVisible, setLimparTudoConfirmacaoVisible] = useState(false);
    const [produtoIndex, setProdutoIndex] = useState(null);

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

    // função de salvar e verifir os valor do valor alvo e modal
    const handleSalvar = () => {
        if (!nome || !precoUnitario || !quantidade) {
            setErrorMessage('Todos os campos são obrigatórios.');
            return;
        }

        const precoFloat = parseFloat(precoUnitario.replace(',', '.'));
        const quantidadeInt = parseInt(quantidade);
        const valorAlvoFloat = parseFloat(valorAlvo.replace(/[^\d,]/g, '').replace(',', '.'));

        if (isNaN(precoFloat) || precoFloat <= 0 || isNaN(quantidadeInt) || quantidadeInt <= 0) {
            setErrorMessage('Por favor, insira valores válidos para preço unitário e quantidade.');
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

    // função para mostrar ou ocultar o modal de confirmação
    const confirmacao = (index) => {
        setProdutoIndex(index); // Armazena o índice do produto a ser removido
        setConfirmacaoVisible(!confirmacaoVisible);
    }

    // atualize a função removerProduto para abrir o modal de confirmação antes de remover o produto
    const removerProduto = (index) => {
        // Abre o modal de confirmação para excluir o produto
        confirmacao(index);
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
                    <Text>Difirença de <Text style={[{ color: '#F6282A' }]}>R$ {diferenca}</Text></Text>
                </View>
            </>
        );
    } else {
        textColor = '#58B02E';
    }

    // função para mostrar ou ocultar o modal de confirmação para limpar tudo
    const confirmacaoLimparTudo = () => {
        setLimparTudoConfirmacaoVisible(!limparTudoConfirmacaoVisible);
    };

    // botão limpar tudo
    const limparTudo = () => {
        // Abre o modal de confirmação para limpar todos os produtos
        confirmacaoLimparTudo();
    };

    // função para fechar o modal de confirmação para limpar todos os produtos
    const fecharModalLimparTudo = () => {
        setLimparTudoConfirmacaoVisible(false);
    };

    // função para fechar o modal de confirmação para excluir produto
    const fecharModalConfirmacao = () => {
        setConfirmacaoVisible(false);
    };

    // lógica para colocar reticências quando for muito grande o nome
    const reticencias = (name) => {
        if (name.length > 8) {
            return name.substring(0, 8) + '...';
        } else {
            return name
        }
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
                    <Text style={styles.textCards}>Cards</Text>

                    {/* botao adicionar */}
                    <TouchableOpacity style={styles.botaoAdicionar} onPress={() => {
                        const valorAlvoFloat = parseFloat(valorAlvo.replace(/[^\d,]/g, '').replace(',', '.'));

                        if (valorAlvo === 'R$ ') {
                            // Verifica se o campo está vazio
                            alert('Por favor, insira o valor alvo antes de adicionar um produto.');
                        } else if (isNaN(valorAlvoFloat) || valorAlvoFloat <= 0) {
                            // Verifica se o valor não é um número válido ou é menor ou igual a zero
                            alert('Por favor, insira um valor alvo válido.');
                        } else {
                            // Se tudo estiver correto, exibe o modal
                            setModalVisible(true);
                        }


                    }}>
                        <Ionicons name="add-outline" style={[styles.iconePlus, { color: '#F6282A' }]} />
                        <Text style={styles.textBotaoAdd}>Adicionar produto</Text>
                    </TouchableOpacity>

                    {/* botao de ver cards adicionados */}
                    <TouchableOpacity style={styles.botaoVerCards} onPress={() => navigation.navigate('produtosAdicionados')}>
                        <Text style={styles.textVerCards}>Ver cards</Text>
                    </TouchableOpacity>

                    {/* mensagem de nenhum produto adicionando */}
                    {produtos.length === 0 && <Text style={styles.textNenhumProduto}>Nenhum produto adicionado</Text>}

                    {/* exibição dos cards */}
                    <View style={styles.tudo}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollExibicao}>
                            <View style={styles.produtosContainer}>
                                {produtos.map((produto, index) => (
                                    <View key={index} style={styles.containerProdutos}>
                                        <Image source={imagemMap[produto.imagem]} style={styles.imgProdutos} />
                                        <View style={styles.boxProdutos}>
                                            <TouchableOpacity onPress={() => removerProduto(index)} style={{ backgroundColor: 'transparent' }}>
                                                <Image source={require('../assets/iconeLixeira.png')} style={styles.icone} />
                                            </TouchableOpacity>
                                            <Text style={styles.nomeProduto}>{reticencias(produto.nome)}</Text>
                                            <Text style={styles.preco}>R$ {(produto.precoUnitario * produto.quantidade).toFixed(2)}</Text>
                                            <View style={styles.boxQuantidade}>
                                                <TouchableOpacity onPress={() => decrementarQuantidade(index)} style={styles.circuloQuantidade}>
                                                    <Icon name="minus" size={20} color="#FFFFFF" />
                                                </TouchableOpacity>
                                                <Text style={styles.textQuantidade}>{produto.quantidade}</Text>
                                                <TouchableOpacity onPress={() => incrementarQuantidade(index)} style={styles.circuloQuantidade}>
                                                    <Icon name="plus" size={20} color="#FFFFFF" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* botões salvar lista e limpar tudo */}
                    <View style={styles.containerRecursos}>
                        <TouchableOpacity style={styles.botaoRecursos}>
                            <Image source={require('../assets/vetorSalvarCards.png')} style={styles.imgRecursos} />
                            <Text style={styles.textRecursos}>Salvar Cards</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botaoRecursos} onPress={limparTudo}>
                            <Image source={require('../assets/vetorLimparTudo.png')} style={styles.imgRecursos} />
                            <Text style={styles.textRecursos}>Limpar Tudo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* gastos */}
                    <View style={styles.containerGastos}>
                        <Text style={styles.textGastos}>Gastos - </Text>
                        <Text style={[
                            styles.textGastos,
                            valorTotal > parseFloat(valorAlvo.replace(/[^\d,]/g, '').replace(',', '.')) && { color: '#F6282A' },
                            valorTotal == parseFloat(valorAlvo.replace(/[^\d,]/g, '').replace(',', '.')) && { color: '#67ff1e' },
                        ]}>
                            R$ {valorTotal.toFixed(2)}
                        </Text>
                    </View>

                    <Text style={[styles.textGastosValor, { color: textColor }]}>
                        {mensagem}
                        {valorTotal === parseFloat(valorAlvo.replace(/[^\d,]/g, '').replace(',', '.')) && "Valor alcançado"}
                    </Text>

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
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={fecharModalInfos}>
                                    <Ionicons name="close-circle-outline" style={[styles.iconePlus, { color: '#FFFFFF', }]} />
                                </TouchableOpacity>
                                <Text style={styles.textHeaderModal}>Informações do produto</Text>
                            </View>
                            <View style={styles.containerModalInfos}>
                                <Image source={require('../assets/imgModalInfos.png')} style={styles.imgModalnfos} />
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
                                    <Text style={styles.buttonText}>Adicionar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* modal de confirmação para excluir produto */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={confirmacaoVisible}
                        onRequestClose={() => confirmacao(null)}
                    >
                        <View style={{ backgroundColor: '#0000004a', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.modalConfirmacao}>
                                <Text style={styles.confirmacaoText}>Tem certeza que deseja apagar este produto?</Text>
                                <View style={styles.botaoConfirmacaoContainer}>
                                    {/* botões "Sim" e "Não" no modal de confirmação para excluir produto */}
                                    <TouchableOpacity style={[styles.botaoConfirmacao, { backgroundColor: '#F6282A' }]} onPress={() => {
                                        fecharModalConfirmacao(); // Fecha apenas o modal de confirmação
                                        if (produtoIndex !== null) {
                                            // Remove o produto se o índice for válido
                                            const novosProdutos = [...produtos];
                                            novosProdutos.splice(produtoIndex, 1);
                                            setProdutos(novosProdutos);
                                        }
                                    }}>
                                        <Text style={styles.botaoConfirmacaoText}>Sim</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.botaoConfirmacao, { backgroundColor: '#305BCC' }]} onPress={fecharModalConfirmacao}>
                                        <Text style={styles.botaoConfirmacaoText}>Não</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* modal de confirmação para limpar todos os produtos */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={limparTudoConfirmacaoVisible}
                        onRequestClose={() => setLimparTudoConfirmacaoVisible(false)}
                    >
                        <View style={{ backgroundColor: '#0000004a', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.modalConfirmacao}>
                                <Text style={styles.confirmacaoText}>Tem certeza que deseja limpar todos os produtos?</Text>
                                <View style={styles.botaoConfirmacaoContainer}>
                                    {/* botões "Sim" e "Não" no modal de confirmação para limpar todos os produtos */}
                                    <TouchableOpacity style={[styles.botaoConfirmacao, { backgroundColor: '#F6282A' }]} onPress={() => {
                                        fecharModalLimparTudo(); // Fecha apenas o modal de confirmação
                                        setProdutos([]); // Limpa a lista de produtos
                                    }}>
                                        <Text style={styles.botaoConfirmacaoText}>Sim</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.botaoConfirmacao, { backgroundColor: '#305BCC' }]} onPress={fecharModalLimparTudo}>
                                        <Text style={styles.botaoConfirmacaoText}>Não</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>


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
        marginTop: 30,
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
    textCards: {
        fontFamily: 'Raleway',
        fontWeight: '500',
        fontSize: 20,
        marginBottom: 15,
    },
    // botão ver cards adicionados 
    textVerCards: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 16,
        color: '#305BCC',
        marginBottom: 10
    },
    // botões de recursos
    containerRecursos: {
        marginRight: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40
    },
    botaoRecursos: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F6282A',
        borderRadius: 40,
        padding: 8,
    },
    textRecursos: {
        fontFamily: 'Raleway',
        fontSize: 16,
        fontWeight: '600',
        color: '#F6282A'
    },
    imgRecursos: {
        width: 25,
        height: 25,
        marginRight: 5
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
        marginBottom: 25,
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
        color: '#F6282A',
        textAlign: 'center',
        marginRight: 40,
        marginTop: 40
    },
    // modal infos produtos
    modalInfosProdutos: {
        backgroundColor: '#F5F5F5',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        padding: 20,
        backgroundColor: '#305BCC',
    },
    textHeaderModal: {
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Raleway',
        fontWeight: '700',
        marginBottom: 5
    },
    containerModalInfos: {
        backgroundColor: 'yellow',
        borderTopStartRadius: 150
    },
    imgModalnfos: {
        width: 200,
        height: 250
    },
    errorText: {
        color: '#F6282A',
        textAlign: 'center',
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 16
    },
    // exibição dos cards
    tudo: {
        textAlign: 'center',
        alignItems: 'center',
        minHeight: 10,
    },
    produtosContainer: {
        paddingBottom: 10,
        flexDirection: 'row',
        borderRadius: 10,
    },
    containerProdutos: {
        marginRight: 40,
        alignItems: 'center'
    },
    boxProdutos: {
        backgroundColor: '#FFFFFF',
        marginTop: -35,
        paddingTop: 20,
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#305BCC',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    imgProdutos: {
        width: 160,
        height: 160,
        zIndex: 22,
    },
    icone: {
        width: 35,
        height: 35,
        marginLeft: -15,
        marginTop: -5
    },
    nomeProduto: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 18,
        marginBottom: 0,
        marginLeft: 25
    },
    preco: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 10,
        marginLeft: 25,
        width: 110,
    },
    boxQuantidade: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#305BCC',
        borderRadius: 20,
        padding: 5,
        alignSelf: 'center',
        marginTop: 5,
        marginLeft: '6%'
    },
    circuloQuantidade: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#F6282A',
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
        marginRight: 50,
        marginTop: 40
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
    // modal de confirmação para excluir produto
    modalConfirmacao: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        position: 'absolute',
        top: '40%',
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
    confirmacaoText: {
        fontFamily: 'Raleway',
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    botaoConfirmacaoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    botaoConfirmacao: {
        flex: 1,
        borderRadius: 10,
        paddingVertical: 10,
        marginHorizontal: 5,
    },
    botaoConfirmacaoText: {
        fontFamily: 'Raleway',
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});