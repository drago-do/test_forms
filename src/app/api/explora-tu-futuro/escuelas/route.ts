import { NextResponse } from "next/server";
import { Escuela } from "../../../../models/escuela";
import mongodb from "../../../../lib/mongodb";

// POST request to create a new Escuela
export async function POST(request: Request) {
  const escuelaData = await request.json();
  const newEscuela = new Escuela(escuelaData);

  try {
    await mongodb();
    const newEscuelaData = await newEscuela.save();
    return NextResponse.json({
      success: true,
      data: newEscuelaData,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

// GET request to fetch paginated Escuelas
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const skip = (page - 1) * limit;

  try {
    await mongodb();
    const escuelas = await Escuela.find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalEscuelas = await Escuela.countDocuments({ isDeleted: false });

    return NextResponse.json({
      success: true,
      data: escuelas,
      total: totalEscuelas,
      page,
      totalPages: Math.ceil(totalEscuelas / limit),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
