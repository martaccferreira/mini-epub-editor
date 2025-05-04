import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { clearEpub } from "~/sessions/epub.sessions.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const sessionHeaders = await clearEpub(request);
  console.log(sessionHeaders);

  return redirect("/", sessionHeaders);
};
