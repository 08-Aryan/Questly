import { requireAuth, clerkClient } from '@clerk/express'
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

            let user = await User.findOne({clerkId})
            
            // Auto-heal: If database was cleared, dynamically sync user from Clerk
            if(!user) {
                console.log(`[AUTH] User ${clerkId} not found in DB. Initiating auto-healing sync from Clerk...`);
                try {
                    const clerkUser = await clerkClient.users.getUser(clerkId);
                    user = await User.create({
                        clerkId: clerkId,
                        email: clerkUser.emailAddresses[0]?.emailAddress || "",
                        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
                        profileImage: clerkUser.imageUrl || ""
                    });
                    console.log(`[AUTH] Auto-healed user ${user.name} successfully in MongoDB.`);
                } catch (clerkError) {
                    console.error("[AUTH] Failed to auto-heal user from Clerk API:", clerkError.message);
                    return res.status(400).json({msg:"User not found and sync failed"});
                }
            }

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