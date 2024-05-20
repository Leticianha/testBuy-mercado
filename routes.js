// routes.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Cards from './pages/produtosAdicionados';
import Interface from './pages/index';
import ListasCriadas from './pages/listasCriadas';

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="index"
                component={Interface}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="produtosAdicionados"
                component={Cards}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="listasCriadas"
                component={ListasCriadas}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
