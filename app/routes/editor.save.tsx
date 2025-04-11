import {
  ActionFunctionArgs,
  redirect,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  UploadHandler,
} from "@remix-run/node";
import { getEpub, writeEpub } from "~/sessions/epub.sessions.server";
import { isSessionHeaders } from "~/sessions/sessions.server";
import { editEpub } from "~/utils/epub.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const uploadHandler: UploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 10_000_000, // 10MB limit
  });

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const title = String(formData.get("title"));
  const author = String(formData.get("author"));
  const cover = formData.get("image");
  if (!title || !author) {
    return Response.json(
      { error: "Unexpected error occurred." },
      { status: 400 }
    );
  }

  // get old epub
  const epub = await getEpub(request);
  if (isSessionHeaders(epub)) {
    console.error("/editor/save: Failed to fetch epub.");
    return redirect("/", epub);
  }

  // update it with user form data
  const alteredEpub = await editEpub(title, author, cover as File, epub);

  // save the updated epub to storage
  const sessionHeader = await writeEpub(request, alteredEpub);

  return redirect(`/download?target=epub`, sessionHeader);
};
