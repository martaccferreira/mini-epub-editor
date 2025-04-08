// routes/details.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { writeSessionEpubAndMetadata } from "~/sessions.server";
import { parseEpub } from "~/utils/epub.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const epub = formData.get("epub");

  if (!(epub instanceof File)) {
    return Response.json({ error: "Invalid file" }, { status: 400 });
  }

  // extract metadata on the server
  const metadata = await parseEpub(epub);

  // optionally: store in session or URL params
  const sessionHeader = await writeSessionEpubAndMetadata(
    request,
    metadata,
    epub
  ); // custom function

  return redirect(`/details/edit`, sessionHeader);
};
