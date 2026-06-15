import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Project = {
  id: string;
  name: string;
  description: string;
  manager: string;
  startDate: string;
  endDate: string;
  progress: number;
  members: string[];
  createdAt: Date;
};

type ProjectContextType = {
  projects: Project[];
  addProject: (data: {
    name: string;
    description: string;
    manager: string;
    startDate: string;
    endDate: string;
  }) => void;
  updateProgress: (id: string, progress: number) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  addMember: (projectId: string, member: string) => void;
};

const ProjectContext = createContext<ProjectContextType>({} as ProjectContextType);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);

  function addProject(data: {
    name: string;
    description: string;
    manager: string;
    startDate: string;
    endDate: string;
  }) {
    const newProject: Project = {
      id: Date.now().toString(),
      ...data,
      progress: 0,
      members: [],
      createdAt: new Date(),
    };
    setProjects(prev => [...prev, newProject]);
  }

  function updateProgress(id: string, progress: number) {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, progress } : p));
  }

  function deleteProject(id: string) {
    setProjects(prev => prev.filter(p => p.id !== id));
  }

  function getProject(id: string) {
    return projects.find(p => p.id === id);
  }

  function addMember(projectId: string, member: string) {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, members: [...p.members, member] } : p
    ));
  }

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProgress, deleteProject, getProject, addMember }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => useContext(ProjectContext);