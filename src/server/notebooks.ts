"use server";

import { db } from "@/db/drizzle";
import { InsertNoteBooks, notebooks } from "@/db/schemas/notebook-schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export const createNoteBook = async (values: InsertNoteBooks) => {
  try {
    console.log(values);
    await db.insert(notebooks).values(values);
    return {
      success: true,
      message: "NoteBook saved Successfully",
    };
  } catch (error) {
    const e = error as Error;
    console.log(error);
    return {
      success: false,
      message: e.message || `Failed to save ${values.name} NoteBook`,
    };
  }
};

export const getNoteBooks = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user.id;
    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }
    const notebooksByUser = await db.query.notebooks.findMany({
      where: eq(notebooks.userId, userId),
      with: {
        notes: true,
      },
    });

    console.log(notebooksByUser);
    return {
      success: true,
      notebooks: notebooksByUser,
    };
  } catch (error) {
    const e = error as Error;
    console.log(error);
    return {
      success: false,
      message: e.message || `Failed to save ${name} NoteBook`,
    };
  }
};

export const getNoteBookById = async (id: string) => {
  try {
    const notebook = await db.query.notebooks.findFirst({
      where: eq(notebooks.id, id),
      with: {
        notes: true,
      },
    });
    return {
      success: true,
      notebook: notebook,
    };
  } catch (error) {
    const e = error as Error;
    console.log(error);
    return {
      success: false,
      message: e.message || `Failed to save ${name} NoteBook`,
    };
  }
};

export const updateNoteBook = async (id: string, values: InsertNoteBooks) => {
  try {
    await db.update(notebooks).set(values).where(eq(notebooks.id, id));
    return {
      success: true,
      message: "NoteBook Updated Successfully",
    };
  } catch (error) {
    const e = error as Error;
    console.log(error);
    return {
      success: false,
      message: e.message || `Failed to save ${values.name} NoteBook`,
    };
  }
};

export const deleteNotebook = async (id: string) => {
  try {
    await db.delete(notebooks).where(eq(notebooks.id, id));
    return { success: true, message: "Notebook deleted successfully" };
  } catch {
    return { success: false, message: "Failed to delete notebook" };
  }
};
