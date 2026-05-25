import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db.js';
import User from '../src/models/User.js';
import Session from '../src/models/Session.js';

const seedData = async () => {
  try {
    console.log("Connecting to the database...");
    await connectDB();

    console.log("Clearing existing mock data...");
    // Only delete mock data to prevent clearing real users if there are any
    await User.deleteMany({ clerkId: { $in: ["mock_clerk_host", "mock_clerk_participant"] } });
    
    // We can clear all sessions to ensure clean benchmark metrics
    const deleteSessionsResult = await Session.deleteMany({});
    console.log(`Deleted ${deleteSessionsResult.deletedCount} existing sessions.`);

    console.log("Creating mock users...");
    const hostUser = await User.create({
      name: "Mock Host User",
      email: "host@questly-test.com",
      profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=host",
      clerkId: "mock_clerk_host"
    });

    const participantUser = await User.create({
      name: "Mock Participant User",
      email: "participant@questly-test.com",
      profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=participant",
      clerkId: "mock_clerk_participant"
    });

    console.log("Mock users created successfully:");
    console.log(`- Host User ID: ${hostUser._id} (Clerk: ${hostUser.clerkId})`);
    console.log(`- Participant User ID: ${participantUser._id} (Clerk: ${participantUser.clerkId})`);

    const difficulties = ["easy", "medium", "hard"];
    const problems = [
      "Two Sum", "Reverse Integer", "Palindrome Number", "Roman to Integer", 
      "Longest Common Prefix", "Valid Parentheses", "Merge Two Sorted Lists", 
      "Remove Duplicates from Sorted Array", "Implement strStr()", "Search Insert Position",
      "3Sum", "Add Two Numbers", "Container With Most Water", "Longest Substring Without Repeating Characters"
    ];

    console.log("Generating 10,000 completed sessions...");
    const batchSize = 1000;
    const totalCompleted = 10000;
    
    for (let i = 0; i < totalCompleted; i += batchSize) {
      const sessionsBatch = [];
      const currentBatchSize = Math.min(batchSize, totalCompleted - i);
      
      for (let j = 0; j < currentBatchSize; j++) {
        const problem = problems[Math.floor(Math.random() * problems.length)];
        const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        // Randomize historical creation time spanning over the last 30 days
        const createdAt = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
        
        sessionsBatch.push({
          problem,
          difficulty,
          host: hostUser._id,
          participant: participantUser._id,
          status: "completed",
          callId: `session_mock_completed_${i + j}`,
          createdAt,
          updatedAt: createdAt
        });
      }
      
      await Session.insertMany(sessionsBatch);
      console.log(`Inserted ${i + currentBatchSize} / ${totalCompleted} completed sessions...`);
    }

    console.log("Generating 10 active sessions...");
    const activeSessions = [];
    for (let i = 0; i < 10; i++) {
      const problem = problems[Math.floor(Math.random() * problems.length)];
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      
      activeSessions.push({
        problem,
        difficulty,
        host: hostUser._id,
        participant: null, // Host waiting for participant
        status: "active",
        callId: `session_mock_active_${i}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    await Session.insertMany(activeSessions);
    console.log("Inserted active sessions.");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
