import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image, Animated, Easing, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// ─── Fundo animado: formas geométricas flutuando ───────────────────────────
function FloatingShape({
  size,
  top,
  left,
  borderRadius = 0,
  duration = 9000,
  delay = 0,
  rotateTo = '25deg',
  driftY = 22,
  borderColor = '#2e7de1',
  borderWidth = 1.5,
}: {
  size: number;
  top: number;
  left: number;
  borderRadius?: number;
  duration?: number;
  delay?: number;
  rotateTo?: string;
  driftY?: number;
  borderColor?: string;
  borderWidth?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, driftY] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', rotateTo] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius,
        borderWidth,
        borderColor,
        opacity: 0.08,
        transform: [{ translateY }, { rotate }],
      }}
    />
  );
}

function AnimatedBackground() {
  return (
    <View style={styles.backgroundWrap} pointerEvents="none">
      <FloatingShape size={120} top={70} left={SCREEN_W - 90} borderRadius={28} duration={8000} rotateTo="20deg" driftY={18} />
      <FloatingShape size={70} top={220} left={-30} borderRadius={16} duration={7000} delay={300} rotateTo="-18deg" driftY={14} borderColor="#1a2540" />
      <FloatingShape size={160} top={SCREEN_H * 0.45} left={SCREEN_W - 60} borderRadius={80} duration={11000} delay={600} rotateTo="0deg" driftY={26} borderColor="#2e7de1" />
      <FloatingShape size={90} top={SCREEN_H * 0.62} left={20} borderRadius={20} duration={9500} delay={150} rotateTo="22deg" driftY={20} borderColor="#1a2540" />
      <FloatingShape size={45} top={SCREEN_H * 0.18} left={SCREEN_W * 0.45} borderRadius={10} duration={6500} delay={450} rotateTo="-30deg" driftY={12} />
      <FloatingShape size={200} top={SCREEN_H - 140} left={-80} borderRadius={100} duration={12000} delay={200} rotateTo="0deg" driftY={16} borderColor="#2e7de1" />
    </View>
  );
}

export default function Conta() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(18)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const logoutScale = useRef(new Animated.Value(1)).current;
  const editarScale = useRef(new Animated.Value(1)).current;
  const logoutShake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  function animatePressIn(value: Animated.Value) {
    Animated.spring(value, { toValue: 0.92, useNativeDriver: true, speed: 40 }).start();
  }
  function animatePressOut(value: Animated.Value) {
    Animated.spring(value, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  }

  function triggerLogoutShake() {
    logoutShake.setValue(0);
    Animated.sequence([
      Animated.timing(logoutShake, { toValue: 1, duration: 50, useNativeDriver: true }),
      Animated.timing(logoutShake, { toValue: -1, duration: 50, useNativeDriver: true }),
      Animated.timing(logoutShake, { toValue: 1, duration: 50, useNativeDriver: true }),
      Animated.timing(logoutShake, { toValue: -1, duration: 50, useNativeDriver: true }),
      Animated.timing(logoutShake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }

  function handleLogout() {
    triggerLogoutShake();
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => { logout(); router.replace('/(auth)/login'); } },
    ]);
  }

  function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  const pulseScale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });
  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] });

  return (
    <SafeAreaView style={styles.safe}>
      <AnimatedBackground />
      <View style={styles.container}>
        <View style={styles.header}>
          <AnimatedTouchable
            style={[
              styles.btnLogoutIcon,
              {
                transform: [
                  { scale: logoutScale },
                  {
                    translateX: logoutShake.interpolate({
                      inputRange: [-1, 0, 1],
                      outputRange: [-4, 0, 4],
                    }),
                  },
                ],
              },
            ]}
            onPress={handleLogout}
            onPressIn={() => animatePressIn(logoutScale)}
            onPressOut={() => animatePressOut(logoutScale)}
            activeOpacity={0.7}
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          >
            <Ionicons name="log-out-outline" size={18} color="#fff" />
          </AnimatedTouchable>
        </View>

        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: translateAnim }] },
          ]}
        >
          <View style={styles.avatarArea}>
            <View style={styles.avatarWrap}>
              <Animated.View
                style={[
                  styles.pulseRing,
                  { opacity: pulseOpacity, transform: [{ scale: pulseScale }] },
                ]}
              />
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(user?.name ?? 'U')}</Text>
                </View>
              )}
            </View>
            <Text style={styles.userName}>{user?.name ?? 'Usuário'}</Text>
            <Text style={styles.userRole}>{user?.role ?? ''}</Text>
            <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
            <Text style={styles.userPhone}>{user?.phone ?? ''}</Text>
          </View>

          <Animated.View style={{ alignSelf: 'center', transform: [{ scale: editarScale }] }}>
            <TouchableOpacity
              style={styles.btnEditar}
              onPress={() => router.push('/(tabs)/conta/editar')}
              onPressIn={() => animatePressIn(editarScale)}
              onPressOut={() => animatePressOut(editarScale)}
              activeOpacity={1}
            >
              <Text style={styles.btnEditarText}>Editar</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f3f7' },
  backgroundWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: -1 },
  container: { flex: 1, paddingHorizontal: 20, zIndex: 1 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 50, paddingRight: 8, zIndex: 10 },
  btnLogoutIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -60 },
  avatarArea: { alignItems: 'center' },
  avatarWrap: { width: 190, height: 190, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  pulseRing: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#2e7de1',
  },
  avatar: { width: 190, height: 190, borderRadius: 95, backgroundColor: '#2b5c65', alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: 190, height: 190, borderRadius: 95 },
  avatarText: { color: '#fff', fontSize: 60, fontWeight: '900' },
  userName: { fontSize: 28, fontWeight: '900', color: '#1a2540', marginBottom: 4 },
  userRole: { fontSize: 19, fontWeight: '600', color: '#1a2540', marginBottom: 14 },
  userEmail: { fontSize: 16, color: '#2563eb', marginBottom: 4 },
  userPhone: { fontSize: 16, color: '#1a2540' },
  btnEditar: { backgroundColor: '#0000ff', borderRadius: 10, paddingVertical: 14, width: 160, alignSelf: 'center', marginTop: 28, alignItems: 'center' },
  btnEditarText: { color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: '800' },
});