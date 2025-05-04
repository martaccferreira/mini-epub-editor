import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { IconArrowWallDown, IconCircleCheck } from "justd-icons";
import { useState } from "react";
import { Button, Card, ProgressCircle } from "~/components/ui";
import { getEpubTitle } from "~/sessions/epub.sessions.server";
import { isSessionHeaders } from "~/sessions/sessions.server";

const format = "epub";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const title = await getEpubTitle(request);
  if (isSessionHeaders(title)) {
    return redirect("/", title);
  }

  return { title };
};

export default function SavePage() {
  const { title } = useLoaderData<typeof loader>();

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const triggerDownload = async () => {
    setIsDownloading(true);

    // start file download
    const res = await fetch(`/download/${format}`);
    if (res.status === 404) {
      return;
    }
    const blob = await res.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    setIsDownloading(false);
    setDownloaded(true);
  };

  const sendToKindle = () => {
    if (!downloaded) triggerDownload();
    window.open("https://www.amazon.com/sendtokindle", "_blank");
  };

  return (
    <Card className="mx-auto my-12 w-full max-w-md">
      <Card.Header>
        <Card.Title>Your {format.toUpperCase()} is ready</Card.Title>
        <Card.Description>{title}</Card.Description>
      </Card.Header>

      <Card.Content className="grid grid-cols-1 gap-4 place-items-center">
        <IconCircleCheck className="size-12 my-3" />
        <Button
          className={"w-full"}
          onPress={triggerDownload}
          isDisabled={isDownloading || downloaded}
          size="large"
        >
          <>
            {isDownloading ? (
              <ProgressCircle isIndeterminate aria-label="Creating..." />
            ) : (
              <IconArrowWallDown />
            )}
            {isDownloading ? "Downloading..." : "Download"}
          </>
        </Button>
        <Button
          className={"w-full"}
          intent="secondary"
          onPress={sendToKindle}
          isDisabled={isDownloading}
          size="large"
        >
          Send to Kindle
        </Button>
        {downloaded && (
          <Form method="post" action="/download/clear" className="w-full">
            <Button
              type="submit"
              intent="outline"
              className={"w-full"}
              size="large"
            >
              Edit new EPUB
            </Button>
          </Form>
        )}
      </Card.Content>

      <Card.Footer>
        <Card.Description>
          {`Click the button to download your ${format.toUpperCase()} file.`}
        </Card.Description>
      </Card.Footer>
    </Card>
  );
}
