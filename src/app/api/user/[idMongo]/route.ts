import { NextResponse } from "next/server";
import User, { IUser } from "../../../../models/user";
import mongodb from "../../../../lib/mongodb";
import mongoose from "mongoose"


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 1. Obtener Usuarios (GET) - Leer
export async function GET(
  request: Request,
  { params }: { params: { idMongo: string } }
) {
  try {
    await mongodb();
    const user = await (User as mongoose.Model<IUser>).findById(params.idMongo).select("-password").exec();

    if (!user) {
      return NextResponse.json({
        error: "Not Found",
        message: "User not found",
      });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 2. Actualizar datos por id (PUT)
export async function PUT(
  request: Request,
  { params }: { params: { idMongo: string } }
) {
  try {
    await mongodb();
    const id = params.idMongo;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "ID parameter is missing",
      });
    }

    const updatedData = await request.json();
    const updatedUser: IUser = await (User as mongoose.Model<IUser>).findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .exec();

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        error: "User Not Found",
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 3. Eliminar un usuario por id (DELETE)

export async function DELETE(
  request: Request,
  { params }: { params: { idMongo: string } }
) {
  try {
    await mongodb();
    const id = params.idMongo;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "ID parameter is missing",
      });
    }

    const deletedUser: IUser = await (User as mongoose.Model<IUser>).findByIdAndDelete(id).exec();

    if (!deletedUser) {
      return NextResponse.json({
        success: false,
        error: "User Not Found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
