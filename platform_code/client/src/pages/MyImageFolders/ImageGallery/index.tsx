import React, { useState, useEffect } from "react";
import imageServiceFileServer from "../../../services/imageServiceFileServer";
import ImageList from "./components/ImageList";
import Button from "../../../components/Button";
import ContentWrapper from "../../../components/wrappers/ContentWrapper";
import { useParams } from "react-router-dom";
import CardAnalytics from "../../../components/CardAnalytics";

interface Image {
  _id: string;
  userId: string;
  imagePath: string;
  label: string;
}

const ImageGallery = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
  });

  const { label } = useParams();

  const [analytics, setAnalytics] = useState<any>();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true); // Start loading
        const response = await imageServiceFileServer.getAllImages(
          currentPage,
          label
        );
        setImages((prevImages: any) => [
          ...prevImages,
          ...response.imagesWithFullUrl,
        ]);
        setPagination(response.pagination);
        setIsLoading(false); // End loading
      } catch (error) {
        console.error(error);
        setIsLoading(false); // End loading on error as well
      }
    };
    fetchImages();
  }, [currentPage, label]);

  useEffect(() => {
    const analytics = async () => {
      try {
        setIsLoading(true); // Start loading
        const response = await imageServiceFileServer.fetchAnalytics(label);
        setAnalytics(response);
        setIsLoading(false); // End loading
      } catch (error) {
        setIsLoading(false); // End loading on error as well
      }
    };
    analytics();
  }, []);

  return (
    <div className="flex flex-col w-[100%] max-h-[100%]">
      <h1 className="block font-sans text-5xl font-semibold leading-tight tracking-normal text-inherit antialiased mb-8">
        Images
      </h1>
      <div className="spacing-4 flex flex-col">
        <ContentWrapper>
          <h4 className="text-[#07074D] text-xl font-medium mb-8">Folders</h4>
          <div className="px-4">
            <CardAnalytics analytics={analytics} />
            <ImageList images={images} setImages={setImages} />
            {pagination.page < pagination.totalPages && (
              <div className="flex justify-center w-full">
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  variant="filled"
                  color="blue"
                  className="mt-6"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </ContentWrapper>
      </div>
    </div>
  );
};

export default React.memo(ImageGallery);
