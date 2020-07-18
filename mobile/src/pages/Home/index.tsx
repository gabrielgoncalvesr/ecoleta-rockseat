import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Text, Image, ImageBackground, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

import styles from './styles';

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}

interface SelectOption {
    label: string,
    value: string
}

const Home = () => {

    const navigation = useNavigation();

    const [ufs, setUfs] = useState<SelectOption[]>([]);
    const [cities, setCities] = useState<SelectOption[]>([]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    const handleNavigationToPoints = () => {
        navigation.navigate('Points', { city: selectedCity, uf: selectedUf });
    }

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => {
                return { label: uf.sigla, value: uf.sigla }
            });
            setUfs(ufInitials);
        })
    }, []);

    useEffect(() => {
        if (selectedUf === '0') {
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cityNames = response.data.map(city => {
                return { label: city.nome, value: city.nome }
            });
            setCities(cityNames);
        })
    }, [selectedUf]);

    const handleSelectUF = (value: string) => {
        setSelectedUf(value);
    }

    const handleSelectCity = (value: string) => {
        setSelectedCity(value);
    }

    return (
        <ImageBackground source={require('../../assets/home-background.png')} style={styles.container}>
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description} >Ajudamos pessoas a encontrarem ponto de coleta de forma eficiente</Text>
            </View>

            <View style={styles.footer}>
                <RNPickerSelect
                    placeholder={{ label: 'Selecione uma UF', value: null, color: '#9EA0A4' }}
                    style={pickerSelectStyles}
                    Icon={() => { return <Icon name="chevron-down" size={24} color="gray" /> }}
                    onValueChange={value => handleSelectUF(value)}
                    items={ufs}
                />

                <RNPickerSelect
                    placeholder={{ label: 'Selecione uma Cidade', value: null, color: '#9EA0A4' }}
                    style={pickerSelectStyles}
                    Icon={() => { return <Icon name="chevron-down" size={24} color="gray" /> }}
                    onValueChange={value => handleSelectCity(value)}
                    items={cities}
                />

                <RectButton style={styles.button} onPress={handleNavigationToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#fff" size={24} />
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    )
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },
    inputAndroid: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },
    iconContainer: {
        top: 20,
        right: 10,
    },
});


export default Home;