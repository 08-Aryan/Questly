import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db.js';
import User from '../src/models/User.js';
import Session from '../src/models/Session.js';

const profileQueries = async () => {
  try {
    await connectDB();
    
    console.log("Syncing database indexes...");
    await Session.syncIndexes();

    // Retrieve mock host user
    const hostUser = await User.findOne({ clerkId: "mock_clerk_host" });
    if (!hostUser) {
      console.error("Mock host user not found. Please run seed.js first.");
      process.exit(1);
    }
    const userId = hostUser._id;

    console.log("\n========================================================");
    console.log("PROFILING 1: Active Sessions Query");
    console.log("Query: Session.find({ status: 'active' }).sort({ createdAt: -1 }).limit(20)");
    console.log("========================================================\n");

    const explainActive = await Session.find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(20)
      .explain("executionStats");

    printExplainStats(explainActive);

    console.log("\n========================================================");
    console.log("PROFILING 2: My Recent Sessions Query");
    console.log(`Query: Session.find({ status: 'completed', $or: [{ host: '${userId}' }, { participant: '${userId}' }] }).sort({ createdAt: -1 }).limit(20)`);
    console.log("========================================================\n");

    const explainRecent = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }]
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .explain("executionStats");

    printExplainStats(explainRecent);

    process.exit(0);
  } catch (error) {
    console.error("Error profiling queries:", error);
    process.exit(1);
  }
};

function printExplainStats(explainData) {
  const executionStats = explainData.executionStats || {};
  const executionStages = executionStats.executionStages || {};
  
  // Recursively find scanning stages
  const findStages = (stage, list = []) => {
    if (!stage) return list;
    list.push(stage.stage);
    if (stage.inputStage) {
      findStages(stage.inputStage, list);
    }
    if (stage.inputStages) {
      for (const input of stage.inputStages) {
        findStages(input, list);
      }
    }
    return list;
  };

  const stages = findStages(executionStages);

  console.log(`- Execution Successful: ${executionStats.executionSuccess}`);
  console.log(`- Execution Time: ${executionStats.executionTimeMillis} ms`);
  console.log(`- Documents Returned: ${executionStats.nReturned}`);
  console.log(`- Total Documents Examined: ${executionStats.totalDocsExamined}`);
  console.log(`- Total Index Keys Examined: ${executionStats.totalKeysExamined}`);
  console.log(`- Execution Stages Traversed: ${stages.join(" -> ")}`);
  
  const hasCollectionScan = stages.includes("COLLSCAN");
  if (hasCollectionScan) {
    console.log("\x1b[31m[WARNING] COLLSCAN detected! The query had to scan the entire collection to find matching documents. O(N) complexity.\x1b[0m");
  } else {
    console.log("\x1b[32m[OPTIMIZED] IXSCAN detected! The query is using indexes for retrieval. O(log N) or O(1) complexity.\x1b[0m");
  }
}

profileQueries();
