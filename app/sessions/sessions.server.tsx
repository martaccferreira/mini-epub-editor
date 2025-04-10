import { createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";

const isProduction = process.env.NODE_ENV === "production";

export type SessionHeaders = {
  headers: {
    "Set-Cookie": string;
  };
};

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    ...(isProduction
      ? { domain: "your-production-domain.com", secure: true }
      : {}),
  },
});

export function isSessionHeaders(obj: any): obj is SessionHeaders {
  return obj && typeof obj === "object" && "headers" in obj;
}

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
