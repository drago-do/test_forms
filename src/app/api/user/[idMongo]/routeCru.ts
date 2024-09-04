import { NextResponse } from "next/server";
import User from "../../../../models/user";


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 2. Obtener Usuarios (GET) - Leer
export async function GET(request: Request,  { params }: { params: { idMongo: string } }) {
  try {
    const Usermodel = new User
    const user = await Usermodel.findOne({ email: params.idMongo});
    if (!user) {
      return NextResponse.json({
        error: "Not Found",
        message: "User not found",
      });
    }
    return NextResponse.json({
      user
    });
  } catch (error: any) {
    return NextResponse.json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 3. Actualizar datos por id (PUT)
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "ID parameter is missing",
      });
    }

    const updatedData = await request.json();
    const usermodel = new User
    const updatedUser = await usermodel.findByIdAndUpdate (id, updatedData, {
      new: true,
      runValidators: true,
    }).select('-password').exec();

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
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 4. Eliminar un usuario por id (DELETE)

export async function DELETE(request: Request,  { params }: { params: { email: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "ID parameter is missing",
      });
    }

    const usermodel = new User
    const deletedUser = await usermodel.findByIdAndDelete(id).exec();

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
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
