import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '../../components/logo';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  function handleConfirm() {
    if (!email) {
      Alert.alert('Atenção', 'Informe seu e-mail.');
      return;
    }
    router.push('/(auth)/reset-password');
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
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.navIcon}>⌂</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoArea}>
          <Logo height={48} />
        </View>

        <Text style={styles.title}>Esqueceu sua senha?</Text>
        <Text style={styles.sub}>Vamos ajudar você a cumprir suas tarefas.</Text>

        <View style={styles.descBox}>
          <Text style={styles.desc}>
            Para redefinir sua senha, informe o seu e-mail cadastrado na sua conta e lhe enviaremos um código.
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#b0b5c8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.btnPrimary} onPress={handleConfirm}>
          <Text style={styles.btnText}>Confirmar</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Logo height={36} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f3f7' },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingVertical: 60 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 70 },
  navIcon: { fontSize: 22, color: '#555' },
  logoArea: { alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '900', color: '#1a2540', textAlign: 'center', marginBottom: 4 },
  sub: { fontSize: 12, color: '#7a8099', textAlign: 'center', marginBottom: 16 },
  descBox: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 16, marginBottom: 20,
  },
  desc: { fontSize: 13, color: '#4a5068', lineHeight: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#fff', borderRadius: 10,
    borderWidth: 1.5, borderColor: '#dde0ea',
    paddingHorizontal: 16, paddingVertical: 13,
    fontSize: 14, color: '#1a2540', marginBottom: 16,
  },
  btnPrimary: {
    backgroundColor: '#1e5fc2', borderRadius: 10,
    paddingVertical: 15, alignItems: 'center', marginBottom: 32,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  footer: { alignItems: 'center', marginTop: 'auto' },
});