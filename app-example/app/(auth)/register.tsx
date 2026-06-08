import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  function handleRegister() {
    if (!name || !email || !phone || !password || !confirm) {
      Alert.alert('Atenção', 'Preencha todos os campos.'); return;
    }
    if (password !== confirm) {
      Alert.alert('Atenção', 'As senhas não coincidem.'); return;
    }
    register(name, email, phone, password);
    Alert.alert('Sucesso', 'Conta criada! Faça login.', [
      { text: 'OK', onPress: () => router.replace('/(auth)/login') },
    ]);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}><Text style={styles.homeIcon}>⌂</Text></TouchableOpacity>
        </View>

        <View style={styles.logoArea}>
          <View style={styles.logoBox}><Text style={styles.logoChar}>K</Text></View>
          <Text style={styles.logoText}>KROW</Text>
        </View>

        <Text style={styles.title}>Bem vindo ao Cadastro</Text>
        <Text style={styles.sub}>Vamos ajudar você a cumprir suas tarefas.</Text>

        <TextInput style={styles.input} placeholder="Digite seu nome completo" placeholderTextColor="#b0b5c8" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Digite seu e-mail" placeholderTextColor="#b0b5c8" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Digite seu número de telefone" placeholderTextColor="#b0b5c8" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <TextInput style={styles.input} placeholder="Digite sua senha" placeholderTextColor="#b0b5c8" secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="Confirme sua senha" placeholderTextColor="#b0b5c8" secureTextEntry value={confirm} onChangeText={setConfirm} />

        <TouchableOpacity style={styles.btnPrimary} onPress={handleRegister}>
          <Text style={styles.btnText}>Registrar</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Já tem uma conta?{' '}
          <Text style={styles.link} onPress={() => router.replace('/(auth)/login')}>Iniciar sessão</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f3f7' },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingVertical: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  backArrow: { fontSize: 22, color: '#555' },
  homeIcon: { fontSize: 22, color: '#555' },
  logoArea: { alignItems: 'center', marginBottom: 16 },
  logoBox: { width: 52, height: 52, borderRadius: 13, backgroundColor: '#1e5fc2', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  logoChar: { color: '#fff', fontSize: 24, fontWeight: '900' },
  logoText: { fontSize: 14, fontWeight: '900', letterSpacing: 3, color: '#1a2540' },
  title: { fontSize: 22, fontWeight: '900', color: '#1a2540', textAlign: 'center', marginBottom: 4 },
  sub: { fontSize: 12, color: '#7a8099', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: '#dde0ea', paddingHorizontal: 16, paddingVertical: 13, fontSize: 14, color: '#1a2540', marginBottom: 12 },
  btnPrimary: { backgroundColor: '#1e5fc2', borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginTop: 4, marginBottom: 16 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  bottomText: { textAlign: 'center', fontSize: 13, color: '#7a8099' },
  link: { color: '#2e7de1', fontWeight: '700' },
});