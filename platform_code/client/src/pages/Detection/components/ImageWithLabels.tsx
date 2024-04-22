import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import ContentWrapper from "../../../components/wrappers/ContentWrapper";
import axios from "axios";
import ImageService from "../../../services/imageService";
import { useAuth } from "../../../context/authContext";
import LabelPopup from "../LabelPopUp";
import ImageDetectionService, {
  IRectObject,
  IRectangle,
  TLabel,
} from "../../../services/imageDetectionService";
import Button from "../../../components/Button";
import { FaArrowLeft } from "react-icons/fa";
import imageServiceFileServer from "../../../services/imageServiceFileServer";
import ImageContainer from "./ImageContainer";
import {
  BiSolidDownArrowSquare,
  BiSolidRightArrowSquare,
} from "react-icons/bi";
import CanvasContainer from "./CanvasContainer";

const PhotoGallery = ({ photos }: { photos: any }) => {
  return (
    <div className="photo-gallery">
      {photos &&
        photos.map((photo: any) => (
          <div key={photo.id} className="photo-item">
            <img src={`${photo.blobUrl}`} alt={`User ${photo.userId}`} />
          </div>
        ))}
    </div>
  );
};

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
};

// Calculate distance from top-left corner of rectangle to point (x, y)
const calculateDistanceFromTopLeft = (
  rect: IRectangle,
  x: number,
  y: number
) => {
  const topLeftX = rect.x1;
  const topLeftY = rect.y1;
  return calculateDistance(topLeftX, topLeftY, x, y);
};

interface HomeProps {
  onBack?: () => void;
}

