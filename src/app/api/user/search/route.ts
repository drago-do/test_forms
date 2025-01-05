import { NextResponse } from "next/server";
import User, { IUser } from "../../../../models/user";
import mongodb from "../../../../lib/mongodb";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await mongodb();
    const { searchParam } = await request.json();

    if (!searchParam) {
      const page = 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const users: IUser[] = await (User as mongoose.Model<IUser>)
        .find()
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
    }

    const users: IUser[] = await (User as mongoose.Model<IUser>)
      .find({
        $or: [
          { firstName: { $regex: searchParam, $options: "i" } },
          { lastName: { $regex: searchParam, $options: "i" } },
          { email: { $regex: searchParam, $options: "i" } },
        ],
      })
      .select("-password")
      .exec();

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
