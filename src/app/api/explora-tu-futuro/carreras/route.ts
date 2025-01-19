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
  const limit = parseInt(searchParams.get("limit") || "20", 20);
  const skip = (page - 1) * limit;

  try {
    await mongodb();
    const carreras: ICarrera[] = await (Carrera as mongoose.Model<ICarrera>)
      .find()
      .skip(skip)
      .limit(limit)
      .exec();
    const totalCarreras = await Carrera.countDocuments();

    return NextResponse.json({
      success: true,
      data: carreras,
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