const ImageWithLabels: React.FC<HomeProps> = ({ onBack }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [rectangles, setRectangles] = useState<IRectObject[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [selectedRectangle, setSelectedRectangle] =
    useState<IRectObject | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [detectionRes, setDetectionRes] = useState<null | {
    metadata: any;
    url: string;
  }>(null);

  const [buildingType, setBuildingType] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const kappa = async () => {
      try {
        /*  const imgRes = await ImageService.getAllImages(); */
      } catch (error) {
        console.error(error);
      }
    };
    kappa();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          setImage(img);
          if (canvasRef.current) {
            canvasRef.current.width = img.width;
            canvasRef.current.height = img.height;
            contextRef.current = canvasRef.current.getContext("2d");
            if (contextRef.current) {
              contextRef.current.drawImage(img, 0, 0);
            }
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDetectionWithLabels = async () => {
    if (imageFile && rectangles.length > 0) {
      try {
        /*   setIsDetectionLoading(true); */
        const detectionResponse =
          await ImageDetectionService.detectImageWithLabels(
            imageFile,
            rectangles
          );

        setDetectionRes(detectionResponse);
        // Additional logic after successful upload can be added here
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        /*    setIsDetectionLoading(false); */
      }
    }
  };

  // Function to handle click event on the canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const x = e.clientX - (rect?.left || 0);
    const y = e.clientY - (rect?.top || 0);

    // Check if the click point is inside any of the rectangles
    const clickedRect = rectangles.filter((rect) => {
      const cuRrect = rect.rect;
      return (
        x >= Math.min(cuRrect.x1, cuRrect.x2) &&
        x <= Math.max(cuRrect.x1, cuRrect.x2) &&
        y >= Math.min(cuRrect.y1, cuRrect.y2) &&
        y <= Math.max(cuRrect.y1, cuRrect.y2)
      );
    });

    let closestRect = null;
    let closestDistance = Number.MAX_VALUE;

    // Calculate the distance from the click point to the center of each rectangle
    clickedRect.forEach((rect, i) => {
      const cuRrect = rect.rect;
      const centerX = (cuRrect.x1 + cuRrect.x2) / 2;
      const centerY = (cuRrect.y1 + cuRrect.y2) / 2;
      const distance = calculateDistance(x, y, centerX, centerY);
      // Update the closest rectangle if this one is closer
      if (distance < closestDistance) {
        closestDistance = distance;
        closestRect = rect;
      }
    });

    if (closestRect) {
      setSelectedRectangle(closestRect);
    } else {
      setSelectedRectangle(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Delete" && selectedRectangle) {
      // Remove the selected rectangle from the list of rectangles
      const updatedRectangles = rectangles.filter((rect) => {
        return rect.id !== selectedRectangle.id;
      });
      // Clear the selected rectangle
      setSelectedRectangle(null);
      // Update the state with the updated rectangles
      setRectangles(updatedRectangles);
      // Redraw the canvas
      drawRectangles();
    }
  };

  useEffect(() => {
    drawRectangles();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedRectangle, rectangles]);

  const openDrawingMode = () => {
    setIsDrawingEnabled(true);
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
        const imageFile = new File([blob], fileName, { type: blob.type });

        // Now use this file with your ImageService.uploadImage method
        await imageServiceFileServer.uploadImage(
          imageFile,
          buildingType,
          detectionRes?.metadata
        );

        setDetectionRes(null);
        setImageFile(null);
        setImage(null);
        // Additional logic after successful upload can be added here
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
      }
    }
  };

  // Function to handle mouse down event
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawingEnabled) {
      setIsDrawing(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      const x = e.clientX - (rect?.left || 0);
      const y = e.clientY - (rect?.top || 0);
      const newId =
        rectangles.length > 0 ? rectangles[rectangles.length - 1].id + 1 : 1;
      setRectangles([
        ...rectangles,
        { id: newId, rect: { x1: x, y1: y, x2: x, y2: y }, label: "" },
      ]);
    }
  };

  // Function to handle mouse move event
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    const x = e.clientX - (rect?.left || 0);
    const y = e.clientY - (rect?.top || 0);
    const lastIndex = rectangles.length - 1;
    if (lastIndex >= 0) {
      const updatedRectangles = [...rectangles];
      updatedRectangles[lastIndex] = {
        ...updatedRectangles[lastIndex],
        rect: { ...updatedRectangles[lastIndex].rect, x2: x, y2: y },
      };
      setRectangles(updatedRectangles);
      drawRectangles();
    }
  };

  // Function to handle mouse up event
  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsDrawingEnabled(false);
  };

  const getRectanglesWithoutLabels = () => {
    return rectangles.filter((rect) => !rect.label);
  };

  // Function to draw rectangles on the canvas
  const drawRectangles = (rectanglesWithoutLabels?: any) => {
    const context = contextRef.current;
    if (context) {
      if (rectanglesWithoutLabels && rectanglesWithoutLabels.length > 0) {
        rectanglesWithoutLabels.forEach(
          (rect: { rect: { x1: number; x2: number; y1: number } }) => {
            // Draw label for rectangles without labels in red
            context.fillStyle = "red";
            context.font = "bold 15px Arial";
            const label = "Select a label please.";
            context.fillText(label, rect.rect.x1, rect.rect.y1 - 10);
          }
        );
        return;
      }
      context.clearRect(
        0,
        0,
        canvasRef.current?.width || 0,
        canvasRef.current?.height || 0
      );
      if (image) {
        context.drawImage(image, 0, 0);
      }

      const curValidRectangles = rectangles.filter(
        (rect) => rect.rect.x1 !== rect.rect.x2 && rect.rect.y1 !== rect.rect.y2
      );

      curValidRectangles.forEach((rect) => {
        context.strokeStyle = "blue";
        context.lineWidth = 4; // Increase rectangle width
        context.strokeRect(
          rect.rect.x1,
          rect.rect.y1,
          rect.rect.x2 - rect.rect.x1,
          rect.rect.y2 - rect.rect.y1
        );

        if (selectedRectangle && selectedRectangle.id === rect.id) {
          context.fillStyle = "gray"; // Fill the selected rectangle with gray
          context.fillRect(
            rect.rect.x1,
            rect.rect.y1,
            rect.rect.x2 - rect.rect.x1,
            rect.rect.y2 - rect.rect.y1
          );
          context.fillStyle = "white"; // Set label text color
          context.font = "bold 20px Arial"; // Increase font size
          context.fillText(rect.label, rect.rect.x1, rect.rect.y1 - 10);
        }
      });
    }
  };

  const handleLabelChange = (id: number, newLabel: TLabel) => {
    setRectangles((prevRectangles) =>
      prevRectangles.map((rect) => {
        return rect.id === id ? { ...rect, label: newLabel } : rect;
      })
    );
  };

  return (
    <div className="flex flex-col w-[100%] max-h-[100%]">
      {/* Back Button */}
      <h1 className="block font-sans text-5xl font-semibold leading-tight tracking-normal text-inherit antialiased mb-8">
        Upload Image
      </h1>
      <div className="spacing-4 flex flex-col">
        <ContentWrapper>
          <h4 className="text-[#07074D] text-xl font-medium mb-8">
            Upload Image (with user annotation)
          </h4>
          {onBack && (
            <Button
              onClick={onBack}
              variant="outlined"
              color="blue"
              className="py-2 px-4 rounded mb-4"
              icon={<FaArrowLeft />}
            >
              Back
            </Button>
          )}
          <div>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }} // Hide the default file input
            />

            <label
              htmlFor="file-input"
              className="inline-block px-5 py-2.5 bg-gray-400 text-white cursor-pointer rounded-lg"
            >
             Upload an Image
            </label>
            {/* {imageUrl && (
              <div>
                <img src={imageUrl} alt="Selected" />
              </div>
            )} */}
          </div>
          <button
            onClick={openDrawingMode}
            className={`mt-2 ${
              isDrawingEnabled ? "bg-green-500" : "bg-gray-500"
            } hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-green-800`}
          >
            {isDrawingEnabled ? "Drawing Enabled" : "Enable Drawing"}
          </button>
          <select
            value={buildingType}
            onChange={(e) => setBuildingType(e.target.value)}
            className="flex mt-2 border rounded p-2 mb-2"
          >
            <option value="">Select Location Type</option>
            <option value="house">House</option>
            <option value="building">Building</option>
          </select>
          {selectedRectangle && (
            <LabelPopup
              selectedRectangle={selectedRectangle}
              onClose={() => setSelectedRectangle(null)}
              onLabelChange={handleLabelChange}
            />
          )}
          <div className="flex flex-col md:flex-row justify-around  md:items-center space-x-0 md:space-x-4 p-4">
            {/* Canvas for drawing or other interactions */}
            <div className="flex flex-col justify-center items-center mb-4 md:mb-0">
              <CanvasContainer>
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onClick={handleCanvasClick}
                  className="w-[256px] h-[256px]"
                />
              </CanvasContainer>
              <span className="mt-2 text-sm text-gray-600">
                Interactive Canvas
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
              <ImageContainer imagePath={detectionRes?.url} />
              <span className="mt-2 text-sm text-gray-600">
                Processed Image (After Detection)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row">
            <Button
              onClick={() => {
                // Set uploadClicked to true when the button is clicked
                // Check if there are rectangles without labels
                const rectanglesWithoutLabels = getRectanglesWithoutLabels();

                if (rectanglesWithoutLabels.length === 0) {
                  handleImageDetectionWithLabels();
                } else {
                  drawRectangles(rectanglesWithoutLabels);
                }
              }}
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

export default ImageWithLabels;
