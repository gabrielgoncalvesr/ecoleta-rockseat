import React, { useEffect, useState } from 'react';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { View, TouchableOpacity, Image, Text, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../../services/api';
import * as MailComposer from 'expo-mail-composer';

import styles from './styles';

interface Params {
    point_id: number;
}

interface Data {
    point: {
        image: string;
        name: string;
        email: string;
        whatsapp: string;
        city: string;
        uf: string;
    };
    items: {
        title: string
    }[];
}

const Detail = () => {

    const route = useRoute();
    const navigation = useNavigation();

    const [data, setData] = useState<Data>({} as Data);

    const routParams = route.params as Params;

    useEffect(() => {
        api.get(`points/${routParams.point_id}`).then(response => {
            setData(response.data);
        })
    }, []);

    const handleNavigateBack = () => {
        navigation.goBack();
    }

    const handleComposeWhatsapp = () => {
        Linking.openURL(`whatsapp://send?phone=55${data.point.whatsapp}&text=Tenho interesse sobre a coleta`);
    }

    const handleComposeMail = () => {
        MailComposer.composeAsync({
            subject: 'Interesse na coleta de resíduos',
            recipients: [data.point.email]
        });
    }

    if (!data.point) {
        return null;
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Feather name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Image
                    style={styles.pointImage}
                    source={{ uri: data.point.image }}
                />

                <Text style={styles.pointName}>{data.point.name}</Text>
                <Text style={styles.pointItems}>
                    {data.items.map(item => item.title).join(', ')}
                </Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleComposeWhatsapp}>
                    <FontAwesome name="whatsapp" size={20} color="#fff" />
                    <Text style={styles.buttonText}>WhatsApp</Text>
                </RectButton>

                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Feather name="mail" size={20} color="#fff" />
                    <Text style={styles.buttonText}>E-mail</Text>
                </RectButton>
            </View>
        </>
    )
}

export default Detail;