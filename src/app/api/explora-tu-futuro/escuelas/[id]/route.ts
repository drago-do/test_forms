import { NextResponse } from "next/server";
import { Escuela } from "../../../../../models/escuela";
import mongodb from "../../../../../lib/mongodb";

// GET request to fetch a specific Escuela by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await mongodb();
    const escuela = await Escuela.findOne({
      _id: params.id,
      isDeleted: false,
    }).exec();

    if (!escuela) {
      return NextResponse.json({
        success: false,
        error: "Not Found",
        message: "Escuela not found",
      });
    }

    return NextResponse.json({
      success: true,
      data: escuela,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

// PUT request to update a specific Escuela by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await mongodb();
    const updatedData = await request.json();
    const updatedEscuela = await Escuela.findOneAndUpdate(
      { _id: params.id, isDeleted: false },
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    ).exec();

    if (!updatedEscuela) {
      return NextResponse.json({
        success: false,
        error: "Not Found",
        message: "Escuela not found",
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedEscuela,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

// DELETE request to remove a specific Escuela by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(params.id);

    await mongodb();
    const deletedEscuela = await Escuela.findOneAndUpdate(
      { _id: params.id },
      { isDeleted: true },
      { new: true }
    ).exec();

    if (!deletedEscuela) {
      return NextResponse.json({
        success: false,
        error: "Not Found",
        message: "Escuela not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Escuela deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
