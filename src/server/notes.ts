"use server";

import { db } from "@/db/drizzle";
import { InsertNotes, notes } from "@/db/schemas/notebook-schema";
import { eq } from "drizzle-orm";

export const createNotes = async (values: InsertNotes) => {
  try {
    console.log(values);
    await db.insert(notes).values(values);
    return {
      success: true,
      message: "Notes saved Successfully",
    };
  } catch (error) {
    const e = error as Error;
    console.log(error);
    return {
      success: false,
      message: e.message || `Failed to save ${values.title} Notes`,
    };
  }
};

export const getNoteById = async (id: string) => {
  try {
    const note = await db.query.notes.findFirst({
      where: eq(notes.id, id),
      with: {
        notebook: true,
      },
    });

    return { success: true, note };
  } catch {
    return { success: false, message: "Failed to get notebook" };
  }
};

export const updateNote = async (id: string, values: Partial<InsertNotes>) => {
  try {
    await db.update(notes).set(values).where(eq(notes.id, id));
    return { success: true, message: "Notebook updated successfully" };
  } catch {
    return { success: false, message: "Failed to update notebook" };
  }
};

export const deleteNote = async (id: string) => {
  try {
    await db.delete(notes).where(eq(notes.id, id));
    return {
      success: true,
      message: "Notes Deleted Successfully",
    };
  } catch (error) {
    const e = error as Error;
    console.log(error);
    return {
      success: false,
      message: e.message || `Failed to delete Notes`,
    };
  }
};
