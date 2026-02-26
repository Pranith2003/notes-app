import { relations } from "drizzle-orm";
import { user, session, account } from "./auth-schema";
import { notebooks, notes } from "./notebook-schema";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  notebooks: many(notebooks),
}));

export const notebookRelations = relations(notebooks, ({ many, one }) => ({
  notes: many(notes),
  user: one(user, {
    fields: [notebooks.userId],
    references: [user.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  notebook: one(notebooks, {
    fields: [notes.notebookId],
    references: [notebooks.id],
  }),
}));
