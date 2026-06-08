import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Alert, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    const ok = login(email, password);
    if (ok) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Erro', 'E-mail ou senha inválidos.');
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoArea}>
          <View style={styles.logoBox}>
            {/* Substitua pelo seu asset real: <Image source={require('../../assets/logo.png')} style={styles.logoImg} /> */}
            <Text style={styles.logoChar}>K</Text>
          </View>
          <Text style={styles.logoText}>KROW</Text>
        </View>

        <Text style={styles.welcome}>Seja bem vindo!</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#b0b5c8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#b0b5c8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={styles.forgotLink}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Não tem uma conta?{' '}
          <Text style={styles.link} onPress={() => router.push('/(auth)/register')}>
            Cadastre-se
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f3f7' },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 40 },
  logoArea: { alignItems: 'center', marginBottom: 32 },
  logoBox: {
    width: 72, height: 72, borderRadius: 18,
    backgroundColor: '#1e5fc2',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  logoChar: { color: '#fff', fontSize: 32, fontWeight: '900' },
  logoText: { fontSize: 22, fontWeight: '900', letterSpacing: 4, color: '#1a2540' },
  welcome: { fontSize: 26, fontWeight: '900', color: '#1a2540', textAlign: 'center', marginBottom: 28 },
  input: {
    backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: '#dde0ea',
    paddingHorizontal: 16, paddingVertical: 13, fontSize: 14, color: '#1a2540', marginBottom: 12,
  },
  forgotLink: { color: '#2e7de1', fontWeight: '700', fontSize: 13, textAlign: 'right', marginBottom: 20 },
  btnPrimary: {
    backgroundColor: '#1e5fc2', borderRadius: 10,
    paddingVertical: 15, alignItems: 'center', marginBottom: 16,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  bottomText: { textAlign: 'center', fontSize: 13, color: '#7a8099' },
  link: { color: '#2e7de1', fontWeight: '700' },
});