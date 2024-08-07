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




export default defineEventHandler( async (event) =>{
    const users = await User.find();
    return users;
})