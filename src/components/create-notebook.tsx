"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import { createNoteBook } from "@/server/notebooks";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(4),
});

export const CreateNoteBook = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { register, handleSubmit, reset } = useForm<z.infer<typeof formSchema>>(
    {
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
      },
    },
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const toastId = toast.loading("Creating NoteBook");
    try {
      setIsLoading(true);
      const userId = (await authClient.getSession()).data?.user.id;
      if (!userId) {
        toast.error("User must be logged in to create a notebook", {
          id: toastId,
        });
        return;
      }
      const response = await createNoteBook({
        ...data,
        userId,
      });
      console.log(response);
      if (response.success) {
        toast.success(response.message, { id: toastId });
        setIsOpen(false);
      } else {
        toast.error(response.message, { id: toastId });
      }
    } catch (error) {
      console.log(error);
    } finally {
      reset();
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create NoteBook</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Notebook?</DialogTitle>
          <DialogDescription>
            Create a new Notebook to store notes..
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...register("name")}
                id="name"
                type="text"
                placeholder="NoteBook Name"
                required
              />
            </Field>
          </FieldGroup>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
