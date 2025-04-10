import { SessionHeaders } from "./sessions.server";
import { EPUB_SESSION_KEY } from "./metadata.sessions.server";
import {
  clearEbook,
  getEbook,
  getEbookTitle,
  writeEbook,
} from "./ebook.sessions.server";

export async function getEpub(
  request: Request
): Promise<File | SessionHeaders> {
  return getEbook(request, EPUB_SESSION_KEY);
}

export async function writeEpub(
  request: Request,
  epub: File
): Promise<SessionHeaders> {
  return writeEbook(request, EPUB_SESSION_KEY, epub);
}

export async function clearEpub(request: Request): Promise<SessionHeaders> {
  return clearEbook(request, EPUB_SESSION_KEY);
}

export async function getEpubTitle(
  request: Request
): Promise<string | SessionHeaders> {
  return getEbookTitle(request, EPUB_SESSION_KEY);
}
