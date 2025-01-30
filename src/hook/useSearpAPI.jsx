import { useState } from "react";
import axios from "axios";

const useSerpApi = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchImages = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/searchImages", { query });

      const data = response.data;
      if (data.success && data.data) {
        setImages(data.data);
      } else {
        setImages([]);
        setError(data.error || "No images found");
      }
    } catch (err) {
      setError("Failed to fetch images");
      console.error("Error fetching images from API:", err);
    } finally {
      setLoading(false);
    }
  };

  return { images, loading, error, searchImages };
};

export default useSerpApi;
