import React, { useState } from "react";
import ImageWithLabels from "./components/ImageWithLabels";
import ImageUpload from "./components/ImageUpload";
import Button from "../../components/Button";

type TimageOptions = "uploadWithLabels" | "upload" | null;

const ImageUploadSelector: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<TimageOptions>(null);

  const handleBack = () => {
    setSelectedOption(null);
  };

  if (selectedOption === "uploadWithLabels")
    return <ImageWithLabels onBack={handleBack} />;
  else if (selectedOption === "upload")
    return <ImageUpload onBack={handleBack} />;

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {!selectedOption && (
          <>
            <Button
              onClick={() => setSelectedOption("uploadWithLabels")}
              variant="filled"
              color="blue"
              className="mt-6"
            >
              Upload Image & Annotate & Classify with Resnet101
            </Button>
            <Button
              onClick={() => setSelectedOption("upload")}
              variant="filled"
              color="green"
              className="mt-6"
            >
              Upload Image & Detect with Yolov7
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default ImageUploadSelector;
