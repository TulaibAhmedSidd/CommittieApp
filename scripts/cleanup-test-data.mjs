// Removes test data created while testing on the shared database.
// Only touches accounts whose name starts with "ZZTEST" and BCs created by them (or named ZZTEST...).
//
//   node --env-file=.env scripts/cleanup-test-data.mjs          -> dry run (counts only)
//   node --env-file=.env scripts/cleanup-test-data.mjs --apply  -> delete

import { MongoClient } from "mongodb";

const APPLY = process.argv.includes("--apply");
const TAG = /^ZZTEST/;

async function main() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db();
  try {
    const admins = await db.collection("admins").find({ name: TAG, isSuperAdmin: { $ne: true } }, { projection: { _id: 1 } }).toArray();
    const members = await db.collection("members").find({ name: TAG }, { projection: { _id: 1 } }).toArray();
    const adminIds = admins.map((a) => a._id);
    const memberIds = members.map((m) => m._id);
    const bcs = await db.collection("committees").find({ $or: [{ createdBy: { $in: adminIds } }, { name: TAG }] }, { projection: { _id: 1, createdBy: 1 } }).toArray();
    const bcIds = bcs.map((b) => b._id);
    const people = [...adminIds, ...memberIds];

    const filters = {
      notifications: { $or: [{ recipient: { $in: people } }, { sender: { $in: people } }] },
      messages: { $or: [{ sender: { $in: people } }, { receiver: { $in: people } }, { committeeId: { $in: bcIds } }] },
      logs: { $or: [{ performedBy: { $in: people } }, { targetId: { $in: [...people, ...bcIds] } }] },
      assets: { uploadedBy: { $in: people } },
      reviews: { $or: [{ organizer: { $in: adminIds } }, { member: { $in: memberIds } }] },
      committees: { _id: { $in: bcIds } },
      members: { _id: { $in: memberIds } },
      admins: { _id: { $in: adminIds } },
    };

    for (const [col, filter] of Object.entries(filters)) {
      const n = await db.collection(col).countDocuments(filter);
      console.log(`${col}: ${n}`);
      if (APPLY && n) await db.collection(col).deleteMany(filter);
    }
    // Real members who were added to a test BC keep a dangling entry: remove it.
    if (bcIds.length) {
      const n = await db.collection("members").countDocuments({ "committees.committee": { $in: bcIds } });
      console.log(`members with a link to a test BC: ${n}`);
      if (APPLY && n) await db.collection("members").updateMany({}, { $pull: { committees: { committee: { $in: bcIds } } } });
    }
    // Remove test people from real BCs and real members lists.
    if (memberIds.length) {
      const n = await db.collection("committees").countDocuments({ $or: [{ members: { $in: memberIds } }, { pendingMembers: { $in: memberIds } }] });
      console.log(`real BCs with a test member: ${n}`);
      if (APPLY && n) await db.collection("committees").updateMany({}, { $pull: { members: { $in: memberIds }, pendingMembers: { $in: memberIds } } });
    }
    if (adminIds.length) {
      const n = await db.collection("members").countDocuments({ $or: [{ organizers: { $in: adminIds } }, { pendingOrganizers: { $in: adminIds } }, { following: { $in: adminIds } }] });
      console.log(`real members linked to a test organizer: ${n}`);
      if (APPLY && n) await db.collection("members").updateMany({}, { $pull: { organizers: { $in: adminIds }, pendingOrganizers: { $in: adminIds }, following: { $in: adminIds } } });
    }
    console.log(APPLY ? "Deleted." : "Dry run. Add --apply to delete.");
  } finally {
    await client.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
