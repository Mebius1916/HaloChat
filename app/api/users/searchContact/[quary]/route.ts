// const getContacts = async () => {
//   try {
//     const res = await fetch(
//       search !== "" ? `/api/users/searchContact/${search}` : "/api/users"
//     );
//     const data = await res.json();  
//     //根据_id在全部用户中筛选出当前用户
//     setContacts(data.filter((contact:SessionData) => contact._id !== currentUser._id));
//     setLoading(false);
//   } catch (err) {
//     console.log(err);
//   }
// };
import { User } from "@/models/User"
import  {connectToDB}  from "@/mongodb/index"
import { NextRequest } from 'next/server';
type Params = {params:{quary:string}}
export const GET = async (req:NextRequest, { params }:Params) => {
  try {
    await connectToDB()

    const { quary } = params
    //在username与email中用正则搜索进行or匹配
    const searchedContacts = await User.find({
      $or: [
        { username: { $regex: quary, $options: "i" } },
        { email: { $regex: quary, $options: "i" } }
      ]
    })

    return new Response(JSON.stringify(searchedContacts), { status: 200 })
  } catch (err) {
    return new Response("Failed to search contact", { status: 500 })
  }
}