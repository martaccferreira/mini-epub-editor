// routes/details.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { writeEpub } from "~/sessions/epub.sessions.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const epub = formData.get("epub");

  if (!(epub instanceof File)) {
    return Response.json({ error: "Invalid file" }, { status: 400 });
  }

  const headers = await writeEpub(request, epub);

  return redirect(`/editor`, headers);
};
