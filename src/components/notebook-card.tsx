"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Notebook } from "@/db/schemas/notebook-schema";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Check,
  ChevronDown,
  Globe,
  Link2,
  Loader2,
  Lock,
  LucideIcon,
  Share2,
  Trash2,
} from "lucide-react";
import { deleteNotebook } from "@/server/notebooks";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import AvatarGroupMaxDemo from "./shadcn-studio/avatar/avatar-14";
import { formatRelativeDate } from "@/utils/date-formater";
interface NotebookCardProps {
  notebook: Notebook;
}

export const PERMISSIONS = ["owner", "editor", "commenter", "viewer"] as const;
type Permissions = (typeof PERMISSIONS)[number];

interface GeneralAccess {
  name: string;
  global: boolean;
  description: string;
  icon: LucideIcon;
}
interface People {
  name: string;
  email: string;
  permission: Permissions;
}

export const initialPeople: People[] = [
  {
    name: "You",
    email: "agentp19@gmail.com",
    permission: "owner",
  },
  {
    name: "Pranith Tettabavi",
    email: "pranith.t@example.com",
    permission: "editor",
  },
  {
    name: "Design Team",
    email: "design-team@company.com",
    permission: "editor",
  },
];

const generalAccess: GeneralAccess[] = [
  {
    name: "Restricted",
    description: "Only People with Access Can Open the Link",
    global: false,
    icon: Lock,
  },
  {
    name: "Anyone with the link",
    description: "Anyone on the Internet with the link can view",
    global: true,
    icon: Globe,
  },
];

export default function NotebookCard({ notebook }: NotebookCardProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sharedPeople, setSharedPeople] = useState<People[]>(initialPeople);
  const [selectedAccess, setSelectedAccess] = useState<GeneralAccess>(
    generalAccess[0],
  );
  const [linkPermission, setLinkPermission] = useState("Viewer");

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteNotebook(notebook.id);

      if (response.success) {
        toast.success("Notebook deleted successfully");
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete notebook");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  const handlePermissionChange = (index: number, permission: Permissions) => {
    setSharedPeople((prev) =>
      prev.map((person, i) =>
        i === index ? { ...person, permission } : person,
      ),
    );
  };

  const handleNoteBookShare = async () => {};
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <p>{notebook.name}</p>
            <Dialog>
              <DialogTrigger>
                <div
                  className="hover:cursor-pointer hover:bg-muted p-2 hover:rounded"
                  onClick={handleNoteBookShare}
                >
                  <Share2 className="size-5" />
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="flex gap-2">
                  <DialogTitle>Share '{notebook.name}'</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <Input placeholder="Add email you want to share" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">People with access</p>
                    <div className="flex flex-col gap-2 px-4">
                      {sharedPeople.map((person, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2"
                        >
                          {/* Left */}
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src="" />
                              <AvatarFallback>
                                {person.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
                              <p className="text-sm font-medium">
                                {person.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {person.email}
                              </p>
                            </div>
                          </div>

                          {/* Right */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
                                {person.permission}
                                <ChevronDown className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              {PERMISSIONS.map((perm) => (
                                <DropdownMenuItem
                                  key={perm}
                                  onClick={() =>
                                    handlePermissionChange(index, perm)
                                  }
                                  className="capitalize"
                                >
                                  {perm}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-4">
                    <p className="text-sm font-medium">General access</p>

                    {/* Main Row */}
                    <div className="flex gap-2 items-center justify-between">
                      {/* Left Section (Access Type Dropdown) */}
                      <div className="flex gap-2 items-center">
                        <div className="bg-muted rounded-full p-2">
                          <selectedAccess.icon className="size-5" />
                        </div>
                        <div className="flex flex-col items-start">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <span className="text-sm font-medium flex gap-2 items-center">
                                {selectedAccess.name}
                              </span>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="start" className="w-56">
                              {generalAccess.map((access) => (
                                <DropdownMenuItem
                                  key={access.name}
                                  onClick={() => setSelectedAccess(access)}
                                  className="flex items-center justify-between"
                                >
                                  <span>{access.name}</span>
                                  {selectedAccess.name === access.name && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <p className="text-sm text-muted-foreground font-medium">
                            {selectedAccess.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Section (Permission Dropdown) */}
                      {selectedAccess.global && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 text-sm hover:bg-muted px-2 py-1.5 rounded-md transition">
                              {linkPermission}
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            {["Viewer", "Commenter", "Editor"].map((perm) => (
                              <DropdownMenuItem
                                key={perm}
                                onClick={() => setLinkPermission(perm)}
                              >
                                {perm}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <div className="w-full flex justify-between">
                    <Button variant="outline">
                      <div className="flex items-center gap-2">
                        <Link2 />
                        <p>Copy Link</p>
                      </div>
                    </Button>
                    <Button>Done</Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-end">
        <p className="text-sm">{notebook.notes?.length ?? 0} notes</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-xs text-muted-foreground cursor-default">
                {formatRelativeDate(notebook.createdAt)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              {notebook.createdAt.toLocaleString()}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <AvatarGroupMaxDemo />
        <Link href={`/dashboard/notebook/${notebook.id}`}>
          <Button variant="outline">View</Button>
        </Link>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting}>
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                notebook and all its notes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
