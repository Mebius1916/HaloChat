import { User } from "@/models/User";
import { connectToDB } from "@/mongodb/index";
import { NextRequest, NextResponse } from 'next/server';
type Params = {
  params: {
    useId: string,
  }
};
//                                    params为动态路由传过来的id
export const POST = async (req: NextRequest, { params }: Params) => {
  try {
    await connectToDB();

    const { useId } = params;
    console.log(params);
    const body = await req.json();

    const { username, profileImage } = body;
    console.log(username, profileImage);
    // 使用 User 模型的 findByIdAndUpdate 方法来查找并更新用户记录
    const updatedUser = await User.findByIdAndUpdate(
      // 用户的唯一标识符，用于定位要更新的用户文档
      useId,
      {
        // 要更新的用户属性，这里是用户名和头像
        username,
        profileImage,
      },
      // 将 new 设置为 true，表示返回更新后的用户文档，而不是更新前的文档
      { new: true }
    );
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to update user", { status: 500 })
  }
};
