import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

let cached = global.mongoose;

if (!MONGODB_URI) {
  console.error("MONGO_URI is not set. Add it to .env");
}

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictPopulate", false);

    const opts = {
      bufferCommands: false,
      // Indexes are created by scripts/migrate-2026-10.mjs only, never on app start
      // (the app shares its database with production).
      autoIndex: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
