import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db.js';
import User from '../src/models/User.js';
import Session from '../src/models/Session.js';
import { cleanupIdleSessions } from '../src/controllers/sessionController.js';

const testCleanup = async () => {
  try {
    console.log("Connecting to the database for cleanup test...");
    await connectDB();

    console.log("Checking if mock host user exists...");
    let hostUser = await User.findOne({ clerkId: "mock_clerk_host" });
    if (!hostUser) {
      console.log("Mock host user not found, creating one...");
      hostUser = await User.create({
        name: "Mock Host User",
        email: "host@questly-test.com",
        profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=host",
        clerkId: "mock_clerk_host"
      });
    }

    console.log("Creating a mock active session that has been idle for 15 minutes...");
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const idleSession = await Session.create({
      problem: "Two Sum (Idle Test)",
      difficulty: "easy",
      host: hostUser._id,
      participant: null,
      status: "active",
      callId: "session_mock_idle_test_15_mins",
      lastHeartbeatAt: fifteenMinutesAgo,
      createdAt: fifteenMinutesAgo,
      updatedAt: fifteenMinutesAgo
    });
    console.log(`Created idle session: ${idleSession._id} (lastHeartbeatAt: ${idleSession.lastHeartbeatAt.toISOString()})`);

    console.log("Running the cleanupIdleSessions logic...");
    // Set MOCK_STREAM flag in env programmatically to ensure we don't call Stream SDK in test
    process.env.MOCK_STREAM = 'true';
    await cleanupIdleSessions();

    console.log("Verifying if the idle session was terminated...");
    const updatedSession = await Session.findById(idleSession._id);
    console.log(`Updated Session status: '${updatedSession.status}'`);

    if (updatedSession.status === 'completed') {
      console.log("\x1b[32m[SUCCESS] Idle session cleanup verified successfully!\x1b[0m");
    } else {
      console.log("\x1b[31m[FAILURE] Idle session cleanup failed!\x1b[0m");
    }

    // Clean up our test session
    await Session.deleteOne({ _id: idleSession._id });
    console.log("Test session document removed.");

    process.exit(updatedSession.status === 'completed' ? 0 : 1);
  } catch (error) {
    console.error("Error in testCleanup:", error);
    process.exit(1);
  }
};

testCleanup();
