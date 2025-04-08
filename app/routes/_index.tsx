import type { MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { FileDrop } from "~/components/file-drop";
import { Header } from "~/components/header";
import { Container } from "~/components/ui";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Justd Starter Kit with Remix",
    },
    {
      name: "description",
      content:
        "Remix Starter Kit with Tailwind CSS, TypeScript, React, React Aria Components, Justd Components, Framer Motion, and more.",
    },
  ];
};

export default function Index() {
  const fetcher = useFetcher();

  const handleSubmit = async (file: File) => {
    const formData = new FormData();
    formData.append("epub", file);

    fetcher.submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
      action: "/details",
    });
  };

  const isValidFileType = (file: any) => {
    return file.type === "application/epub+zip" || file.name?.endsWith(".epub");
  };

  return (
    <>
      <Header
        title="Justd Starter Kit"
        description="Remix Starter Kit with Tailwind CSS, TypeScript, React, React Aria Components, Justd Components, Framer Motion, and more."
      />
      <Container>
        <fetcher.Form
          method="post"
          encType="multipart/form-data"
          action="/details"
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
