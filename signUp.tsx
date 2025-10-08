import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUp() {
  const [modalVisible, setModalVisible] = useState(false);
  const [alerta, setAlerta] = useState('');
  const router = useRouter();
      const goToLogIn = () => {
          router.push('/(tabs)'); 
      };

  const [nombre, setNombre] = useState('');
  const [contraseña, setContraseña] = useState('');

  const Registrar = async () => {
    if (!nombre || !contraseña) {
      console.log('No se ingresaron los valores necesarios.');
      setAlerta('No se ingresaron los valores necesarios.');
      setModalVisible(true)
      return;
    }
    //En lugar de mi IP, debe ir la IP de la maquina en la que se este hosteando la API
    const API_URL = 'http://192.168.100.227:3000/insertar';
    const datosUsuario = {
        nombre: nombre,
        contraseña: contraseña,
    };
    try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosUsuario),
            });
            const resultadoTexto = await response.text();
            if (response.ok) {
                console.log('Éxito', resultadoTexto);
                goToLogIn()
            } else {
                console.log('Error al Registrar', resultadoTexto);
                setAlerta('Error al Registrar ' + resultadoTexto);
                setModalVisible(true);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            setAlerta('Error de conexión: ' + error);
            setModalVisible(true);
        }
  };

  return (
    <ScrollView  style={{backgroundColor:'#292929'}} contentContainerStyle={{flexGrow:1, justifyContent:'center'}}>
      <Text style={styles.titulo}>Creación de usuario</Text>
      <View style={{marginHorizontal: 35}}>

        <Text style={styles.label}>Nombre de usuario: </Text>
        <TextInput
        style={styles.input}
        placeholder='Ingrese su nombre de usuario'
        value={nombre}
        onChangeText={setNombre}
        ></TextInput>

        <Text style={styles.label}>Contraseña: </Text>
        <TextInput
        style={styles.input}
        placeholder='Ingrese su contraseña'
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry={true}
        ></TextInput>

        <TouchableOpacity style={styles.boton} onPress={Registrar}>
          <Text style={{letterSpacing: 2, color: 'black', fontWeight: 'bold'}}>Crear usuario</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.vinculo} onPress={goToLogIn}>
          <Text style={{color: '#2bff60', fontSize: 16}}>Presione aquí para iniciar sesión.</Text>
        </TouchableOpacity>

      </View>
      <Modal transparent={true} visible={modalVisible} animationType='fade'>
              <View style={{backgroundColor: '#101010ff', padding: 30, paddingVertical: 15, alignItems:'center'}}>
                <Text style={styles.label}>{alerta}</Text>
                <TouchableOpacity style={styles.boton} onPress={() => setModalVisible(false)}>
                <Text style={{letterSpacing: 2, color: 'black', fontWeight: 'bold'}}>Salir</Text>
                </TouchableOpacity>
              </View>
      </Modal>
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
  input: {
    borderWidth: 0.5,
    padding: 8,
    borderColor: "black",
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 8
  },
  label: {
    color: '#e0e0e0',
    fontWeight: 600,
    fontSize: 17,
    marginTop: 20
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
  }
});