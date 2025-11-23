import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getWorkplaces,
  createWorkplace,
  updateWorkplace,
  deleteWorkplace,
} from "./api";
import type { Workplace } from "./types";

interface ContextValue {
  workplaces: Workplace[];
  create: (data: Omit<Workplace, "id">) => Promise<void>;
  update: (id: string, data: Omit<Workplace, "id">) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const WorkplaceContext = createContext<ContextValue | null>(null);

export const useWorkplaces = () => {
  const ctx = useContext(WorkplaceContext);
  if (!ctx) throw new Error("useWorkplaces must be used inside provider");
  return ctx;
};

export const WorkplaceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);

  useEffect(() => {
    getWorkplaces().then(setWorkplaces);
  }, []);

  const create = async (data: Omit<Workplace, "id">) => {
    await createWorkplace(data);
    setWorkplaces(await getWorkplaces());
  };

  const update = async (id: string, data: Omit<Workplace, "id">) => {
    await updateWorkplace(id, data);
    setWorkplaces(await getWorkplaces());
  };

  const remove = async (id: string) => {
    await deleteWorkplace(id);
    setWorkplaces(await getWorkplaces());
  };

  return (
    <WorkplaceContext.Provider value={{ workplaces, create, update, remove }}>
      {children}
    </WorkplaceContext.Provider>
  );
};
