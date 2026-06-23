import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function Conta() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => { logout(); router.replace('/(auth)/login'); } },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Ícone superior direito para navegar para editar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/conta/editar')}>
             <Ionicons name="create-outline" size={28} color="#1a2540" />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarArea}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JP</Text>
          </View>
          <Text style={styles.userName}>{user?.name ?? 'João Pedro'}</Text>
          <Text style={styles.userRole}>Gerente de Projetos</Text>
          <Text style={styles.userEmail}>{user?.email ?? 'joao.pedro@krow.com.br'}</Text>
        </View>

        {/* Botão azul para editar perfil */}
        <TouchableOpacity style={styles.btnEditar} onPress={() => router.push('/(tabs)/conta/editar')}>
          <Text style={styles.btnEditarText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f3f7' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 20 },
  avatarArea: { alignItems: 'center', marginTop: 40 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#1e5fc2', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  avatarText: { color: '#fff', fontSize: 40, fontWeight: '900' },
  userName: { fontSize: 22, fontWeight: '900', color: '#1a2540' },
  userRole: { fontSize: 16, color: '#7a8099', marginBottom: 10 },
  userEmail: { fontSize: 14, color: '#1a2540' },
  btnEditar: { backgroundColor: '#0000ff', borderRadius: 8, paddingVertical: 12, width: 150, alignSelf: 'center', marginTop: 30 },
  btnEditarText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});