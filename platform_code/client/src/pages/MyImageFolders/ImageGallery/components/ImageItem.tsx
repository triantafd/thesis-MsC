import React from "react";
import { FaCheckCircle } from "react-icons/fa";
interface ImageItemProps {
  image: any;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

const ImageItem: React.FC<ImageItemProps> = ({
  image,
  isSelected,
  onToggleSelect,
}) => {
  return (
    <div
      className={`max-w-[256px] rounded overflow-hidden shadow-lg relative cursor-pointer ${
        isSelected ? "bg-gray-200 bg-shadow" : ""
      }`}
      onClick={() => onToggleSelect(image._id)}
    >
      <img className="w-full" src={image.imagePath} alt={image.label} />
      {isSelected && (
        <div className="absolute top-0 right-0 p-4">
          <FaCheckCircle className="w-5 h-5 text-green-500" />
        </div>
      )}
      <div className="px-6 py-4">
        <div className="uppercase underline font-bold text-lg mb-2">
          {image.label}:
        </div>
      </div>
    </div>
  );
};

export default ImageItem;
