import { Dispatch, SetStateAction, useCallback, useState } from "react";
import ImageItem from "./ImageItem";
import { FaExchangeAlt, FaTrash } from "react-icons/fa";
import Button from "../../../../components/Button";
import imageServiceFileServer from "../../../../services/imageServiceFileServer";

interface Image {
  _id: string;
  userId: string;
  imagePath: string;
  label: string;
}

interface ImageListProps {
  images: Image[];
  setImages: Dispatch<SetStateAction<Image[]>>;
}

const ImageList: React.FC<ImageListProps> = ({ images, setImages }) => {
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);

  // ... rest of your state and variables

  const isAnyImageSelected = selectedImageIds.length > 0;

  const handleDelete = async () => {
    try {
      await imageServiceFileServer.deleteAllImages(selectedImageIds);
      setImages(
        images.filter((image) => !selectedImageIds.includes(image._id))
      );
      setSelectedImageIds([]);
    } catch (error) {
      throw error;
    }
  };

  const handleMoveTo = async () => {};

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedImageIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((imageId) => imageId !== id)
        : [...prevSelected, id]
    );
  }, []);

  return (
    <div className="">
      <div className="flex justify-end space-x-2 mb-4">
        <Button
          onClick={handleDelete}
          disabled={!isAnyImageSelected}
          variant="outlined"
          color="red"
          className="w-20 h-10"
        >
          <FaTrash />
        </Button>
        <Button
          onClick={handleMoveTo}
          disabled={!isAnyImageSelected}
          variant="outlined"
          color="blue"
          className="w-20 h-10"
        >
          <FaExchangeAlt />
        </Button>
      </div>
      <div className="flex flex-row gap-4 flex-wrap">
        {/* grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-4 gap-4 */}
        {(images || []).map((image: any) => (
          <ImageItem
            key={image._id}
            image={image}
            isSelected={selectedImageIds.includes(image._id)}
            onToggleSelect={handleToggleSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageList;
