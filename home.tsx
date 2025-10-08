// ARCHIVO: home.tsx (Perfil de Usuario y Edición)

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
const API_URL = 'http://192.168.100.227:3000';

export default function HomeScreen() {
    const router = useRouter();
    const { user, clearSession } = useAuth0(); 

    const [nombre, setNombre] = useState(user?.nickname || user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            await clearSession(); 
            router.replace('/(tabs)'); 
        } catch (e) {
            console.error('Error al cerrar sesión:', e);
            Alert.alert('Error', 'No se pudo cerrar la sesión.');
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        if (!user?.sub) {
            Alert.alert('Error', 'No se pudo obtener el ID de Auth0. Por favor, reinicie la sesión.');
            setLoading(false);
            return;
        }

        const datosUsuario = {
            auth0_id: user.sub,
            nombre: nombre,
            email: email,
        };

        try {
            const response = await fetch(`${API_URL}/update-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosUsuario),
            });

            if (response.ok) {
                Alert.alert('Éxito', '¡Datos actualizados correctamente en tu base de datos!');
            } else {
                const errorText = await response.text();
                Alert.alert('Error', `Error al actualizar: ${errorText}`);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            Alert.alert('Error de conexión', 'No se pudo conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };
    if (!user) return null;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.titulo}>Configuración del Perfil</Text>

            <View style={{marginHorizontal: 35}}>
                
                <Text style={styles.label}>ID de Auth0 (Clave Única):</Text>
                <Text style={styles.readOnlyInput}>{user.sub}</Text>

                <Text style={styles.label}>Nombre de usuario:</Text>
                <TextInput
                    style={styles.input}
                    value={nombre}
                    onChangeText={setNombre}
                />

                <Text style={styles.label}>Email:</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                />
                
                <TouchableOpacity 
                    style={styles.boton} 
                    onPress={handleUpdate} 
                    disabled={loading}
                >
                    <Text style={styles.botonText}>{loading ? 'Guardando...' : 'Guardar Cambios'}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.boton, styles.logoutBoton]} 
                    onPress={handleLogout}
                >
                    <Text style={styles.botonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#292929',
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 40, 
    },
    titulo: {
        fontSize: 30,
        textAlign:"center",
        fontWeight: 'bold',
        color: '#2bff60',
        padding: 10
    },
    input: {
        borderWidth: 0.5,
        padding: 10,
        borderColor: "#555",
        backgroundColor: "white",
        borderRadius: 8,
        marginTop: 8,
        fontSize: 16,
    },
    readOnlyInput: {
        borderWidth: 0.5,
        padding: 10,
        borderColor: "#555",
        backgroundColor: "#444",
        borderRadius: 8,
        marginTop: 8,
        fontSize: 14,
        color: '#ccc',
        overflow: 'hidden'
    },
    label: {
        color: '#e0e0e0',
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: 20
    },
    boton: {
        alignSelf: "center",
        marginTop: 30,
        backgroundColor: "#2bff60",
        padding: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    logoutBoton: {
        backgroundColor: "#ff4d4d",
        marginTop: 15,
    },
    botonText: {
        letterSpacing: 1, 
        color: 'black', 
        fontWeight: 'bold'
    }
});