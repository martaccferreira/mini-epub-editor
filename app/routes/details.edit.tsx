import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Button, Card, TextField, Badge } from "ui";
import { FileDrop } from "~/components/file-drop";
import { getSessionMetadata, isSessionRedirect } from "~/sessions.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const result = await getSessionMetadata(request);

  if (isSessionRedirect(result)) {
    return redirect("/", result);
  }

  return result;
};

export default function DetailsPage() {
  const { title, author, subjects, coverUrl } = useLoaderData<typeof loader>();

  return (
    <form method="post" action="/save">
      <Card className="mx-auto w-full">
        <Card.Header>
          <Card.Title>Edit EPUB</Card.Title>
          <Card.Description>
            Don't loose the level, just keep on going.
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
    </form>
  );
}
