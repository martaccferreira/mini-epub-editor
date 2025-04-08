"use client";

import { DropZone, Description, FileTrigger } from "ui";
import type { DropEvent, FileDropItem } from "@react-types/shared";
import { IconFiles } from "justd-icons";
import { isFileDropItem } from "react-aria-components";
import { useState } from "react";

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
  const [droppedImage, setDroppedImage] = useState<string | undefined>(image);
  console.log("droppedImage", droppedImage);

  const onDropHandler = async (e: DropEvent) => {
    const item = e.items
      .filter(isFileDropItem)
      .find((item) => isValidFile(item));

    if (item)
      item
        .getFile()
        .then((file) =>
          isFileDrop
            ? onServerUpload && onServerUpload(file)
            : setDroppedImage(URL.createObjectURL(file))
        );
  };

  const onSelectHandler = async (e: any) => {
    if (e) {
      const files = Array.from([...e]);
      const item = files[0];

      if (item && isValidFile(item)) {
        isFileDrop
          ? onServerUpload && onServerUpload(item)
          : setDroppedImage(URL.createObjectURL(item));
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
            <IconFiles className="size-5" />
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
      {!isFileDrop && <input type="hidden" name="image" value={droppedImage} />}
    </DropZone>
  );
};
