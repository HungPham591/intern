import React from 'react';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Image,
    ToastAndroid
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export default function Login({ navigation }) {
    const URI_LOGO = '../icon1.png'

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(false)

    const handleLogin = () => {
        if (username.length === 0 || password.length === 0) {
            setAlert(true);
            return
        }
        setAlert(false)
        checkLogin()
    }
    const checkLogin = async () => {
        const URL = "https://qlsc.maysoft.io/server/api/auth/login"
        const DATA = { username, password };
        const HEADER = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        }
        const result = await axios.post(URL, DATA, { headers: HEADER })
        if (result.data.code === 200) {
            AsyncStorage.setItem('TOKEN', JSON.stringify(result.data.data))
            navigation.navigate('Tab')
        } else {
            ToastAndroid.show("Login fail !", ToastAndroid.SHORT)
        }
    }
    return (
        <View style={styles.container}>
            <Image source={require(URI_LOGO)}></Image>
            <View>
                <Text style={styles.textView}>Tên tài khoản</Text>
                <TextInput style={styles.textInput} placeholder='Nhập tên tài khoản' onChangeText={text => setUsername(text)} />
                <Text style={alert ? styles.alertTextTrue : styles.alertTextFalse}>Không được để trống</Text>
                <Text style={styles.textView}>Mật khẩu</Text>
                <TextInput style={styles.textInput} placeholder='Nhập mật khẩu' onChangeText={text => setPassword(text)} />
                <Text style={alert ? styles.alertTextTrue : styles.alertTextFalse}>Không được để trống</Text>
                <TouchableHighlight style={styles.button} onPress={handleLogin}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        Login
                    </Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: 'white'
    },
    logo: {

    },
    textInput: {
        borderWidth: 0.5,
        borderRadius: 5,
        paddingVertical: 1,
        paddingHorizontal: 10,
        width: 250,
        height: 50,
    }, textView: {
        paddingVertical: 10,
        fontWeight: 'bold'
    },
    alertTextTrue: {
        color: 'red'
    }, alertTextFalse: {
        transform: [{ scale: 0 }]
    },
    button: {
        width: 250,
        height: 50,
        marginVertical: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: 'rgb(15, 142, 162)',
    }
})