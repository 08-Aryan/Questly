import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // create session in db
    const session = await Session.create({ problem, difficulty, host: userId, callId });

    if (process.env.MOCK_STREAM === 'true') {
      console.log(`[MOCK STREAM] Skipping Stream video/chat creation for session: ${session._id}`);
    } else {
      // create stream video call
      await streamClient.video.call("default", callId).getOrCreate({
        data: {
          created_by_id: clerkId,
          custom: { problem, difficulty, sessionId: session._id.toString() },
        },
      });

      // chat messaging
      const channel = chatClient.channel("messaging", callId, {
        name: `${problem} Session`,
        created_by_id: clerkId,
        members: [clerkId],
      });

      await channel.create();
    }

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
//  using _ as we dont use req 
export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      return res.status(400).json({ message: "Host cannot join their own session as participant" });
    }

    // check if session is already full - has a participant
    if (session.participant) return res.status(409).json({ message: "Session is full" });

    session.participant = userId;
    await session.save();

    if (process.env.MOCK_STREAM === 'true') {
      console.log(`[MOCK STREAM] Skipping Stream chat join for session: ${session._id}`);
    } else {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.addMembers([clerkId]);
    }

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    if (process.env.MOCK_STREAM === 'true') {
      console.log(`[MOCK STREAM] Skipping Stream video/chat deletion for session: ${session._id}`);
    } else {
      // delete stream video call
      const call = streamClient.video.call("default", session.callId);
      await call.delete({ hard: true });

      // delete stream chat channel
      const channel = chatClient.channel("messaging", session.callId);
      await channel.delete();
    }

    session.status = "completed";
    await session.save();

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendHeartbeat(req, res) {
  try {
    const { id } = req.params;

    // Update the lastHeartbeatAt timestamp
    const session = await Session.findByIdAndUpdate(
      id,
      { lastHeartbeatAt: new Date() },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ success: true, message: "Heartbeat received successfully" });
  } catch (error) {
    console.log("Error in sendHeartbeat controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function cleanupIdleSessions() {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    // Find sessions in 'active' status where lastHeartbeatAt is older than 10 minutes
    const idleSessions = await Session.find({
      status: "active",
      lastHeartbeatAt: { $lt: tenMinutesAgo }
    });

    if (idleSessions.length === 0) return;

    console.log(`[CLEANUP] Found ${idleSessions.length} idle active sessions. Terminating...`);

    for (const session of idleSessions) {
      try {
        console.log(`[CLEANUP] Terminating idle session ${session._id} (callId: ${session.callId})...`);

        if (process.env.MOCK_STREAM === 'true') {
          console.log(`[CLEANUP] [MOCK STREAM] Skipping Stream video/chat deletion for session: ${session._id}`);
        } else {
          // delete stream video call
          const call = streamClient.video.call("default", session.callId);
          await call.delete({ hard: true });

          // delete stream chat channel
          const channel = chatClient.channel("messaging", session.callId);
          await channel.delete();
        }

        session.status = "completed";
        await session.save();
        console.log(`[CLEANUP] Session ${session._id} terminated successfully.`);
      } catch (err) {
        console.error(`[CLEANUP] Failed to terminate session ${session._id}:`, err.message);
      }
    }
  } catch (error) {
    console.error("[CLEANUP] Error in cleanupIdleSessions:", error.message);
  }
}