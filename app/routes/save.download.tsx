import { ActionFunctionArgs } from "@remix-run/node";
import { getSessionEpub } from "~/sessions.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const author = formData.get("author");
  const cover = formData.get("image");

  console.log(title, author);

  // extract metadata on the server
  const epub = await getSessionEpub(request);

  console.log("epub", epub);

  // optionally: store in session or URL params
  const sessionHeader = await writeSessionEpub(request, metadata, epub); // custom function

  return redirect(`/details/edit`, sessionHeader);
};
