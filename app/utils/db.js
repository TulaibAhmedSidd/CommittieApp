
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

let cached = global.mongoose;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable in .env.local');
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
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
