import express from 'express';
import path from 'path';
import cors from 'cors';
// Import environment variables
import {ENV} from './lib/env.js';
import { connectDB } from './lib/db.js';
import {serve} from 'inngest/express';
import {inngest , functions} from './lib/inngest.js';
import { clerkMiddleware } from '@clerk/express';
import chatRoutes from './routes/chatRoutes.js'
import sessionRoutes from './routes/sessionRoutes.js'
// Initialize environment variables

const app = express();
const __dirname = path.resolve();

// Middleware to parse JSON requests
app.use(express.json());
// creditials:true allows cookies to be sent along with requests
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use(clerkMiddleware()); // this adds auth field to request object
app.use('api/chat',chatRoutes);

app.use('api/sessions',sessionRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({msg:"api is running perfectly"});
});

// Make our app ready for deployment
if(ENV.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend','dist','index.html'));
  });
}


const startServer = async () => {
  try{
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  }
  catch(error){
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};
startServer();