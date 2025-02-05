import { NextResponse } from "next/server";
import { Escuela } from "../../../../../models/escuela";
import mongodb from "../../../../../lib/mongodb";

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
          { nombreInstitucion: { $regex: searchParam, $options: "i" } },
          { razonSocial: { $regex: searchParam, $options: "i" } },
        ],
      };
    }

    const escuelas = await Escuela.find(query).skip(skip).limit(limit).exec();

    // Filter out logically deleted records after the query
    const filteredEscuelas = escuelas.filter((escuela) => !escuela.isDeleted);

    const totalEscuelas = await Escuela.countDocuments(query);

    const response = {
      success: true,
      data: filteredEscuelas,
      total: totalEscuelas,
      page,
      totalPages: Math.ceil(totalEscuelas / limit),
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
