import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView, Modal,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { useTasks, TaskPriority } from '../../context/TaskContext';
import { Logo } from '../../components/logo';

// ─── Donut Chart ────────────────────────────────────────────────────────────
function DonutChart({ percent, size = 90 }: { percent: number; size?: number }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;

  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={radius} stroke="#e0e0e0" strokeWidth={strokeWidth} fill="none" />
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

// ─── Tipos locais ─────────────────────────────────────────────────────────────
type Project = {
  id: string;
  name: string;
  description?: string;
  manager: string;
  startDate: string;
  endDate: string;
  progress: number;
  members: string[];
};

// ─── Modal de detalhe de projeto ─────────────────────────────────────────────
function ProjectDetailModal({
  project,
  visible,
  onClose,
}: {
  project: Project | null;
  visible: boolean;
  onClose: () => void;
}) {
  if (!project) return null;
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableOpacity style={pStyles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={pStyles.card} activeOpacity={1} onPress={() => {}}>
          <View style={pStyles.topBar}>
            <View style={pStyles.topInfo}>
              <Text style={pStyles.projectName}>{project.name}</Text>
              <Text style={pStyles.managerLabel}>GP · {project.manager}</Text>
            </View>
            <View style={pStyles.donutWrap}>
              <DonutChart percent={project.progress} size={72} />
              <Text style={pStyles.donutLabel}>{project.progress}%</Text>
            </View>
          </View>
          <View style={pStyles.progressBar}>
            <View style={[pStyles.progressFill, { width: `${project.progress}%` }]} />
          </View>
          <Text style={pStyles.progressText}>{project.progress}% concluído</Text>
          <View style={pStyles.datesRow}>
            <View style={pStyles.dateBox}>
              <Text style={pStyles.dateLabel}>Início</Text>
              <Text style={pStyles.dateValue}>{project.startDate}</Text>
            </View>
            <View style={pStyles.dateDivider} />
            <View style={pStyles.dateBox}>
              <Text style={pStyles.dateLabel}>Entrega</Text>
              <Text style={pStyles.dateValue}>{project.endDate}</Text>
            </View>
          </View>
          {!!project.description && (
            <View style={pStyles.descBox}>
              <Text style={pStyles.sectionLabel}>Descrição</Text>
              <Text style={pStyles.descText}>{project.description}</Text>
            </View>
          )}
          {project.members && project.members.length > 0 && (
            <View style={pStyles.membersSection}>
              <Text style={pStyles.sectionLabel}>Membros</Text>
              <View style={pStyles.membersRow}>
                {project.members.map((m, i) => (
                  <View key={i} style={[pStyles.memberAvatar, { marginLeft: i > 0 ? -8 : 0 }]}>
                    <Text style={pStyles.memberAvatarText}>{getInitials(m)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          <TouchableOpacity style={pStyles.closeBtn} onPress={onClose}>
            <Text style={pStyles.closeBtnText}>Fechar</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const pStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  topInfo: { flex: 1, paddingRight: 12 },
  projectName: { fontSize: 18, fontWeight: '900', color: '#1a2540', marginBottom: 4 },
  managerLabel: { fontSize: 13, color: '#7a8099' },
  donutWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  donutLabel: { position: 'absolute', fontSize: 13, fontWeight: '900', color: '#1a2540' },
  progressBar: { height: 6, backgroundColor: '#e0e0e0', borderRadius: 4, marginBottom: 6 },
  progressFill: { height: 6, backgroundColor: '#2e7de1', borderRadius: 4 },
  progressText: { fontSize: 11, color: '#7a8099', marginBottom: 16 },
  datesRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f3f7', borderRadius: 12, padding: 14, marginBottom: 14 },
  dateBox: { flex: 1, alignItems: 'center' },
  dateLabel: { fontSize: 11, color: '#7a8099', marginBottom: 4 },
  dateValue: { fontSize: 14, fontWeight: '800', color: '#1a2540' },
  dateDivider: { width: 1, height: 32, backgroundColor: '#dde0ea' },
  descBox: { backgroundColor: '#f2f3f7', borderRadius: 12, padding: 14, marginBottom: 14 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#7a8099', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  descText: { fontSize: 13, color: '#1a2540', lineHeight: 19 },
  membersSection: { marginBottom: 14 },
  membersRow: { flexDirection: 'row', marginTop: 8 },
  memberAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1e5fc2', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  memberAvatarText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  closeBtn: { backgroundColor: '#1a2540', borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginTop: 4 },
  closeBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});

// ─── Prioridade (para modal de tarefa) ───────────────────────────────────────
const PRIORITY_COLORS: Record<TaskPriority, string> = {
  alta: '#ef4444', media: '#f59e0b', baixa: '#22c55e',
};
const PRIORITY_LABELS: Record<TaskPriority, string> = {
  alta: 'ALTA', media: 'MÉDIA', baixa: 'BAIXA',
};

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <View style={[tStyles.priorityBadge, { backgroundColor: PRIORITY_COLORS[priority] + '22', borderColor: PRIORITY_COLORS[priority] }]}>
      <Text style={[tStyles.priorityText, { color: PRIORITY_COLORS[priority] }]}>● {PRIORITY_LABELS[priority]}</Text>
    </View>
  );
}

// ─── Modal de detalhe de tarefa ───────────────────────────────────────────────
function TaskDetailModal({
  taskId,
  visible,
  onClose,
}: {
  taskId: string | null;
  visible: boolean;
  onClose: () => void;
}) {
  const { getTask, toggleChecklistItem, addComment, updateStatus, addChecklistItem } = useTasks();
  const [newComment, setNewComment] = useState('');
  const [newCheckItem, setNewCheckItem] = useState('');

  const task = taskId ? getTask(taskId) : null;
  if (!task) return null;

  function handleAddComment() {
    if (!newComment.trim() || !taskId) return;
    addComment(taskId, 'Usuário', newComment.trim());
    setNewComment('');
  }

  function handleAddCheckItem() {
    if (!newCheckItem.trim() || !taskId) return;
    addChecklistItem(taskId, newCheckItem.trim());
    setNewCheckItem('');
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={tStyles.overlay}>
        <View style={tStyles.content}>
          <View style={tStyles.header}>
            <Text style={tStyles.title} numberOfLines={1}>{task.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={tStyles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={tStyles.badgesRow}>
              <PriorityBadge priority={task.priority} />
              <View style={tStyles.projectBadge}><Text style={tStyles.projectBadgeText}>{task.projectName}</Text></View>
              <View style={tStyles.statusBadge}><Text style={tStyles.statusBadgeText}>{task.status.replace('_', ' ').toUpperCase()}</Text></View>
            </View>
            <Text style={tStyles.sectionTitle}>DESCRIÇÃO</Text>
            <Text style={tStyles.descText}>{task.description || 'Sem descrição.'}</Text>
            <View style={tStyles.infoRow}>
              <View style={tStyles.infoBox}>
                <Text style={tStyles.infoLabel}>PRAZO</Text>
                <Text style={tStyles.infoValue}>📅 {task.deadline}</Text>
              </View>
              <View style={tStyles.infoBox}>
                <Text style={tStyles.infoLabel}>CRIADA EM</Text>
                <Text style={tStyles.infoValue}>{task.createdAt.toLocaleDateString('pt-BR')}</Text>
              </View>
            </View>
            <Text style={tStyles.sectionTitle}>RESPONSÁVEL</Text>
            <View style={tStyles.assigneeRow}>
              <View style={tStyles.assigneeAvatar}>
                <Text style={tStyles.assigneeAvatarText}>{task.assignedTo.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</Text>
              </View>
              <Text style={tStyles.assigneeName}>{task.assignedTo}</Text>
            </View>
            <Text style={tStyles.sectionTitle}>CHECKLIST ({task.checklist.filter(c => c.done).length} de {task.checklist.length} concluídos)</Text>
            {task.checklist.map(item => (
              <TouchableOpacity key={item.id} style={tStyles.checkItem} onPress={() => toggleChecklistItem(task.id, item.id)}>
                <View style={[tStyles.checkbox, item.done && tStyles.checkboxDone]}>
                  {item.done && <Text style={tStyles.checkmark}>✓</Text>}
                </View>
                <Text style={[tStyles.checkText, item.done && tStyles.checkTextDone]}>{item.text}</Text>
              </TouchableOpacity>
            ))}
            <View style={tStyles.addRow}>
              <TextInput style={[tStyles.input, { flex: 1 }]} placeholder="Novo item..." placeholderTextColor="#b0b5c8" value={newCheckItem} onChangeText={setNewCheckItem} />
              <TouchableOpacity style={tStyles.addBtn} onPress={handleAddCheckItem}><Text style={tStyles.addBtnText}>+</Text></TouchableOpacity>
            </View>
            <Text style={tStyles.sectionTitle}>COMENTÁRIOS ({task.comments.length})</Text>
            {task.comments.map(c => (
              <View key={c.id} style={tStyles.commentCard}>
                <View style={tStyles.commentHeader}>
                  <View style={tStyles.assigneeAvatar}>
                    <Text style={tStyles.assigneeAvatarText}>{c.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</Text>
                  </View>
                  <View>
                    <Text style={tStyles.commentAuthor}>{c.author}</Text>
                    <Text style={tStyles.commentDate}>{c.createdAt.toLocaleDateString('pt-BR')}</Text>
                  </View>
                </View>
                <Text style={tStyles.commentText}>{c.text}</Text>
              </View>
            ))}
            <View style={tStyles.addRow}>
              <TextInput style={[tStyles.input, { flex: 1 }]} placeholder="Adicionar comentário..." placeholderTextColor="#b0b5c8" value={newComment} onChangeText={setNewComment} />
              <TouchableOpacity style={tStyles.addBtn} onPress={handleAddComment}><Text style={tStyles.addBtnText}>→</Text></TouchableOpacity>
            </View>
            <View style={tStyles.actionsRow}>
              <TouchableOpacity style={tStyles.btnVoltar} onPress={onClose}>
                <Text style={tStyles.btnVoltarText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tStyles.btnConcluir} onPress={() => { updateStatus(task.id, 'concluida'); onClose(); }}>
                <Text style={tStyles.btnConcluirText}>Marcar concluída</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const tStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  content: { flex: 1, backgroundColor: '#f2f3f7', marginTop: 48, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 16, fontWeight: '900', color: '#1a2540', flex: 1, marginRight: 12 },
  closeIcon: { fontSize: 18, color: '#555' },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  priorityBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  priorityText: { fontSize: 11, fontWeight: '700' },
  projectBadge: { backgroundColor: '#2e7de122', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: '#2e7de1' },
  projectBadgeText: { fontSize: 11, fontWeight: '700', color: '#2e7de1' },
  statusBadge: { backgroundColor: '#1a254022', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: '#1a2540' },
  statusBadgeText: { fontSize: 11, fontWeight: '700', color: '#1a2540' },
  sectionTitle: { fontSize: 11, fontWeight: '900', color: '#7a8099', letterSpacing: 1, marginTop: 20, marginBottom: 10 },
  descText: { fontSize: 13, color: '#4a5068', lineHeight: 20 },
  infoRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  infoBox: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1.5, borderColor: '#dde0ea' },
  infoLabel: { fontSize: 10, color: '#7a8099', fontWeight: '700', marginBottom: 4 },
  infoValue: { fontSize: 13, color: '#1a2540', fontWeight: '700' },
  assigneeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  assigneeAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1e5fc2', alignItems: 'center', justifyContent: 'center' },
  assigneeAvatarText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  assigneeName: { fontSize: 14, fontWeight: '700', color: '#1a2540' },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: '#dde0ea', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: '#2e7de1', borderColor: '#2e7de1' },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: '900' },
  checkText: { fontSize: 13, color: '#1a2540', flex: 1 },
  checkTextDone: { textDecorationLine: 'line-through', color: '#b0b5c8' },
  addRow: { flexDirection: 'row', gap: 8, marginTop: 8, marginBottom: 4 },
  addBtn: { backgroundColor: '#2e7de1', borderRadius: 10, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  commentCard: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1.5, borderColor: '#dde0ea' },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  commentAuthor: { fontSize: 13, fontWeight: '700', color: '#1a2540' },
  commentDate: { fontSize: 11, color: '#7a8099' },
  commentText: { fontSize: 13, color: '#4a5068', lineHeight: 18 },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 24, marginBottom: 32 },
  btnVoltar: { flex: 1, paddingVertical: 13, borderRadius: 10, borderWidth: 1.5, borderColor: '#dde0ea', alignItems: 'center', backgroundColor: '#fff' },
  btnVoltarText: { fontSize: 14, fontWeight: '700', color: '#1a2540' },
  btnConcluir: { flex: 1, paddingVertical: 13, borderRadius: 10, backgroundColor: '#2e7de1', alignItems: 'center' },
  btnConcluirText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  input: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: '#dde0ea', paddingHorizontal: 16, paddingVertical: 13, fontSize: 14, color: '#1a2540' },
});

// ─── Notificações (exemplo) ───────────────────────────────────────────────
type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const EXAMPLE_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Nova tarefa atribuída', description: 'Você recebeu a tarefa "Atualização do Sistema de Design".', time: 'Há 2h', read: false },
  { id: '2', title: 'Comentário no projeto', description: 'Carlos Eduardo comentou em "La Bolaria".', time: 'Há 5h', read: false },
  { id: '3', title: 'Prazo se aproximando', description: 'A tarefa "Homologação e Controle de Qualidade (QA)" vence em breve.', time: 'Ontem', read: false },
];

function NotificationsModal({
  visible,
  onClose,
  notifications,
  onMarkRead,
  onDelete,
}: {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableOpacity style={nStyles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={nStyles.card} activeOpacity={1} onPress={() => {}}>
          <View style={nStyles.header}>
            <Text style={nStyles.headerTitle}>Notificações</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={nStyles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {notifications.length === 0 ? (
            <View style={nStyles.emptyBox}>
              <Text style={nStyles.emptyIcon}>🔔</Text>
              <Text style={nStyles.emptyTitle}>Nenhuma notificação</Text>
              <Text style={nStyles.emptyText}>Você está em dia! Avisaremos por aqui quando algo novo acontecer.</Text>
            </View>
          ) : (
            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
              {notifications.map(n => (
                <TouchableOpacity
                  key={n.id}
                  style={nStyles.notifCard}
                  activeOpacity={0.7}
                  onPress={() => !n.read && onMarkRead(n.id)}
                >
                  <View style={[nStyles.notifDot, !n.read && nStyles.notifDotUnread]} />
                  <View style={{ flex: 1 }}>
                    <Text style={nStyles.notifTitle}>{n.title}</Text>
                    <Text style={nStyles.notifDescription}>{n.description}</Text>
                    <Text style={nStyles.notifTime}>{n.time}</Text>
                  </View>
                  <TouchableOpacity style={nStyles.deleteBtn} onPress={() => onDelete(n.id)}>
                    <Text style={nStyles.deleteBtnText}>✕</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity style={nStyles.closeBtn} onPress={onClose}>
            <Text style={nStyles.closeBtnText}>Fechar</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const nStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  card: { width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 17, fontWeight: '900', color: '#1a2540' },
  closeIcon: { fontSize: 18, color: '#555' },
  emptyBox: { alignItems: 'center', paddingVertical: 28 },
  emptyIcon: { fontSize: 38, marginBottom: 10 },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: '#1a2540', marginBottom: 6 },
  emptyText: { fontSize: 13, color: '#7a8099', textAlign: 'center', lineHeight: 18, paddingHorizontal: 10 },
  notifCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eef0f5' },
  notifDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#dde0ea', marginTop: 6 },
  notifDotUnread: { backgroundColor: '#2e7de1' },
  notifTitle: { fontSize: 13, fontWeight: '800', color: '#1a2540', marginBottom: 2 },
  notifDescription: { fontSize: 12, color: '#4a5068', lineHeight: 17, marginBottom: 4 },
  notifTime: { fontSize: 11, color: '#b0b5c8' },
  deleteBtn: { padding: 4, marginLeft: 4 },
  deleteBtnText: { fontSize: 13, color: '#b0b5c8', fontWeight: '700' },
  closeBtn: { backgroundColor: '#1a2540', borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginTop: 14 },
  closeBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});

// ─── Tela ───────────────────────────────────────────────────────────────────
export default function Home() {
  const { user } = useAuth();
  const { projects } = useProjects();
  const { getRecentTasks } = useTasks();
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(EXAMPLE_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  function handleMarkRead(id: string) {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  }

  function handleDeleteNotification(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

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
            <Logo height={38} />
          </View>
          <TouchableOpacity style={styles.bellBtn} onPress={() => setNotificationsVisible(true)}>
            <Text style={styles.bellIcon}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
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
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(tabs)/projetos',
                params: { abrirTodos: Date.now().toString() },
              })
            }
          >
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
              <TouchableOpacity
                key={p.id}
                style={styles.projectCard}
                onPress={() => setSelectedProject(p as Project)}
                activeOpacity={0.75}
              >
                <View style={styles.donutWrap}>
                  <DonutChart percent={p.progress} />
                  <Text style={styles.donutLabel}>{p.progress}%</Text>
                </View>
                <Text style={styles.projectName} numberOfLines={1}>{p.name.toUpperCase()}</Text>
                <Text style={styles.projectSub}>{p.progress}% COMPLETO</Text>
              </TouchableOpacity>
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
              <TouchableOpacity
                key={t.id}
                style={styles.taskCard}
                onPress={() => setSelectedTaskId(t.id)}
                activeOpacity={0.75}
              >
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
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footerLogo}>
          <Logo height={28} />
        </View>

      </ScrollView>

      {/* Modal de projeto */}
      <ProjectDetailModal
        project={selectedProject}
        visible={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Modal de tarefa */}
      <TaskDetailModal
        taskId={selectedTaskId}
        visible={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />

      {/* Modal de notificações */}
      <NotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onDelete={handleDeleteNotification}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f3f7' },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginBottom: 20 },
  headerLogo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bellBtn: { padding: 4, position: 'relative' },
  bellIcon: { fontSize: 22 },
  bellBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ef4444',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#f2f3f7',
  },
  bellBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
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