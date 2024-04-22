import React from "react";
import ImageFolderItem from "./ImageFolderItem";

const labels = [
  { id: 1, label: "house" },
  { id: 2, label: "building" },
];

const ImageFolderList: React.FC = () => {
  return (
    <div
      className="flex justify-start items-center gap-10 
        py-10 px-1 flex-wrap overflow-auto"
    >
      {(labels || []).map((folder: any) => (
        <ImageFolderItem key={folder.id} label={folder.label} />
      ))}
    </div>
  );
};

export default ImageFolderList;
