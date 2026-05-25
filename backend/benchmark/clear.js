import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db.js';
import User from '../src/models/User.js';
import Session from '../src/models/Session.js';

const clearDatabase = async () => {
  try {
    console.log("Connecting to the database to clear all data...");
    await connectDB();

    console.log("Deleting all documents from User collection...");
    const deleteUsers = await User.deleteMany({});
    console.log(`Deleted ${deleteUsers.deletedCount} users.`);

    console.log("Deleting all documents from Session collection...");
    const deleteSessions = await Session.deleteMany({});
    console.log(`Deleted ${deleteSessions.deletedCount} sessions.`);

    console.log("Database cleared successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing database:", error);
    process.exit(1);
  }
};

clearDatabase();
