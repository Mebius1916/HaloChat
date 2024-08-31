import {User} from "@/models/User";
import { connectToDB } from "@/mongodb/index";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from 'next/server';
import { SessionData } from "@/lib/type";
export const POST = async (req:NextRequest,res:NextResponse) => {
  try {
    await connectToDB();
    // 从请求中解析并验证 JSON 主体
    const body = await req.json();
    const { username, email, password } = body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response("User already exists", {
        status: 400,
      });
    }
  

    // 哈希密码并创建新用户
    const hashedPassword = await hash(password,10);
    const newUser = await User.create<SessionData>({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // 返回不包括密码的安全用户信息
    return new Response(JSON.stringify(newUser), { status: 200});

  } catch (err) {
    console.error(err);
    return new Response("Failed to create a new user", {
      status: 500,
    });
  }
};
