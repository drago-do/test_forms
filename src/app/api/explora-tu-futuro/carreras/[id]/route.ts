import { NextResponse } from "next/server";
import { Carrera, ICarrera } from "../../../../../models/carrera";
import mongodb from "../../../../../lib/mongodb";
import mongoose from "mongoose";

// GET request to fetch a specific Carrera by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await mongodb();
    const carrera = await (Carrera as mongoose.Model<ICarrera>)
      .findById(params.id)
      .exec();

    if (!carrera) {
      return NextResponse.json({
        success: false,
        error: "Not Found",
        message: "Carrera not found",
      });
    }

    return NextResponse.json({
      success: true,
      data: carrera,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

// PUT request to update a specific Carrera by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await mongodb();
    const updatedData = await request.json();
    const updatedCarrera = await (Carrera as mongoose.Model<ICarrera>)
      .findByIdAndUpdate(params.id, updatedData, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedCarrera) {
      return NextResponse.json({
        success: false,
        error: "Not Found",
        message: "Carrera not found",
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedCarrera,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

// DELETE request to remove a specific Carrera by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(params.id);

    await mongodb();
    const deletedCarrera = await (Carrera as mongoose.Model<ICarrera>)
      .findByIdAndDelete(params.id)
      .exec();

    if (!deletedCarrera) {
      return NextResponse.json({
        success: false,
        error: "Not Found",
        message: "Carrera not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Carrera deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
