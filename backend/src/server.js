import express from 'express';

// Import environment variables
import {ENV} from './lib/env.js';
// Initialize environment variables

const app = express();

console.log(process.env.PORT);
console.log(ENV.DB_URL);
app.get('/health', (req, res) => {
  res.status(200).json({msg:"api is running perfectly"});
});
app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});