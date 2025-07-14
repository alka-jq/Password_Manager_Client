import { RootState } from "@/store";
import { Card } from "../Slices/cardSlice";
import { Task } from "../Slices/taskSlice";
import { Identity } from "../Slices/identitySlice";

type CombinedItem = (Card | Task | Identity) & { type: "card" | "task" | "identity" };

export const selectCombinedItems = (state: RootState): CombinedItem[] => {
  const cards: CombinedItem[] = state.card.cards.map((c) => ({
    ...c,
    type: "card",
  }));

  const tasks: CombinedItem[] = state.task.tasks.map((t) => ({
    ...t,
    type: "task",
  }));

  const identities: CombinedItem[] = state.identity.identities.map((i) => ({
    ...i,
    type: "identity",
  }));

  return [...tasks, ...cards, ...identities].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};
