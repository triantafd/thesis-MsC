import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import ContentWrapper from "../../components/wrappers/ContentWrapper";
import axios from 'axios';
import ImageService from "../../services/imageService";
import { useAuth } from "../../context/authContext";

const sendImageToBackend = async (selectedImage: File | null, userId?: string) => {
  if (!selectedImage || !userId) {
    // Handle the case where no image is selected
    return;
  }

  try {
    const imgRes = await ImageService.uploadImage(userId, selectedImage);
    console.log('Image uploaded successfully:', imgRes);
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

interface Rectangle {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}



const PhotoGallery = ({ photos }: { photos: any }) => {
  return (
    <div className="photo-gallery">
      {photos && photos.map((photo: any) => (
        <div key={photo.id} className="photo-item">
          <img
            src={`${photo.blobUrl}`}
            alt={`User ${photo.userId}`}
          />
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
const calculateDistanceFromTopLeft = (rect: Rectangle, x: number, y: number) => {
  const topLeftX = rect.x1;
  const topLeftY = rect.y1;
  return calculateDistance(topLeftX, topLeftY, x, y);
};

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [validRectangles, setValidRectangles] = useState<Rectangle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedRectangle, setSelectedRectangle] = useState<Rectangle | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const kappa = async () => {
      const imgRes = await ImageService.getAllImages();
    }
    kappa()
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
    const clickedRect = validRectangles.filter((rect) => {
      return (
        (x >= Math.min(rect.x1, rect.x2) && x <= Math.max(rect.x1, rect.x2)) &&
        (y >= Math.min(rect.y1, rect.y2) && y <= Math.max(rect.y1, rect.y2))
      );
    });

    let closestRect = null;
    let closestDistance = Number.MAX_VALUE;

    // Calculate the distance from the click point to the center of each rectangle
    clickedRect.forEach((rect, i) => {
      const centerX = (rect.x1 + rect.x2) / 2;
      const centerY = (rect.y1 + rect.y2) / 2;
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

  useEffect(() => {
    drawRectangles();
  }, [selectedRectangle]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Delete" && selectedRectangle) {
      // Remove the selected rectangle from the list of rectangles
      const updatedRectangles = rectangles.filter(
        (rect) =>
          rect.x1 !== selectedRectangle.x1 ||
          rect.y1 !== selectedRectangle.y1 ||
          rect.x2 !== selectedRectangle.x2 ||
          rect.y2 !== selectedRectangle.y2
      );
      // Clear the selected rectangle
      setSelectedRectangle(null);
      // Update the state with the updated rectangles
      setRectangles(updatedRectangles);
      // Redraw the canvas
      drawRectangles();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedRectangle, rectangles]);

  // Function to handle mouse down event
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    const x = e.clientX - (rect?.left || 0);
    const y = e.clientY - (rect?.top || 0);
    setRectangles([...validRectangles, { x1: x, y1: y, x2: x, y2: y }]);
  };

  // Function to handle mouse move event
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    const x = e.clientX - (rect?.left || 0);
    const y = e.clientY - (rect?.top || 0);
    const lastIndex = rectangles.length - 1;
    if (lastIndex >= 0) {
      rectangles[lastIndex] = { ...rectangles[lastIndex], x2: x, y2: y };
      drawRectangles();
    }
  };

  // Function to handle mouse up event
  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Function to draw rectangles on the canvas
  // Function to draw rectangles on the canvas
  const drawRectangles = () => {
    const context = contextRef.current;
    if (context) {
      context.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
      if (image) {
        context.drawImage(image, 0, 0);
      }

      const curValidRectangles = rectangles.filter(
        (rect) => rect.x1 !== rect.x2 && rect.y1 !== rect.y2
        /*  && ((Math.max(rect.x1, rect.x2) - Math.min(rect.x1, rect.x2))
           * (Math.max(rect.y1, rect.y2) - Math.min(rect.y1, rect.y2)) > 16) */
      );

      setValidRectangles(curValidRectangles)

      curValidRectangles.forEach((rect) => {
        context.strokeStyle = 'red'
        context.lineWidth = 4; // Increase rectangle width
        context.strokeRect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);

        if (selectedRectangle
          && selectedRectangle.x1 === rect.x1
          && selectedRectangle.y1 === rect.y1
          && selectedRectangle.x2 === rect.x2
          && selectedRectangle.y2 === rect.y2) {
          context.fillStyle = "gray"; // Fill the selected rectangle with gray
          context.fillRect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
        }
      });
    }
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
            //onClick={() => sendImageToBackend(selectedImage, user?.id)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          >
            Upload Image
          </button>
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleCanvasClick} // Detect clicks on the canvas
          />

          {/*   {imageSources && <PhotoGallery photos={imageSources} />} */}
        </ContentWrapper>
      </div>
    </div>
  );
};

export default Home;