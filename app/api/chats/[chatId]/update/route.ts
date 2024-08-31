import Chat from "@/models/Chat"
import { connectToDB } from "@/mongodb/index"
import { NextRequest} from 'next/server';
type Params={
  params: {
    chatId: string
  }
}
export const POST = async (req:NextRequest, {params}:Params) => {
  try {
    await connectToDB()

    const body = await req.json()

    const { chatId } = params

    const { name, groupPhoto } = body

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      { name, groupPhoto },
      { new: true }
    )

    return new Response(JSON.stringify(updatedGroupChat), { status: 200 })
  } catch (err) {
    return new Response("Failed to update group chat info", { status: 500 })
  }
}