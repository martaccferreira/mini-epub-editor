type MemoryEpubStore = Map<string, File>;

export type StoreKey = {
  storeId: string;
  title: string;
};

const epubStore: MemoryEpubStore = new Map();

export function storeEbook(storeId: string, file: File) {
  epubStore.set(storeId, file);
}

export function getStoredEbook(storeId: string): File | undefined {
  return epubStore.get(storeId);
}

export function deleteStoredEbook(storeId: string): boolean {
  return epubStore.delete(storeId);
}
