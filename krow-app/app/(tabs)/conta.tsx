import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

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
        <View style={styles.header}>
          <View style={styles.headerLogo}>
            <View style={styles.logoBox}><Text style={styles.logoChar}>K</Text></View>
            <Text style={styles.logoText}>KROW</Text>
          </View>
        </View>

        <View style={styles.avatarArea}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user?.name ?? 'U')}</Text>
          </View>
          <Text style={styles.userName}>{user?.name ?? 'Usuário'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nome</Text>
            <Text style={styles.infoValue}>{user?.name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>E-mail</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Telefone</Text>
            <Text style={styles.infoValue}>{user?.phone}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <Text style={styles.btnLogoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f3f7' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginBottom: 32 },
  headerLogo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBox: { width: 36, height: 36, borderRadius: 9, backgroundColor: '#1e5fc2', alignItems: 'center', justifyContent: 'center' },
  logoChar: { color: '#fff', fontSize: 16, fontWeight: '900' },
  logoText: { fontSize: 16, fontWeight: '900', letterSpacing: 2, color: '#1a2540' },
  avatarArea: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1e5fc2', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '900' },
  userName: { fontSize: 20, fontWeight: '900', color: '#1a2540', marginBottom: 4 },
  userEmail: { fontSize: 13, color: '#7a8099' },
  infoCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 1.5, borderColor: '#dde0ea', marginBottom: 32 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  infoLabel: { fontSize: 13, color: '#7a8099', fontWeight: '600' },
  infoValue: { fontSize: 13, color: '#1a2540', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#dde0ea' },
  btnLogout: { backgroundColor: '#ef4444', borderRadius: 10, paddingVertical: 15, alignItems: 'center' },
  btnLogoutText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});