import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image } from 'react-native';
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

  function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Ícone circular vermelho de logout no canto superior direito */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.btnLogoutIcon} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.avatarArea}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(user?.name ?? 'U')}</Text>
              </View>
            )}
            <Text style={styles.userName}>{user?.name ?? 'Usuário'}</Text>
            <Text style={styles.userRole}>{user?.role ?? ''}</Text>
            <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
            <Text style={styles.userPhone}>{user?.phone ?? ''}</Text>
          </View>

          {/* Botão azul para editar perfil */}
          <TouchableOpacity style={styles.btnEditar} onPress={() => router.push('/(tabs)/conta/editar')}>
            <Text style={styles.btnEditarText}>Editar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f3f7' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 20 },
  btnLogoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -60 },
  avatarArea: { alignItems: 'center' },
  avatar: { width: 190, height: 190, borderRadius: 95, backgroundColor: '#2b5c65', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  avatarImage: { width: 190, height: 190, borderRadius: 95, marginBottom: 22 },
  avatarText: { color: '#fff', fontSize: 60, fontWeight: '900' },
  userName: { fontSize: 28, fontWeight: '900', color: '#1a2540', marginBottom: 4 },
  userRole: { fontSize: 19, fontWeight: '600', color: '#1a2540', marginBottom: 14 },
  userEmail: { fontSize: 16, color: '#2563eb', marginBottom: 4 },
  userPhone: { fontSize: 16, color: '#1a2540' },
  btnEditar: { backgroundColor: '#0000ff', borderRadius: 10, paddingVertical: 14, width: 160, alignSelf: 'center', marginTop: 28, alignItems: 'center' },
  btnEditarText: { color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: '800' }
});