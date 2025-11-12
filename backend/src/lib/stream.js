import {StreamChat} from "stream-chat";
import {StreamClient} from "@stream-io/node-sdk";
import {ENV} from "./env.js";


const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Stream API key or Stream Secret missing");
}
export const chatClient = StreamChat.getInstance(apiKey,apiSecret); // Used for chatmessaging
export const streamClient = new StreamClient(apiKey,apiSecret) // Used for video Calls
// upsert is were you create or update a user in stream
export const upsertStreamUser = async(userData)=>{
    try{
        await chatClient.upsertUser(userData);
        console.log("User upserted to Stream:",userData);
    }catch(error){
        console.error("Error upserting user to Stream:",error);
    }
}
export const deleteStreamUser = async(userId)=>{
    try{
        await chatClient.deleteUser(userId);
        console.log("User deleted from Stream:",userId);
    }catch(error){
        console.error("Error deleting user to Stream:",error);
    }
}

