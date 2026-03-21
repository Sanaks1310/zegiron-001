import { createContext, useContext, useState, ReactNode } from "react";
import { mapContacts } from "@/data/mockData";

export interface Contact {
  id: string;
  x: number;
  y: number;
  speed?: string;
  type: "hostile" | "unknown" | "friendly";
  label?: string;
}

interface SelectedContactContextType {
  selected: Contact;
  setSelected: (c: Contact) => void;
}

const SelectedContactContext = createContext<SelectedContactContextType | null>(null);

export function SelectedContactProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Contact>(mapContacts[0]);
  return (
    <SelectedContactContext.Provider value={{ selected, setSelected }}>
      {children}
    </SelectedContactContext.Provider>
  );
}

export function useSelectedContact() {
  const ctx = useContext(SelectedContactContext);
  if (!ctx) throw new Error("useSelectedContact must be used within SelectedContactProvider");
  return ctx;
}
