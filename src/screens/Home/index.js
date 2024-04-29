import React, { useEffect, useState } from 'react';
import { styles } from './style';

import {
    SafeAreaView,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
    StatusBar,
    Alert,

} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import Load from '../../components/Load';
import { DrawerActions, useNavigation } from '@react-navigation/core';
import api from '../../services/api';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { useIsFocused } from '@react-navigation/native';

export default function Home() {
    const navigation= useNavigation();
    const isFocused = useIsFocused();

    const [dados, setDados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [usu, setUsu] = useState('');


    async function listarDados() {

        try {
            const user = await AsyncStorage.getItem('@user');
            const res = await api.get(`apiModelo/dashboard/listar-cards.php?user=${user}`);
            setDados(res.data);

        } catch (error) {
            console.log("Erro ao Listar " + error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);

        }
    }

    useEffect(() => {
        listarDados();
    }, [isFocused]);

    const onRefresh = () => {
        setRefreshing(true);
        listarDados();

    };


    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" />
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <View style={styles.containerHeader}>

                        <TouchableOpacity
                            style={styles.menu}
                            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        >
                            <MaterialIcons name="menu" size={35} color="black" />
                        </TouchableOpacity>

                        <Image style={styles.logo} source={require('../../assets/telass.png')} />

                    </View>
                </View>



                {isLoading ?
                    <Load /> :

                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >

                        <View style={styles.circleProgressView}>
                            <View style={styles.textProgressContainer}>
                                <Text style={styles.textProgressTitle}>Bem vindo(a)</Text>
                                <Text style={styles.textProgress}>10 de 20 concluídas</Text>
                            </View>

                           
                        </View>


                        <View style={styles.containerBox}>

                            <TouchableOpacity onPress={() => navigation.navigate("Usuario")}>
                                <View>
                                    <View style={styles.box}>
                                        <MaterialIcons style={styles.iconRegistered} name="lock-clock" size={70} color="#000" />
                                        <View style={styles.textos}>
                                            <Text style={styles.rText}>Total deusuários</Text>
                                            <Text style={styles.lenghtText}>{dados.total_usuarios}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.textFooter}></Text>
                                </View>
                            </TouchableOpacity>

                        </View>


                    </ScrollView>
                }
            </View>
        </View>






    )
}