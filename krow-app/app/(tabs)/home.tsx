import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { useTasks } from '../../context/TaskContext';

// ─── Donut Chart ────────────────────────────────────────────────────────────
function DonutChart({ percent }: { percent: number }) {
  const size = 90;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="#e0e0e0" strokeWidth={strokeWidth} fill="none"
      />
      <Circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="#1a2540" strokeWidth={strokeWidth} fill="none"
        strokeDasharray={`${filled} ${circumference - filled}`}
        strokeDashoffset={circumference / 4}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function getDayLabel(date: Date) {
  const today = new Date();
  const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'HOJE';
  if (diff === 1) return 'ONTEM';
  return `${diff}d atrás`;
}

// ─── Tela ───────────────────────────────────────────────────────────────────
export default function Home() {
  const { user } = useAuth();
  const { projects } = useProjects();
  const { getRecentTasks } = useTasks();
  const [search, setSearch] = useState('');

  const firstName = user?.name?.split(' ')[0] ?? 'usuário';
  const recentTasks = getRecentTasks(3);

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayProjects = filteredProjects.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLogo}>
            <View style={styles.logoBox}>
              <Text style={styles.logoChar}>K</Text>
            </View>
            <Text style={styles.logoText}>KROW</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Saudação */}
        <Text style={styles.greeting}>
          {getGreeting()},{' '}
          <Text style={styles.greetingName}>{firstName}</Text>
        </Text>

        {/* Busca */}
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquise o seu projeto"
            placeholderTextColor="#b0b5c8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Projetos */}
        <View style={styles.sectionRow}>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>visão geral dos projetos:</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.verTodos}>VER TODOS</Text>
          </TouchableOpacity>
        </View>

        {displayProjects.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nenhum projeto criado ainda.</Text>
          </View>
        ) : (
          <View style={styles.projectsRow}>
            {displayProjects.map(p => (
              <View key={p.id} style={styles.projectCard}>
                <View style={styles.donutWrap}>
                  <DonutChart percent={p.progress} />
                  <Text style={styles.donutLabel}>{p.progress}%</Text>
                </View>
                <Text style={styles.projectName} numberOfLines={1}>{p.name.toUpperCase()}</Text>
                <Text style={styles.projectSub}>{p.progress}% COMPLETO</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tarefas recentes */}
        <View style={[styles.sectionBadge, { marginBottom: 12 }]}>
          <Text style={styles.sectionBadgeText}>Tarefas feitas recentes:</Text>
        </View>

        {recentTasks.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nenhuma tarefa criada ainda.</Text>
          </View>
        ) : (
          <View style={styles.tasksList}>
            {recentTasks.map(t => (
              <View key={t.id} style={styles.taskCard}>
                <View style={styles.taskAvatar}>
                  <Text style={styles.taskAvatarText}>{getInitials(t.assignedTo)}</Text>
                </View>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle} numberOfLines={1}>{t.title}</Text>
                  <Text style={styles.taskSub}>{t.projectName} · {t.assignedTo.toUpperCase()}</Text>
                </View>
                <View style={[
                  styles.taskBadge,
                  getDayLabel(t.createdAt) === 'HOJE' ? styles.badgeHoje : styles.badgeOntem
                ]}>
                  <Text style={styles.taskBadgeText}>{getDayLabel(t.createdAt)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footerLogo}>
          <View style={styles.logoBox}>
            <Text style={styles.logoChar}>K</Text>
          </View>
          <Text style={styles.logoText}>KROW</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f3f7' },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginBottom: 20 },
  headerLogo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBox: { width: 36, height: 36, borderRadius: 9, backgroundColor: '#1e5fc2', alignItems: 'center', justifyContent: 'center' },
  logoChar: { color: '#fff', fontSize: 16, fontWeight: '900' },
  logoText: { fontSize: 16, fontWeight: '900', letterSpacing: 2, color: '#1a2540' },
  bellBtn: { padding: 4 },
  bellIcon: { fontSize: 22 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#1a2540', marginBottom: 16 },
  greetingName: { fontWeight: '900' },
  searchBox: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1.5, borderColor: '#dde0ea', marginBottom: 20 },
  searchInput: { paddingHorizontal: 16, paddingVertical: 13, fontSize: 14, color: '#1a2540' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionBadge: { backgroundColor: '#2e7de1', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 },
  sectionBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  verTodos: { color: '#2e7de1', fontSize: 12, fontWeight: '800' },
  emptyBox: { backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 20 },
  emptyText: { color: '#b0b5c8', fontSize: 13 },
  projectsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  projectCard: { alignItems: 'center', flex: 1 },
  donutWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  donutLabel: { position: 'absolute', fontSize: 16, fontWeight: '900', color: '#1a2540' },
  projectName: { fontSize: 11, fontWeight: '900', color: '#1a2540', textAlign: 'center' },
  projectSub: { fontSize: 9, color: '#7a8099', textAlign: 'center', marginTop: 2 },
  tasksList: { gap: 10, marginBottom: 32 },
  taskCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1.5, borderColor: '#dde0ea', flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  taskAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#1e5fc2', alignItems: 'center', justifyContent: 'center' },
  taskAvatarText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 13, fontWeight: '700', color: '#1a2540' },
  taskSub: { fontSize: 11, color: '#7a8099', marginTop: 2 },
  taskBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  badgeHoje: { backgroundColor: '#2e7de1' },
  badgeOntem: { backgroundColor: '#1a2540' },
  taskBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  footerLogo: { alignItems: 'center', gap: 6, marginTop: 8 },
});