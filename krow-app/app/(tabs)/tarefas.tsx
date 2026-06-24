import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { useTasks, Task, TaskPriority } from "../../context/TaskContext";
import { useProjects } from "../../context/ProjectContext";
import { useAuth } from "../../context/AuthContext";
import { maskDate } from "../utils/masks";
import { Logo } from "../../components/logo";

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  alta: "#ef4444",
  media: "#f59e0b",
  baixa: "#22c55e",
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  alta: "ALTA",
  media: "MÉDIA",
  baixa: "BAIXA",
};

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <View
      style={[
        styles.priorityBadge,
        {
          backgroundColor: PRIORITY_COLORS[priority] + "22",
          borderColor: PRIORITY_COLORS[priority],
        },
      ]}
    >
      <Text style={[styles.priorityText, { color: PRIORITY_COLORS[priority] }]}>
        ● {PRIORITY_LABELS[priority]}
      </Text>
    </View>
  );
}

export default function Tarefas() {
  const {
    tasks,
    addTask,
    updateStatus,
    toggleChecklistItem,
    addChecklistItem,
    addComment,
    getTask,
  } = useTasks();
  const { projects } = useProjects();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "a_fazer" | "em_andamento" | "concluida"
  >("a_fazer");
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Form nova tarefa
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("media");
  const [deadline, setDeadline] = useState("");

  // Comentário
  const [newComment, setNewComment] = useState("");
  const [newCheckItem, setNewCheckItem] = useState("");

  const selectedTask = selectedTaskId ? getTask(selectedTaskId) : null;

  const filteredTasks = tasks.filter((t) => t.status === activeTab);

  function handleAddTask() {
    if (!titulo || !projectId || !responsavel || !deadline) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }
    addTask({
      title: titulo,
      description: descricao,
      projectId,
      projectName,
      assignedTo: responsavel,
      priority,
      deadline,
    });
    setTitulo("");
    setDescricao("");
    setProjectId("");
    setProjectName("");
    setResponsavel("");
    setPriority("media");
    setDeadline("");
    setModalAdd(false);
  }

  function openTask(id: string) {
    setSelectedTaskId(id);
    setModalEdit(true);
  }

  function handleAddComment() {
    if (!newComment.trim() || !selectedTaskId) return;
    addComment(selectedTaskId, user?.name ?? "Usuário", newComment.trim());
    setNewComment("");
  }

  function handleAddCheckItem() {
    if (!newCheckItem.trim() || !selectedTaskId) return;
    addChecklistItem(selectedTaskId, newCheckItem.trim());
    setNewCheckItem("");
  }

  const tabs: {
    key: "a_fazer" | "em_andamento" | "concluida";
    label: string;
  }[] = [
    { key: "a_fazer", label: "A fazer" },
    { key: "em_andamento", label: "Em andamento" },
    { key: "concluida", label: "Concluído" },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLogo}>
            <Logo height={38} />
          </View>
        </View>

        <Text style={styles.pageTitle}>KANBAN BOARD</Text>
        <Text style={styles.pageSub}>Toque numa tarefa para ver detalhes</Text>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {tabs.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[
                styles.tabBtn,
                activeTab === t.key && styles.tabBtnActive,
              ]}
              onPress={() => setActiveTab(t.key)}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === t.key && styles.tabBtnTextActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lista de tarefas */}
        <View style={styles.list}>
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Nenhuma tarefa nesta coluna.</Text>
            </View>
          ) : (
            filteredTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => openTask(task.id)}
              >
                <View style={styles.taskCardHeader}>
                  <PriorityBadge priority={task.priority} />
                  <Text style={styles.taskDeadline}>📅 {task.deadline}</Text>
                </View>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDesc} numberOfLines={2}>
                  {task.description}
                </Text>
                <View style={styles.taskFooter}>
                  <Text style={styles.taskProject}>{task.projectName}</Text>
                  <Text style={styles.taskAssigned}>{task.assignedTo}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.footerLogo}>
          <Logo height={28} />
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalAdd(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Modal: Adicionar tarefa */}
      <Modal visible={modalAdd} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalAdd(false)}>
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Nova Tarefa</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>Título: *</Text>
              <TextInput
                style={styles.input}
                placeholder="Título da tarefa"
                placeholderTextColor="#b0b5c8"
                value={titulo}
                onChangeText={setTitulo}
              />

              <Text style={styles.fieldLabel}>Descrição:</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Descrição da tarefa"
                placeholderTextColor="#b0b5c8"
                value={descricao}
                onChangeText={setDescricao}
                multiline
              />

              <Text style={styles.fieldLabel}>Projeto: *</Text>
              {projects.length === 0 ? (
                <Text style={styles.emptyText}>Crie um projeto primeiro.</Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 12 }}
                >
                  {projects.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={[
                        styles.projectChip,
                        projectId === p.id && styles.projectChipActive,
                      ]}
                      onPress={() => {
                        setProjectId(p.id);
                        setProjectName(p.name);
                      }}
                    >
                      <Text
                        style={[
                          styles.projectChipText,
                          projectId === p.id && styles.projectChipTextActive,
                        ]}
                      >
                        {p.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <Text style={styles.fieldLabel}>Responsável: *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome do responsável"
                placeholderTextColor="#b0b5c8"
                value={responsavel}
                onChangeText={setResponsavel}
              />

              <Text style={styles.fieldLabel}>Prioridade:</Text>
              <View style={styles.priorityRow}>
                {(["alta", "media", "baixa"] as TaskPriority[]).map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityChip,
                      priority === p && { backgroundColor: PRIORITY_COLORS[p] },
                    ]}
                    onPress={() => setPriority(p)}
                  >
                    <Text
                      style={[
                        styles.priorityChipText,
                        priority === p && { color: "#fff" },
                      ]}
                    >
                      {PRIORITY_LABELS[p]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Prazo: *</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#b0b5c8"
                value={deadline}
                onChangeText={(text) => setDeadline(maskDate(text))}
                keyboardType="numeric"
                maxLength={10}
              />
              <TouchableOpacity
                style={styles.btnConfirmar}
                onPress={handleAddTask}
              >
                <Text style={styles.btnConfirmarText}>Confirmar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: Editar/ver tarefa */}
      <Modal visible={modalEdit} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedTask && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.editTitle} numberOfLines={1}>
                    {selectedTask.title}
                  </Text>
                  <TouchableOpacity onPress={() => setModalEdit(false)}>
                    <Text style={styles.closeIcon}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Badges */}
                  <View style={styles.badgesRow}>
                    <PriorityBadge priority={selectedTask.priority} />
                    <View style={styles.projectBadge}>
                      <Text style={styles.projectBadgeText}>
                        {selectedTask.projectName}
                      </Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>
                        {selectedTask.status.replace("_", " ").toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Descrição */}
                  <Text style={styles.sectionTitle}>DESCRIÇÃO</Text>
                  <Text style={styles.descText}>
                    {selectedTask.description || "Sem descrição."}
                  </Text>

                  {/* Prazo */}
                  <View style={styles.infoRow}>
                    <View style={styles.infoBox}>
                      <Text style={styles.infoLabel}>PRAZO</Text>
                      <Text style={styles.infoValue}>
                        📅 {selectedTask.deadline}
                      </Text>
                    </View>
                    <View style={styles.infoBox}>
                      <Text style={styles.infoLabel}>CRIADA EM</Text>
                      <Text style={styles.infoValue}>
                        {selectedTask.createdAt.toLocaleDateString("pt-BR")}
                      </Text>
                    </View>
                  </View>

                  {/* Responsável */}
                  <Text style={styles.sectionTitle}>RESPONSÁVEL</Text>
                  <View style={styles.assigneeRow}>
                    <View style={styles.assigneeAvatar}>
                      <Text style={styles.assigneeAvatarText}>
                        {selectedTask.assignedTo
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.assigneeName}>
                      {selectedTask.assignedTo}
                    </Text>
                  </View>

                  {/* Checklist */}
                  <Text style={styles.sectionTitle}>
                    CHECKLIST (
                    {selectedTask.checklist.filter((c) => c.done).length} de{" "}
                    {selectedTask.checklist.length} concluídos)
                  </Text>
                  {selectedTask.checklist.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.checkItem}
                      onPress={() =>
                        toggleChecklistItem(selectedTask.id, item.id)
                      }
                    >
                      <View
                        style={[
                          styles.checkbox,
                          item.done && styles.checkboxDone,
                        ]}
                      >
                        {item.done && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text
                        style={[
                          styles.checkText,
                          item.done && styles.checkTextDone,
                        ]}
                      >
                        {item.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <View style={styles.addRow}>
                    <TextInput
                      style={[styles.input, { flex: 1, marginBottom: 0 }]}
                      placeholder="Novo item..."
                      placeholderTextColor="#b0b5c8"
                      value={newCheckItem}
                      onChangeText={setNewCheckItem}
                    />
                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={handleAddCheckItem}
                    >
                      <Text style={styles.addBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Comentários */}
                  <Text style={styles.sectionTitle}>
                    COMENTÁRIOS ({selectedTask.comments.length})
                  </Text>
                  {selectedTask.comments.map((c) => (
                    <View key={c.id} style={styles.commentCard}>
                      <View style={styles.commentHeader}>
                        <View style={styles.assigneeAvatar}>
                          <Text style={styles.assigneeAvatarText}>
                            {c.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.commentAuthor}>{c.author}</Text>
                          <Text style={styles.commentDate}>
                            {c.createdAt.toLocaleDateString("pt-BR")}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.commentText}>{c.text}</Text>
                    </View>
                  ))}
                  <View style={styles.addRow}>
                    <TextInput
                      style={[styles.input, { flex: 1, marginBottom: 0 }]}
                      placeholder="Adicionar comentário..."
                      placeholderTextColor="#b0b5c8"
                      value={newComment}
                      onChangeText={setNewComment}
                    />
                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={handleAddComment}
                    >
                      <Text style={styles.addBtnText}>→</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Ações */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.btnVoltar}
                      onPress={() => setModalEdit(false)}
                    >
                      <Text style={styles.btnVoltarText}>Voltar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btnConcluir}
                      onPress={() => {
                        updateStatus(selectedTask.id, "concluida");
                        setModalEdit(false);
                      }}
                    >
                      <Text style={styles.btnConcluirText}>
                        Marcar concluída
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f2f3f7" },
  scroll: { paddingHorizontal: 20, paddingBottom: 100 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    marginBottom: 12,
  },
  headerLogo: { flexDirection: "row", alignItems: "center", gap: 8 },
  pageTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1a2540",
    marginBottom: 2,
  },
  pageSub: { fontSize: 12, color: "#7a8099", marginBottom: 16 },
  tabsRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#dde0ea",
    alignItems: "center",
  },
  tabBtnActive: { backgroundColor: "#1e5fc2", borderColor: "#1e5fc2" },
  tabBtnText: { fontSize: 12, fontWeight: "700", color: "#7a8099" },
  tabBtnTextActive: { color: "#fff" },
  list: { gap: 12, marginBottom: 32 },
  emptyBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  emptyText: { color: "#b0b5c8", fontSize: 13 },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#dde0ea",
  },
  taskCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1a2540",
    marginBottom: 4,
  },
  taskDesc: {
    fontSize: 12,
    color: "#7a8099",
    marginBottom: 10,
    lineHeight: 18,
  },
  taskDeadline: { fontSize: 11, color: "#7a8099" },
  taskFooter: { flexDirection: "row", justifyContent: "space-between" },
  taskProject: { fontSize: 11, color: "#2e7de1", fontWeight: "700" },
  taskAssigned: { fontSize: 11, color: "#7a8099" },
  priorityBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  priorityText: { fontSize: 11, fontWeight: "700" },
  footerLogo: { alignItems: "center", gap: 6 },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2e7de1",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  fabIcon: { color: "#fff", fontSize: 30, fontWeight: "300", lineHeight: 34 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  modalContent: {
    flex: 1,
    backgroundColor: "#f2f3f7",
    marginTop: 48,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 16, fontWeight: "900", color: "#1a2540" },
  backIcon: { fontSize: 24, color: "#555" },
  closeIcon: { fontSize: 18, color: "#555" },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1a2540",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#dde0ea",
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: "#1a2540",
    marginBottom: 0,
  },
  projectChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#dde0ea",
    backgroundColor: "#fff",
    marginRight: 8,
  },
  projectChipActive: { backgroundColor: "#1e5fc2", borderColor: "#1e5fc2" },
  projectChipText: { fontSize: 13, fontWeight: "700", color: "#7a8099" },
  projectChipTextActive: { color: "#fff" },
  priorityRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  priorityChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#dde0ea",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  priorityChipText: { fontSize: 12, fontWeight: "700", color: "#7a8099" },
  btnConfirmar: {
    backgroundColor: "#2e7de1",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  btnConfirmarText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  // Editar tarefa
  editTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1a2540",
    flex: 1,
    marginRight: 12,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  projectBadge: {
    backgroundColor: "#2e7de122",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#2e7de1",
  },
  projectBadgeText: { fontSize: 11, fontWeight: "700", color: "#2e7de1" },
  statusBadge: {
    backgroundColor: "#1a254022",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#1a2540",
  },
  statusBadgeText: { fontSize: 11, fontWeight: "700", color: "#1a2540" },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#7a8099",
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 10,
  },
  descText: { fontSize: 13, color: "#4a5068", lineHeight: 20 },
  infoRow: { flexDirection: "row", gap: 12, marginTop: 4 },
  infoBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "#dde0ea",
  },
  infoLabel: {
    fontSize: 10,
    color: "#7a8099",
    fontWeight: "700",
    marginBottom: 4,
  },
  infoValue: { fontSize: 13, color: "#1a2540", fontWeight: "700" },
  assigneeRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  assigneeAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1e5fc2",
    alignItems: "center",
    justifyContent: "center",
  },
  assigneeAvatarText: { color: "#fff", fontSize: 12, fontWeight: "800" },
  assigneeName: { fontSize: 14, fontWeight: "700", color: "#1a2540" },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#dde0ea",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: "#2e7de1", borderColor: "#2e7de1" },
  checkmark: { color: "#fff", fontSize: 12, fontWeight: "900" },
  checkText: { fontSize: 13, color: "#1a2540", flex: 1 },
  checkTextDone: { textDecorationLine: "line-through", color: "#b0b5c8" },
  addRow: { flexDirection: "row", gap: 8, marginTop: 8, marginBottom: 4 },
  addBtn: {
    backgroundColor: "#2e7de1",
    borderRadius: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  commentCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: "#dde0ea",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  commentAuthor: { fontSize: 13, fontWeight: "700", color: "#1a2540" },
  commentDate: { fontSize: 11, color: "#7a8099" },
  commentText: { fontSize: 13, color: "#4a5068", lineHeight: 18 },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  btnVoltar: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#dde0ea",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  btnVoltarText: { fontSize: 14, fontWeight: "700", color: "#1a2540" },
  btnConcluir: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: "#2e7de1",
    alignItems: "center",
  },
  btnConcluirText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
