import React, { createContext, useContext, useState, ReactNode } from "react";

export type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

export type Comment = {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
};

export type TaskPriority = "alta" | "media" | "baixa";
export type TaskStatus = "a_fazer" | "em_andamento" | "concluida";

export type Task = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  assignedTo: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  createdAt: Date;
  checklist: ChecklistItem[];
  comments: Comment[];
};

type TaskContextType = {
  tasks: Task[];
  addTask: (data: {
    title: string;
    description: string;
    projectId: string;
    projectName: string;
    assignedTo: string;
    priority: TaskPriority;
    deadline: string;
  }) => void;
  updateStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  getTasksByProject: (projectId: string) => Task[];
  getRecentTasks: (limit?: number) => Task[];
  getTask: (id: string) => Task | undefined;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  addChecklistItem: (taskId: string, text: string) => void;
  addComment: (taskId: string, author: string, text: string) => void;
};

const TaskContext = createContext<TaskContextType>({} as TaskContextType);

const MOCK_TASKS: Task[] = [
  // CALZOON
  {
    id: "101",
    title: "Atualização do Sistema de Design",
    description:
      "Revisar e atualizar todos os componentes do design system da Calzoon, alinhando com a nova identidade visual aprovada.",
    projectId: "1",
    projectName: "CALZOON",
    assignedTo: "Igor",
    priority: "alta",
    status: "em_andamento",
    deadline: "15/06/2026",
    createdAt: new Date("2026-06-20"),
    checklist: [
      { id: "c1", text: "Revisar paleta de cores", done: true },
      { id: "c2", text: "Atualizar tipografia", done: true },
      { id: "c3", text: "Redesenhar componentes de botão", done: false },
      { id: "c4", text: "Documentar no Figma", done: false },
    ],
    comments: [
      {
        id: "cm1",
        author: "Brian",
        text: "Já rodei o teste no sandbox, parece estável. Falta só validar produção.",
        createdAt: new Date("2026-06-20"),
      },
      {
        id: "cm2",
        author: "Igor",
        text: "Vou terminar os componentes de botão hoje à tarde.",
        createdAt: new Date("2026-06-21"),
      },
    ],
  },
  {
    id: "102",
    title: "Redesign da Marca",
    description:
      "Criação do novo logotipo e manual de marca para a Calzoon, incluindo variações para digital e impresso.",
    projectId: "1",
    projectName: "CALZOON",
    assignedTo: "Carlos Eduardo",
    priority: "media",
    status: "a_fazer",
    deadline: "30/06/2026",
    createdAt: new Date("2026-06-19"),
    checklist: [
      { id: "c5", text: "Pesquisa de referências", done: true },
      { id: "c6", text: "Apresentar 3 propostas ao cliente", done: false },
      { id: "c7", text: "Desenvolver manual de marca", done: false },
    ],
    comments: [
      {
        id: "cm3",
        author: "Brian",
        text: "Cliente pediu algo mais minimalista. Leva isso em conta nas propostas.",
        createdAt: new Date("2026-06-19"),
      },
      {
        id: "cm4",
        author: "Carlos Eduardo",
        text: "Entendido, já estou ajustando as referências.",
        createdAt: new Date("2026-06-20"),
      },
    ],
  },
  // LA BOLARIA
  {
    id: "201",
    title: "Homologação e Controle de Qualidade (QA)",
    description:
      "Executar todos os testes de QA no ambiente de homologação antes do deploy em produção.",
    projectId: "2",
    projectName: "LA BOLARIA",
    assignedTo: "Felipe",
    priority: "alta",
    status: "a_fazer",
    deadline: "10/06/2026",
    createdAt: new Date("2026-06-18"),
    checklist: [
      { id: "c8", text: "Testar fluxo de autenticação", done: true },
      { id: "c9", text: "Testar responsividade mobile", done: true },
      { id: "c10", text: "Validar formulários", done: false },
      { id: "c11", text: "Testar integração com API", done: false },
    ],
    comments: [
      {
        id: "cm5",
        author: "Brian",
        text: "Atenção ao timeout de 30s no webhook — já deu problema antes.",
        createdAt: new Date("2026-06-18"),
      },
      {
        id: "cm6",
        author: "Felipe",
        text: "Anotado, vou monitorar durante os testes de integração.",
        createdAt: new Date("2026-06-19"),
      },
    ],
  },
  {
    id: "202",
    title: "Atualizar dashboard NEXTDROPBG",
    description:
      "Adicionar métrica de conversão semanal por canal no dashboard principal.",
    projectId: "2",
    projectName: "LA BOLARIA",
    assignedTo: "Carlos Eduardo",
    priority: "media",
    status: "em_andamento",
    deadline: "18/06/2026",
    createdAt: new Date("2026-06-17"),
    checklist: [
      { id: "c12", text: "Mapear fontes de dados", done: true },
      { id: "c13", text: "Criar queries de conversão", done: false },
      { id: "c14", text: "Implementar gráfico no dashboard", done: false },
    ],
    comments: [
      {
        id: "cm7",
        author: "Brian",
        text: "O cliente quer ver conversão por canal: orgânico, pago e direto.",
        createdAt: new Date("2026-06-17"),
      },
      {
        id: "cm8",
        author: "Carlos Eduardo",
        text: "Já mapeei as fontes, começando as queries amanhã.",
        createdAt: new Date("2026-06-18"),
      },
    ],
  },
  // NEXTDROPBG
  {
    id: "301",
    title: "Revisar API de pagamento",
    description:
      "Validar integração com gateway de pagamento antes do deploy de quinta-feira. Conferir webhooks de confirmação, retry policy e logs de erro no Sentry.",
    projectId: "3",
    projectName: "NEXTDROPBG",
    assignedTo: "Brian",
    priority: "alta",
    status: "a_fazer",
    deadline: "12/06/2026",
    createdAt: new Date("2026-06-16"),
    checklist: [
      { id: "c15", text: "Testar fluxo de cartão de crédito", done: true },
      { id: "c16", text: "Validar webhook de confirmação", done: true },
      { id: "c17", text: "Conferir logs no Sentry", done: false },
      { id: "c18", text: "Documentar retry policy", done: false },
    ],
    comments: [
      {
        id: "cm9",
        author: "Brian",
        text: "Já rodei o teste no sandbox, parece estável. Falta só validar produção.",
        createdAt: new Date("2026-06-16"),
      },
      {
        id: "cm10",
        author: "Felipe",
        text: "Posso ajudar com os logs do Sentry se precisar.",
        createdAt: new Date("2026-06-17"),
      },
    ],
  },
  {
    id: "302",
    title: "Onboarding cliente LA BOLARIA",
    description:
      "Preparar deck de apresentação e cronograma inicial para reunião de onboarding do cliente.",
    projectId: "3",
    projectName: "NEXTDROPBG",
    assignedTo: "Igor",
    priority: "baixa",
    status: "concluida",
    deadline: "22/06/2026",
    createdAt: new Date("2026-06-15"),
    checklist: [
      { id: "c19", text: "Criar deck de apresentação", done: true },
      { id: "c20", text: "Definir cronograma", done: true },
      { id: "c21", text: "Enviar para aprovação interna", done: true },
    ],
    comments: [
      {
        id: "cm11",
        author: "Igor",
        text: "Deck finalizado e aprovado internamente.",
        createdAt: new Date("2026-06-15"),
      },
      {
        id: "cm12",
        author: "Brian",
        text: "Ótimo trabalho! Cliente adorou a apresentação.",
        createdAt: new Date("2026-06-16"),
      },
    ],
  },
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  function addTask(data: {
    title: string;
    description: string;
    projectId: string;
    projectName: string;
    assignedTo: string;
    priority: TaskPriority;
    deadline: string;
  }) {
    const newTask: Task = {
      id: Date.now().toString(),
      ...data,
      status: "a_fazer",
      createdAt: new Date(),
      checklist: [],
      comments: [],
    };
    setTasks((prev) => [...prev, newTask]);
  }

  function updateStatus(id: string, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function getTasksByProject(projectId: string) {
    return tasks.filter((t) => t.projectId === projectId);
  }

  function getRecentTasks(limit = 3) {
    return [...tasks]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  function getTask(id: string) {
    return tasks.find((t) => t.id === id);
  }

  function toggleChecklistItem(taskId: string, itemId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              checklist: t.checklist.map((c) =>
                c.id === itemId ? { ...c, done: !c.done } : c,
              ),
            }
          : t,
      ),
    );
  }

  function addChecklistItem(taskId: string, text: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              checklist: [
                ...t.checklist,
                { id: Date.now().toString(), text, done: false },
              ],
            }
          : t,
      ),
    );
  }

  function addComment(taskId: string, author: string, text: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              comments: [
                ...t.comments,
                {
                  id: Date.now().toString(),
                  author,
                  text,
                  createdAt: new Date(),
                },
              ],
            }
          : t,
      ),
    );
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateStatus,
        deleteTask,
        getTasksByProject,
        getRecentTasks,
        getTask,
        toggleChecklistItem,
        addChecklistItem,
        addComment,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
