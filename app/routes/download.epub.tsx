import { LoaderFunctionArgs } from "@remix-run/node";
import { getEpub } from "~/sessions/epub.sessions.server";
import { isSessionHeaders } from "~/sessions/sessions.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const epub = await getEpub(request);
  if (isSessionHeaders(epub)) {
    return new Response("No file found", { status: 404 });
  }

  return new Response(epub, {
    headers: {
      "Content-Type": "application/epub+zip",
      "Content-Disposition": `attachment; filename="${epub.name}"`,
    },
  });
};
