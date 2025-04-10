import { createThemeAction } from "remix-themes";
import { themeSessionResolver } from "~/sessions/sessions.server";

export const action = createThemeAction(themeSessionResolver);
