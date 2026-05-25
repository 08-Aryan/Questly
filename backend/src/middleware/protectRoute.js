import { requireAuth } from '@clerk/express'
import User from '../models/User.js'

const clerkAuth = requireAuth();
let cachedMockUser = null;

export const protectRoute = [
    async (req, res, next) => {
        if (process.env.MOCK_AUTH === 'true') {
            // Bypass Clerk and populate mock auth details
            const mockClerkId = req.headers['x-mock-clerk-id'] || 'mock_clerk_host';
            req.auth = () => ({ userId: mockClerkId });
            return next();
        }
        clerkAuth(req, res, next);
    },
    async (req,res,next)=>{
        try {
            const clerkId = req.auth().userId;
            if(!clerkId) return res.status(401).json({msg:"Unauthorized - invalid"});
             // Find user in db by clerk id

            if (process.env.MOCK_AUTH === 'true' && cachedMockUser && cachedMockUser.clerkId === clerkId) {
                req.user = cachedMockUser;
                return next();
            }

            const user = await User.findOne({clerkId})
            if(!user) return res.status(400).json({msg:"User not found"});

            if (process.env.MOCK_AUTH === 'true') {
                cachedMockUser = user;
            }

            // attach user to req
            req.user = user;
            next();

        }
        catch(error){
            console.log("Error in protectRoute middleware",error);
            res.status(500).json({msg:"Internal Server Error"});
        }

    },
];