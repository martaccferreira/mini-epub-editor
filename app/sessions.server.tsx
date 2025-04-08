import {
  createCookieSessionStorage,
  Session,
  SessionData,
} from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";
import { EpubMetadata } from "./utils/epub.server";
import {
  deleteStoredEpub,
  getStoredEpub,
  storeEpub,
} from "./utils/memoryStorage.server";
import { meta } from "./routes/_index";

const isProduction = process.env.NODE_ENV === "production";

const sessionStorage = createCookieSessionStorage({
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

type SessionRedirect = {
  headers: {
    "Set-Cookie": string;
  };
};

export function isSessionRedirect(obj: any): obj is SessionRedirect {
  return obj && typeof obj === "object" && "headers" in obj;
}

export async function writeSessionEpubAndMetadata(
  request: Request,
  metadata: EpubMetadata,
  epub: File
): Promise<SessionRedirect> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const storeId = crypto.randomUUID();
  session.set("epubMetadata", { storeID: storeId, ...metadata });
  storeEpub(storeId, epub);

  return {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  };
}

export async function getSessionMetadata(
  request: Request
): Promise<EpubMetadata | SessionRedirect> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  if (!session.has("epubMetadata")) {
    session.flash("error", "No epub metadata found.");
    return {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    };
  }

  return session.get("epubMetadata");
}

async function getSessionStoreId(
  session: Session<SessionData, SessionData>
): Promise<string | SessionRedirect> {
  if (!session.has("epubMetadata")) {
    session.flash("error", "No epub metadata found.");
    return {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    };
  }

  const metadata = session.get("epubMetadata");
  if (!metadata.storeID) {
    session.flash("error", "Epub metadata is missing storeID.");
    return {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    };
  }
  return metadata.storeID;
}

export async function getSessionEpub(
  request: Request
): Promise<File | SessionRedirect> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const storeId = await getSessionStoreId(session);
  if (isSessionRedirect(storeId)) {
    return storeId;
  }

  const file = getStoredEpub(storeId);
  if (!file) {
    session.flash("error", "Epub not found.");
    return {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    };
  }

  return file;
}

export async function writeDownloadEpub(
  request: Request,
  epub: File
): Promise<SessionRedirect> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const storeId = await getSessionStoreId(session);
  if (isSessionRedirect(storeId)) {
    return storeId;
  }

  storeEpub(storeId, epub);

  return {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  };
}

export async function clearEpub(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  if (session.id) {
    deleteStoredEpub(session.id);
  }
}

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
