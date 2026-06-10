import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Task = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  assignedTo: string; // nome do responsável
  status: 'pendente' | 'em_andamento' | 'concluida';
  createdAt: Date;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (
    title: string,
    description: string,
    projectId: string,
    projectName: string,
    assignedTo: string
  ) => void;
  updateStatus: (id: string, status: Task['status']) => void;
  deleteTask: (id: string) => void;
  getTasksByProject: (projectId: string) => Task[];
  getRecentTasks: (limit?: number) => Task[];
};

const TaskContext = createContext<TaskContextType>({} as TaskContextType);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  function addTask(
    title: string,
    description: string,
    projectId: string,
    projectName: string,
    assignedTo: string
  ) {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      projectId,
      projectName,
      assignedTo,
      status: 'pendente',
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  }

  function updateStatus(id: string, status: Task['status']) {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, status } : t)
    );
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

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateStatus, deleteTask, getTasksByProject, getRecentTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);