import React, { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Text, View, Image, TextInput, TouchableOpacity, Modal, Alert, FlatList } from 'react-native';
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
    const [listName, setListName] = useState('');
    const [saveListModalVisible, setSaveListModalVisible] = useState(false);
    const [savedLists, setSavedLists] = useState([]);
    const [showInstructionsAlert, setShowInstructionsAlert] = useState(true);

    // navegar entra as páginas
    const navigation = useNavigation()

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
            nome: nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase(),
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

    const removerProdutoIndividual = (index) => {
        // Abre o modal de confirmação para excluir o produto
        confirmacao(index);
    };

    // atualize a função removerProduto para abrir o modal de confirmação antes de remover o produto
    const removerProduto = (index) => {
        const newProducts = [...produtos];
        newProducts.splice(index, 1);
        setProdutos(newProducts);
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
        if (produtos.length === 0) {
            // Exibe um alerta caso não haja nenhum produto na lista
            Alert.alert('Atenção', 'Não há produtos para salvar.');
        } else {
            // Abre o modal de confirmação para limpar todos os produtos
            confirmacaoLimparTudo();
        }
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

    const openSaveListModal = () => {
        if (produtos.length === 0) {
            Alert.alert('Atenção', 'Não há produtos para salvar.');
        } else {
            setSaveListModalVisible(true);
        }
    };

    const closeSaveListModal = () => {
        setSaveListModalVisible(false);
        setListName('');
    };

    const saveList = () => {
        if (listName.trim() === '') {
            Alert.alert('Atenção', 'Por favor, digite o nome da lista.');
            return;
        }
        if (produtos.length === 0) {
            Alert.alert('Atenção', 'Não há produtos para salvar.');
            return;
        }

        // Verifica se já existe uma lista com o mesmo nome
        const existingList = savedLists.find(list => list.nomeLista === listName.trim());
        if (existingList) {
            Alert.alert(
                'Atenção',
                'Já existe uma lista salva com esse nome. Deseja acrescentar os novos produtos nessa lista?',
                [
                    {
                        text: 'Sim',
                        onPress: () => {
                            // Adicionar os produtos à lista existente
                            const updatedList = savedLists.map(list => {
                                if (list.nomeLista === listName.trim()) {
                                    return {
                                        ...list,
                                        produtos: [...list.produtos, ...produtos]
                                    };
                                }
                                return list;
                            });
                            setSavedLists(updatedList);

                            Alert.alert('Sucesso', 'Produtos acrescentados com sucesso!', [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        closeSaveListModal();
                                        navigation.navigate('listasCriadas', { savedLists: updatedList }); // Navegar para a tela de listas criadas com as listas atualizadas
                                    }
                                }
                            ]);
                        }
                    },
                    {
                        text: 'Não',
                        onPress: () => {
                            // Não fazer nada, apenas fechar o modal
                            closeSaveListModal();
                        },
                        style: 'cancel'
                    }
                ]
            );
            return;
        }

        // Cria um objeto com a lista de produtos e o nome da lista
        const listaSalva = {
            nomeLista: listName,
            produtos: [...produtos]
        };

        // Atualiza o estado de listas salvas
        setSavedLists([...savedLists, listaSalva]);

        // Limpa a lista de produtos
        setProdutos([]);

        // Exibe um alerta de sucesso e navega para a tela de listas salvas
        Alert.alert('Sucesso', 'Lista salva com sucesso!', [
            {
                text: 'OK',
                onPress: () => {
                    closeSaveListModal();
                    navigation.navigate('listasCriadas', { savedLists: [...savedLists, listaSalva] }); // Navegar para a tela de listas criadas com as listas salvas
                }
            }
        ]);

        console.log('Lista Salva:', listaSalva);
    };


    const handleViewCards = () => {
        if (savedLists.length === 0) {
            Alert.alert('Atenção', 'Não há listas salvas. Salve uma lista para visualizá-las.');
        } else {
            navigation.navigate('listasCriadas', { savedLists });
        }
    };

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
                            Alert.alert('Atenção', 'Por favor, insira o valor alvo antes de adicionar um produto.');

                        } else if (isNaN(valorAlvoFloat) || valorAlvoFloat <= 0) {
                            // Verifica se o valor não é um número válido ou é menor ou igual a zero
                            Alert.alert('Atenção', 'Por favor, insira um valor alvo válido.');

                        } else {
                            // Se tudo estiver correto, exibe o modal
                            setModalVisible(true);
                        }

                    }}>
                        <Ionicons name="add-outline" style={[styles.iconePlus, { color: '#F6282A' }]} />
                        <Text style={styles.textBotaoAdd}>Adicionar produto</Text>
                    </TouchableOpacity>

                    {/* Ver listas button */}
                    <TouchableOpacity onPress={handleViewCards}>
                        <Text style={styles.textVerCards}>Ver listas</Text>
                    </TouchableOpacity>

                    {/* mensagem de nenhum produto adicionando */}
                    {produtos.length === 0 && <Text style={styles.textNenhumProduto}>Nenhum produto adicionado</Text>}

                    {/* exibição dos cards */}
                    <View style={styles.tudo}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollExibicao}>
                            {produtos.map((produto, index) => (
                                <Animatable.View delay={100} animation='fadeInUp' key={index} style={styles.containerProdutos}>
                                    <Image source={imagemMap[produto.imagem]} style={styles.imgProdutos} />
                                    <View style={styles.boxProdutos}>
                                        <TouchableOpacity onPress={() => removerProdutoIndividual(index)} style={{ backgroundColor: 'transparent' }}>
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
                                </Animatable.View>
                            ))}
                        </ScrollView>
                    </View>


                    {/* botões salvar lista e limpar tudo */}
                    <View style={styles.containerRecursos}>
                        <TouchableOpacity style={styles.botaoRecursos} onPress={openSaveListModal}>
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
                        <ScrollView style={{ minHeight: 100 }}>
                            <View style={{ backgroundColor: '#0000004a', flex: 1, }}>

                                <View style={styles.boxModalInfos}>
                                    <TouchableOpacity onPress={fecharModalInfos} style={{ width: '15%', marginLeft: 20, marginTop: 20, }}>
                                        <Ionicons name="close-circle-outline" style={[styles.iconePlus, { color: '#FFFFFF', }]} />
                                    </TouchableOpacity>

                                    <View style={styles.boxTextHeaderModal}>
                                        <Text style={styles.textHeaderModal}>Informações do produto</Text>
                                    </View>

                                    <View style={styles.containerModalInfos}>

                                        <View style={styles.boxImagemModalInfos}>
                                            <Image source={require('../assets/imgModalInfos.png')} style={styles.imgModalnfos} />
                                        </View>

                                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                                        <View style={styles.boxTextInputInfos}>

                                            <Text style={styles.TextInputInfos}>Nome</Text>

                                            <View style={styles.inputContainer}>
                                                <Ionicons name="cart" size={25} style={styles.icon} />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Nome do produto"
                                                    onChangeText={setNome}
                                                    value={nome}
                                                />
                                            </View>

                                            <Text style={styles.TextInputInfos}>Preço Unitário</Text>

                                            <View style={styles.inputContainer}>
                                                <Ionicons name="cash" size={25} style={styles.icon} />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Preço Unitário"
                                                    keyboardType="numeric"
                                                    onChangeText={setPrecoUnitario}
                                                    value={precoUnitario}
                                                />
                                            </View>

                                            <Text style={styles.TextInputInfos}>Quantidade</Text>

                                            <View style={styles.inputContainer}>
                                                <Ionicons name="add" size={25} style={styles.icon} />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Quantidade"
                                                    keyboardType="numeric"
                                                    onChangeText={setQuantidade}
                                                    value={quantidade}
                                                />
                                            </View>

                                        </View>

                                        <View style={styles.boxBotaoInfos}>
                                            <TouchableOpacity onPress={handleSalvar}>
                                                <Text style={styles.buttonText}>Adicionar</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                </View>

                            </View>
                        </ScrollView>
                    </Modal>

                    {/* Modal de salvar lista */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={saveListModalVisible}
                        onRequestClose={closeSaveListModal}
                    >
                        <View style={{ backgroundColor: '#0000004a', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.containerModalSalvar}>
                                <View style={styles.centralizarSalvar}>
                                    <View style={styles.headerModalSalvar}>
                                        <Image source={require('../assets/vetorSalvarCardsAzul.png')} style={styles.imgHeaderModalSalvar} />
                                        <Text style={styles.textHeaderModalSalvar}>Salvar Cards</Text>
                                    </View>
                                </View>
                                <View style={styles.boxImgSalvar}>
                                    <Image source={require('../assets/imgModalSalvar.png')} style={styles.imgModalSalvar} />
                                </View>
                                <View style={styles.textLista}>
                                    <Text style={styles.textSalvarModal}>Lista:</Text>
                                </View>
                                <View style={styles.inputModalSalvar}>
                                    <Ionicons name="clipboard" size={25} style={styles.iconLista} />
                                    <TextInput
                                        style={styles.inputSalvar}
                                        onChangeText={text => setListName(text)}
                                        value={listName}
                                        placeholder="Digite o nome da lista"
                                    />
                                </View>
                                <View style={styles.botoesModalSalvar}>
                                    <TouchableOpacity
                                        style={[styles.botaoModalSalvar, { backgroundColor: '#305BCC' }]}
                                        onPress={saveList}
                                    >
                                        <Text style={styles.botaoTextSalvarModal}>Salvar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.botaoModalSalvar, { backgroundColor: '#F6282A' }]}
                                        onPress={closeSaveListModal}
                                    >
                                        <Text style={styles.botaoTextSalvarModal}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
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
    // valor alvo
    textValorAlvo: {
        fontFamily: 'Raleway-Medium',
        fontSize: 18,
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
        marginBottom: 10
    },
    inputValorAlvo: {
        backgroundColor: '#6F8DDB',
        borderRadius: 15,
        padding: 10,
        fontFamily: 'Raleway-Medium',
        fontSize: 20,
        color: '#FFFFFF'
    },
    // cards
    textCards: {
        fontFamily: 'Raleway-Medium',
        fontSize: 18,
        marginBottom: 15,
    },
    // botão ver cards adicionados 
    textVerCards: {
        fontFamily: 'Raleway',
        fontSize: 18,
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
        fontSize: 40
    },
    textBotaoAdd: {
        fontFamily: 'Raleway-Medium',
        fontSize: 18,
        color: '#305BCC'
    },
    // nenhum produto adicionado
    textNenhumProduto: {
        fontFamily: 'Raleway-SemiBold',
        fontSize: 16,
        color: '#F6282A',
        textAlign: 'center',
        marginRight: 40,
        marginTop: 40
    },
    // modal infos produtos
    modalInfosProdutos: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    boxModalInfos: {
        backgroundColor: '#305BCC',
        width: '100%',
        borderRadius: 20
    },
    boxTextHeaderModal: {
        marginBottom: 30,
        alignItems: 'center',
    },
    textHeaderModal: {
        fontFamily: 'Raleway-Bold',
        fontSize: 22,
        color: '#FFFFFF',
        width: '50%',
        textAlign: 'center'
    },
    containerModalInfos: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        width: '100%',
        padding: 35,
    },
    boxImagemModalInfos: {
        alignItems: 'center'
    },
    imgModalnfos: {
        width: 200,
        height: 190,
    },
    errorText: {
        fontFamily: 'Raleway-SemiBold',
        fontSize: 16,
        textAlign: 'center',
        color: '#F6282A',
        marginBottom: 10,
        marginTop: 10
    },
    TextInputInfos: {
        fontFamily: 'Raleway-SemiBold',
        fontSize: 18,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6E6E6',
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
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
    boxBotaoInfos: {
        alignItems: 'center',
        marginTop: 15
    },
    buttonText: {
        backgroundColor: '#305BCC',
        color: '#FFFFFF',
        fontFamily: 'Raleway-ExtraBold',
        fontSize: 24,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: 'center',
        borderRadius: 20,
    },
     // exibição dos cards
     tudo: {
        flex: 1,
        alignItems: 'center'
    },
    scrollExibicao: {
        flexDirection: 'row',
        paddingHorizontal: 0,
    },
    // 674.48
    containerProdutos: {
        marginRight: 3, // Ajuste para espaçamento horizontal entre os produtos
        padding: 10,
        alignItems: 'center',
        width: 200, // Defina a largura fixa dos itens para garantir que eles não sejam cortados
    },
    boxProdutos: {
        backgroundColor: '#FFFFFF',
        marginTop: -35,
        padding: 20,
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
    },
    nomeProduto: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 18,
        marginBottom: 0,
        marginLeft: 25,
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
        marginLeft: '6%',
    },
    circuloQuantidade: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#F6282A',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    textQuantidade: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 16,
        color: '#FFFFFF',
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
        fontFamily: 'Raleway-SemiBold',
        fontSize: 20,
        color: '#FFFFFF',
    },
    textGastosValor: {
        fontFamily: 'Raleway-SemiBold',
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
        fontFamily: 'Raleway-Medium',
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
        fontFamily: 'Raleway-SemiBold',
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    // modal salvar
    containerModalSalvar: {
        backgroundColor: '#FFFFFF',
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 30,
        paddingBottom: 30,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    centralizarSalvar: {
        alignItems: 'center'
    },
    headerModalSalvar: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    imgHeaderModalSalvar: {
        width: 35,
        height: 35,
        marginRight: 10
    },
    textHeaderModalSalvar: {
        fontFamily: 'Raleway-SemiBold',
        fontSize: 22,
        color: '#305BCC'
    },
    boxImgSalvar: {
        alignItems: 'center'
    },
    imgModalSalvar: {
        width: 200,
        height: 180,
        marginBottom: 10
    },
    textLista: {
    },
    textSalvarModal: {
        fontFamily: 'Raleway-Medium',
        fontSize: 18,
        marginBottom: 10,
    },
    inputModalSalvar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6E6E6',
        borderRadius: 20,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    iconLista: {
        color: '#F6282A',
    },
    inputSalvar: {
        padding: 15,
        paddingRight: 30,
        paddingLeft: 5,
        backgroundColor: '#E6E6E6',
        borderRadius: 15,
    },
    botoesModalSalvar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    botaoModalSalvar: {
        borderRadius: 15,
        width: 111,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    botaoTextSalvarModal: {
        color: '#FFFFFF',
        fontFamily: 'Raleway-Medium',
        fontSize: 18
    }
});
