import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth0, User } from 'react-native-auth0';
const API_URL = 'http://192.168.100.227:3000'; 

export default function HomeScreen() {
    const router = useRouter();
    const { authorize, user, isLoading } = useAuth0();

    const syncUserWithAPI = async (auth0User : User) => {
        const datosUsuario = {
            auth0_id: auth0User.sub,
            nombre: auth0User.name || auth0User.nickname || 'Usuario',
        };
        try {
            const response = await fetch(`${API_URL}/sync-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosUsuario),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error al sincronizar con BD:', errorText);
                Alert.alert('Error', 'No se pudo sincronizar la cuenta con el servidor. Intente más tarde.');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error de conexión al sincronizar:', error);
            Alert.alert('Error', 'Fallo de conexión con el servidor. Verifique su red.');
            return false;
        }
    };

    const handleAuth0Login = async () => {
        try {
            await authorize({ scope: 'openid profile email' });
        } catch (e) {
            console.error('Error de Auth0:', e);
            Alert.alert('Error de Login', 'El inicio de sesión falló. Revise su conexión y el Callback URL.');
        }
    };

    if (isLoading) {
        return <View style={styles.loadingContainer}><Text style={styles.loadingText}>Cargando sesión...</Text></View>;
    }
    if (user) {
        syncUserWithAPI(user); 
        router.replace({ 
            pathname: '/home', 
            params: { username: user.name || user.nickname || 'Usuario' } 
        });
        return null;
    }

    return (
        <ScrollView style={{backgroundColor:'#292929'}} contentContainerStyle={{flexGrow:1, justifyContent:'center'}}>
            <Text style={styles.titulo}>Inicio de Sesión</Text>

            <View style={{marginHorizontal: 35}}>
                <TouchableOpacity style={styles.boton} onPress={handleAuth0Login}>
                    <Text style={{letterSpacing: 2, color: 'black', fontWeight: 'bold'}}>Ingresar con Auth0</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    titulo: {
        fontSize: 35,
        textAlign:"center",
        marginTop: 20,
        fontWeight: 700,
        color: '#2bff60',
        padding: 10
    },
    boton: {
        fontFamily: "Arial",
        alignSelf: "center",
        marginTop: 20,
        backgroundColor: "#2bff60",
        padding: 15,
        paddingHorizontal: 35,
        borderRadius: 10,
    },
    vinculo: {
        alignSelf: "center",
        marginBottom: 40,
        marginTop: 20
    },
    loadingContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#292929',
    },
    loadingText: {
        color: '#e0e0e0',
        fontSize: 18,
    }
});
