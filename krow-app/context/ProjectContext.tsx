import React, { createContext, useContext, useState, ReactNode } from "react";

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

const ProjectContext = createContext<ProjectContextType>(
  {} as ProjectContextType,
);

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "CALZOON",
    description: "Projeto de redesign da identidade visual da marca Calzoon.",
    manager: "Brian",
    startDate: "01/01/2026",
    endDate: "30/06/2026",
    progress: 40,
    members: ["Brian", "Igor", "Carlos Eduardo"],
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "2",
    name: "LA BOLARIA",
    description: "Desenvolvimento do novo site institucional da La Bolaria.",
    manager: "Brian",
    startDate: "15/02/2026",
    endDate: "15/07/2026",
    progress: 70,
    members: ["Brian", "Carlos Eduardo", "Felipe"],
    createdAt: new Date("2026-02-15"),
  },
  {
    id: "3",
    name: "NEXTDROPBG",
    description: "Plataforma de drops exclusivos para colecionadores.",
    manager: "Brian",
    startDate: "01/03/2026",
    endDate: "01/08/2026",
    progress: 90,
    members: ["Brian", "Felipe", "Igor"],
    createdAt: new Date("2026-03-01"),
  },
];

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

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
    setProjects((prev) => [...prev, newProject]);
  }

  function updateProgress(id: string, progress: number) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, progress } : p)),
    );
  }

  function deleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  function getProject(id: string) {
    return projects.find((p) => p.id === id);
  }

  function addMember(projectId: string, member: string) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, members: [...p.members, member] } : p,
      ),
    );
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProgress,
        deleteProject,
        getProject,
        addMember,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => useContext(ProjectContext);
