type MemoryEpubStore = Map<string, File>;

const epubStore: MemoryEpubStore = new Map();

export function storeEpub(sessionId: string, file: File) {
  epubStore.set(sessionId, file);
}

export function getStoredEpub(sessionId: string): File | undefined {
  return epubStore.get(sessionId);
}

export function deleteStoredEpub(sessionId: string) {
  epubStore.delete(sessionId);
}
