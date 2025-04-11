// utils/epub.server.ts
import JSZip from "jszip";
import { XMLBuilder, XMLParser } from "fast-xml-parser";

export type StoreKey = {
  storeId: string;
  title: string;
};

async function getEpubOPFAndZip(epubFile: File) {
  const buffer = Buffer.from(await epubFile.arrayBuffer());
  const zip = await JSZip.loadAsync(buffer);

  const parser = new XMLParser({ ignoreAttributes: false });

  // Step 1: Get container.xml
  const containerXml = await zip
    .file("META-INF/container.xml")
    ?.async("string");
  if (!containerXml) throw new Error("Missing container.xml in EPUB file");

  const container = parser.parse(containerXml);

  const opfPath = container?.container?.rootfiles?.rootfile?.["@_full-path"];
  if (!opfPath) throw new Error("Missing OPF file path in container.xml");

  // Step 2: Get OPF file (holds metadata)
  const opfXml = await zip.file(opfPath)?.async("string");
  if (!opfXml) throw new Error("Missing OPF file in EPUB");

  const opf = parser.parse(opfXml);

  return {
    opf,
    opfPath,
    zip,
  };
}

export async function parseEpub(epubFile: File) {
  const { opf, opfPath, zip } = await getEpubOPFAndZip(epubFile);

  const metadata = opf?.package?.metadata;

  const title = metadata?.["dc:title"] ?? "";

  /* example author:
    'dc:creator': {
      '#text': 'Cuttlefish That Loves Diving',
      '@_opf:role': 'aut',
      '@_opf:file-as': 'Cuttlefish That Loves Diving'
    },
  */
  const authorData = metadata?.["dc:creator"];
  const author =
    typeof authorData === "object" && authorData?.["#text"]
      ? authorData?.["#text"]
      : authorData ?? "";

  let subjects = [];
  if (Array.isArray(metadata?.["dc:subject"])) {
    subjects = metadata?.["dc:subject"];
  } else if (metadata?.["dc:subject"]) {
    subjects = [metadata?.["dc:subject"]];
  }

  // Step 3: Try to find the cover image (via manifest)
  const coverBase64 = await getEpubCover(zip, opf, opfPath, metadata);
  if (coverBase64) {
    console.log("Cover found:", coverBase64.substring(0, 100));
  } else {
    console.log("No cover found.");
  }

  return {
    title,
    author,
    subjects,
    coverUrl: coverBase64,
  };
}

async function getEpubCover(zip: JSZip, opf: any, opfPath: any, metadata: any) {
  try {
    const manifest = opf?.package?.manifest?.item || [];
    let coverHref = "";

    let metaArray = [];
    if (Array.isArray(metadata?.meta)) {
      metaArray = metadata.meta;
    } else if (metadata?.meta) {
      metaArray = [metadata.meta];
    }

    const coverIdMeta = metadata?.meta?.find(
      (m: any) => m?.["@_name"] === "cover"
    )?.["@_content"];

    if (coverIdMeta) {
      const coverItem = manifest.find(
        (item: any) =>
          item?.["@_id"] === coverIdMeta ||
          item?.["@_properties"] === "cover-image"
      );
      coverHref = coverItem?.["@_href"];
    } else {
      const coverItem = manifest.find(
        (item: any) =>
          /cover.*\.(jpg|jpeg|png)/i.test(item?.["@_href"]) ||
          item?.["@_properties"] === "cover-image"
      );
      coverHref = coverItem?.["@_href"];
    }

    if (!coverHref) {
      return undefined; // No cover found
    }

    const coverPath = resolveRelativePath(opfPath, coverHref);
    const coverFile = await zip.file(coverPath)?.async("base64");

    if (!coverFile) {
      return undefined; // Cover file not found in zip
    }

    const fileExtension = coverHref.split(".").pop().toLowerCase();
    let mimeType = "image/jpeg"; // Default to jpeg.

    if (fileExtension === "png") {
      mimeType = "image/png";
    }

    return `data:${mimeType};base64,${coverFile}`;
  } catch (error) {
    console.error("Error getting cover:", error);
    return undefined;
  }
}

export async function editEpub(
  title: string,
  author: string,
  cover: File,
  epub: File
): Promise<File> {
  const { zip, opf, opfPath } = await getEpubOPFAndZip(epub);

  // update metadata
  const metadata = opf.package.metadata;
  metadata["dc:title"] = title;
  metadata["dc:creator"] = {
    "#text": author,
    "@_opf:role": "aut",
    "@_opf:file-as": author,
  };

  const builder = new XMLBuilder({ ignoreAttributes: false });

  // Add new cover image if provided
  if (cover && cover instanceof File) {
    const coverBuffer = Buffer.from(await cover.arrayBuffer());
    const ext = cover.name.split(".").pop()?.toLowerCase() || "jpg";
    const coverId = "ci";
    const coverFileName = `cover.${ext}`;
    const mediaType = ext === "svg" ? "image/svg+xml" : `image/${ext}`;

    // Add file to zip
    const basePath = opfPath.split("/").slice(0, -1).join("/");
    const coverPath = basePath ? `${basePath}/${coverFileName}` : coverFileName;
    zip.file(coverPath, coverBuffer);

    // Add manifest item
    const manifest = opf.package.manifest.item || [];
    manifest.push({
      "@_id": coverId,
      "@_href": coverFileName,
      "@_media-type": mediaType,
      "@_properties": "cover-image",
    });
    opf.package.manifest.item = manifest;

    // Add meta to metadata
    const meta = metadata.meta || [];
    meta.push({ "@_name": "cover", "@_content": coverId });
    metadata.meta = meta;
  }

  // Rebuild OPF and write back
  const newOpfXml = builder.build(opf);
  zip.file(opfPath, newOpfXml);

  const updatedEpubBuffer = await zip.generateAsync({ type: "uint8array" });
  return new File([updatedEpubBuffer], `${title}.epub`, {
    type: "application/epub+zip",
    lastModified: Date.now(),
  });
}

function resolveRelativePath(opfPath: any, relativePath: any) {
  const opfDirectory = opfPath.substring(0, opfPath.lastIndexOf("/"));
  let resolvedPath = relativePath;

  if (!relativePath.startsWith(opfDirectory) && !relativePath.startsWith("/")) {
    resolvedPath = `${opfDirectory}/${relativePath}`;
  } else if (relativePath.startsWith("/")) {
    resolvedPath = relativePath.substring(1); // remove leading slash
  }

  return resolvedPath;
}
