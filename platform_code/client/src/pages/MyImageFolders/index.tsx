import React from "react";
import ImageFolders from "./ImageFolders";
import ContentWrapper from "../../components/wrappers/ContentWrapper";

const ImageUploadSelector: React.FC = () => {
  return (
    <div className="flex flex-col w-[100%] max-h-[100%]">
      <h1 className="block font-sans text-5xl font-semibold leading-tight tracking-normal text-inherit antialiased mb-8">
        Location Types
      </h1>
      <div className="spacing-4 flex flex-col">
        <ContentWrapper>
          <h4 className="text-[#07074D] text-xl font-medium mb-8">Folders</h4>
          <ImageFolders />
        </ContentWrapper>
      </div>
    </div>
  );
};

export default ImageUploadSelector;
