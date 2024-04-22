import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFolder } from "react-icons/fa";

interface ImageFolderItemProps {
  label: string;
}

const ImageFolderItem: React.FC<ImageFolderItemProps> = ({ label }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    // Navigate to the new URL
    navigate(`${location.pathname}/${label}`);
  };

  return (
    <div
      className="flex flex-col items-center cursor-pointer transition duration-150 ease-in-out transform 
      hover:scale-105 hover:shadow-lg hover:bg-blue-100 hover:rounded"
      onClick={handleClick}
    >
      <FaFolder className="text-yellow-400 w-40 h-40" />
      <span className="text-center mt-2">{label}</span>
    </div>
  );
};

export default ImageFolderItem;
