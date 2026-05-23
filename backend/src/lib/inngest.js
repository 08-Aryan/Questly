import { Inngest } from 'inngest';
import { connectDB } from './db.js';
import User from '../models/User.js';
import { upsertStreamUser, deleteStreamUser } from './stream.js';

export const inngest = new Inngest({ id: "questly" });

// Sync user creation with upsert to prevent database crash on Clerk retries
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address || "",
      name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
      profileImage: image_url || "",
    };

    // Use findOneAndUpdate with upsert to handle potential duplicate webhook triggers robustly
    await User.findOneAndUpdate({ clerkId: id }, newUser, { upsert: true, new: true });

    await upsertStreamUser({
      id: id.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });
  }
);

// Sync profile updates when user modifies their name/email/avatar in Clerk
const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const updatedUser = {
      email: email_addresses[0]?.email_address || "",
      name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
      profileImage: image_url || "",
    };

    await User.findOneAndUpdate({ clerkId: id }, updatedUser, { new: true });

    await upsertStreamUser({
      id: id.toString(),
      name: updatedUser.name,
      image: updatedUser.profileImage,
    });
  }
);

// Securely delete user records from database and Stream Chat client
const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    await deleteStreamUser(id.toString());
  }
);

export const functions = [syncUser, syncUserUpdate, deleteUserFromDB];