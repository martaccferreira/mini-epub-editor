import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { IconArrowWallDown, IconCircleCheck } from "justd-icons";
import { useEffect, useState } from "react";
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
  const fetcher = useFetcher();

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!downloaded) return;

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c === 1) {
          clearInterval(timer);
          ebookClear();
        }
        return c - 1;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [downloaded]);

  const ebookClear = () => {
    fetcher.submit(null, {
      method: "post",
      action: "/download/clear",
    });
  };

  const triggerDownload = async () => {
    setIsDownloading(true);

    // start file download
    const res = await fetch(`/download/${format}`);
    if (res.status === 404) {
      // toater error
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
    triggerDownload();
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
          isDisabled={isDownloading}
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
          <Button
            intent="outline"
            onPress={ebookClear}
            className={"w-full"}
            size="large"
          >
            Edit new EPUB
          </Button>
        )}
      </Card.Content>

      <Card.Footer>
        <Card.Description>
          {!downloaded
            ? `Click the button to download your ${format.toUpperCase()} file.`
            : `File will be deleted in ${countdown}s`}
        </Card.Description>
      </Card.Footer>
    </Card>
  );
}
