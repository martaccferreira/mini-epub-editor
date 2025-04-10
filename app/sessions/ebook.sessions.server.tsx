import {
  deleteStoredEbook,
  getStoredEbook,
  storeEbook,
} from "~/utils/memoryStorage.server";
import { SessionHeaders, sessionStorage } from "./sessions.server";
import {
  clearSessionInfo,
  editSessionInfo,
  getSessionInfo,
  writeSessionInfo,
} from "./metadata.sessions.server";

function stripExtension(fileName: string): string {
  return fileName.replace(/\.[^/.]+$/, "");
}

export async function getEbook(
  request: Request,
  key: string
): Promise<File | SessionHeaders> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const sessionInfo = await getSessionInfo(session, key);
  if (!sessionInfo) {
    console.error(`getEbook: no ${key} session info found`);
    return {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    };
  }

  const { storeId } = sessionInfo;
  const file = getStoredEbook(storeId);
  if (!file) {
    console.error(`getEbook: no ebook found associated to id ${storeId}`);
    session.flash("error", "Ebook not found.");
    return {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    };
  }

  return file;
}

export async function writeEbook(
  request: Request,
  key: string,
  ebook: File
): Promise<SessionHeaders> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  let storeId: string;
  const title = stripExtension(ebook.name);

  const sessionInfo = await getSessionInfo(session, key);
  if (!sessionInfo) {
    storeId = await writeSessionInfo(session, key, title);
  } else {
    storeId = sessionInfo.storeId;
    editSessionInfo(session, key, title);
  }

  storeEbook(storeId, ebook);
  return {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  };
}

export async function clearEbook(
  request: Request,
  key: string
): Promise<SessionHeaders> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const sessionInfo = await getSessionInfo(session, key);
  if (!sessionInfo) {
    console.error(`clearEbook: no ${key} session info found`);
    return {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    };
  }

  const { storeId } = sessionInfo;
  const success = deleteStoredEbook(storeId);
  if (!success) {
    console.error(`clearEbook: could not remove entry with storeId ${storeId}`);
  }

  clearSessionInfo(session, key);
  return {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  };
}

export async function getEbookTitle(
  request: Request,
  key: string
): Promise<string | SessionHeaders> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const sessionInfo = await getSessionInfo(session, key);
  if (!sessionInfo) {
    console.error(`getEbookTitle: no ${key} session info found`);
    return {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    };
  }

  const { title } = sessionInfo;
  return title;
}
