import * as authSchema from "@/db/schemas/auth-schema";
import * as notebookSchema from "@/db/schemas/notebook-schema";
export const schema = {
  ...authSchema,
  ...notebookSchema,
};
