import React, { useEffect, useState } from "react";
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
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useLocalSearchParams } from "expo-router";
import { useProjects } from "../../context/ProjectContext";
import { maskDate } from "../utils/masks";
import { Logo } from "../../components/logo";

function DonutChart({
  percent,
  size = 70,
}: {
  percent: number;
  size?: number;
}) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;
  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e0e0e0"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#1a2540"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${filled} ${circumference - filled}`}
        strokeDashoffset={circumference / 4}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─── Tipo Project ─────────────────────────────────────────────────────────────
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

// ─── Modal de detalhes do projeto ────────────────────────────────────────────
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
      <TouchableOpacity
        style={detailStyles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={detailStyles.card}
          activeOpacity={1}
          onPress={() => {}}
        >
          {/* Topo com nome e donut */}
          <View style={detailStyles.topBar}>
            <View style={detailStyles.topInfo}>
              <Text style={detailStyles.projectName}>{project.name}</Text>
              <Text style={detailStyles.managerLabel}>GP · {project.manager}</Text>
            </View>
            <View style={detailStyles.donutWrap}>
              <DonutChart percent={project.progress} size={72} />
              <Text style={detailStyles.donutLabel}>{project.progress}%</Text>
            </View>
          </View>

          {/* Barra de progresso */}
          <View style={detailStyles.progressBar}>
            <View
              style={[detailStyles.progressFill, { width: `${project.progress}%` }]}
            />
          </View>
          <Text style={detailStyles.progressText}>{project.progress}% concluído</Text>

          {/* Datas */}
          <View style={detailStyles.datesRow}>
            <View style={detailStyles.dateBox}>
              <Text style={detailStyles.dateLabel}>Início</Text>
              <Text style={detailStyles.dateValue}>{project.startDate}</Text>
            </View>
            <View style={detailStyles.dateDivider} />
            <View style={detailStyles.dateBox}>
              <Text style={detailStyles.dateLabel}>Entrega</Text>
              <Text style={detailStyles.dateValue}>{project.endDate}</Text>
            </View>
          </View>

          {/* Descrição */}
          {!!project.description && (
            <View style={detailStyles.descBox}>
              <Text style={detailStyles.sectionLabel}>Descrição</Text>
              <Text style={detailStyles.descText}>{project.description}</Text>
            </View>
          )}

          {/* Membros */}
          {project.members && project.members.length > 0 && (
            <View style={detailStyles.membersSection}>
              <Text style={detailStyles.sectionLabel}>Membros</Text>
              <View style={detailStyles.membersRow}>
                {project.members.map((m, i) => (
                  <View
                    key={i}
                    style={[detailStyles.memberAvatar, { marginLeft: i > 0 ? -8 : 0 }]}
                  >
                    <Text style={detailStyles.memberAvatarText}>{getInitials(m)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity style={detailStyles.closeBtn} onPress={onClose}>
            <Text style={detailStyles.closeBtnText}>Fechar</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const detailStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  topInfo: { flex: 1, paddingRight: 12 },
  projectName: { fontSize: 18, fontWeight: "900", color: "#1a2540", marginBottom: 4 },
  managerLabel: { fontSize: 13, color: "#7a8099" },
  donutWrap: { position: "relative", alignItems: "center", justifyContent: "center" },
  donutLabel: { position: "absolute", fontSize: 13, fontWeight: "900", color: "#1a2540" },
  progressBar: { height: 6, backgroundColor: "#e0e0e0", borderRadius: 4, marginBottom: 6 },
  progressFill: { height: 6, backgroundColor: "#2e7de1", borderRadius: 4 },
  progressText: { fontSize: 11, color: "#7a8099", marginBottom: 16 },
  datesRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f3f7",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  dateBox: { flex: 1, alignItems: "center" },
  dateLabel: { fontSize: 11, color: "#7a8099", marginBottom: 4 },
  dateValue: { fontSize: 14, fontWeight: "800", color: "#1a2540" },
  dateDivider: { width: 1, height: 32, backgroundColor: "#dde0ea" },
  descBox: { backgroundColor: "#f2f3f7", borderRadius: 12, padding: 14, marginBottom: 14 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7a8099",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  descText: { fontSize: 13, color: "#1a2540", lineHeight: 19 },
  membersSection: { marginBottom: 14 },
  membersRow: { flexDirection: "row", marginTop: 8 },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1e5fc2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  memberAvatarText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  closeBtn: {
    backgroundColor: "#1a2540",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 4,
  },
  closeBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});

export default function Projetos() {
  const { abrirTodos } = useLocalSearchParams<{ abrirTodos?: string }>();
  const { projects, addProject } = useProjects();
  const [modalVerTodos, setModalVerTodos] = useState(false);
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [gerente, setGerente] = useState("");

  useEffect(() => {
    if (abrirTodos) {
      setModalVerTodos(true);
    }
  }, [abrirTodos]);

  function handleAddProject() {
    if (!nome || !dataInicio || !dataEntrega || !gerente) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }
    addProject({
      name: nome,
      description: descricao,
      manager: gerente,
      startDate: dataInicio,
      endDate: dataEntrega,
    });
    setNome("");
    setDescricao("");
    setDataInicio("");
    setDataEntrega("");
    setGerente("");
    setModalAdicionar(false);
  }

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

        {/* Botão ver todos */}
        <TouchableOpacity
          style={styles.btnVerTodos}
          onPress={() => setModalVerTodos(true)}
        >
          <Text style={styles.btnVerTodosText}>Todos os projetos</Text>
        </TouchableOpacity>

        {/* Lista de projetos */}
        <View style={styles.list}>
          {projects.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Nenhum projeto criado ainda.</Text>
              <Text style={styles.emptyText}>
                Use o botão + para adicionar.
              </Text>
            </View>
          ) : (
            projects.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.projectRow}
                onPress={() => setSelectedProject(p as Project)}
                activeOpacity={0.75}
              >
                <View style={styles.donutWrap}>
                  <DonutChart percent={p.progress} />
                  <Text style={styles.donutLabel}>{p.progress}%</Text>
                </View>
                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>{p.name}</Text>
                  <Text style={styles.projectManager}>GP - {p.manager}</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, { width: `${p.progress}%` }]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Footer */}
        <View style={styles.footerLogo}>
          <Logo height={28} />
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalAdicionar(true)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Pop-up detalhe do projeto */}
      <ProjectDetailModal
        project={selectedProject}
        visible={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Modal: Ver todos (grid) */}
      <Modal visible={modalVerTodos} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVerTodos(false)}>
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
              <View style={styles.headerLogo}>
                <Logo height={38} />
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.grid}>
                {projects.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.gridCard}
                    onPress={() => {
                      setModalVerTodos(false);
                      setSelectedProject(p as Project);
                    }}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.gridName}>{p.name}</Text>
                    <View style={styles.gridDonutWrap}>
                      <DonutChart percent={p.progress} size={80} />
                      <Text style={styles.gridDonutLabel}>{p.progress}%</Text>
                    </View>
                    <Text style={styles.gridDates}>{p.startDate}</Text>
                    <Text style={styles.gridDates}>{p.endDate}</Text>
                    <View style={styles.membersRow}>
                      {p.members.slice(0, 4).map((m, i) => (
                        <View
                          key={i}
                          style={[
                            styles.memberAvatar,
                            { marginLeft: i > 0 ? -8 : 0 },
                          ]}
                        >
                          <Text style={styles.memberAvatarText}>
                            {getInitials(m)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                ))}
                {/* Card de adicionar no grid */}
                <TouchableOpacity
                  style={[styles.gridCard, styles.gridCardAdd]}
                  onPress={() => {
                    setModalVerTodos(false);
                    setModalAdicionar(true);
                  }}
                >
                  <Text style={styles.gridAddIcon}>+</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: Adicionar projeto */}
      <Modal visible={modalAdicionar} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalAdicionar(false)}>
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
              <View style={styles.headerLogo}>
                <Logo height={38} />
              </View>
            </View>

            <TouchableOpacity style={styles.btnVerTodos} onPress={() => {}}>
              <Text style={styles.btnVerTodosText}>Adicione um projeto</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>Nome do projeto:</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o nome do projeto"
                placeholderTextColor="#b0b5c8"
                value={nome}
                onChangeText={setNome}
              />

              <Text style={styles.fieldLabel}>Data de início:</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#b0b5c8"
                value={dataInicio}
                onChangeText={(text) => setDataInicio(maskDate(text))}
                keyboardType="numeric"
                maxLength={10}
              />

              <Text style={styles.fieldLabel}>Data de entrega:</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#b0b5c8"
                value={dataEntrega}
                onChangeText={(text) => setDataEntrega(maskDate(text))}
                keyboardType="numeric"
                maxLength={10}
              />
              <Text style={styles.fieldLabel}>Gerente do projeto:</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite quem é o gerente do projeto"
                placeholderTextColor="#b0b5c8"
                value={gerente}
                onChangeText={setGerente}
              />

              <TouchableOpacity
                style={styles.btnConfirmar}
                onPress={handleAddProject}
              >
                <Text style={styles.btnConfirmarText}>Confirmar</Text>
              </TouchableOpacity>
            </ScrollView>
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
    marginBottom: 20,
  },
  headerLogo: { flexDirection: "row", alignItems: "center", gap: 8 },
  btnVerTodos: {
    backgroundColor: "#2e7de1",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  btnVerTodosText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  list: { gap: 16, marginBottom: 32 },
  emptyBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  emptyText: { color: "#b0b5c8", fontSize: 13, marginBottom: 4 },
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    gap: 14,
    borderWidth: 1.5,
    borderColor: "#dde0ea",
  },
  donutWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  donutLabel: {
    position: "absolute",
    fontSize: 13,
    fontWeight: "900",
    color: "#1a2540",
  },
  projectInfo: { flex: 1 },
  projectName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1a2540",
    marginBottom: 2,
  },
  projectManager: { fontSize: 12, color: "#7a8099", marginBottom: 8 },
  progressBar: { height: 4, backgroundColor: "#e0e0e0", borderRadius: 4 },
  progressFill: { height: 4, backgroundColor: "#2e7de1", borderRadius: 4 },
  footerLogo: { alignItems: "center", gap: 6, marginTop: 8 },
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
  backIcon: { fontSize: 24, color: "#555" },
  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  gridCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#dde0ea",
    alignItems: "center",
  },
  gridCardAdd: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2e7de1",
  },
  gridAddIcon: { fontSize: 40, color: "#fff", fontWeight: "300" },
  gridName: {
    fontSize: 13,
    fontWeight: "900",
    color: "#1a2540",
    marginBottom: 8,
    textAlign: "center",
  },
  gridDonutWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  gridDonutLabel: {
    position: "absolute",
    fontSize: 14,
    fontWeight: "900",
    color: "#1a2540",
  },
  gridDates: { fontSize: 10, color: "#7a8099" },
  membersRow: { flexDirection: "row", marginTop: 8 },
  memberAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#1e5fc2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  memberAvatarText: { color: "#fff", fontSize: 9, fontWeight: "800" },
  // Form
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
  },
  btnConfirmar: {
    backgroundColor: "#2e7de1",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  btnConfirmarText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
