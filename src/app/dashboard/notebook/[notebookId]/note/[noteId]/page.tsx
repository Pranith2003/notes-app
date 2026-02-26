import { PageWrapper } from "@/components/page-wrapper";
import RichTextEditor from "@/components/rich-text-editor";
import { getNoteById } from "@/server/notes";
import { formatRelativeDate } from "@/utils/date-formater";
import { JSONContent } from "@tiptap/react";

type Params = Promise<{
  noteId: string;
}>;

export default async function NotePage({ params }: { params: Params }) {
  const { noteId } = await params;
  const { note } = await getNoteById(noteId);

  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        {
          label: note?.notebook?.name ?? "Notebook",
          href: `/dashboard/notebook/${note?.notebook?.id}`,
        },
        { label: note?.title ?? "Note", href: `/dashboard/note/${noteId}` },
      ]}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 border-b pb-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            {note?.title}
          </h1>
          <p
            className="text-sm text-muted-foreground"
            title={note?.updatedAt.toLocaleString()}
          >
            Last updated {note?.updatedAt && formatRelativeDate(note.updatedAt)}
          </p>
        </div>
        <div className="pt-2">
          <RichTextEditor
            content={note?.content as JSONContent[]}
            noteId={noteId}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
