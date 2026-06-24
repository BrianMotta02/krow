import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function EditarConta() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [nome, setNome] = useState(user?.name ?? '');
  const [funcao, setFuncao] = useState(user?.role ?? '');
  const [fone, setFone] = useState(user?.phone ?? '');
  const [foto, setFoto] = useState<string | null>(user?.avatar ?? null);

  // ── Animação de sucesso no botão Confirmar ─────────────────────────────
  const [isSuccess, setIsSuccess] = useState(false);
  const btnColorAnim = useRef(new Animated.Value(0)).current;
  const btnScaleAnim = useRef(new Animated.Value(1)).current;

  async function handleAlterarFoto() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível acessar a galeria.');
    }
  }

  function handleConfirmar() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Nome não pode ficar vazio.');
      return;
    }

    updateUser({
      name: nome.trim(),
      role: funcao.trim(),
      email: user?.email ?? '',
      phone: fone.trim(),
      avatar: foto,
    });

    setIsSuccess(true);
    Animated.sequence([
      Animated.timing(btnScaleAnim, { toValue: 1.06, duration: 140, useNativeDriver: true }),
      Animated.timing(btnScaleAnim, { toValue: 1, duration: 140, useNativeDriver: true }),
    ]).start();
    Animated.timing(btnColorAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        router.back();
      }, 600);
    });
  }

  function getInitials(nameStr: string) {
    return nameStr.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  const btnBackgroundColor = btnColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#0000ff', '#22c55e'],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backCircleBtn}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.mainCard}>

            <View style={styles.avatarArea}>
              <TouchableOpacity onPress={handleAlterarFoto} activeOpacity={0.8}>
                {foto ? (
                  <Image source={{ uri: foto }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{getInitials(nome || 'U')}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.editPencilIcon} onPress={handleAlterarFoto}>
                <Feather name="edit" size={16} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome:</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Digite seu nome"
                />
              </View>
            </View>

            <View style={styles.blueLine} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Função</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={funcao}
                  onChangeText={setFuncao}
                  placeholder="Sua função"
                />
              </View>
            </View>

            <View style={styles.blueLine} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={[styles.inputBox, { backgroundColor: '#f0f0f4' }]}>
                <TextInput
                  style={[styles.input, { color: '#888' }]}
                  value={user?.email ?? ''}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>
            </View>

            <View style={styles.blueLine} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fone</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={fone}
                  onChangeText={setFone}
                  keyboardType="phone-pad"
                  placeholder="+55 (00) 00000-0000"
                />
              </View>
            </View>

            <Animated.View style={{ width: '65%', alignSelf: 'center', marginTop: 28, transform: [{ scale: btnScaleAnim }] }}>
              <Animated.View
                style={[
                  styles.btnConfirmar,
                  { backgroundColor: btnBackgroundColor },
                ]}
              >
                <TouchableOpacity
                  style={styles.btnConfirmarTouchable}
                  onPress={handleConfirmar}
                  disabled={isSuccess}
                  activeOpacity={0.85}
                >
                  {isSuccess ? (
                    <View style={styles.successRow}>
                      <Ionicons name="checkmark-circle" size={18} color="#fff" />
                      <Text style={styles.btnConfirmarText}>Salvo!</Text>
                    </View>
                  ) : (
                    <Text style={styles.btnConfirmarText}>Confirmar</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f3f7' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  header: { marginBottom: 16 },
  backCircleBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  mainCard: { backgroundColor: '#fff', borderRadius: 34, paddingHorizontal: 22, paddingTop: 30, paddingBottom: 35, borderWidth: 1.5, borderColor: '#dde0ea' },
  avatarArea: { alignSelf: 'center', marginBottom: 24, position: 'relative' },
  avatarImage: { width: 90, height: 90, borderRadius: 45 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#2b5c65', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 32, color: '#fff', fontWeight: '900' },
  editPencilIcon: { position: 'absolute', right: -15, top: 30, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#000', borderRadius: 6, padding: 6 },
  inputGroup: { marginBottom: 4 },
  label: { fontSize: 13, fontWeight: '700', color: '#1a2540', marginBottom: 6, marginLeft: 4 },
  inputBox: { borderWidth: 1.5, borderColor: '#7a8099', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff' },
  input: { fontSize: 13, color: '#1a2540', fontWeight: '600' },
  blueLine: { height: 3, backgroundColor: '#0000ff', width: '65%', alignSelf: 'center', marginVertical: 12, borderRadius: 2 },
  btnConfirmar: { borderRadius: 12, overflow: 'hidden' },
  btnConfirmarTouchable: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  successRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnConfirmarText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});