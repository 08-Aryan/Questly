import { requireAuth } from '@clerk/express'
import User from '../models/User.js'

let cachedMockUser = null;

const mockAuthMiddleware = (req, res, next) => {
    // Bypass Clerk and populate mock auth details
    const mockClerkId = req.headers['x-mock-clerk-id'] || 'mock_clerk_host';
    req.auth = () => ({ userId: mockClerkId });
    return next();
};

export const protectRoute = [
    process.env.MOCK_AUTH === 'true' ? mockAuthMiddleware : requireAuth(),
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