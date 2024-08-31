import { User } from "@/models/User"
import { connectToDB } from "@/mongodb/index"
import { NextRequest, NextResponse } from 'next/server';
export const GET = async (req:NextRequest,res:NextResponse)=>{
  try{
    await connectToDB();
    const allUsers = await User.find();
    return new Response(JSON.stringify(allUsers),{status:200});
  }catch(err){
    console.log(err);
    return new Response("Failed to fetch users",{status:500});
  }
}