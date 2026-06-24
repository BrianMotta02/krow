import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/logo';
export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 11);

  if (!numbers) return '';

  if (numbers.length < 3) {
    return `(${numbers}`;
  }

  if (numbers.length < 8) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(
    2,
    7
  )}-${numbers.slice(7)}`;
}
  function handleRegister() {
    if (!name || !email || !phone || !password || !confirm) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Atenção', 'Digite um e-mail válido.');
      return;
    }
    const phoneNumbers = phone.replace(/\D/g, '');
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      Alert.alert('Atenção', 'Digite um telefone válido.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }
    register(name, email, phone, password);
    Alert.alert('Sucesso', 'Conta criada! Faça login.', [
      {
        text: 'OK',
        onPress: () => router.replace('/(auth)/login'),
      },
    ]);
  }
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.navIcon}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text style={styles.navIcon}>⌂</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logoArea}>
          <Logo height={48} />
        </View>
        <Text style={styles.title}>Bem vindo ao Cadastro</Text>
        <Text style={styles.sub}>
          Vamos ajudar você a cumprir suas tarefas.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome completo"
          placeholderTextColor="#b0b5c8"
          value={name}
          onChangeText={setName}
        />
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
          placeholder="Digite seu celular"
          placeholderTextColor="#b0b5c8"
          keyboardType="phone-pad"
          maxLength={15}
          value={phone}
          onChangeText={(text) => setPhone(formatPhone(text))}
        />
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#b0b5c8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirme sua senha"
          placeholderTextColor="#b0b5c8"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={handleRegister}
        >
          <Text style={styles.btnText}>Registrar</Text>
        </TouchableOpacity>
        <Text style={styles.bottomText}>
          Já tem uma conta?{' '}
          <Text
            style={styles.link}
            onPress={() => router.replace('/(auth)/login')}
          >
            Iniciar sessão
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f3f7',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingVertical: 60,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 70,
  },
  navIcon: {
    fontSize: 22,
    color: '#555',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1a2540',
    textAlign: 'center',
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    color: '#7a8099',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#dde0ea',
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: '#1a2540',
    marginBottom: 12,
  },
  btnPrimary: {
    backgroundColor: '#1e5fc2',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  bottomText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#7a8099',
  },
  link: {
    color: '#2e7de1',
    fontWeight: '700',
  },
});