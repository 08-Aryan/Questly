import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
    problem:{
        type: String,
        required: true,
    },
    difficulty:{
        type: String,
        enum : ["easy","medium","hard"],
        required: true
    },
    host:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    participant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null,
    },
    status:{
        type:String,
        enum:['active','completed'],
        default: 'active' 
    },
    // Stream Video Call Id
    callId:{
        type:String,
        default:""
    },
},{timestamps:true});

// Indexes for high-concurrency performance scaling
sessionSchema.index({ status: 1, createdAt: -1 });
sessionSchema.index({ host: 1, status: 1, createdAt: -1 });
sessionSchema.index({ participant: 1, status: 1, createdAt: -1 });

const Session = mongoose.model("Session",sessionSchema);
export default Session;