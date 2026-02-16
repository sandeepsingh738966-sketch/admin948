import mongoose from 'mongoose';

// Paste your actual connection string inside the quotes
const MONGODB_URI = "mongodb+srv://sandeepsingh738966_db_user:<TP8201tp>@cluster0.teazoyx.mongodb.net/?appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
