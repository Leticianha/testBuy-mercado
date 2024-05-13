import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importando imagens
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';

const ProdutosAdicionados = () => {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const loadProdutos = async () => {
        try {
            const produtosString = await AsyncStorage.getItem('produtos');
            if (produtosString !== null) {
                const produtosArray = JSON.parse(produtosString);
                setProdutos(produtosArray);
                console.log('Produtos carregados:', produtosArray); // Adicione este log para verificar se os produtos estão sendo carregados corretamente
            }
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    };

    loadProdutos();
}, []);

  const imagemMap = {
    'img1.png': img1,
    'img2.png': img2,
    'img3.png': img3,
  };

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <Image source={imagemMap[item.imagem]} style={{ width: 50, height: 50, marginRight: 10 }} />
      <View>
        <Text style={{ fontSize: 18 }}>{item.nome}</Text>
        <Text style={{ fontSize: 16 }}>Preço: R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</Text>
        <Text style={{ fontSize: 16 }}>Quantidade: {item.quantidade}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {produtos.length === 0 ? (
        <Text>Nenhum produto adicionado.</Text>
      ) : (
        <FlatList
          data={produtos}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default ProdutosAdicionados;
