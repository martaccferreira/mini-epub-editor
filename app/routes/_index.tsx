import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { FileDrop } from "~/components/file-drop";
import { Header } from "~/components/header";
import { Container } from "~/components/ui";
import { sessionStorage } from "~/sessions/sessions.server";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Minimalistic EPUB Editor",
    },
    {
      name: "description",
      content:
        "EPUB Editor: drop your epub and change it's author, title and cover at will!",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const message = session.get("error") ?? "";
  return Response.json(
    { message },
    {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    }
  );
}

export default function UploadPage() {
  const fetcher = useFetcher();
  const { message } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (message) {
      toast.error(message, { position: "top-center" });
    }
  }, []);

  const handleSubmit = async (file: File) => {
    const formData = new FormData();
    formData.append("epub", file);

    fetcher.submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
      action: "/upload",
    });
  };

  const isValidFileType = (file: any) => {
    return file.type === "application/epub+zip" || file.name?.endsWith(".epub");
  };

  return (
    <>
      <Header
        title={"The Minimalistic EPUB Editor"}
        description={"Fix your EPUB metadata and cover image in simple steps."}
      />
      <Container>
        <fetcher.Form
          method="post"
          encType="multipart/form-data"
          action={"/upload"}
        >
          <FileDrop
            title="Upload an EPUB"
            description="Or drag and drop EPUB up to 10MB"
            isFileDrop
            acceptedFileTypes={["application/epub+zip", ".epub"]}
            isValidFile={isValidFileType}
            onServerUpload={handleSubmit}
          />
        </fetcher.Form>
      </Container>
    </>
  );
}
