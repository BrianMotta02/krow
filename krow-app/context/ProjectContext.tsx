import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Project = {
  id: string;
  name: string;
  description: string;
  progress: number; // 0 a 100
  createdAt: Date;
};

type ProjectContextType = {
  projects: Project[];
  addProject: (name: string, description: string) => void;
  updateProgress: (id: string, progress: number) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
};

const ProjectContext = createContext<ProjectContextType>({} as ProjectContextType);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);

  function addProject(name: string, description: string) {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      progress: 0,
      createdAt: new Date(),
    };
    setProjects(prev => [...prev, newProject]);
  }

  function updateProgress(id: string, progress: number) {
    setProjects(prev =>
      prev.map(p => p.id === id ? { ...p, progress } : p)
    );
  }

  function deleteProject(id: string) {
    setProjects(prev => prev.filter(p => p.id !== id));
  }

  function getProject(id: string) {
    return projects.find(p => p.id === id);
  }

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProgress, deleteProject, getProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => useContext(ProjectContext);