import { StoreKey } from "~/utils/memoryStorage.server";
import { Session, SessionData } from "@remix-run/node";

export const EPUB_SESSION_KEY = "epubStoreKey";
export const AZW3_SESSION_KEY = "azw3StoreKey";

export async function writeSessionInfo(
  session: Session<SessionData, SessionData>,
  sessionKey: string,
  title: string
): Promise<string> {
  const storeId = crypto.randomUUID();
  session.set(sessionKey, { storeId: storeId, title });

  return storeId;
}

// returns false when edit was not successful
export async function editSessionInfo(
  session: Session<SessionData, SessionData>,
  sessionKey: string,
  title?: string
): Promise<boolean> {
  if (!session.has(sessionKey)) {
    session.flash("error", "No session key found. Defaulting to old title.");
    return false;
  }
  const metadata: StoreKey = session.get(sessionKey);
  if (title) {
    session.set(sessionKey, { ...metadata, title });
  }

  return true;
}

// returns undefined when metadata is not found
export async function getSessionInfo(
  session: Session<SessionData, SessionData>,
  sessionKey: string
): Promise<StoreKey | undefined> {
  if (!session.has(sessionKey)) {
    session.flash("error", "No session key found.");
    return;
  }

  return session.get(sessionKey);
}

export async function clearSessionInfo(
  session: Session<SessionData, SessionData>,
  sessionKey: string
) {
  session.unset(sessionKey);
}
