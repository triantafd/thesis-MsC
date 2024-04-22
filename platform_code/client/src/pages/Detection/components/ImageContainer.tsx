import React from "react";

interface ImageContainerProps {
  imagePath?: string | null;
  label?: string;
  displayText?: string
}

const ImageContainer: React.FC<ImageContainerProps> = ({
  imagePath,
  label,
  displayText
}) => {
  return (
    <div className="min-w-[256px] min-h-[256px] rounded overflow-hidden shadow-lg relative cursor-pointer bg-gray-100 flex items-center justify-center border-2 border-gray-300">
      {imagePath ? (
        <img
          className="max-w-full max-h-full object-cover"
          src={imagePath}
          alt={label || "Img-to-detect"}
        />
      ) : (
        <span className="text-gray-500 text-center text-small p-2">{displayText || 'image container'} </span>
      )}
    </div>
  );
};

export default ImageContainer;
