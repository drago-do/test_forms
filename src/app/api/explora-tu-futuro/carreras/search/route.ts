import { NextResponse } from "next/server";
import { Carrera, ICarrera } from "../../../../../models/carrera";
import mongodb from "../../../../../lib/mongodb";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await mongodb();
    const { searchParam, page = 1, limit = 10 } = await request.json();
    console.log("[POST] Input:", { searchParam, page, limit });
    const skip = (page - 1) * limit;
    let query = {};
    if (searchParam) {
      query = {
        $or: [
          { nombre: { $regex: searchParam, $options: "i" } },
          { areaAcademica: { $regex: searchParam, $options: "i" } },
        ],
      };
    }

    const carreras: ICarrera[] = await (Carrera as mongoose.Model<ICarrera>)
      .find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    // Filter out logically deleted records after the query
    const filteredCarreras = carreras.filter((carrera) => !carrera.isDeleted);

    const totalCarreras = await Carrera.countDocuments(query);

    const response = {
      success: true,
      data: filteredCarreras,
      total: totalCarreras,
      page,
      totalPages: Math.ceil(totalCarreras / limit),
    };

    console.log("[POST] Output:", response);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("[POST] Error:", error.message);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
