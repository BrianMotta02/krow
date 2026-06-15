import React, { createContext, useContext, useState, ReactNode } from 'react';

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

export type TaskPriority = 'alta' | 'media' | 'baixa';
export type TaskStatus = 'a_fazer' | 'em_andamento' | 'concluida';

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

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

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
      status: 'a_fazer',
      createdAt: new Date(),
      checklist: [],
      comments: [],
    };
    setTasks(prev => [...prev, newTask]);
  }

  function updateStatus(id: string, status: TaskStatus) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  }

  function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function getTasksByProject(projectId: string) {
    return tasks.filter(t => t.projectId === projectId);
  }

  function getRecentTasks(limit = 3) {
    return [...tasks]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  function getTask(id: string) {
    return tasks.find(t => t.id === id);
  }

  function toggleChecklistItem(taskId: string, itemId: string) {
    setTasks(prev => prev.map(t =>
      t.id === taskId
        ? { ...t, checklist: t.checklist.map(c => c.id === itemId ? { ...c, done: !c.done } : c) }
        : t
    ));
  }

  function addChecklistItem(taskId: string, text: string) {
    setTasks(prev => prev.map(t =>
      t.id === taskId
        ? { ...t, checklist: [...t.checklist, { id: Date.now().toString(), text, done: false }] }
        : t
    ));
  }

  function addComment(taskId: string, author: string, text: string) {
    setTasks(prev => prev.map(t =>
      t.id === taskId
        ? { ...t, comments: [...t.comments, { id: Date.now().toString(), author, text, createdAt: new Date() }] }
        : t
    ));
  }

  return (
    <TaskContext.Provider value={{
      tasks, addTask, updateStatus, deleteTask,
      getTasksByProject, getRecentTasks, getTask,
      toggleChecklistItem, addChecklistItem, addComment,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);