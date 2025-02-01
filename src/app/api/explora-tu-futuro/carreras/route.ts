import { NextResponse } from "next/server";
import { Carrera, ICarrera } from "../../../../models/carrera";
import mongodb from "../../../../lib/mongodb";
import mongoose from "mongoose";

// POST request to create a new Carrera
export async function POST(request: Request) {
  const carreraData = await request.json();
  const newCarrera = new Carrera(carreraData);

  try {
    await mongodb();
    const newCarreraData = await newCarrera.save();
    return NextResponse.json({
      success: true,
      data: newCarreraData,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

// GET request to fetch paginated Carreras
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10); // Corrected the radix for limit
  const skip = (page - 1) * limit;

  try {
    await mongodb();
    const carreras: ICarrera[] = await (Carrera as mongoose.Model<ICarrera>)
      .find({ isDeleted: false }) // Ensure only non-deleted records are considered
      .skip(skip)
      .limit(limit)
      .exec();

    // Filter out undefined objects
    const filteredCarreras = carreras.filter(
      (carrera) => carrera !== undefined
    );

    const totalCarreras = await Carrera.countDocuments({ isDeleted: false });

    return NextResponse.json({
      success: true,
      data: filteredCarreras,
      total: totalCarreras,
      page,
      totalPages: Math.ceil(totalCarreras / limit),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
