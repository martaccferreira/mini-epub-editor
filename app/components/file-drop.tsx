"use client";

import { DropZone, Description, FileTrigger } from "ui";
import type { DropEvent, FileDropItem } from "@react-types/shared";
import { IconFiles, IconGallery } from "justd-icons";
import { isFileDropItem } from "react-aria-components";
import { useEffect, useRef, useState } from "react";

type FileDropProps = {
  title: string;
  description: string;
  isFileDrop?: boolean;
  acceptedFileTypes?: string[];
  image?: string;
  isValidFile?: (file: any) => boolean;
  onServerUpload?: (file: File) => void;
};

export const FileDrop: React.FC<FileDropProps> = ({
  title,
  description,
  isFileDrop = false,
  acceptedFileTypes = ["image/jpeg", "image/png"],
  image = undefined,
  isValidFile = (image: FileDropItem) => acceptedFileTypes.includes(image.type),
  onServerUpload,
}) => {
  const [droppedImage, setDroppedImage] = useState<string | undefined>(
    undefined
  );
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image) {
      setDroppedImage(image);
    }
  }, [image]);

  const attachToHiddenFileInput = (file: File) => {
    const dt = new DataTransfer();
    dt.items.add(file);

    const input = hiddenFileInputRef.current;
    if (input) {
      input.files = dt.files;
    }
  };

  const handleFile = (file: File) => {
    if (isFileDrop) {
      onServerUpload?.(file);
    } else {
      setDroppedImage(URL.createObjectURL(file));
      attachToHiddenFileInput(file);
    }
  };

  const onDropHandler = async (e: DropEvent) => {
    const item = e.items
      .filter(isFileDropItem)
      .find((item) => isValidFile(item));

    if (item) item.getFile().then((file) => handleFile(file));
  };

  const onSelectHandler = async (e: any) => {
    if (e && e.length > 0) {
      const file = e[0];
      if (isValidFile(file)) {
        handleFile(file);
      }
    }
  };

  return (
    <DropZone
      getDropOperation={(types) =>
        acceptedFileTypes.some((type) => types.has(type)) ? "copy" : "cancel"
      }
      onDrop={onDropHandler}
      className={""}
    >
      {droppedImage ? (
        <img
          alt=""
          src={droppedImage}
          className="aspect-square size-full object-contain"
        />
      ) : (
        <div className="grid space-y-3">
          <div className="mx-auto grid size-12 place-content-center rounded-full border bg-secondary/70 group-data-[drop-target]:border-primary/70 group-data-[drop-target]:bg-primary/20">
            {isFileDrop ? (
              <IconFiles className="size-5" />
            ) : (
              <IconGallery className="size-5" />
            )}
          </div>
          <div className="flex justify-center">
            <FileTrigger
              acceptedFileTypes={acceptedFileTypes}
              allowsMultiple={false}
              onSelect={onSelectHandler}
            >
              {title}
            </FileTrigger>
          </div>
          <Description>{description}</Description>
        </div>
      )}
      {!isFileDrop && (
        <input
          ref={hiddenFileInputRef}
          type="file"
          name="image"
          accept={acceptedFileTypes.join(",")}
          className="hidden"
        />
      )}
    </DropZone>
  );
};
