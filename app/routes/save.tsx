import { ActionFunctionArgs, redirect } from "@remix-run/node";
import {
  getSessionEpub,
  isSessionRedirect,
  writeDownloadEpub,
} from "~/sessions.server";
import { writeEpub } from "~/utils/epub.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const author = formData.get("author");
  const cover = formData.get("image");

  console.log(title, author);
  console.log(cover);

  // extract metadata on the server
  const epub = await getSessionEpub(request);
  if (isSessionRedirect(epub)) {
    return Response.json(
      { error: "Unexpected error occurred." },
      { status: 400 }
    );
  }

  const alteredEpub = await writeEpub(title, author, cover, epub);
  console.log(alteredEpub);

  const sessionHeaders = await writeDownloadEpub(request, alteredEpub);

  return redirect(`/save/download`, sessionHeaders);
};
