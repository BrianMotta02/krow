import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace('/(auth)/login');
  }

  function dummy() {
    Alert.alert('Teste', 'Botão de teste pressionado!');
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
        <View style={styles.container}>
          <Text style={styles.title}>Olá, {user?.name ?? 'usuário'}! 👋</Text>
          <Text style={styles.sub}>Bem vindo ao KROW</Text>
          <TouchableOpacity style={styles.btn} onPress={handleLogout}>
            <Text style={styles.btnText}>teste</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={dummy}>
            <Text style={styles.btnText}>teste</Text>
          </TouchableOpacity>
        </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f3f7', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 50 },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingVertical: 20 },
  title: { fontSize: 22, fontWeight: '900', color: '#1a2540', marginBottom: 20 },
  sub: { fontSize: 14, color: '#7a8099', marginBottom: 40 },
  btn: { backgroundColor: '#1e5fc2', borderRadius: 10, paddingVertical: 13, paddingHorizontal: 40 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});