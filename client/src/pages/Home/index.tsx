import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import ContentWrapper from "../../components/wrappers/ContentWrapper";
import axios from "axios";
import ImageService from "../../services/imageService";
import { useAuth } from "../../context/authContext";
import LabelPopup from "./LabelPopUp";

const sendImageToBackend = async (
  selectedImage: File | null,
  userId?: string
) => {
  if (!selectedImage || !userId) {
    // Handle the case where no image is selected
    return;
  }

  try {
    const imgRes = await ImageService.uploadImage(userId, selectedImage);
    console.log("Image uploaded successfully:", imgRes);
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

interface Rectangle {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface RectObject {
  id: number;
  rect: Rectangle;
  label: string;
}

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
  rect: Rectangle,
  x: number,
  y: number
) => {
  const topLeftX = rect.x1;
  const topLeftY = rect.y1;
  return calculateDistance(topLeftX, topLeftY, x, y);
};

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [rectangles, setRectangles] = useState<RectObject[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [selectedRectangle, setSelectedRectangle] = useState<RectObject | null>(
    null
  );
  const { user } = useAuth();

  useEffect(() => {
    const kappa = async () => {
      try {
        const imgRes = await ImageService.getAllImages();
      } catch (error) {
        console.error(error);
      }
    };
    kappa();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const handleLabelChange = (id: number, newLabel: string) => {
    setRectangles((prevRectangles) =>
      prevRectangles.map((rect) => {
        return rect.id === id ? { ...rect, label: newLabel } : rect;
      })
    );
  };

  return (
    <div className="flex flex-col w-[100%] max-h-[100%]">
      <h1 className="block font-sans text-5xl font-semibold leading-tight tracking-normal text-inherit antialiased mb-8">
        Account
      </h1>
      <div className="spacing-4 flex flex-col">
        <ContentWrapper>
          <h4 className="text-[#07074D] text-xl font-medium mb-8">
            Account info
          </h4>
          <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {/* {imageUrl && (
              <div>
                <img src={imageUrl} alt="Selected" />
              </div>
            )} */}
          </div>
          <button
            onClick={() => {
              // Set uploadClicked to true when the button is clicked
              // Check if there are rectangles without labels
              const rectanglesWithoutLabels = getRectanglesWithoutLabels();

              if (rectanglesWithoutLabels.length === 0) {
                /*   sendImageToBackend(selectedImage, user?.id); */
              } else {
                drawRectangles(rectanglesWithoutLabels);
              }
            }}
            className="bg-blue-500 hover:bg-blue-700 mr-2 mt-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          >
            Upload Image
          </button>
          <button
            onClick={openDrawingMode}
            className={`${
              isDrawingEnabled ? "bg-green-500" : "bg-gray-500"
            } hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-green-800`}
          >
            {isDrawingEnabled ? "Drawing Enabled" : "Enable Drawing"}
          </button>
          {selectedRectangle && (
            <LabelPopup
              selectedRectangle={selectedRectangle}
              onClose={() => setSelectedRectangle(null)}
              onLabelChange={handleLabelChange}
            />
          )}
          <div className="flex items-center mt-2 justify-center h-[100%]">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onClick={handleCanvasClick} // Detect clicks on the canvas
              className="bg-gray-100" // Add any additional styles you want for the canvas here
            />
          </div>
          {/*   {imageSources && <PhotoGallery photos={imageSources} />} */}
        </ContentWrapper>
      </div>
    </div>
  );
};

export default Home;
