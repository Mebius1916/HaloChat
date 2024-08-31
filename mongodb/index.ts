import mongoose from "mongoose";
let isConnected : boolean = false;
export const connectToDB = async () => {
    mongoose.set('strictQuery', true)//开启严格模式
    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
    }
    try {

        await mongoose.connect(process.env.MONGODB_URL as string,{
            dbName: "HaloChat",//连接数据库的名字
            //@ts-ignore
            useNewUrlParser: true,//启用新的url解析器
            useUnifiedTopology: true,//启用新的拓扑监视引擎,它确保了更稳定的连接和更好的网络适应性
        });
        isConnected = true;
        console.log("MongoDB is connected");
    } catch (error) {
        console.log(error);
    }
}