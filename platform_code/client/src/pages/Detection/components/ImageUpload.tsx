import React, { useState, useEffect } from "react";
import ContentWrapper from "../../../components/wrappers/ContentWrapper";
import ImageDetectionService from "../../../services/imageDetectionService";
import ImageServiceFileServer from "../../../services/imageServiceFileServer";
import ImageGallery from "../../MyImageFolders/ImageGallery";
import Button from "../../../components/Button";
import { FaArrowLeft } from "react-icons/fa";
import ImageFolders from "../../MyImageFolders/ImageFolders";
import ImageContainer from "./ImageContainer";
import {
  BiSolidRightArrowSquare,
  BiSolidDownArrowSquare,
} from "react-icons/bi";
interface ImageUploadProps {
  onBack: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onBack }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDetectionLoading, setIsDetectionLoading] = useState(false);
  const [detectionRes, setDetectionRes] = useState<null | {
    metadata: any;
    url: string;
  }>(null);
  const [buildingType, setBuildingType] = useState<string | undefined>(
    undefined
  );

  const prepareImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // Save the file for later upload

      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string); // Set the image URL for preview
      };
      reader.readAsDataURL(file);
    }
  };

  const saveImage = async () => {
    if (detectionRes?.url && buildingType) {
      try {
        // Fetch the image from the URL
        const response = await fetch(detectionRes?.url);
        const blob = await response.blob();

        // Extract the file name from the URL
        const urlParts = detectionRes?.url.split("/");
        const fileName = urlParts[urlParts.length - 1];

        // Create a file from the Blob with the extracted file name
        const imageDetectFile = new File([blob], fileName, { type: blob.type });

        // Now use this file with your ImageService.uploadImage method
        await ImageServiceFileServer.uploadImage(
          imageDetectFile,
          buildingType,
          detectionRes?.metadata
        );

        setDetectionRes(null);
        setImageFile(null);
        setImageUrl(null);
        // Additional logic after successful upload can be added here
      } catch (error) {
        console.error("Error saving image:", error);
      } finally {
      }
    }
  };

  const handleImageDetection = async () => {
    if (imageFile) {
      try {
        setIsDetectionLoading(true);
        const detectionResponse = await ImageDetectionService.detectImage(
          imageFile
        );
        setDetectionRes(detectionResponse);
        // Additional logic after successful upload can be added here
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsDetectionLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col w-[100%] max-h-[100%]">
      <h1 className="block font-sans text-5xl font-semibold leading-tight tracking-normal text-inherit antialiased mb-8">
        Upload Image
      </h1>
      <div className="spacing-4 flex flex-col">
        <ContentWrapper>
          <h4 className="text-[#07074D] text-xl font-medium mb-8">
            Upload Image (no user annotation)
          </h4>
          <Button
            onClick={onBack}
            variant="outlined"
            color="blue"
            className="py-2 px-4 rounded mb-4"
            icon={<FaArrowLeft />}
          >
            Back
          </Button>
          <div>
            <input
              id="file-input"
              className="flex-grow!important"
              type="file"
              accept="image/*"
              onChange={prepareImagePreview}
              style={{ display: "none" }} // Hide the default file input
            />
            <label
              htmlFor="file-input"
              className="inline-block px-5 py-2.5 bg-gray-400 text-white cursor-pointer rounded-lg"
            >
              Upload an Image
            </label>

            <select
              value={buildingType}
              onChange={(e) => setBuildingType(e.target.value)}
              className="flex mt-2 border rounded p-2 mb-2"
            >
              <option value="">Select Location Type</option>
              <option value="house">House</option>
              <option value="building">Building</option>
            </select>
            <div className="flex flex-col md:flex-row justify-around  md:items-center space-x-0 md:space-x-4 p-4">
              {/* Container for the uploaded image */}
              <div className="flex flex-col justify-center items-center mb-4 md:mb-0">
                <ImageContainer
                  imagePath={imageUrl}
                  displayText={"Image to detect"}
                />
                <span className="mt-2 text-sm text-gray-600">
                  Original Image
                </span>
              </div>

              {/* Arrow icon indicating transformation */}
              <div className="flex  self-center justify-center items-center mb-4 md:mb-0">
                <BiSolidDownArrowSquare size={40} className="md:hidden" />{" "}
                {/* Shown on small screens */}
                <BiSolidRightArrowSquare
                  size={40}
                  className="hidden md:block"
                />{" "}
                {/* Shown on medium screens and above */}
              </div>

              <div className="flex flex-col justify-center items-center">
                <ImageContainer
                  imagePath={detectionRes?.url}
                  displayText={"Image after detection"}
                />
                <span className="mt-2 text-sm text-gray-600">
                  Processed Image (After Detection)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row">
            <Button
              onClick={handleImageDetection}
              variant="filled"
              className=""
              color="blue"
            >
              Detect Image
            </Button>
            <Button
              onClick={saveImage}
              className="sm:ml-2 mt-2 sm:mt-0"
              variant="filled"
              color="green"
            >
              Save Image
            </Button>
          </div>
        </ContentWrapper>
      </div>
    </div>
  );
};

export default ImageUpload;
