import { NextResponse } from "next/server";
import User from "../../../models/user";
import mongodb from "../../../lib/mongodb";

export async function POST(request: Request) {
  console.log("endpint user");
  const userData = await request.json();
  console.log(userData);

  const newUser = new User(userData);

  try {
    await mongodb();
    const newUserData = await newUser.save();
    console.log(newUserData);

    newUserData.password = 0;

    return NextResponse.json({
      success: true,
      data: newUserData,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

// Nueva función para obtener todos los usuarios con paginado
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  try {
    await mongodb();
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .select("-password")
      .exec();
    const totalUsers = await User.countDocuments();

    return NextResponse.json({
      success: true,
      data: users,
      total: totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
