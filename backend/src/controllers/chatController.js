import {chatClient} from '../lib/stream.js'
export async function getStreamToken(req,res) {
    try{
        // Using clerk_id for Stream as it is saving using clerId in stream
        const token = chatClient.createToken(req.user.clerkId)
        res.status(200).jso({
            token,
            userId: req.user.clerkId,
            userName: req.user.name,
            userImage: req.user.image

        })
    }
    catch(error){
        console.log("Error in getStreeamToken Controller:",error.message);
        res.status(500).json({msg:"Internal Server Error"})
    }
}