import React from "react";

interface CanvasContainerProps {
  children: React.ReactNode;
  displayText?: string;
}

const CanvasContainer: React.FC<CanvasContainerProps> = ({
  children,
  displayText,
}) => {
  return (
    <div className="min-w-[256px] min-h-[256px] rounded overflow-hidden shadow-lg relative cursor-pointer bg-gray-100 flex items-center justify-center border-2 border-gray-300">
      {children}
    </div>
  );
};

export default CanvasContainer;
