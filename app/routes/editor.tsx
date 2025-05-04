import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Button, Card, TextField, Badge } from "ui";
import { FileDrop } from "~/components/file-drop";
import { getEpub } from "~/sessions/epub.sessions.server";
import { isSessionHeaders } from "~/sessions/sessions.server";
import { parseEpub } from "~/utils/epub.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const result = await getEpub(request);
  if (isSessionHeaders(result)) {
    return redirect("/", result);
  }

  const metadata = await parseEpub(result);

  return metadata;
};

export default function EditorPage() {
  const { title, author, subjects, coverUrl } = useLoaderData<typeof loader>();

  return (
    <Form method="post" action="/editor/save" encType="multipart/form-data">
      <Card className="mx-auto w-full">
        <Card.Header>
          <Card.Title>Edit EPUB</Card.Title>
          <Card.Description>
            Featuring the subject tags, just for your amusement
          </Card.Description>
        </Card.Header>

        <Card.Content className="space-y-6 grid grid-cols-2 gap-4">
          <FileDrop
            title="Upload a cover"
            description="Or drag and drop an image up to 10MB"
            image={coverUrl}
          />
          <div className="flex grid grid-rows-2">
            <TextField label="Title" name="title" defaultValue={title} />
            <TextField label="Author" name="author" defaultValue={author} />
            <div className="h-52 overflow-y-scroll">
              <Badge>Subjects</Badge>
              {subjects.map((sub: string, index: number) => (
                <Badge key={index} intent="secondary">
                  {sub}
                </Badge>
              ))}
            </div>
          </div>
        </Card.Content>

        <Card.Footer>
          <Button type="submit">Save changes</Button>
        </Card.Footer>
      </Card>
    </Form>
  );
}
