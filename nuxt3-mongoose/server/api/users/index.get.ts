import { Schema , model} from "mongoose";

const UserSchema = new Schema({
    name:{
        type: String,
    },
    text:{
        type: String,
    },
    dateCreate:{
        type: Date,
    }
});

export const User = model<any>('User',UserSchema)

//หน้าบ้านส่งมาให้ตัวแปล
// const name ="";
// User.create({ name: name }); 


export default defineEventHandler( async (event) =>{
    const users = await User.find();
    return users;
})