import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const notebooks = pgTable("notebooks", {
  id: text("id ").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const notes = pgTable("notes", {
  id: text("id ").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: jsonb("content").notNull(),
  notebookId: text("notebook_id").references(() => notebooks.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const notebookRelations = relations(notebooks, ({ many }) => ({
  notes: many(notes),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  notebook: one(notebooks, {
    fields: [notes.notebookId],
    references: [notebooks.id],
  }),
}));

export type NoteBook = typeof notebooks.$inferSelect;
export type InsertNoteBooks = typeof notebooks.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type InsertNotes = typeof notes.$inferInsert;

export type Notebook = typeof notebooks.$inferSelect & {
  notes: Note[];
};
