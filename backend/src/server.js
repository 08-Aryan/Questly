import express from 'express';
import path from 'path';
// Import environment variables
import {ENV} from './lib/env.js';
// Initialize environment variables

const app = express();
const __dirname = path.resolve();

console.log(process.env.PORT);
console.log(ENV.DB_URL);
app.get('/health', (req, res) => {
  res.status(200).json({msg:"api is running perfectly"});
});
app.get('/books', (req, res) => {
  res.status(200).json({msg:'This is books endpoint'});
});

// Make our app ready for deployment
if(ENV.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend','dist','index.html'));
  });
}
app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});