import { NextResponse } from "next/server";
import User from "../../../models/user";

export async function POST(request: Request) {
  const userData = await request.json();
  console.log(userData);

  const newUser = new User(userData);

  try {
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