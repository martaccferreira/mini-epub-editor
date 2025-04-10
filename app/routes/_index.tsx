import type { MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { FileDrop } from "~/components/file-drop";
import { Header } from "~/components/header";
import { Container } from "~/components/ui";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Minimalistic EPUB Editor",
    },
    {
      name: "description",
      content:
        "Remix Starter Kit with Tailwind CSS, TypeScript, React, React Aria Components, Justd Components, Framer Motion, and more.",
    },
  ];
};

export default function UploadPage() {
  const fetcher = useFetcher();

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
