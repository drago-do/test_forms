import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  const { query } = await request.json();
  const { SERPAPI } = process.env;
  const apiKey =
    SERPAPI ||
    "cdf4b2f503c06a102f87087505e67de91e62c1c7546a268bc80e9e2d98382dfd";

  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: "API key is missing",
    });
  }

  try {
    const response = await axios.get(`https://serpapi.com/search`, {
      params: {
        engine: "google_images",
        q: query,
        api_key: apiKey,
        num: 20, // Limit to 20 images
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });

    const data = response.data;
    const images = data.images_results || [];

    // Validate image URLs
    const validImages = await Promise.all(
      images.map(async (image) => {
        try {
          const headResponse = await axios.head(image.original);
          if (headResponse.status === 200) {
            return image;
          }
        } catch (error) {
          console.error(
            `Image URL validation failed for ${image.original}:`,
            error
          );
        }
        return null;
      })
    ).then((results) => results.filter((image) => image !== null));

    return NextResponse.json({
      success: true,
      data: validImages,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Failed to fetch images",
      message: error.message,
    });
  }
}
